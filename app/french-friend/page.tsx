'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setFrenchFriendSession } from '../../lib/french-friend-auth'
import TrackView from '../../components/TrackView'

export default function FrenchFriendLandingPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSignup, setShowSignup] = useState(false)

  const startTrial = async () => {
    if (!code.trim()) { setError('Please enter your access code.'); return }
    setError(''); setSubmitting(true)
    try {
      const res = await fetch('/api/french-friend/enter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }),
      })
      let data: any = {}
      try { data = await res.json() } catch { setError(`Server returned an unexpected response (status ${res.status}).`); return }
      if (!res.ok) { setError(data.error || `Something went wrong (status ${res.status}).`); return }
      setFrenchFriendSession({ id: data.id })
      router.push('/french-friend/characters')
    } catch { setError('Could not reach the server. Please try again.') } finally { setSubmitting(false) }
  }

  return (
    <main style={{ fontFamily: "'Work Sans', sans-serif", background: '#14201C', minHeight: '100vh', color: '#F5EFE1' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,600&family=Work+Sans:wght@400;500;600;700&display=swap');
        .ff-display { font-family: 'Fraunces', serif; }
      `}</style>

      <TrackView scope="french-friend" />

      <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <span className="ff-display" style={{ fontSize: '20px', fontWeight: 700 }}>French Friend</span>
        <a href="/french-friend/login" style={{ color: '#F5EFE1', opacity: 0.8, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Log in</a>
      </div>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        <div>
          <h1 className="ff-display" style={{ fontSize: '48px', lineHeight: 1.15, fontWeight: 700, margin: '0 0 24px', maxWidth: '460px' }}>
            Learn French by making a friend, not studying grammar.
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'rgba(245,239,225,0.8)', maxWidth: '420px', marginBottom: '32px' }}>
            Talk with a real French personality who remembers your conversations, helps when you get stuck, and gently corrects you without ever making you feel silly. No drills. No red pen. Just a friend who happens to speak French.
          </p>

          {!showSignup ? (
            <button onClick={() => setShowSignup(true)} className="ff-display"
              style={{ background: '#D4A24C', color: '#14201C', border: 'none', padding: '16px 36px', borderRadius: '10px', fontSize: '17px', fontWeight: 700, cursor: 'pointer' }}>
              Enter your access code
            </button>
          ) : (
            <div style={{ background: 'rgba(245,239,225,0.06)', border: '1px solid rgba(245,239,225,0.15)', borderRadius: '14px', padding: '24px', maxWidth: '360px' }}>
              <p style={{ fontSize: '13px', color: 'rgba(245,239,225,0.7)', margin: '0 0 12px', lineHeight: 1.5 }}>
                Enter your access code to start. If you've been here before, use the same code as last time.
              </p>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && startTrial()}
                placeholder="FF-XXXX-XXXX" autoFocus
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(212,162,76,0.5)', borderRadius: '8px', padding: '14px', color: '#F5EFE1', fontSize: '16px', letterSpacing: '1.5px', textAlign: 'center', boxSizing: 'border-box', marginBottom: '12px' }} />
              {error && <p style={{ color: '#e8a3a3', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
              <button onClick={startTrial} disabled={submitting}
                style={{ width: '100%', background: '#D4A24C', color: '#14201C', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Checking...' : 'Enter & start talking'}
              </button>
              <p style={{ fontSize: '12px', color: 'rgba(245,239,225,0.55)', marginTop: '10px', marginBottom: 0, lineHeight: 1.5 }}>
                Don't have a code? Email <a href="mailto:Admin@jobsinthailand.net?subject=French%20Friend%20access%20code" style={{ color: '#D4A24C' }}>Admin@jobsinthailand.net</a> for a free 48-hour trial code.
              </p>
            </div>
          )}
        </div>

        <div style={{ background: '#1B2B25', borderRadius: '20px', padding: '28px', border: '1px solid rgba(245,239,225,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#2F6B52' }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>Camille</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(245,239,225,0.5)' }}>Lyon</p>
            </div>
          </div>
          <ChatBubble fr="Salut ! Tu as mangé quoi ce matin ?" en="Hi! What did you eat this morning?" mine={false} />
          <ChatBubble fr="J'ai mangé du pain avec des oeufs." en="I ate bread with eggs" mine={true} />
          <ChatBubble fr="Ah, comme d'habitude ! Tu adores ça, non ?" en="Ah, same as usual! You love that, don't you?" mine={false} />
          <div style={{ marginTop: '18px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: 'rgba(245,239,225,0.5)', textAlign: 'center' }}>
            🎙 Tap to speak
          </div>
        </div>
      </section>

      <section style={{ background: '#1B2B25', padding: '72px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="ff-display" style={{ fontSize: '30px', fontWeight: 700, marginBottom: '10px' }}>Meet your French friends</h2>
          <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '15px', marginBottom: '10px', maxWidth: '520px' }}>
            Each one has their own personality and story — pick whoever you click with. They'll remember everything about you, separately.
          </p>
          <p style={{ color: 'rgba(245,239,225,0.4)', fontSize: '12px', marginBottom: '40px' }}>These are AI characters, not real people.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <CharacterCard slug="leo" name="Léo" place="Paris, 22" tagline="Easygoing student, into music and football" />
            <CharacterCard slug="henri" name="Henri" place="Aix-en-Provence, 61" tagline="Retired literature professor, warm storyteller" />
            <CharacterCard slug="camille" name="Camille" place="Lyon, 26" tagline="Runs a small bookshop, warm and patient" />
            <CharacterCard slug="odette" name="Odette" place="Quimper, Brittany, 57" tagline="Runs a family boulangerie, chatty and direct" />
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 32px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 className="ff-display" style={{ fontSize: '30px', fontWeight: 700, marginBottom: '36px', textAlign: 'center' }}>How it works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <Step n={1} title="Pick a friend" text="Choose the personality you click with best. Each friend has their own life and remembers you separately from the others." />
          <Step n={2} title="Just talk" text="Speak naturally about whatever comes up. If you forget a word, ask in English — they'll tell you, then pick the conversation right back up." />
          <Step n={3} title="Get corrected gently" text="No red pen, no interruptions. Mistakes get folded naturally into their reply, the way a real friend would say it back correctly." />
          <Step n={4} title="They remember you" text="Mention what you like or where you're from — next time, they'll ask about it. Real rapport builds over time." />
        </div>
      </section>


      {/* PRICING */}
      <section style={{ padding: '0 32px 72px', maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="ff-display" style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px' }}>Simple pricing</h2>
        <p style={{ color: 'rgba(245,239,225,0.65)', fontSize: '14px', marginBottom: '32px' }}>Start with a free 48-hour trial, then keep going for as long as you like.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(245,239,225,0.05)', border: '1px solid rgba(245,239,225,0.12)', borderRadius: '14px', padding: '20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(245,239,225,0.6)' }}>Free trial</p>
            <p style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#D4A24C' }}>48 hours</p>
          </div>
          <div style={{ background: 'rgba(245,239,225,0.05)', border: '1px solid rgba(245,239,225,0.12)', borderRadius: '14px', padding: '20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(245,239,225,0.6)' }}>30 days</p>
            <p style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#D4A24C' }}>฿199</p>
          </div>
          <div style={{ background: 'rgba(245,239,225,0.05)', border: '1px solid rgba(245,239,225,0.12)', borderRadius: '14px', padding: '20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(245,239,225,0.6)' }}>90 days</p>
            <p style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: '#D4A24C' }}>฿549</p>
          </div>
        </div>
        <p style={{ color: 'rgba(245,239,225,0.5)', fontSize: '12px', marginTop: '18px' }}>Email Admin@jobsinthailand.net to register and pay.</p>
      </section>

      <section style={{ background: '#1B2B25', padding: '72px 32px', textAlign: 'center' }}>
        <h2 className="ff-display" style={{ fontSize: '30px', fontWeight: 700, marginBottom: '16px' }}>Ready to make a French friend?</h2>
        <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '15px', marginBottom: '28px' }}>Email us for a free 48-hour trial code.</p>
        <button onClick={() => { setShowSignup(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="ff-display"
          style={{ background: '#D4A24C', color: '#14201C', border: 'none', padding: '16px 36px', borderRadius: '10px', fontSize: '17px', fontWeight: 700, cursor: 'pointer' }}>
          Get started
        </button>
      </section>
    </main>
  )
}

function ChatBubble({ fr, en, mine }: { fr: string; en: string; mine: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: '14px' }}>
      <div style={{ maxWidth: '82%', background: mine ? '#D4A24C' : 'rgba(245,239,225,0.08)', color: mine ? '#14201C' : '#F5EFE1', borderRadius: '14px', padding: '10px 14px' }}>
        <p style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: 600 }}>{fr}</p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.65 }}>{en}</p>
      </div>
    </div>
  )
}

function CharacterCard({ slug, name, place, tagline }: { slug: string; name: string; place: string; tagline: string }) {
  return (
    <div style={{ background: 'rgba(245,239,225,0.05)', border: '1px solid rgba(245,239,225,0.12)', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '140px', background: `url('/french-friend/characters/${slug}.jpg')`, backgroundSize: 'cover', backgroundPosition: 'top center' }} />
      <div style={{ padding: '20px' }}>
        <p className="ff-display" style={{ fontSize: '19px', fontWeight: 700, margin: '0 0 4px' }}>{name}</p>
        <p style={{ fontSize: '13px', color: 'rgba(245,239,225,0.55)', margin: '0 0 10px' }}>{place}</p>
        <p style={{ fontSize: '13.5px', color: 'rgba(245,239,225,0.8)', lineHeight: 1.5, margin: 0 }}>{tagline}</p>
      </div>
    </div>
  )
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div className="ff-display" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2F6B52', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>{n}</div>
      <div>
        <p className="ff-display" style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>{title}</p>
        <p style={{ fontSize: '14.5px', color: 'rgba(245,239,225,0.75)', lineHeight: 1.6, margin: 0 }}>{text}</p>
      </div>
    </div>
  )
}
