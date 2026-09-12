'use client'
import { use, useEffect, useState, useRef } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Activity = {
  id: number
  skill_type: string
  activity_type: string
  title: string | null
  sort_order: number
  content_json: any
}

const AUDIO_BASE = '/audio/'

export default function PrimaryLessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [lessonTitle, setLessonTitle] = useState('')
  const [unitId, setUnitId] = useState<number | null>(null)
  const [nextLessonId, setNextLessonId] = useState<number | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [debugError, setDebugError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: lesson, error: lessonError } = await supabase
        .from('primary_course_lessons')
        .select('title, unit_id, sort_order, video_url')
        .eq('id', id)
        .single()
      if (lessonError) setDebugError('Lesson query error: ' + JSON.stringify(lessonError))
      if (lesson) {
        setLessonTitle(lesson.title)
        setUnitId(lesson.unit_id)

        const { data: nextLesson } = await supabase
          .from('primary_course_lessons')
          .select('id')
          .eq('unit_id', lesson.unit_id)
          .gt('sort_order', lesson.sort_order)
          .order('sort_order', { ascending: true })
          .limit(1)
          .maybeSingle()
        setNextLessonId(nextLesson ? nextLesson.id : null)
      }

      const { data: acts, error: actsError } = await supabase
        .from('primary_course_activities')
        .select('*')
        .eq('lesson_id', id)
        .order('sort_order', { ascending: true })
      if (actsError) setDebugError('Activities query error: ' + JSON.stringify(actsError))
      setActivities(acts || [])
      setLoading(false)
    }
    load()
  }, [id])

  function playAudio(file: string) {
    const audio = new Audio(AUDIO_BASE + file)
    audio.play().catch(() => {})
  }

  if (loading) {
    return <main style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading lesson...</main>
  }

  if (!activities.length) {
    return (
      <main style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        No activities found for this lesson yet.
        {debugError && (
          <div style={{ marginTop: '24px', color: '#c00', fontSize: '13px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'left', wordBreak: 'break-word' }}>
            DEBUG: {debugError}
          </div>
        )}
      </main>
    )
  }

  const activity = activities[activeIndex]
  const isLastActivity = activeIndex === activities.length - 1

  function goNext() {
    if (!isLastActivity) {
      setActiveIndex((i) => Math.min(i + 1, activities.length - 1))
      return
    }
    if (nextLessonId) {
      router.push(`/primary/lesson/${nextLessonId}`)
    } else if (unitId) {
      router.push(`/primary/unit/${unitId}`)
    }
  }

  const skillLabel: Record<string, string> = {
    listening: '🎧 Listening',
    speaking: '🎤 Speaking',
    reading: '📖 Reading',
    writing: '✏️ Writing',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #DCEEFB, #E8F9F0)', fontFamily: 'sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {unitId && (
          <Link href={`/primary/unit/${unitId}`} style={{ display: 'inline-block', marginBottom: '16px', color: '#2563EB', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to lessons
          </Link>
        )}
        <h1 style={{ textAlign: 'center', fontSize: '26px', color: '#1E3A5F', marginBottom: '4px' }}>{lessonTitle}</h1>
        <p style={{ textAlign: 'center', color: '#5b7a99', marginBottom: '8px', fontWeight: 'bold' }}>
          {skillLabel[activity.skill_type] || activity.skill_type}
        </p>
        <p style={{ textAlign: 'center', color: '#8a99a8', marginBottom: '24px', fontSize: '14px' }}>
          Activity {activeIndex + 1} of {activities.length}
        </p>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          {activity.activity_type === 'listening_dialogue' && <ListeningDialogue key={activity.id} content={activity.content_json} onPlay={playAudio} />}
          {activity.activity_type === 'comprehension_quiz' && <ComprehensionQuiz key={activity.id} content={activity.content_json} onComplete={goNext} />}
          {activity.activity_type === 'speaking_recorder' && <SpeakingRecorder key={activity.id} content={activity.content_json} onPlay={playAudio} />}
          {activity.activity_type === 'reading_passage' && <ReadingPassage key={activity.id} content={activity.content_json} onPlay={playAudio} />}
          {activity.activity_type === 'sentence_builder' && <SentenceBuilder key={activity.id} content={activity.content_json} onComplete={goNext} />}
          {activity.activity_type === 'fill_in_blank' && <FillInBlank key={activity.id} content={activity.content_json} onComplete={goNext} />}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))} disabled={activeIndex === 0} style={navButtonStyle(activeIndex === 0)}>
            ← Back
          </button>
          <button onClick={goNext} style={navButtonStyle(false)}>
            {isLastActivity ? (nextLessonId ? 'Next Lesson →' : 'Finish Unit →') : 'Next →'}
          </button>
        </div>
      </div>
    </main>
  )
}

