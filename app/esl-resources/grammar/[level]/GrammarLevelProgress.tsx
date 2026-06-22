'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

type Progress = { topic_id: string; learn_completed: boolean; practice_score: number | null }

type Props = {
  topicIds: string[]
  totalTopics: number
  color: string
  loginUrl: string
}

export default function GrammarLevelProgress({ topicIds, totalTopics, color, loginUrl }: Props) {
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoaded(true); return }
      setIsLoggedIn(true)
      const { data: progress } = await supabase
        .from('grammar_progress')
        .select('topic_id, learn_completed, practice_score')
        .eq('user_id', user.id)
        .in('topic_id', topicIds)
      if (progress) {
        const map: Record<string, Progress> = {}
        progress.forEach((p: Progress) => { map[p.topic_id] = p })
        setProgressMap(map)
      }
      setLoaded(true)
    }
    load()
  }, [topicIds])

  const learnDoneCount = topicIds.filter(id => progressMap[id]?.learn_completed).length
  const practisedCount = topicIds.filter(id => progressMap[id]?.practice_score !== null && progressMap[id]?.practice_score !== undefined).length
  const pct = totalTopics > 0 ? Math.round((learnDoneCount / totalTopics) * 100) : 0

  if (!loaded) return (
    <div style={{ textAlign: 'center', padding: '4px 0' }}>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Loading progress…</span>
    </div>
  )

  if (!isLoggedIn) return (
    <div style={{ textAlign: 'center' }}>
      <Link href={loginUrl} style={{
        color: 'rgba(255,255,255,0.55)', fontSize: '13px', textDecoration: 'none',
        borderBottom: '1px dashed rgba(255,255,255,0.3)', paddingBottom: '1px'
      }}>
        Sign in to track your progress →
      </Link>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' }}>Your progress</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{learnDoneCount} / {totalTopics} learned</span>
          {practisedCount > 0 && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>· {practisedCount} practised</span>}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: pct === 100 ? '#4ade80' : 'rgba(255,255,255,0.9)' }}>
          {pct === 100 ? '✓ Complete!' : `${pct}%`}
        </span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
        <div style={{
          background: pct === 100 ? '#4ade80' : color,
          height: '8px', borderRadius: '6px',
          width: `${pct}%`, transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}
