'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, getCurrentThaiFriendUser } from '../../../../lib/thai-friend-auth'

type Turn = {
  speaker: 'student' | 'character'
  thai_text?: string
  romanization?: string
  english_text: string
  wordBreakdown?: { thai: string; roman: string }[]
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
  const [showTopicPicker, setShowTopicPicker] = useState(true)
  const [languageHint, setLanguageHint] = useState<'auto' | 'th' | 'en'>('auto')

  const TOPIC_SUGGESTIONS = ['Just chat freely', 'At the supermarket', 'Ordering food', 'Asking for directions', 'At the doctor', 'Meeting for the first time']

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

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
    } else {
      const { data: newRel } = await supabase
        .from('thai_friend_relationships')
        .insert({ user_id: user.id, character_id: char.id })
        .select()
        .single()
      if (newRel) setRelationshipId(newRel.id)
    }

    setLoading(false)
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

      const characterTurn: Turn = {
        speaker: 'character',
        thai_text: conversationData.thai,
        romanization: conversationData.roman,
        english_text: conversationData.english,
        wordBreakdown: conversationData.wordBreakdown || [],
      }
      setTranscript((prev) => [...prev, characterTurn])

      // 3. Speak the reply aloud
      const speakRes = await fetch('/api/thai-friend/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: conversationData.thai, characterSlug: slug, level: proficiencyLevel }),
      })

      if (speakRes.ok) {
        const audioArrayBuffer = await speakRes.arrayBuffer()
        const blob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.onplay = () => setSpeaking(true)
          audioRef.current.onended = () => setSpeaking(false)
          audioRef.current.onpause = () => setSpeaking(false)
          audioRef.current.play()
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const speakWord = async (thaiWord: string) => {
    try {
      const res = await fetch('/api/thai-friend/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: thaiWord, characterSlug: slug, level: proficiencyLevel }),
      })
      if (res.ok) {
        const audioArrayBuffer = await res.arrayBuffer()
        const blob = new Blob([audioArrayBuffer], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        if (audioRef.current) {
          audioRef.current.src = url
          audioRef.current.play()
        }
      }
    } catch {
      // Silently ignore — this is a nice-to-have, not critical
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
                {turn.thai_text && (
                  <p style={{ margin: '0 0 3px', fontSize: '17px', fontWeight: 600, color: turn.speaker === 'student' ? '#14201C' : '#F5EFE1' }}>{turn.thai_text}</p>
                )}
                {turn.romanization && (
                  <p style={{ margin: '0 0 3px', fontSize: '13px', fontStyle: 'italic', color: turn.speaker === 'student' ? 'rgba(20,32,28,0.7)' : 'rgba(245,239,225,0.7)' }}>{turn.romanization}</p>
                )}
                <p style={{ margin: 0, fontSize: '13px', color: turn.speaker === 'student' ? 'rgba(20,32,28,0.65)' : 'rgba(245,239,225,0.65)' }}>{turn.english_text}</p>

                {turn.wordBreakdown && turn.wordBreakdown.length > 0 && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(245,239,225,0.15)' }}>
                    <p style={{ fontSize: '10px', color: 'rgba(245,239,225,0.5)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' }}>Word by word</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {turn.wordBreakdown.map((w, wi) => (
                        <button
                          key={wi}
                          onClick={() => speakWord(w.thai)}
                          style={{ background: 'rgba(212,162,76,0.15)', border: '1px solid rgba(212,162,76,0.3)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', textAlign: 'center' }}
                        >
                          <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#D4A24C' }}>{w.thai}</span>
                          <span style={{ display: 'block', fontSize: '10px', color: 'rgba(245,239,225,0.6)' }}>{w.roman}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
