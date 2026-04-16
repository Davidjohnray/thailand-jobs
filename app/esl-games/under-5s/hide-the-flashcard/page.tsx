'use client'
import Link from 'next/link'

export default function HideTheFlashcardGame() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', padding: '52px 24px', color: 'white' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <Link href="/esl-games/under-5s" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>← Back to Under 5s Games</Link>
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🙈</div>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: '0 0 10px' }}>Hide the Flashcard</h1>
            <p style={{ opacity: 0.9, fontSize: '16px', margin: '0 0 16px' }}>Teacher hides a flashcard around the room — children find it and shout the word.</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['⏱ 10 min', '⚡ High energy', '👥 Whole class'].map((t, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.25)', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📋 What You Need</h2>
          <p style={{ color: '#444', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>A set of vocabulary flashcards. The classroom itself is your game board.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🎮 How to Play</h2>
          {[
            'Show children a flashcard and drill the word together two or three times.',
            'Ask children to close their eyes or put their heads down on the desk.',
            'Hide the flashcard somewhere visible in the classroom — on a shelf, under a chair, on the window.',
            'Call "Open your eyes! Find the card!"',
            'Children search the room. The first child to find it shouts the vocabulary word.',
            'That child hides the next card while the others close their eyes.',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px', alignItems: 'flex-start' }}>
              <span style={{ background: '#f97316', color: 'white', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', flexShrink: 0 }}>{i + 1}</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>💡 Teacher Tips</h2>
          {[
            'Hide cards in easy spots for the first round — confidence builds quickly.',
            'Use hot and cold verbal cues to guide children who are struggling to find it.',
            'Only move on once the child says the word clearly — finding it is not enough.',
            'Keep a spare card in your hand so you can show the picture as a hint if needed.',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#f97316', fontWeight: 'bold', flexShrink: 0 }}>→</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>🔄 Variations</h2>
          {[
            'Hide multiple cards at once — children collect as many as they can and name each one.',
            'Reverse it — place all cards visibly around the room and teacher describes one for children to fetch.',
            'Team version — two teams race to find their team\'s hidden card first.',
            'Sentence reward — child who finds the card must use the word in a full sentence to keep it.',
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#f97316', fontWeight: 'bold', flexShrink: 0 }}>→</span>
              <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
          <p style={{ color: 'white', marginBottom: '16px', fontSize: '15px' }}>Want full 50-minute lesson plans for Under 5s?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/esl-resources/under-5s" style={{ background: '#f97316', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>Browse Lesson Plans</Link>
            <Link href="/esl-games/under-5s" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>More Under 5s Games</Link>
          </div>
        </div>

      </div>
    </main>
  )
}