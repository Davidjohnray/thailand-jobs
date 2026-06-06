'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '../../../../../src/lib/supabase'

export default function LearnModePage({ params }: { params: any }) {
  const { slug, gameId } = use(params) as { slug: string; gameId: string }
  const [game, setGame] = useState<any>(null)
  const [rawCards, setRawCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!gameId) return
    supabase.from('custom_games').select('*').eq('id', gameId).single().then(({ data }) => {
      if (!data) { setLoading(false); return }
      setGame(data)
      // Merge sessionStorage images back into questions
      let cards = Array.isArray(data.questions) ? data.questions : []
      try {
        const stored = sessionStorage.getItem(`game_images_${gameId}`)
        if (stored) {
          const images = JSON.parse(stored)
          cards = cards.map((q: any, i: number) => images[i] ? { ...q, image_data: images[i] } : q)
        }
      } catch {}
      setRawCards(cards)
      setLoading(false)
    })
  }, [gameId])

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
    </main>
  )
  if (!game) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white' }}>Game not found. <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b' }}>Go back</Link></div>
    </main>
  )

  const total = rawCards.length
  if (total === 0) return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white' }}>No cards found. <Link href={`/arcade/${slug}`} style={{ color: '#f59e0b' }}>Go back</Link></div>
    </main>
  )

  const card = rawCards[cardIndex]
  const ageGroup = game.age_group || '5_11'

  const frontText = card.word || card.correct_word || card.question || card.statement || ''
  const backMain = card.definition || (card.correct === 'true' ? 'TRUE ✅' : card.correct === 'false' ? 'FALSE ❌' : card['option_' + card.correct] || '')
  const backPhonetic = card.phonetic || ''
  const backExample = card.example_sentence || ''
  const backNotes = card.notes || ''
  const backImage = card.image_data || ''

  const isFirst = cardIndex === 0
  const isLast = cardIndex + 1 >= total

  const goNext = () => { setFlipped(false); setTimeout(() => setCardIndex(i => i + 1), 200) }
  const goPrev = () => { setFlipped(false); setTimeout(() => setCardIndex(i => i - 1), 200) }
  const handleFlip = () => setFlipped(f => !f)

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px' }}>
      <style>{`
        .flip-card { perspective: 1200px; width: 100%; max-width: 560px; height: 340px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.55s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; }
        .flip-card-inner.flipped { transform: rotateY(180deg); }
        .flip-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px; box-sizing: border-box; overflow: hidden; }
        .flip-front { background: white; }
        .flip-back { background: linear-gradient(135deg, #1e3a5f, #0f172a); border: 2px solid rgba(14,165,233,0.4); transform: rotateY(180deg); }
        @media (max-width: 600px) { .flip-card { height: 300px; } }
      `}</style>

      <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href={`/arcade/${slug}/${gameId}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>← Back</Link>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'white', fontWeight: '900', fontSize: '16px' }}>{game.title}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>🃏 Learn Mode</div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '700' }}>{cardIndex + 1} / {total}</div>
      </div>

      <div style={{ width: '100%', maxWidth: '560px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '5px', marginBottom: '28px' }}>
        <div style={{ height: '5px', borderRadius: '10px', background: '#0ea5e9', width: `${((cardIndex + 1) / total) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      <div className="flip-card" onClick={handleFlip}>
        <div className={`flip-card-inner${flipped ? ' flipped' : ''}`}>

          {/* FRONT */}
          <div className="flip-face flip-front">
            {ageGroup === 'under_5' && backImage && (
              <img src={backImage} alt="" style={{ width: '120px', height: '100px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px' }} />
            )}
            <div style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
              {game.game_type === 'vocab_blast' || game.game_type === 'word_hunter' ? 'Word' : game.game_type === 'true_or_false' ? 'Statement' : 'Question'}
            </div>
            <div style={{ fontSize: frontText.length > 30 ? '22px' : frontText.length > 15 ? '28px' : '36px', fontWeight: '900', color: '#1a1a2e', textAlign: 'center', lineHeight: '1.3', wordBreak: 'break-word' }}>
              {frontText}
            </div>
            <div style={{ marginTop: '20px', color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>Tap to reveal →</div>
          </div>

          {/* BACK */}
          <div className="flip-face flip-back">
            <div style={{ color: '#7dd3fc', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
              {game.game_type === 'true_or_false' ? 'Answer' : 'Definition'}
            </div>
            {ageGroup !== 'under_5' && backImage && (
              <img src={backImage} alt="" style={{ width: '80px', height: '64px', objectFit: 'contain', borderRadius: '10px', marginBottom: '12px' }} />
            )}
            <div style={{ fontSize: backMain.length > 60 ? '15px' : backMain.length > 30 ? '18px' : '22px', fontWeight: '800', color: 'white', textAlign: 'center', lineHeight: '1.5', wordBreak: 'break-word', marginBottom: backPhonetic || backExample || backNotes ? '14px' : '0' }}>
              {backMain}
            </div>
            {backPhonetic && (
              <div style={{ color: '#fbbf24', fontSize: '15px', fontWeight: '700', marginBottom: '8px', fontStyle: 'italic' }}>{backPhonetic}</div>
            )}
            {backExample && (
              <div style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', lineHeight: '1.5', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', width: '100%' }}>
                "{backExample}"
              </div>
            )}
            {backNotes && (
              <div style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', marginTop: '8px', lineHeight: '1.4' }}>{backNotes}</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px', color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
        {flipped ? 'Tap card to flip back' : 'Tap card to see the answer'}
      </div>

      {backImage && (
        <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>
          📸 Image shown this session only
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '28px', width: '100%', maxWidth: '560px' }}>
        <button onClick={goPrev} disabled={isFirst}
          style={{ flex: 1, background: isFirst ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: isFirst ? 'rgba(255,255,255,0.2)' : 'white', border: '2px solid rgba(255,255,255,0.15)', padding: '14px', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: isFirst ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
          ← Previous
        </button>
        {!isLast ? (
          <button onClick={goNext}
            style={{ flex: 2, background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: 'white', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
            Next Card →
          </button>
        ) : (
          <Link href={`/arcade/${slug}/${gameId}`} style={{ flex: 2, textDecoration: 'none' }}>
            <button style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white', border: 'none', padding: '14px', borderRadius: '14px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
              ✅ All Done!
            </button>
          </Link>
        )}
      </div>

      {cardIndex > 0 && (
        <button onClick={() => { setCardIndex(0); setFlipped(false) }}
          style={{ marginTop: '14px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
          ↺ Start from beginning
        </button>
      )}

      <div style={{ marginTop: '32px', color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
        Powered by jobsinthailand.net Teacher Arcade
      </div>
    </main>
  )
}
