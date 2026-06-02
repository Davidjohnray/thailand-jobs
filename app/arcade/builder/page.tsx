'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../src/lib/supabase'

const GAME_TYPES = [
  { id: 'vocab_blast', label: '🎯 Vocab Blast', desc: 'Students see a word and pick the correct definition from 4 choices.' },
  { id: 'word_hunter', label: '🔍 Word Hunter', desc: 'Students read a definition and choose the correct word. Reverse of Vocab Blast.' },
  { id: 'quiz_master', label: '📝 Quiz Master', desc: 'Write any question and all 4 answer options yourself. Any subject.' },
  { id: 'true_or_false', label: '✅ True or False', desc: 'Write a statement. Students tap True or False. Fast and fun.' },
  { id: 'picture_quiz', label: '🖼️ Picture Quiz', desc: 'Upload an image, write the question and 4 answer options.' },
]

const TIMERS = [10, 15, 20, 30, 45, 60]

const MODES = [
  { id: 'solo_enabled', label: '📚 Self Study', desc: 'Students review vocabulary cards and test themselves individually on their own device.' },
  { id: 'tv_enabled', label: '📺 TV Classroom Mode', desc: 'Teacher presents vocabulary on the big screen, then runs a team quiz — no student devices needed.' },
  { id: 'multiplayer_enabled', label: '📱 Online Multiplayer', desc: 'Students join on their own devices with a room code and answer questions live.' },
]

function emptyQuestion(type: string) {
  if (type === 'vocab_blast') return { word: '', definition: '', distractor1: '', distractor2: '', distractor3: '' }
  if (type === 'word_hunter') return { definition: '', correct_word: '', distractor1: '', distractor2: '', distractor3: '' }
  if (type === 'quiz_master') return { question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct: 'a' }
  if (type === 'true_or_false') return { statement: '', correct: 'true' }
  if (type === 'picture_quiz') return { question: '', image_url: '', option_a: '', option_b: '', option_c: '', option_d: '', correct: 'a' }
  return {}
}

function BuilderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = searchParams.get('slug') || ''
  const gameId = searchParams.get('game') || ''

  const [teacher, setTeacher] = useState<any>(null)
  const [authError, setAuthError] = useState('')
  const [title, setTitle] = useState('')
  const [gameType, setGameType] = useState('vocab_blast')
  const [timerSeconds, setTimerSeconds] = useState(20)
  const [showVocabLesson, setShowVocabLesson] = useState(true)
  const [soloEnabled, setSoloEnabled] = useState(true)
  const [tvEnabled, setTvEnabled] = useState(true)
  const [multiplayerEnabled, setMultiplayerEnabled] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentQ, setCurrentQ] = useState<any>(emptyQuestion('vocab_blast'))
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState<'setup' | 'questions'>('setup')
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const s = sessionStorage.getItem('arcadeTeacher')
    if (!s) { setAuthError('not_logged_in'); return }
    try {
      const t = JSON.parse(s)
      if (t.arcade_slug !== slug) { setAuthError('wrong_account'); return }
      setTeacher(t)
    } catch { setAuthError('not_logged_in') }
  }, [slug])

  useEffect(() => {
    if (!gameId || !teacher) return
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      if (!data) return
      setTitle(data.title)
      setGameType(data.game_type)
      setTimerSeconds(data.timer_seconds)
      setShowVocabLesson(data.show_vocab_lesson !== false)
      setSoloEnabled(data.solo_enabled !== false)
      setTvEnabled(data.tv_enabled !== false)
      setMultiplayerEnabled(!!data.multiplayer_enabled)
      setQuestions(Array.isArray(data.questions) ? data.questions : [])
    })
  }, [gameId, teacher])

  useEffect(() => { setCurrentQ(emptyQuestion(gameType)); setEditingIndex(null) }, [gameType])

  const updateCurrentQ = (field: string, value: string) => setCurrentQ((prev: any) => ({ ...prev, [field]: value }))

  const addOrUpdateQuestion = () => {
    if (gameType === 'vocab_blast' && (!currentQ.word?.trim() || !currentQ.definition?.trim())) return alert('Please fill in the word and definition.')
    if (gameType === 'word_hunter' && (!currentQ.definition?.trim() || !currentQ.correct_word?.trim())) return alert('Please fill in the definition and correct word.')
    if (gameType === 'quiz_master' && (!currentQ.question?.trim() || !currentQ.option_a?.trim() || !currentQ.option_b?.trim())) return alert('Please fill in the question and at least 2 options.')
    if (gameType === 'true_or_false' && !currentQ.statement?.trim()) return alert('Please enter a statement.')
    if (gameType === 'picture_quiz' && (!currentQ.question?.trim() || !currentQ.option_a?.trim())) return alert('Please fill in the question and at least 2 options.')
    if (editingIndex !== null) {
      setQuestions(prev => prev.map((q, i) => i === editingIndex ? currentQ : q))
      setEditingIndex(null)
    } else {
      setQuestions(prev => [...prev, currentQ])
    }
    setCurrentQ(emptyQuestion(gameType))
  }

  const editQuestion = (index: number) => { setCurrentQ(questions[index]); setEditingIndex(index); setActiveSection('questions'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const deleteQuestion = (index: number) => { if (!confirm('Delete this question?')) return; setQuestions(prev => prev.filter((_, i) => i !== index)); if (editingIndex === index) { setEditingIndex(null); setCurrentQ(emptyQuestion(gameType)) } }
  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQ = [...questions]; const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= newQ.length) return;
    [newQ[index], newQ[target]] = [newQ[target], newQ[index]]; setQuestions(newQ)
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingImage(true)
    const ext = file.name.split('.').pop()
    const filename = `game-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('teacher-game-images').upload(filename, file, { upsert: true })
    if (error) { alert('Upload failed: ' + error.message); setUploadingImage(false); return }
    const { data } = supabase.storage.from('teacher-game-images').getPublicUrl(filename)
    updateCurrentQ('image_url', data.publicUrl); setUploadingImage(false)
  }

  const deleteGame = async () => {
    if (!gameId) return
    if (!confirm('Delete this game permanently? This cannot be undone.')) return
    await supabase.from('custom_games').delete().eq('id', gameId)
    router.push('/arcade/dashboard')
  }

  const saveGame = async (status: 'draft' | 'active') => {
    if (!title.trim()) return alert('Please enter a game title.')
    if (questions.length === 0) return alert('Please add at least one question.')
    if (!soloEnabled && !tvEnabled && !multiplayerEnabled) return alert('Please enable at least one game mode.')
    setSaving(true)
    const gameData = {
      teacher_email: teacher.user_email, teacher_slug: slug, title: title.trim(),
      game_type: gameType, timer_seconds: timerSeconds, show_vocab_lesson: showVocabLesson,
      solo_enabled: soloEnabled, tv_enabled: tvEnabled, multiplayer_enabled: multiplayerEnabled,
      questions, question_count: questions.length, status, updated_at: new Date().toISOString(),
    }
    if (gameId) { await supabase.from('custom_games').update(gameData).eq('id', gameId) }
    else { await supabase.from('custom_games').insert([{ ...gameData, play_count: 0 }]) }
    setSaving(false); setSaved(true)
    setTimeout(() => router.push('/arcade/dashboard'), 1200)
  }

  if (authError === 'not_logged_in') return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>Sign in to build games</h2>
        <Link href="/arcade/dashboard" style={{ display: 'block', background: '#f59e0b', color: '#1a1a2e', padding: '14px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800' }}>Go to Dashboard →</Link>
      </div>
    </main>
  )

  if (saved) return (
    <main style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Game Saved!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Redirecting to dashboard...</p>
      </div>
    </main>
  )

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/arcade/dashboard" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← Dashboard</Link>
          <div style={{ color: 'white', fontWeight: '900', fontSize: '18px' }}>{gameId ? '✏️ Edit Game' : '➕ New Game'}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {gameId && <button onClick={deleteGame} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>🗑 Delete Game</button>}
          <button onClick={() => saveGame('draft')} disabled={saving} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>💾 Save Draft</button>
          <button onClick={() => saveGame('active')} disabled={saving} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '900', fontSize: '14px' }}>{saving ? 'Saving...' : '🟢 Save & Go Live'}</button>
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '2px solid #e5e7eb', padding: '0 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex' }}>
          {[{ id: 'setup', label: '⚙️ Game Setup' }, { id: 'questions', label: `❓ Questions (${questions.length})` }].map(tab => (
            <button key={tab.id} onClick={() => setActiveSection(tab.id as any)}
              style={{ padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', color: activeSection === tab.id ? '#f59e0b' : '#555', borderBottom: activeSection === tab.id ? '3px solid #f59e0b' : '3px solid transparent' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 24px' }}>

        {activeSection === 'setup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '15px', color: '#1a1a2e', marginBottom: '8px' }}>Game Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Animals Vocabulary, Unit 3 Quiz..."
                style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '16px', outline: 'none', boxSizing: 'border-box', fontWeight: '600' }} />
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '15px', color: '#1a1a2e', marginBottom: '12px' }}>Game Type *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {GAME_TYPES.map(t => (
                  <button key={t.id} onClick={() => setGameType(t.id)}
                    style={{ padding: '16px', borderRadius: '12px', border: `3px solid ${gameType === t.id ? '#f59e0b' : '#e5e7eb'}`, background: gameType === t.id ? '#fffbeb' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: gameType === t.id ? '#92400e' : '#1a1a2e', marginBottom: '4px' }}>{t.label}</div>
                    <div style={{ color: '#888', fontSize: '12px', lineHeight: '1.4' }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '15px', color: '#1a1a2e', marginBottom: '12px' }}>Time Per Question</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {TIMERS.map(t => (
                  <button key={t} onClick={() => setTimerSeconds(t)}
                    style={{ padding: '10px 20px', borderRadius: '10px', border: `2px solid ${timerSeconds === t ? '#f59e0b' : '#e5e7eb'}`, background: timerSeconds === t ? '#fffbeb' : 'white', color: timerSeconds === t ? '#92400e' : '#555', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
                    {t}s
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a2e', marginBottom: '4px' }}>📚 Show Vocabulary Lesson First</div>
                  <div style={{ color: '#888', fontSize: '13px' }}>Students see all words and definitions before the game starts.</div>
                </div>
                <button onClick={() => setShowVocabLesson(!showVocabLesson)}
                  style={{ background: showVocabLesson ? '#f59e0b' : '#e5e7eb', border: 'none', borderRadius: '30px', width: '56px', height: '30px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: '3px', left: showVocabLesson ? '28px' : '3px', width: '24px', height: '24px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #fde68a' }}>
              <label style={{ display: 'block', fontWeight: '800', fontSize: '15px', color: '#1a1a2e', marginBottom: '4px' }}>🎮 Game Modes</label>
              <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Choose which modes students can use to play this game.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {MODES.map(mode => {
                  const enabled = mode.id === 'solo_enabled' ? soloEnabled : mode.id === 'tv_enabled' ? tvEnabled : multiplayerEnabled
                  const toggle = mode.id === 'solo_enabled' ? () => setSoloEnabled(!soloEnabled) : mode.id === 'tv_enabled' ? () => setTvEnabled(!tvEnabled) : () => setMultiplayerEnabled(!multiplayerEnabled)
                  return (
                    <div key={mode.id} onClick={toggle}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', border: `2px solid ${enabled ? '#f59e0b' : '#e5e7eb'}`, background: enabled ? '#fffbeb' : '#fafafa', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${enabled ? '#f59e0b' : '#d1d5db'}`, background: enabled ? '#f59e0b' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                        {enabled && <span style={{ color: 'white', fontSize: '14px', fontWeight: '900' }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '800', fontSize: '15px', color: enabled ? '#92400e' : '#374151' }}>{mode.label}</div>
                        <div style={{ color: '#888', fontSize: '13px' }}>{mode.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button onClick={() => setActiveSection('questions')}
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>
              Next: Add Questions →
            </button>
          </div>
        )}

        {activeSection === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '2px solid #fde68a' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#1a1a2e', marginBottom: '20px' }}>
                {editingIndex !== null ? `✏️ Editing Question ${editingIndex + 1}` : `➕ Add Question ${questions.length + 1}`}
              </h3>

              {/* VOCAB BLAST */}
              {gameType === 'vocab_blast' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Word / Term *</label>
                    <input value={currentQ.word || ''} onChange={e => updateCurrentQ('word', e.target.value)} placeholder="e.g. Photosynthesis"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>✅ Correct Definition *</label>
                    <input value={currentQ.definition || ''} onChange={e => updateCurrentQ('definition', e.target.value)} placeholder="The correct definition"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #22c55e', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ color: '#888', fontSize: '13px', fontWeight: '600' }}>❌ Wrong Options (distractors)</div>
                  {['distractor1', 'distractor2', 'distractor3'].map((key, i) => (
                    <input key={key} value={currentQ[key] || ''} onChange={e => updateCurrentQ(key, e.target.value)} placeholder={`Wrong option ${i + 1} (optional)`}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #fca5a5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  ))}
                </div>
              )}

              {/* WORD HUNTER */}
              {gameType === 'word_hunter' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '12px 16px', border: '1px solid #86efac' }}>
                    <div style={{ color: '#15803d', fontSize: '13px', fontWeight: '700' }}>🔍 Word Hunter — students read the definition and choose the correct word.</div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Definition *</label>
                    <input value={currentQ.definition || ''} onChange={e => updateCurrentQ('definition', e.target.value)} placeholder="e.g. The process by which plants make food using sunlight"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>✅ Correct Word *</label>
                    <input value={currentQ.correct_word || ''} onChange={e => updateCurrentQ('correct_word', e.target.value)} placeholder="e.g. Photosynthesis"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #22c55e', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }} />
                  </div>
                  <div style={{ color: '#888', fontSize: '13px', fontWeight: '600' }}>❌ Wrong Words (distractors)</div>
                  {['distractor1', 'distractor2', 'distractor3'].map((key, i) => (
                    <input key={key} value={currentQ[key] || ''} onChange={e => updateCurrentQ(key, e.target.value)} placeholder={`Wrong word ${i + 1} (optional)`}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #fca5a5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  ))}
                </div>
              )}

              {/* QUIZ MASTER */}
              {gameType === 'quiz_master' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Question *</label>
                    <input value={currentQ.question || ''} onChange={e => updateCurrentQ('question', e.target.value)} placeholder="e.g. What is the capital of Thailand?"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }} />
                  </div>
                  <div style={{ color: '#555', fontSize: '13px', fontWeight: '700' }}>Answer Options — tap the letter to mark as correct:</div>
                  {['a', 'b', 'c', 'd'].map(opt => (
                    <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => updateCurrentQ('correct', opt)}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: `3px solid ${currentQ.correct === opt ? '#22c55e' : '#e5e7eb'}`, background: currentQ.correct === opt ? '#22c55e' : 'white', color: currentQ.correct === opt ? 'white' : '#9ca3af', fontWeight: '900', fontSize: '13px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {opt.toUpperCase()}
                      </button>
                      <input value={currentQ[`option_${opt}`] || ''} onChange={e => updateCurrentQ(`option_${opt}`, e.target.value)} placeholder={`Option ${opt.toUpperCase()}${opt === 'a' || opt === 'b' ? ' *' : ' (optional)'}`}
                        style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: `2px solid ${currentQ.correct === opt ? '#22c55e' : '#e5e7eb'}`, fontSize: '14px', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* TRUE OR FALSE */}
              {gameType === 'true_or_false' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Statement *</label>
                    <input value={currentQ.statement || ''} onChange={e => updateCurrentQ('statement', e.target.value)} placeholder="e.g. Elephants are the largest land animals."
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }} />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#374151' }}>Correct Answer:</div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['true', 'false'].map(val => (
                      <button key={val} onClick={() => updateCurrentQ('correct', val)}
                        style={{ flex: 1, padding: '16px', borderRadius: '12px', border: `3px solid ${currentQ.correct === val ? (val === 'true' ? '#22c55e' : '#ef4444') : '#e5e7eb'}`, background: currentQ.correct === val ? (val === 'true' ? '#f0fdf4' : '#fef2f2') : 'white', cursor: 'pointer', fontWeight: '900', fontSize: '18px', color: currentQ.correct === val ? (val === 'true' ? '#15803d' : '#dc2626') : '#9ca3af' }}>
                        {val === 'true' ? '✅ True' : '❌ False'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PICTURE QUIZ */}
              {gameType === 'picture_quiz' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Question *</label>
                    <input value={currentQ.question || ''} onChange={e => updateCurrentQ('question', e.target.value)} placeholder="e.g. What animal is this?"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '700' }} />
                  </div>
                  <div>
                    <input ref={imageInputRef} type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}
                      style={{ background: uploadingImage ? '#e5e7eb' : '#1e3a5f', color: uploadingImage ? '#9ca3af' : 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: uploadingImage ? 'not-allowed' : 'pointer', fontWeight: '700', fontSize: '14px' }}>
                      {uploadingImage ? '⏳ Uploading...' : '📷 Upload Image'}
                    </button>
                    {currentQ.image_url && <img src={currentQ.image_url} alt="" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginLeft: '12px', verticalAlign: 'middle' }} />}
                  </div>
                  {['a', 'b', 'c', 'd'].map(opt => (
                    <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => updateCurrentQ('correct', opt)}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', border: `3px solid ${currentQ.correct === opt ? '#22c55e' : '#e5e7eb'}`, background: currentQ.correct === opt ? '#22c55e' : 'white', color: currentQ.correct === opt ? 'white' : '#9ca3af', fontWeight: '900', fontSize: '13px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {opt.toUpperCase()}
                      </button>
                      <input value={currentQ[`option_${opt}`] || ''} onChange={e => updateCurrentQ(`option_${opt}`, e.target.value)} placeholder={`Option ${opt.toUpperCase()}${opt === 'a' || opt === 'b' ? ' *' : ' (optional)'}`}
                        style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: `2px solid ${currentQ.correct === opt ? '#22c55e' : '#e5e7eb'}`, fontSize: '14px', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={addOrUpdateQuestion}
                  style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                  {editingIndex !== null ? '✅ Update Question' : '➕ Add Question'}
                </button>
                {editingIndex !== null && (
                  <button onClick={() => { setEditingIndex(null); setCurrentQ(emptyQuestion(gameType)) }}
                    style={{ background: '#f3f4f6', color: '#555', border: 'none', padding: '14px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                )}
              </div>
            </div>

            {questions.length > 0 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a2e', marginBottom: '12px' }}>Questions Added ({questions.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {questions.map((q, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', border: editingIndex === i ? '2px solid #f59e0b' : '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#f59e0b', color: '#1a1a2e', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.word || q.correct_word || q.question || q.statement || 'Question'}</div>
                        <div style={{ color: '#888', fontSize: '12px' }}>{q.definition || q.correct_word || (q.correct === 'true' ? '✅ True' : q.correct === 'false' ? '❌ False' : `Correct: ${(q.correct || 'a').toUpperCase()}`)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => moveQuestion(i, 'up')} disabled={i === 0} style={{ background: '#f3f4f6', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                        <button onClick={() => moveQuestion(i, 'down')} disabled={i === questions.length - 1} style={{ background: '#f3f4f6', border: 'none', width: '30px', height: '30px', borderRadius: '6px', cursor: i === questions.length - 1 ? 'not-allowed' : 'pointer', opacity: i === questions.length - 1 ? 0.4 : 1 }}>↓</button>
                        <button onClick={() => editQuestion(i)} style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}>✏️</button>
                        <button onClick={() => deleteQuestion(i)} style={{ background: '#ffeaea', color: '#c62828', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {questions.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => saveGame('draft')} disabled={saving} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>💾 Save as Draft</button>
                <button onClick={() => saveGame('active')} disabled={saving} style={{ flex: 2, background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                  {saving ? 'Saving...' : `🟢 Save & Go Live (${questions.length} questions)`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default function ArcadeBuilderPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px' }}>Loading builder...</div>}>
      <BuilderContent />
    </Suspense>
  )
}
