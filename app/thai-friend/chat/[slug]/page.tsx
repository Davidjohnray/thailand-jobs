'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, getCurrentThaiFriendUser } from '../../../../lib/thai-friend-auth'

type Turn = {
  speaker: 'student' | 'character'
  thai_text?: string
  romanization?: string
  english_text: string
}

export default function ThaiFriendChatPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [character, setCharacter] = useState<any>(null)
  const [relationshipId, setRelationshipId] = useState<string | null>(null)
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('A1')
  const [transcript, setTranscript] = useState<Turn[]>([])
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [ending, setEnding] = useState(false)
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [topic, setTopic] = useState<string | null>(null)
  const [showTopicPicker, setShowTopicPicker] = useState(false)
  const [showLevelPicker, setShowLevelPicker] = useState(false)
  const [languageHint, setLanguageHint] = useState<'auto' | 'th' | 'en'>('auto')

  const TOPIC_SUGGESTIONS = ['Just chat freely', 'At the supermarket', 'Ordering food', 'Asking for directions', 'At the doctor', 'Meeting for the first time']

  const LEVEL_OPTIONS = [
    { level: 'A1', title: 'Complete beginner', desc: 'I know a few words and phrases, but can\'t really hold a conversation yet' },
    { level: 'A2', title: 'Beginner', desc: 'I can handle very basic conversations about familiar topics' },
    { level: 'B1', title: 'Intermediate', desc: 'I can talk about everyday things, with some mistakes along the way' },
    { level: 'B2', title: 'Upper Intermediate', desc: 'I can have fairly natural conversations on most topics' },
    { level: 'C1', title: 'Advanced', desc: 'I\'m close to fluent, just want more natural practice' },
    { level: 'C2', title: 'Fluent', desc: 'I want completely natural, unrestricted conversation' },
  ]

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isProcessingRef = useRef(false) // guards against the stop handler firing twice for one recording

  useEffect(() => {
    init()
  }, [slug])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  const init = async () => {
    setLoading(true)

    const user = await getCurrentThaiFriendUser()
    if (!user) {
      router.push('/thai-friend/login')
      return
    }

    const { data: char } = await supabase
      .from('thai_friend_characters')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!char) {
      setLoading(false)
      return
    }
    setCharacter(char)

    // Find or create the relationship for this student+character pair
    const { data: existingRel } = await supabase
      .from('thai_friend_relationships')
      .select('*')
      .eq('user_id', user.id)
      .eq('character_id', char.id)
      .maybeSingle()

    if (existingRel) {
      setRelationshipId(existingRel.id)
      setProficiencyLevel(existingRel.proficiency_level || 'A1')
      setShowTopicPicker(true) // returning relationship — level already known, skip straight to topic
    } else {
      const { data: newRel } = await supabase
        .from('thai_friend_relationships')
        .insert({ user_id: user.id, character_id: char.id })
        .select()
        .single()
      if (newRel) setRelationshipId(newRel.id)
      setShowLevelPicker(true) // brand new relationship — ask once, never again
    }

    setLoading(false)
  }

  const selectLevel = async (level: string) => {
    setProficiencyLevel(level)
    if (relationshipId) {
      await supabase.from('thai_friend_relationships').update({ proficiency_level: level }).eq('id', relationshipId)
    }
    setShowLevelPicker(false)
    setShowTopicPicker(true)
  }

  const startRecording = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = handleRecordingStop

      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch (err) {
      setError('Could not access your microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const handleRecordingStop = async () => {
    // MediaRecorder can occasionally fire its 'stop' event more than once for a single
    // recording in some browsers — without this guard that would mean two full
    // transcribe→respond→speak round trips overlapping, which sounds exactly like an echo.
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    setProcessing(true)
    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

    try {
      // 1. Transcribe what the student said
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      if (languageHint !== 'auto') {
        formData.append('language', languageHint)
      }

      const transcribeRes = await fetch('/api/thai-friend/transcribe', { method: 'POST', body: formData })
      const transcribeData = await transcribeRes.json()

      if (!transcribeRes.ok || !transcribeData.text?.trim()) {
        setError('Could not hear that clearly — try again?')
        setProcessing(false)
        return
      }

      const studentTurn: Turn = { speaker: 'student', english_text: transcribeData.text }
      const updatedTranscript = [...transcript, studentTurn]
      setTranscript(updatedTranscript)
      const studentTurnIndex = updatedTranscript.length - 1

      // 2. Get the character's response
      const conversationRes = await fetch('/api/thai-friend/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationshipId,
          userMessage: transcribeData.text,
          recentHistory: updatedTranscript.slice(-8),
          topic: topic && topic !== 'Just chat freely' ? topic : null,
        }),
      })
      const conversationData = await conversationRes.json()

      if (!conversationRes.ok) {
        setError(conversationData.error || 'Something went wrong getting a response.')
        setProcessing(false)
        return
      }

      // If the student's message was in Thai script, replace it with the romanized
      // version now that we have it — avoids ever showing raw Thai script on screen.
      if (conversationData.studentMessageRoman) {
        setTranscript((prev) => {
          const copy = [...prev]
          if (copy[studentTurnIndex]) {
            copy[studentTurnIndex] = { ...copy[studentTurnIndex], english_text: conversationData.studentMessageRoman }
          }
          return copy
        })
      }

      const characterTurn: Turn = {
        speaker: 'character',
        thai_text: conversationData.thai,
        romanization: conversationData.roman,
        english_text: conversationData.english,
      }
      setTranscript((prev) => [...prev, characterTurn])

      // 3. Speak the reply aloud
      const speakRes = await fetch('/api/thai-friend/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: conversationData.thai, characterSlug: slug }),
      })

      if (speakRes.ok) {
        const audioArrayBuffer = await speakRes.arrayBuffer()
        const blob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        if (audioRef.current) {
          const audioEl = audioRef.current
          audioEl.pause()
          audioEl.currentTime = 0
          audioEl.onplay = () => setSpeaking(true)
          audioEl.onended = () => setSpeaking(false)
          audioEl.onpause = () => setSpeaking(false)

          // Wait until enough of the file is actually buffered before playing —
          // playing immediately on src assignment can sometimes start before the
          // browser has decoded enough audio, causing a choppy/unclear start.
          audioEl.oncanplaythrough = () => {
            audioEl.oncanplaythrough = null
            audioEl.play()
          }
          audioEl.src = url
          audioEl.load()
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setProcessing(false)
      isProcessingRef.current = false
    }
  }

  const endConversation = async () => {
    if (transcript.length === 0) {
      router.push('/thai-friend/characters')
      return
    }
    setEnding(true)
    const res = await fetch('/api/thai-friend/end-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relationshipId, transcript }),
    })
    const data = await res.json()

    if (data.levelChanged && data.newLevel > proficiencyLevel) {
      setLevelUpMessage(`🎉 ${character.name} thinks you're ready for ${data.newLevel}-level conversations now!`)
      setTimeout(() => router.push('/thai-friend/characters'), 2800)
    } else {
      router.push('/thai-friend/characters')
    }
  }

  if (loading) {
    return <main style={{ background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5EFE1' }}>Loading...</main>
  }

  if (!character) {
    return <main style={{ background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5EFE1' }}>Friend not found.</main>
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: `url('/thai-friend/characters/${slug}.svg') center/cover no-repeat, #14201C`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Work+Sans:wght@400;500;600;700&display=swap');
        @keyframes waveform-bounce {
          0%, 100% { height: 8px; }
          50% { height: 28px; }
        }
        .waveform-bar {
          width: 4px;
          background: #D4A24C;
          border-radius: 2px;
          animation: waveform-bounce 0.6s ease-in-out infinite;
        }
      `}</style>

      {speaking && (
        <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '4px', height: '28px', zIndex: 5, background: 'rgba(20,32,28,0.5)', padding: '8px 16px', borderRadius: '20px' }}>
          {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
            <div key={i} className="waveform-bar" style={{ animationDelay: `${delay}s` }} />
          ))}
        </div>
      )}

      {/* Dark overlay so text stays readable over the portrait */}
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, rgba(20,32,28,0.55) 0%, rgba(20,32,28,0.75) 55%, rgba(20,32,28,0.95) 100%)', display: 'flex', flexDirection: 'column' }}>

        {levelUpMessage && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,32,28,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 20, textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <p style={{ fontFamily: "'Fraunces', serif", color: '#D4A24C', fontSize: '22px', fontWeight: 700, maxWidth: '340px', margin: '0 auto' }}>
                {levelUpMessage}
              </p>
            </div>
          </div>
        )}

        {showLevelPicker && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,32,28,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 15, overflowY: 'auto' }}>
            <div style={{ maxWidth: '440px', width: '100%' }}>
              <p style={{ fontFamily: "'Fraunces', serif", color: 'white', fontSize: '22px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                What's your Thai level?
              </p>
              <p style={{ color: 'rgba(245,239,225,0.65)', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
                {character?.name} will match how they talk to you based on this — don't worry, it can always adjust as you go.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LEVEL_OPTIONS.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => selectLevel(opt.level)}
                    style={{
                      background: 'rgba(245,239,225,0.06)',
                      border: '1px solid rgba(245,239,225,0.15)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ background: '#D4A24C', color: '#14201C', fontWeight: 700, fontSize: '12px', borderRadius: '6px', padding: '4px 8px', flexShrink: 0 }}>{opt.level}</span>
                    <span>
                      <span style={{ display: 'block', color: '#F5EFE1', fontWeight: 600, fontSize: '13px' }}>{opt.title}</span>
                      <span style={{ display: 'block', color: 'rgba(245,239,225,0.6)', fontSize: '12px' }}>{opt.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showTopicPicker && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,32,28,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 10 }}>
            <div style={{ maxWidth: '400px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Fraunces', serif", color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>
                What do you want to talk about?
              </p>
              <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '14px', marginBottom: '16px' }}>
                Pick a situation to practice, or just chat freely — you can always change direction mid-conversation.
              </p>
              <p style={{ color: 'rgba(245,239,225,0.4)', fontSize: '11px', marginBottom: '24px' }}>
                {character.name} is an AI character, not a real person.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {TOPIC_SUGGESTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTopic(t); setShowTopicPicker(false) }}
                    style={{
                      background: t === 'Just chat freely' ? '#D4A24C' : 'rgba(245,239,225,0.08)',
                      color: t === 'Just chat freely' ? '#14201C' : '#F5EFE1',
                      border: '1px solid rgba(245,239,225,0.15)',
                      borderRadius: '10px',
                      padding: '13px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={endConversation} disabled={ending} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#F5EFE1', borderRadius: '20px', padding: '8px 18px', fontSize: '13px', cursor: 'pointer' }}>
            ← {ending ? 'Saving...' : 'End conversation'}
          </button>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: "'Fraunces', serif", color: 'white', fontSize: '18px', fontWeight: 700, margin: 0 }}>{character.name}</p>
            <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '12px', margin: 0 }}>{character.hometown} · AI Character</p>
          </div>
        </div>

        {/* SUBTITLE AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
          {transcript.length === 0 && (
            <p style={{ color: 'rgba(245,239,225,0.6)', textAlign: 'center', fontSize: '14px' }}>
              Tap the microphone to say hello to {character.name}
            </p>
          )}

          {transcript.map((turn, i) => (
            <div key={i} style={{ marginBottom: '16px', display: 'flex', justifyContent: turn.speaker === 'student' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', background: turn.speaker === 'student' ? 'rgba(212,162,76,0.9)' : 'rgba(27,43,37,0.9)', borderRadius: '14px', padding: '12px 16px' }}>
                {turn.romanization && (
                  <p style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 600, color: turn.speaker === 'student' ? '#14201C' : '#F5EFE1' }}>{turn.romanization}</p>
                )}
                <p style={{ margin: 0, fontSize: '13px', color: turn.speaker === 'student' ? 'rgba(20,32,28,0.65)' : 'rgba(245,239,225,0.65)' }}>{turn.english_text}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p style={{ color: '#e8a3a3', textAlign: 'center', fontSize: '13px', margin: '0 24px 12px' }}>{error}</p>
        )}

        {/* MIC CONTROL */}
        <div style={{ padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.25)', borderRadius: '20px', padding: '4px' }}>
            {(['auto', 'th', 'en'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setLanguageHint(opt)}
                style={{
                  background: languageHint === opt ? '#D4A24C' : 'transparent',
                  color: languageHint === opt ? '#14201C' : 'rgba(245,239,225,0.7)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {opt === 'auto' ? 'Auto-detect' : opt === 'th' ? '🇹🇭 I\'m speaking Thai' : '🇬🇧 I\'m speaking English'}
              </button>
            ))}
          </div>

          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={processing}
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              border: 'none',
              background: recording ? '#e8a3a3' : processing ? '#666' : '#D4A24C',
              fontSize: '28px',
              cursor: processing ? 'not-allowed' : 'pointer',
              boxShadow: recording ? '0 0 0 8px rgba(232,163,163,0.25)' : '0 0 0 8px rgba(212,162,76,0.2)',
              transition: 'box-shadow 0.2s',
            }}
          >
            {processing ? '⏳' : recording ? '⏹' : '🎙'}
          </button>
          <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '13px', margin: 0 }}>
            {processing ? 'Thinking...' : recording ? 'Tap to stop' : 'Tap to speak'}
          </p>
        </div>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </main>
  )
}
