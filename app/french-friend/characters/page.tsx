'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentFrenchFriendUser, getFullUserRecord, trialStatus, clearFrenchFriendSession } from '../../../lib/french-friend-auth'

type Character = { id: string; slug: string; name: string; age: number; hometown: string; short_tagline: string }

export default function CharacterPickerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [notLoggedIn, setNotLoggedIn] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [relationships, setRelationships] = useState<Record<string, any>>({})
  const [trial, setTrial] = useState<{ active: boolean; hoursLeft: number }>({ active: true, hoursLeft: 48 })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const sessionUser = await getCurrentFrenchFriendUser()
    if (!sessionUser) { setNotLoggedIn(true); setLoading(false); return }

    const fullUser = await getFullUserRecord(sessionUser.id)
    setTrial(trialStatus(fullUser))

    const { data: chars } = await supabase.from('french_friend_characters').select('id, slug, name, age, hometown, short_tagline').eq('active', true).order('display_order', { ascending: true })
    setCharacters(chars || [])

    const { data: rels } = await supabase.from('french_friend_relationships').select('*').eq('user_id', sessionUser.id)
    const relMap: Record<string, any> = {}
    ;(rels || []).forEach((r: any) => { relMap[r.character_id] = r })
    setRelationships(relMap)
    setLoading(false)
  }

  const selectCharacter = (slug: string) => router.push(`/french-friend/chat/${slug}`)
  const logout = () => { clearFrenchFriendSession(); router.push('/french-friend') }

  if (loading) return <main style={{ background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5EFE1', fontFamily: "'Work Sans', sans-serif" }}>Loading...</main>

  if (notLoggedIn) {
    return (
      <main style={{ background: '#14201C', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Work Sans', sans-serif" }}>
        <div style={{ background: '#1B2B25', borderRadius: '18px', padding: '40px', maxWidth: '380px', textAlign: 'center', color: '#F5EFE1' }}>
          <p style={{ marginBottom: '20px' }}>Please log in to see your friends.</p>
          <a href="/french-friend/login" style={{ color: '#D4A24C', fontWeight: 700, textDecoration: 'none' }}>Log In →</a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ fontFamily: "'Work Sans', sans-serif", background: '#14201C', minHeight: '100vh', color: '#F5EFE1' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;1,600&family=Work+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700 }}>French Friend</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {trial.active && (
            <span style={{ fontSize: '13px', background: 'rgba(212,162,76,0.15)', color: '#D4A24C', padding: '6px 14px', borderRadius: '20px', fontWeight: 600 }}>
              {trial.hoursLeft > 72 ? `${Math.ceil(trial.hoursLeft / 24)} days left` : `${Math.round(trial.hoursLeft)}h left`}
            </span>
          )}
          {!trial.active && <span style={{ fontSize: '13px', background: 'rgba(232,163,163,0.15)', color: '#e8a3a3', padding: '6px 14px', borderRadius: '20px', fontWeight: 600 }}>Access ended</span>}
          <a href="/french-friend/subscribe" style={{ color: 'rgba(245,239,225,0.6)', fontSize: '13px', textDecoration: 'none' }}>Add code</a>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(245,239,225,0.6)', fontSize: '13px', cursor: 'pointer' }}>Log out</button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 32px 60px' }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Qui veux-tu contacter ?</h1>
        <p style={{ color: 'rgba(245,239,225,0.7)', fontSize: '15px', marginBottom: '36px' }}>Each friend remembers you separately — pick up right where you left off.</p>

        {!trial.active && (
          <div style={{ background: 'rgba(232,163,163,0.1)', border: '1px solid rgba(232,163,163,0.3)', borderRadius: '14px', padding: '20px 24px', marginBottom: '32px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#e8a3a3' }}>
              Your access has ended. Enter a new access code to keep talking. <a href="/french-friend/subscribe" style={{ color: '#D4A24C', fontWeight: 700 }}>Add a code →</a>
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {characters.map((char) => {
            const rel = relationships[char.id]
            const hasTalked = !!rel && rel.total_conversations > 0
            return (
              <div key={char.id} onClick={() => trial.active && selectCharacter(char.slug)}
                style={{ background: '#1B2B25', border: '1px solid rgba(245,239,225,0.12)', borderRadius: '18px', overflow: 'hidden', cursor: trial.active ? 'pointer' : 'not-allowed', opacity: trial.active ? 1 : 0.5 }}>
                <div style={{ height: '160px', background: `url('/french-friend/characters/${char.slug}.jpg')`, backgroundSize: 'cover', backgroundPosition: 'top center', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(20,32,28,0.75)', color: 'rgba(245,239,225,0.85)', fontSize: '10px', fontWeight: 600, padding: '4px 8px', borderRadius: '10px' }}>AI Character</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>{char.name}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(245,239,225,0.5)', margin: '0 0 10px' }}>{char.hometown}, {char.age}</p>
                  <p style={{ fontSize: '13px', color: 'rgba(245,239,225,0.75)', lineHeight: 1.5, margin: '0 0 14px' }}>{char.short_tagline}</p>
                  {hasTalked ? (
                    <p style={{ fontSize: '12px', color: '#D4A24C', fontWeight: 600, margin: 0 }}>💬 {rel.total_conversations} conversation{rel.total_conversations !== 1 ? 's' : ''} so far</p>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'rgba(245,239,225,0.45)', margin: 0 }}>You haven't met yet</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
