'use client'
import { use, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { supabase } from '@/lib/supabase'

type Activity = {
  id: number
  skill_type: string
  activity_type: string
  title: string | null
  sort_order: number
  content_json: any
}

// TEMP: pointing at public/ folders for the pilot. Swap to a Supabase storage
// bucket URL once you're ready to move assets off local files.
const AUDIO_BASE = '/audio/'
const IMAGE_BASE = '/images/'

export default function LessonPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [lessonTitle, setLessonTitle] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    async function load() {
      const { data: lesson } = await supabase
        .from('early_course_lessons')
        .select('title')
        .eq('id', id)
        .single()
      if (lesson) setLessonTitle(lesson.title)

      const { data: acts } = await supabase
        .from('early_course_activities')
        .select('*')
        .eq('lesson_id', id)
        .order('sort_order', { ascending: true })
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
    return (
      <main style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        Loading lesson...
      </main>
    )
  }

  if (!activities.length) {
    return (
      <main style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        No activities found for this lesson yet.
      </main>
    )
  }

  const activity = activities[activeIndex]

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFE9A8, #FFD3E0)', fontFamily: 'sans-serif', padding: '32px 16px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', color: '#5b3a29', marginBottom: '8px' }}>{lessonTitle}</h1>
        <p style={{ textAlign: 'center', color: '#8a6a55', marginBottom: '24px' }}>
          Activity {activeIndex + 1} of {activities.length}
        </p>

        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          {activity.activity_type === 'flashcard_audio' && (
            <FlashcardAudio content={activity.content_json} onPlay={playAudio} />
          )}
          {activity.activity_type === 'chant' && (
            <Chant content={activity.content_json} onPlay={playAudio} />
          )}
          {activity.activity_type === 'tap_match' && (
            <TapMatch
              content={activity.content_json}
              onPlay={playAudio}
              onComplete={() => setActiveIndex((i) => Math.min(i + 1, activities.length - 1))}
            />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button
            onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
            disabled={activeIndex === 0}
            style={navButtonStyle(activeIndex === 0)}
          >
            ← Back
          </button>
          <button
            onClick={() => setActiveIndex((i) => Math.min(i + 1, activities.length - 1))}
            disabled={activeIndex === activities.length - 1}
            style={navButtonStyle(activeIndex === activities.length - 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  )
}

function navButtonStyle(disabled: boolean): CSSProperties {
  return {
    background: disabled ? '#ddd' : '#7C3AED',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: disabled ? 'default' : 'pointer',
  }
}

// ---------- Activity: Flashcard Audio ----------
function FlashcardAudio({ content, onPlay }: { content: any; onPlay: (file: string) => void }) {
  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#5b3a29', marginBottom: '20px' }}>Tap each word to listen</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
        {content.items.map((item: any, i: number) => (
          <button
            key={i}
            onClick={() => onPlay(item.audio)}
            style={{
              background: '#FFF3D6',
              border: '3px solid #FFD98A',
              borderRadius: '16px',
              padding: '16px 8px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔊</div>
            <div style={{ fontWeight: 'bold', color: '#5b3a29' }}>{item.word}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------- Activity: Chant (repeat after me) ----------
function Chant({ content, onPlay }: { content: any; onPlay: (file: string) => void }) {
  const [index, setIndex] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const item = content.items[index]

  useEffect(() => {
    setShowPrompt(false)
    onPlay(item.audio)
    const timer = setTimeout(() => setShowPrompt(true), (content.pause_seconds || 3) * 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#5b3a29', marginBottom: '20px' }}>Listen and Say It Back</h2>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7C3AED', marginBottom: '16px' }}>{item.phrase}</div>
      <button onClick={() => onPlay(item.audio)} style={{ fontSize: '40px', background: 'none', border: 'none', cursor: 'pointer' }}>
        🔊
      </button>
      {showPrompt && <p style={{ color: '#E85D26', fontWeight: 'bold', marginTop: '16px' }}>Now you say it!</p>}
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={() => setIndex((i) => Math.min(i + 1, content.items.length - 1))}
          disabled={index === content.items.length - 1}
          style={navButtonStyle(index === content.items.length - 1)}
        >
          Next Word →
        </button>
      </div>
    </div>
  )
}

// ---------- Activity: Tap Match ----------
function TapMatch({
  content,
  onPlay,
  onComplete,
}: {
  content: any
  onPlay: (file: string) => void
  onComplete: () => void
}) {
  const [round, setRound] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const currentRound = content.rounds[round]

  useEffect(() => {
    setFeedback(null)
    onPlay(currentRound.audio)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  function handleChoice(option: string) {
    if (option === currentRound.correct_image) {
      setFeedback('correct')
      setTimeout(() => {
        if (round < content.rounds.length - 1) {
          setRound((r) => r + 1)
        } else {
          onComplete()
        }
      }, 1200)
    } else {
      setFeedback('wrong')
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#5b3a29', marginBottom: '8px' }}>Which One?</h2>
      <button
        onClick={() => onPlay(currentRound.audio)}
        style={{ fontSize: '40px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
      >
        🔊
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {currentRound.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => handleChoice(opt)}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '16px',
              border: '3px solid #ddd',
              background: `#f5f5f5 center/cover no-repeat url(${IMAGE_BASE}${opt})`,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      {feedback === 'correct' && <p style={{ color: '#22c55e', fontWeight: 'bold', marginTop: '16px' }}>Great job! ⭐</p>}
      {feedback === 'wrong' && <p style={{ color: '#E85D26', fontWeight: 'bold', marginTop: '16px' }}>Try again!</p>}
      <p style={{ marginTop: '12px', color: '#8a6a55', fontSize: '14px' }}>
        Round {round + 1} of {content.rounds.length}
      </p>
    </div>
  )
}
