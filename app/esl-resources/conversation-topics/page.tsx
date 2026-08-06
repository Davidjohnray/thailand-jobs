'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Topic = {
  id: string
  category: string
  category_group: string
  emoji: string
  level: string
  topic_title: string
  main_question: string
  follow_up_questions: string[]
  vocabulary: { word: string; definition: string }[]
}

type CategoryInfo = {
  category: string
  category_group: string
  emoji: string
}

const GROUP_LABELS: Record<string, { label: string; icon: string }> = {
  adult: { label: 'General Life & Adults', icon: '🌍' },
  business: { label: 'Business', icon: '💼' },
  kids: { label: 'Kids', icon: '🧸' },
  teens: { label: 'Teens', icon: '🎧' },
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function ConversationTopicsPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null)
  const [availableLevels, setAvailableLevels] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string>('any')

  const [topic, setTopic] = useState<Topic | null>(null)
  const [generating, setGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Load distinct categories once on mount
  useEffect(() => {
    supabase
      .from('conversation_topics')
      .select('category, category_group, emoji')
      .then(({ data, error }) => {
        if (error) {
          setErrorMsg('Could not load categories.')
          setLoadingCategories(false)
          return
        }
        const seen = new Set<string>()
        const unique: CategoryInfo[] = []
        ;(data || []).forEach((row: any) => {
          if (!seen.has(row.category)) {
            seen.add(row.category)
            unique.push(row)
          }
        })
        setCategories(unique)
        setLoadingCategories(false)
      })
  }, [])

  // When a category is picked, load which levels exist for it
  const pickCategory = async (cat: CategoryInfo) => {
    setSelectedCategory(cat)
    setSelectedLevel('any')
    setTopic(null)
    setErrorMsg('')

    const { data, error } = await supabase
      .from('conversation_topics')
      .select('level')
      .eq('category', cat.category)

    if (error) return
    const levels = Array.from(new Set((data || []).map((r: any) => r.level)))
    levels.sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b))
    setAvailableLevels(levels)
  }

  const generateTopic = async () => {
    if (!selectedCategory) return
    setGenerating(true)
    setErrorMsg('')

    let query = supabase.from('conversation_topics').select('*').eq('category', selectedCategory.category)
    if (selectedLevel !== 'any') {
      query = query.eq('level', selectedLevel)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      setErrorMsg('No topics found for this selection yet.')
      setGenerating(false)
      return
    }

    // Avoid repeating the same topic twice in a row if possible
    let pool = data
    if (topic && data.length > 1) {
      pool = data.filter((t: any) => t.id !== topic.id)
    }
    const random = pool[Math.floor(Math.random() * pool.length)]
    setTopic(random)
    setGenerating(false)
  }

  const goBackToCategories = () => {
    setSelectedCategory(null)
    setTopic(null)
    setErrorMsg('')
  }

  const groupedCategories = categories.reduce((acc: Record<string, CategoryInfo[]>, cat) => {
    if (!acc[cat.category_group]) acc[cat.category_group] = []
    acc[cat.category_group].push(cat)
    return acc
  }, {})

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#1a1a2e', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)', padding: '60px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗣️</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px' }}>Conversation Topics</h1>
        <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '520px', margin: '0 auto' }}>
          Pick a category and level to generate a random speaking topic with discussion questions
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* STEP 1: CATEGORY PICKER */}
        {!selectedCategory && (
          <>
            {loadingCategories && (
              <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>Loading categories...</p>
            )}

            {!loadingCategories && categories.length === 0 && (
              <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>No categories added yet.</p>
            )}

            {Object.keys(groupedCategories).map((groupKey) => {
              const groupMeta = GROUP_LABELS[groupKey] || { label: groupKey, icon: '📁' }
              return (
                <div key={groupKey} style={{ marginBottom: '36px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>
                    {groupMeta.icon} {groupMeta.label}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {groupedCategories[groupKey].map((cat) => (
                      <button
                        key={cat.category}
                        onClick={() => pickCategory(cat)}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '14px',
                          padding: '16px 20px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      >
                        <span style={{ fontSize: '20px' }}>{cat.emoji}</span> {cat.category}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* STEP 2: LEVEL PICKER + GENERATE */}
        {selectedCategory && (
          <div>
            <button
              onClick={goBackToCategories}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
            >
              ← Back to categories
            </button>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{selectedCategory.emoji}</div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{selectedCategory.category}</h2>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Level</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                <button
                  onClick={() => setSelectedLevel('any')}
                  style={{
                    background: selectedLevel === 'any' ? '#f97316' : 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 18px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Any Level
                </button>
                {availableLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    style={{
                      background: selectedLevel === lvl ? '#f97316' : 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 18px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <button
                onClick={generateTopic}
                disabled={generating}
                style={{
                  background: generating ? '#999' : 'linear-gradient(135deg, #dc2626, #f97316)',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '16px 40px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(220,38,38,0.35)',
                }}
              >
                {generating ? 'Generating...' : topic ? '🔄 Generate Another' : '🎲 Generate Topic'}
              </button>
            </div>

            {errorMsg && (
              <p style={{ color: '#fca5a5', textAlign: 'center', marginBottom: '20px' }}>{errorMsg}</p>
            )}

            {/* TOPIC CARD */}
            {topic && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
                <div style={{ display: 'inline-block', background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', padding: '5px 14px', borderRadius: '20px', marginBottom: '16px' }}>
                  {topic.level} · {topic.category}
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 14px' }}>{topic.topic_title}</h3>

                <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.6', margin: '0 0 24px', fontWeight: 600 }}>{topic.main_question}</p>

                <div style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Follow-up Questions</p>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#444', lineHeight: '1.9', fontSize: '15px' }}>
                    {topic.follow_up_questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                {topic.vocabulary && topic.vocabulary.length > 0 && (
                  <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '18px 20px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Key Vocabulary</p>
                    {topic.vocabulary.map((v, i) => (
                      <p key={i} style={{ margin: '0 0 6px', fontSize: '14px', color: '#333' }}>
                        <strong style={{ color: '#dc2626' }}>{v.word}</strong> — {v.definition}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
