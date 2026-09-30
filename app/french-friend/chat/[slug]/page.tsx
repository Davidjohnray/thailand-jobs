'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, getCurrentFrenchFriendUser, getFullUserRecord, trialStatus } from '../../../../lib/french-friend-auth'

type Turn = { speaker: 'student' | 'character'; french_text?: string; english_text: string; suggestions?: { french: string; english: string }[] }

export default function FrenchFriendChatPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [character, setCharacter] = useState<any>(null)
  const [relationshipId, setRelationshipId] = useState<string | null>(null)
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('A1')
  const [transcript, setTranscript] = useState<Turn[]>([])
  const [pastConversations, setPastConversations] = useState<{ id: string; started_at: string; transcript: Turn[] }[]>([])
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [ending, setEnding] = useState(false)
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [repeating, setRepeating] = useState(false)
  const [topic, setTopic] = useState<string | null>(null)
  const [showTopicPicker, setShowTopicPicker] = useState(false)
  const [showLevelPicker, setShowLevelPicker] = useState(false)
  const [changingLevel, setChangingLevel] = useState(false)
  const [levelNotice, setLevelNotice] = useState<string | null>(null)
  const [languageHint, setLanguageHint] = useState<'auto' | 'fr' | 'en'>('auto')
  const [showChoices, setShowChoices] = useState(true)

  const TOPIC_SUGGESTIONS = ['Just chat freely', 'At a bakery', 'Ordering food', 'Asking for directions', 'At the doctor', 'Meeting for the first time']
  const LEVEL_OPTIONS = [
    { level: 'A1', title: 'Complete beginner', desc: 'I know a few words and phrases, but can\'t hold a conversation yet' },
    { level: 'A2', title: 'Beginner', desc: 'I can handle very basic conversations about familiar topics' },
    { level: 'B1', title: 'Intermediate', desc: 'I can talk about everyday things, with some mistakes' },
    { level: 'B2', title: 'Upper Intermediate', desc: 'I can have fairly natural conversations on most topics' },
    { level: 'C1', title: 'Advanced', desc: 'I\'m close to fluent, just want more natural practice' },
    { level: 'C2', title: 'Fluent', desc: 'I want completely natural, unrestricted conversation' },
  ]

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const savedRef = useRef(false)
  const transcriptRef = useRef<Turn[]>([])
  const isProcessingRef = useRef(false)

  useEffect(() => { transcriptRef.current = transcript }, [transcript])

  useEffect(() => {
    const saveOnLeave = () => {
      if (savedRef.current || !relationshipId) return
      const t = transcriptRef.current
      if (!t.some((x) => x.speaker === 'student')) return
      savedRef.current = true
      const blob = new Blob([JSON.stringify({ relationshipId, transcript: t })], { type: 'application/json' })
      navigator.sendBeacon('/api/french-friend/end-conversation', blob)
    }
    window.addEventListener('pagehide', saveOnLeave)
    return () => { window.removeEventListener('pagehide', saveOnLeave); saveOnLeave() }
  }, [relationshipId])

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach((track) => track.stop()) }
  }, [])

  useEffect(() => { init() }, [slug])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [transcript])

  const loadPast = async (relId: string) => {
    const { data } = await supabase.from('french_friend_conversations').select('id, started_at, transcript').eq('relationship_id', relId).order('started_at', { ascending: false }).limit(15)
    setPastConversations(((data as any) || []).reverse())
  }

  const init = async () => {
    setLoading(true)
    const user = await getCurrentFrenchFriendUser()
    if (!user) { router.push('/french-friend/login'); return }

    const fullUser = await getFullUserRecord(user.id)
    if (!trialStatus(fullUser).active) { router.push('/french-friend/subscribe'); return }

    const { data: char } = await supabase.from('french_friend_characters').select('*').eq('slug', slug).single()
    if (!char) { setLoading(false); return }
    setCharacter(char)

    const { data: existingRel } = await supabase.from('french_friend_relationships').select('*').eq('user_id', user.id).eq('character_id', char.id).maybeSingle()

    if (existingRel) {
      setRelationshipId(existingRel.id)
      setProficiencyLevel(existingRel.proficiency_level || 'A1')
      setShowTopicPicker(true)
      loadPast(existingRel.id)
    } else {
      const { data: newRel } = await supabase.from('french_friend_relationships').insert({ user_id: user.id, character_id: char.id }).select().single()
      if (newRel) setRelationshipId(newRel.id)
      setShowLevelPicker(true)
    }
    setLoading(false)
  }

  const selectLevel = async (level: string) => {
    setProficiencyLevel(level)
    if (relationshipId) await supabase.from('french_friend_relationships').update({ proficiency_level: level }).eq('id', relationshipId)
    setShowLevelPicker(false)
    if (changingLevel) {
      setChangingLevel(false)
      setLevelNotice(`Switched to ${level} — ${character?.name} will adjust from the next reply.`)
      setTimeout(() => setLevelNotice(null), 4000)
    } else {
      setShowTopicPicker(true)
    }
  }
  const openLevelChanger = () => { setChangingLevel(true); setShowLevelPicker(true) }

  const playSpeech = async (frenchText: string) => {
    const speakRes = await fetch('/api/french-friend/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: frenchText, characterSlug: slug }) })
    if (!speakRes.ok) return
    const audioArrayBuffer = await speakRes.arrayBuffer()
    const blob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' })
    const url = URL.createObjectURL(blob)
    if (audioRef.current) {
      const audioEl = audioRef.current
      audioEl.pause(); audioEl.currentTime = 0
      audioEl.onplay = () => setSpeaking(true)
      audioEl.onended = () => setSpeaking(false)
      audioEl.onpause = () => setSpeaking(false)
      audioEl.oncanplaythrough = () => { audioEl.oncanplaythrough = null; audioEl.play() }
      audioEl.src = url; audioEl.load()
    }
  }

  const repeatLast = async () => {
    const last = [...transcript].reverse().find((t) => t.speaker === 'character' && t.french_text)
    if (!last?.french_text || repeating || processing) return
    setRepeating(true); setError('')
    try { await playSpeech(last.french_text) } catch { setError('Could not play that again — please try once more.') } finally { setRepeating(false) }
  }

  const startConversation = async (selectedTopic: string | null) => {
    if (!relationshipId || isProcessingRef.current) return
    isProcessingRef.current = true; setProcessing(true); setError('')
    try {
      const res = await fetch('/api/french-friend/conversation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationshipId, userMessage: '', opening: true, recentHistory: [], topic: selectedTopic && selectedTopic !== 'Just chat freely' ? selectedTopic : null, showChoices: showChoices && ['A1', 'A2'].includes(proficiencyLevel) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong getting a response.'); return }
      const openingTurn: Turn = { speaker: 'character', french_text: data.french, english_text: data.english, suggestions: data.suggestedReplies || [] }
      setTranscript([openingTurn])
      await playSpeech(data.french)
    } catch { setError('Something went wrong. Please try again.') } finally { setProcessing(false); isProcessingRef.current = false }
  }

  const startRecording = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => { stream.getTracks().forEach((track) => track.stop()); streamRef.current = null; handleRecordingStop() }
      mediaRecorderRef.current = recorder
      recorder.start(); setRecording(true)
    } catch { setError('Could not access your microphone. Please check permissions.') }
  }
  const stopRecording = () => { mediaRecorderRef.current?.stop(); setRecording(false) }

  const handleRecordingStop = async () => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true
    setProcessing(true)
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      if (languageHint !== 'auto') formData.append('language', languageHint)

      const transcribeRes = await fetch('/api/french-friend/transcribe', { method: 'POST', body: formData })
      const transcribeData = await transcribeRes.json()
      if (!transcribeRes.ok || !transcribeData.text?.trim()) { setError('Could not hear that clearly — try again?'); return }

      const studentTurn: Turn = { speaker: 'student', english_text: transcribeData.text }
      const updatedTranscript = [...transcript, studentTurn]
      setTranscript(updatedTranscript)

      const conversationRes = await fetch('/api/french-friend/conversation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationshipId, userMessage: transcribeData.text, recentHistory: updatedTranscript.slice(-8), topic: topic && topic !== 'Just chat freely' ? topic : null, showChoices: showChoices && ['A1', 'A2'].includes(proficiencyLevel) }),
      })
      const conversationData = await conversationRes.json()
      if (!conversationRes.ok) { setError(conversationData.error || 'Something went wrong getting a response.'); return }

      const characterTurn: Turn = { speaker: 'character', french_text: conversationData.french, english_text: conversationData.english, suggestions: conversationData.suggestedReplies || [] }
      setTranscript((prev) => [...prev, characterTurn])
      await playSpeech(conversationData.french)
    } catch { setError('Something went wrong. Please try again.') } finally { setProcessing(false); isProcessingRef.current = false }
  }

  const openLevelPickerInit = () => {}

  const endConversation = async () => {
    if (!transcript.some((t) => t.speaker === 'student')) { router.push('/french-friend/characters'); return }
    setEnding(true); savedRef.current = true
    const res = await fetch('/api/french-friend/end-conversation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ relationshipId, transcript }) })
    const data = await res.json()
    if (data.saved === false) { setError(`This conversation could not be saved: ${data.saveError || 'unknown error'}`); setEnding(false); setTimeout(() => router.push('/french-friend/characters'), 6000); return }
    if (data.levelChanged && data.newLevel > proficiencyLevel) {
      setLevelUpMessage(`🎉 ${character.name} thinks you're ready for ${data.newLevel}-level conversations now!`)
      setTimeout(() => router.push('/french-friend/characters'), 2800)
    } else {
      router.push('/french-friend/characters')
    }
  }

  if (loading) return <main style={{ background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5EFE1' }}>Loading...</main>
  if (!character) return <main style={{ background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5EFE1' }}>Friend not found.</main>

  return (
    <main style={{ minHeight: '100vh', background: `url('/french-friend/characters/${slug}.svg') center/cover no-repeat, #14201C`, display: 'flex', flexDirection: 'column', fontFamily: "'Work Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Work+Sans:wght@400;500;600;700&display=swap');
        @keyframes waveform-bounce { 0%, 100% { height: 8px; } 50% { height: 28px; } }
        .waveform-bar { width: 4px; background: #D4A24C; border-radius: 2px; animation: waveform-bounce 0.6s ease-in-out infinite; }
      `}</style>

      {speaking && (
        <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '4px', height: '28px', zIndex: 5, background: 'rgba(20,32,28,0.5)', padding: '8px 16px', borderRadius: '20px' }}>
          {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => <div key={i} className="waveform-bar" style={{ animationDelay: `${delay}s` }} />)}
        </div>
      )}

      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, rgba(20,32,28,0.55) 0%, rgba(20,32,28,0.75) 55%, rgba(20,32,28,0.95) 100%)', display: 'flex', flexDirection: 'column' }}>

        {showLevelPicker && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,32,28,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 15, overflowY: 'auto' }}>
            <div style={{ maxWidth: '440px', width: '100%' }}>
              <p style={{ fontFamily: "'Fraunces', serif", color: 'white', fontSize: '22px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>{changingLevel ? 'Change your level' : "What's your French level?"}</p>
              <p style={{ color: 'rgba(245,239,225,0.65)', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
                {changingLevel ? `Too hard? Too easy? Pick a level and ${character?.name} will change how they talk to you straight away.` : `${character?.name} will match how they talk to you based on this — you can change it any time.`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LEVEL_OPTIONS.map((opt) => (
                  <button key={opt.level} onClick={() => selectLevel(opt.level)}
                    style={{ background: opt.level === proficiencyLevel ? 'rgba(212,162,76,0.18)' : 'rgba(245,239,225,0.06)', border: opt.level === proficiencyLevel ? '1px solid #D4A24C' : '1px solid rgba(245,239,225,0.15)', borderRadius: '12px', padding: '12px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: '#D4A24C', color: '#14201C', fontWeight: 700, fontSize: '12px', borderRadius: '6px', padding: '4px 8px', flexShrink: 0 }}>{opt.level}</span>
                    <span>
                      <span style={{ display: 'block', color: '#F5EFE1', fontWeight: 600, fontSize: '13px' }}>{opt.title}</span>
                      <span style={{ display: 'block', color: 'rgba(245,239,225,0.6)', fontSize: '12px' }}>{opt.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
              {changingLevel && (
                <button onClick={() => { setShowLevelPicker(false); setChangingLevel(false) }} style={{ display: 'block', margin: '18px auto 0', background: 'none', border: 'none', color: 'rgba(245,239,225,0.6)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              )}
            </div>
          </div>
        )}

        {showTopicPicker && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,32,28,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 10 }}>
            <div style={{ maxWidth: '400px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Fraunces', serif", color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>What do you want to talk about?</p>
              <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '14px', marginBottom: '28px' }}>Pick a situation to practice, or just chat freely.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TOPIC_SUGGESTIONS.map((t) => (
                  <button key={t} onClick={() => { setTopic(t); setShowTopicPicker(false); startConversation(t) }}
                    style={{ background: t === 'Just chat freely' ? '#D4A24C' : 'rgba(245,239,225,0.08)', color: t === 'Just chat freely' ? '#14201C' : '#F5EFE1', border: '1px solid rgba(245,239,225,0.15)', borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {levelUpMessage && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,32,28,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 20, textAlign: 'center' }}>
            <div><div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div><p style={{ fontFamily: "'Fraunces', serif", color: '#D4A24C', fontSize: '22px', fontWeight: 700, maxWidth: '340px', margin: '0 auto' }}>{levelUpMessage}</p></div>
          </div>
        )}

        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={endConversation} disabled={ending} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#F5EFE1', borderRadius: '20px', padding: '8px 18px', fontSize: '13px', cursor: 'pointer' }}>
              ← {ending ? 'Saving...' : 'End conversation'}
            </button>
            <button onClick={openLevelChanger} style={{ background: 'rgba(212,162,76,0.25)', border: '1px solid rgba(212,162,76,0.5)', color: '#D4A24C', borderRadius: '20px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
              Level {proficiencyLevel} ▾
            </button>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: "'Fraunces', serif", color: 'white', fontSize: '18px', fontWeight: 700, margin: 0 }}>{character.name}</p>
            <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '12px', margin: 0 }}>{character.hometown} · AI Character</p>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
          <div style={{ marginTop: 'auto' }} />

          {pastConversations.map((pc) => {
            const turns = Array.isArray(pc.transcript) ? pc.transcript : []
            return (
              <div key={pc.id} style={{ opacity: 0.85 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0', color: 'rgba(245,239,225,0.55)', fontSize: '11px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(245,239,225,0.15)' }} />
                  <span>{new Date(pc.started_at).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(245,239,225,0.15)' }} />
                </div>
                {turns.map((t, ti) => (
                  <div key={ti} style={{ marginBottom: '12px', display: 'flex', justifyContent: t.speaker === 'student' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', background: t.speaker === 'student' ? 'rgba(212,162,76,0.75)' : 'rgba(27,43,37,0.85)', borderRadius: '14px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      {t.speaker === 'character' && t.french_text && (
                        <button onClick={() => playSpeech(t.french_text as string)} aria-label="Hear this" style={{ background: '#D4A24C', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '12px', flexShrink: 0 }}>🔊</button>
                      )}
                      <div>
                        {t.french_text && <p style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: 600, color: t.speaker === 'student' ? '#14201C' : '#F5EFE1' }}>{t.french_text}</p>}
                        <p style={{ margin: 0, fontSize: '12px', color: t.speaker === 'student' ? 'rgba(20,32,28,0.7)' : 'rgba(245,239,225,0.65)' }}>{t.english_text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}

          {pastConversations.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '18px 0 14px', color: '#D4A24C', fontSize: '11px', fontWeight: 700 }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(212,162,76,0.4)' }} />
              <span>Today's conversation · scroll up to review earlier ones</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(212,162,76,0.4)' }} />
            </div>
          )}

          {transcript.length === 0 && (
            <p style={{ color: 'rgba(245,239,225,0.6)', textAlign: 'center', fontSize: '14px' }}>{processing ? `${character.name} is saying hello...` : `Tap the microphone to say hello to ${character.name}`}</p>
          )}

          {transcript.map((turn, i) => (
            <div key={i} style={{ marginBottom: '16px', display: 'flex', justifyContent: turn.speaker === 'student' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', background: turn.speaker === 'student' ? 'rgba(212,162,76,0.9)' : 'rgba(27,43,37,0.9)', borderRadius: '14px', padding: '12px 16px' }}>
                {turn.french_text && <p style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600, color: turn.speaker === 'student' ? '#14201C' : '#F5EFE1' }}>{turn.french_text}</p>}
                <p style={{ margin: 0, fontSize: '13px', color: turn.speaker === 'student' ? 'rgba(20,32,28,0.65)' : 'rgba(245,239,225,0.65)' }}>{turn.english_text}</p>
              </div>
            </div>
          ))}

          {(() => {
            const last = transcript[transcript.length - 1]
            if (!last || last.speaker !== 'character' || !last.suggestions || last.suggestions.length === 0) return null
            return (
              <div style={{ marginBottom: '16px', maxWidth: '90%' }}>
                <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '12px', margin: '0 0 8px' }}>🎙 Try saying one of these out loud. Tap 🔊 to hear it first.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {last.suggestions.map((sug, si) => (
                    <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(212,162,76,0.14)', border: '1px solid rgba(212,162,76,0.4)', borderRadius: '12px', padding: '10px 12px' }}>
                      <button onClick={() => { setLanguageHint('fr'); playSpeech(sug.french) }} aria-label="Hear this" style={{ background: '#D4A24C', color: '#14201C', border: 'none', borderRadius: '50%', width: '34px', height: '34px', fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>🔊</button>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 600, color: '#F5EFE1' }}>{sug.french}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'rgba(245,239,225,0.6)' }}>{sug.english}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
          <div ref={bottomRef} />
        </div>

        {levelNotice && <p style={{ color: '#D4A24C', textAlign: 'center', fontSize: '13px', margin: '0 24px 12px' }}>{levelNotice}</p>}
        {error && <p style={{ color: '#e8a3a3', textAlign: 'center', fontSize: '13px', margin: '0 24px 12px' }}>{error}</p>}

        <div style={{ padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          {['A1', 'A2'].includes(proficiencyLevel) && (
            <button onClick={() => setShowChoices((v) => !v)} style={{ background: showChoices ? 'rgba(212,162,76,0.2)' : 'transparent', color: showChoices ? '#D4A24C' : 'rgba(245,239,225,0.6)', border: '1px solid rgba(212,162,76,0.4)', borderRadius: '16px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              💡 Answer choices: {showChoices ? 'On' : 'Off'}
            </button>
          )}

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.25)', borderRadius: '20px', padding: '4px' }}>
            {(['auto', 'fr', 'en'] as const).map((opt) => (
              <button key={opt} onClick={() => setLanguageHint(opt)}
                style={{ background: languageHint === opt ? '#D4A24C' : 'transparent', color: languageHint === opt ? '#14201C' : 'rgba(245,239,225,0.7)', border: 'none', borderRadius: '16px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {opt === 'auto' ? 'Auto-detect' : opt === 'fr' ? '🇫🇷 I\'m speaking French' : '🇬🇧 I\'m speaking English'}
              </button>
            ))}
          </div>

          <button onClick={recording ? stopRecording : startRecording} disabled={processing}
            style={{ width: '76px', height: '76px', borderRadius: '50%', border: 'none', background: recording ? '#e8a3a3' : processing ? '#666' : '#D4A24C', fontSize: '28px', cursor: processing ? 'not-allowed' : 'pointer', boxShadow: recording ? '0 0 0 8px rgba(232,163,163,0.25)' : '0 0 0 8px rgba(212,162,76,0.2)' }}>
            {processing ? '⏳' : recording ? '⏹' : '🎙'}
          </button>
          <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '13px', margin: 0 }}>{processing ? 'Thinking...' : recording ? 'Tap to stop' : 'Tap to speak'}</p>

          {transcript.some((t) => t.speaker === 'character') && (
            <button onClick={repeatLast} disabled={repeating || processing || recording}
              style={{ background: 'rgba(245,239,225,0.1)', color: '#F5EFE1', border: '1px solid rgba(245,239,225,0.25)', borderRadius: '20px', padding: '8px 20px', fontSize: '13px', fontWeight: 600, cursor: repeating || processing || recording ? 'not-allowed' : 'pointer', opacity: repeating || processing || recording ? 0.5 : 1 }}>
              {repeating ? 'Repeating...' : '🔁 Please repeat'}
            </button>
          )}

          <p style={{ color: 'rgba(245,239,225,0.45)', fontSize: '11px', margin: 0, textAlign: 'center', maxWidth: '340px' }}>
            Voice unclear? The words on screen are always right. Tap Please repeat — or ask your friend in English, like "Can you say that again?"
          </p>
        </div>
      </div>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </main>
  )
}