function navButtonStyle(disabled: boolean): CSSProperties {
  return {
    background: disabled ? '#ddd' : '#2563EB',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: disabled ? 'default' : 'pointer',
  }
}

// ---------- Listening Dialogue ----------
function ListeningDialogue({ content, onPlay }: { content: any; onPlay: (file: string) => void }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#1E3A5F', marginBottom: '16px' }}>Listen to the conversation</h2>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => {
            onPlay(content.audio)
            setRevealed(true)
          }}
          style={{ fontSize: '48px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          🔊
        </button>
      </div>
      {revealed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {content.lines.map((line: any, i: number) => (
            <div
              key={i}
              style={{
                alignSelf: line.speaker === 'A' ? 'flex-start' : 'flex-end',
                background: line.speaker === 'A' ? '#EEF2FF' : '#E8F9F0',
                borderRadius: '14px',
                padding: '10px 16px',
                maxWidth: '80%',
              }}
            >
              <strong style={{ color: '#5b7a99', fontSize: '12px' }}>{line.speaker === 'A' ? 'Student A' : 'Student B'}</strong>
              <div style={{ color: '#1E3A5F' }}>{line.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- Comprehension Quiz ----------
function ComprehensionQuiz({ content, onComplete }: { content: any; onComplete: () => void }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const question = content.questions[current]

  function choose(i: number) {
    if (selected !== null) return
    setSelected(i)
    if (i === question.correct_index) setScore((s) => s + 1)
    setTimeout(() => {
      if (current < content.questions.length - 1) {
        setCurrent((c) => c + 1)
        setSelected(null)
      } else {
        setFinished(true)
      }
    }, 1000)
  }

  if (finished) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#1E3A5F' }}>Quiz Complete!</h2>
        <p style={{ fontSize: '20px', margin: '16px 0' }}>
          You got {score} out of {content.questions.length} correct
        </p>
        <button onClick={onComplete} style={navButtonStyle(false)}>
          Continue →
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#1E3A5F', marginBottom: '8px' }}>
        Question {current + 1} of {content.questions.length}
      </h2>
      <p style={{ fontSize: '18px', textAlign: 'center', marginBottom: '20px', color: '#1E3A5F' }}>{question.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {question.options.map((opt: string, i: number) => {
          let bg = '#F1F5F9'
          if (selected !== null) {
            if (i === question.correct_index) bg = '#DCFCE7'
            else if (i === selected) bg = '#FEE2E2'
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              style={{ background: bg, border: 'none', borderRadius: '12px', padding: '14px', fontSize: '16px', textAlign: 'left', cursor: 'pointer' }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---------- Speaking Recorder ----------
function SpeakingRecorder({ content, onPlay }: { content: any; onPlay: (file: string) => void }) {
  const [recording, setRecording] = useState(false)
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordedUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setRecording(true)
    } catch {
      alert("Couldn't access the microphone. Please allow microphone access and try again.")
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#1E3A5F', marginBottom: '16px' }}>Your Turn to Speak</h2>
      {content.prompt_audio && (
        <button onClick={() => onPlay(content.prompt_audio)} style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px' }}>
          🔊
        </button>
      )}
      <p style={{ fontSize: '17px', color: '#1E3A5F', marginBottom: '24px', fontStyle: 'italic' }}>{content.prompt}</p>

      {!recording && (
        <button
          onClick={startRecording}
          style={{ background: '#DC2626', color: 'white', border: 'none', borderRadius: '50%', width: '72px', height: '72px', fontSize: '28px', cursor: 'pointer' }}
        >
          🎤
        </button>
      )}
      {recording && (
        <button
          onClick={stopRecording}
          style={{ background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '16px', padding: '14px 28px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ⏹ Stop Recording
        </button>
      )}

      {recordedUrl && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#5b7a99', marginBottom: '8px' }}>Listen to your answer:</p>
          <audio controls src={recordedUrl} />
        </div>
      )}
    </div>
  )
}

// ---------- Reading Passage ----------
function ReadingPassage({ content, onPlay }: { content: any; onPlay: (file: string) => void }) {
  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#1E3A5F', marginBottom: '16px' }}>Read the passage</h2>
      {content.audio && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <button onClick={() => onPlay(content.audio)} style={{ fontSize: '32px', background: 'none', border: 'none', cursor: 'pointer' }}>
            🔊
          </button>
          <p style={{ fontSize: '13px', color: '#8a99a8' }}>Tap to hear it read aloud</p>
        </div>
      )}
      <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#1E3A5F', background: '#F8FAFC', borderRadius: '14px', padding: '20px' }}>
        {content.passage}
      </p>
    </div>
  )
}

// ---------- Sentence Builder ----------
function SentenceBuilder({ content, onComplete }: { content: any; onComplete: () => void }) {
  const [available, setAvailable] = useState<string[]>(content.word_bank)
  const [built, setBuilt] = useState<string[]>([])
  const [checked, setChecked] = useState<null | boolean>(null)

  function addWord(word: string, index: number) {
    setAvailable((a) => a.filter((_, i) => i !== index))
    setBuilt((b) => [...b, word])
  }

  function removeWord(word: string, index: number) {
    setBuilt((b) => b.filter((_, i) => i !== index))
    setAvailable((a) => [...a, word])
  }

  function check() {
    const isCorrect = built.join(' ').toLowerCase() === content.correct_sentence.toLowerCase()
    setChecked(isCorrect)
    if (isCorrect) setTimeout(onComplete, 1200)
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#1E3A5F', marginBottom: '20px' }}>Put the words in order</h2>
      <div style={{ minHeight: '56px', display: 'flex', flexWrap: 'wrap', gap: '8px', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '12px', marginBottom: '20px' }}>
        {built.map((word, i) => (
          <button
            key={i}
            onClick={() => removeWord(word, i)}
            style={{ background: '#2563EB', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}
          >
            {word}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
        {available.map((word, i) => (
          <button
            key={i}
            onClick={() => addWord(word, i)}
            style={{ background: '#F1F5F9', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer' }}
          >
            {word}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={check} disabled={built.length === 0} style={navButtonStyle(built.length === 0)}>
          Check
        </button>
        {checked === true && <p style={{ color: '#22c55e', fontWeight: 'bold', marginTop: '12px' }}>Great job! ⭐</p>}
        {checked === false && <p style={{ color: '#E85D26', fontWeight: 'bold', marginTop: '12px' }}>Not quite, try again!</p>}
      </div>
    </div>
  )
}

// ---------- Fill In Blank ----------
function FillInBlank({ content, onComplete }: { content: any; onComplete: () => void }) {
  const blankCount = content.correct_answers.length
  const [answers, setAnswers] = useState<(string | null)[]>(Array(blankCount).fill(null))
  const [checked, setChecked] = useState<null | boolean>(null)
  const usedWords = answers.filter(Boolean) as string[]

  function fillBlank(word: string) {
    const nextEmptyIndex = answers.findIndex((a) => a === null)
    if (nextEmptyIndex === -1) return
    const updated = [...answers]
    updated[nextEmptyIndex] = word
    setAnswers(updated)
  }

  function clearBlank(index: number) {
    const updated = [...answers]
    updated[index] = null
    setAnswers(updated)
  }

  function check() {
    const isCorrect = answers.every((a, i) => a === content.correct_answers[i])
    setChecked(isCorrect)
    if (isCorrect) setTimeout(onComplete, 1200)
  }

  const parts = content.text_template.split(/\{(\d+)\}/)

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#1E3A5F', marginBottom: '20px' }}>Fill in the blanks</h2>
      <p style={{ fontSize: '18px', lineHeight: '2', color: '#1E3A5F', marginBottom: '20px' }}>
        {parts.map((part: string, i: number) => {
          if (i % 2 === 0) return <span key={i}>{part}</span>
          const blankIndex = parseInt(part, 10)
          return (
            <button
              key={i}
              onClick={() => answers[blankIndex] && clearBlank(blankIndex)}
              style={{
                display: 'inline-block',
                minWidth: '80px',
                borderBottom: '2px solid #2563EB',
                background: answers[blankIndex] ? '#EEF2FF' : 'transparent',
                border: 'none',
                borderBottomWidth: '2px',
                borderBottomColor: '#2563EB',
                borderBottomStyle: 'solid',
                fontWeight: 'bold',
                color: '#1E3A5F',
                cursor: answers[blankIndex] ? 'pointer' : 'default',
                padding: '2px 8px',
              }}
            >
              {answers[blankIndex] || '____'}
            </button>
          )
        })}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
        {content.word_bank.map((word: string, i: number) => {
          const usedCount = usedWords.filter((w) => w === word).length
          const totalCount = content.word_bank.filter((w: string) => w === word).length
          const disabled = usedCount >= totalCount
          return (
            <button
              key={i}
              onClick={() => !disabled && fillBlank(word)}
              disabled={disabled}
              style={{
                background: disabled ? '#e2e8f0' : '#F1F5F9',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '8px 14px',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled ? 0.4 : 1,
              }}
            >
              {word}
            </button>
          )
        })}
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={check} disabled={answers.some((a) => a === null)} style={navButtonStyle(answers.some((a) => a === null))}>
          Check
        </button>
        {checked === true && <p style={{ color: '#22c55e', fontWeight: 'bold', marginTop: '12px' }}>Perfect! ⭐</p>}
        {checked === false && <p style={{ color: '#E85D26', fontWeight: 'bold', marginTop: '12px' }}>Not quite, try again!</p>}
      </div>
    </div>
  )
}
