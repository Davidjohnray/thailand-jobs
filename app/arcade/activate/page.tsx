'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

const SUBJECTS = ['English', 'Maths', 'Science', 'Social Studies', 'Thai', 'Art', 'Music', 'PE', 'Other']
const LEVELS = ['Kindergarten', 'Primary (P1–P3)', 'Primary (P4–P6)', 'Secondary', 'Adult / University', 'All levels']

export default function ArcadeActivatePage() {
  const [step, setStep] = useState<'code' | 'profile' | 'success'>('code')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [checkingCode, setCheckingCode] = useState(false)
  const [validCode, setValidCode] = useState<any>(null)

  const [form, setForm] = useState({
    display_name: '',
    subject: 'English',
    class_level: 'All levels',
    arcade_slug: '',
  })
  const [slugError, setSlugError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedProfile, setSavedProfile] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'display_name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20)
      setForm(prev => ({ ...prev, display_name: value, arcade_slug: slug }))
    }
    if (name === 'arcade_slug') {
      setSlugError('')
    }
  }

  const checkCode = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setCodeError('Please enter your activation code.'); return }
    setCheckingCode(true); setCodeError('')
    const { data, error } = await supabase
      .from('teacher_activation_codes')
      .select('*')
      .eq('code', trimmed)
      .single()

    if (error || !data) { setCodeError('Code not found. Please check and try again.'); setCheckingCode(false); return }
    if (!data.active) { setCodeError('This code has been deactivated. Please contact us.'); setCheckingCode(false); return }
    if (data.used) { setCodeError('This code has already been used. Each code is for one teacher only.'); setCheckingCode(false); return }
    if (new Date(data.expires_at) < new Date()) { setCodeError('This code has expired. Please contact us to renew.'); setCheckingCode(false); return }

    // Check if already registered
    const { data: existing } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_email', data.buyer_email || '')
      .single()

    if (existing) {
      setCodeError('An arcade account already exists for this email. Please log in at /arcade/dashboard.')
      setCheckingCode(false); return
    }

    setValidCode(data)
    setForm(prev => ({ ...prev, display_name: data.buyer_name || '' }))
    const slug = (data.buyer_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20)
    setForm(prev => ({ ...prev, arcade_slug: slug }))
    setCheckingCode(false)
    setStep('profile')
  }

  const saveProfile = async () => {
    if (!form.display_name.trim()) return
    const slug = form.arcade_slug.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!slug || slug.length < 3) { setSlugError('Arcade name must be at least 3 letters (a–z, 0–9 only).'); return }

    setSaving(true); setSlugError('')

    // Check slug is unique
    const { data: slugCheck } = await supabase
      .from('teacher_profiles')
      .select('id')
      .eq('arcade_slug', slug)
      .single()

    if (slugCheck) { setSlugError('This arcade name is already taken. Please choose another.'); setSaving(false); return }

    // Calculate expiry (30 days from now)
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)

    // Create teacher profile
    const { data: profile, error } = await supabase
      .from('teacher_profiles')
      .insert([{
        user_email: validCode.buyer_email || `${slug}@arcade.local`,
        display_name: form.display_name.trim(),
        subject: form.subject,
        class_level: form.class_level,
        arcade_slug: slug,
        subscription_expires_at: expires.toISOString(),
        active: true,
      }])
      .select()
      .single()

    if (error) { setSlugError('Error saving profile: ' + error.message); setSaving(false); return }

    // Mark code as used
    await supabase
      .from('teacher_activation_codes')
      .update({ used: true, used_by_email: validCode.buyer_email || slug, used_at: new Date().toISOString() })
      .eq('id', validCode.id)

    setSavedProfile(profile)
    setSaving(false)
    setStep('success')
  }

  return (
    <main style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🕹️</div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '900', margin: '0 0 8px' }}>Teacher Arcade</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>Activate your subscription and start building games</p>
        </div>

        {/* STEP INDICATOR */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
          {[
            { n: 1, label: 'Enter Code', id: 'code' },
            { n: 2, label: 'Set Up Profile', id: 'profile' },
            { n: 3, label: 'Ready!', id: 'success' },
          ].map((s, i) => {
            const stepOrder = ['code', 'profile', 'success']
            const currentIndex = stepOrder.indexOf(step)
            const sIndex = stepOrder.indexOf(s.id)
            const isDone = sIndex < currentIndex
            const isCurrent = sIndex === currentIndex
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isDone ? '#22c55e' : isCurrent ? '#f59e0b' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: isDone || isCurrent ? '#1a1a2e' : 'rgba(255,255,255,0.4)' }}>
                    {isDone ? '✓' : s.n}
                  </div>
                  <span style={{ color: isCurrent ? '#f59e0b' : isDone ? '#22c55e' : 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: isCurrent ? '700' : '400' }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ width: '24px', height: '2px', background: isDone ? '#22c55e' : 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />}
              </div>
            )
          })}
        </div>

        {/* STEP 1 — ENTER CODE */}
        {step === 'code' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Enter Your Activation Code</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
              You received this code after payment. It looks like <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#f59e0b', background: '#fffbeb', padding: '2px 8px', borderRadius: '6px' }}>TCH-XXXX-XXXX</span>
            </p>
            <div style={{ marginBottom: '16px' }}>
              <input
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError('') }}
                onKeyDown={e => e.key === 'Enter' && checkCode()}
                placeholder="TCH-XXXX-XXXX"
                maxLength={12}
                style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: `2px solid ${codeError ? '#ef4444' : '#e5e7eb'}`, fontSize: '20px', fontFamily: 'monospace', fontWeight: '800', outline: 'none', boxSizing: 'border-box', letterSpacing: '2px', textAlign: 'center', color: '#1a1a2e', background: '#f9fafb' }}
              />
              {codeError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '8px 0 0', textAlign: 'center' }}>{codeError}</p>}
            </div>
            <button onClick={checkCode} disabled={checkingCode || !code.trim()}
              style={{ width: '100%', background: checkingCode || !code.trim() ? '#e5e7eb' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: checkingCode || !code.trim() ? '#9ca3af' : '#1a1a2e', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: checkingCode || !code.trim() ? 'not-allowed' : 'pointer', boxShadow: checkingCode || !code.trim() ? 'none' : '0 6px 20px rgba(245,158,11,0.4)', transition: 'all 0.2s' }}>
              {checkingCode ? 'Checking...' : 'Activate Code →'}
            </button>
            <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
              Don&apos;t have a code? <a href="https://wa.me/66871033821" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', fontWeight: '700', textDecoration: 'none' }}>Get Teacher Arcade →</a>
            </p>
          </div>
        )}

        {/* STEP 2 — SET UP PROFILE */}
        {step === 'profile' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>✅</span>
              <div>
                <div style={{ fontWeight: '800', color: '#14532d', fontSize: '14px' }}>Code verified!</div>
                <div style={{ color: '#15803d', fontSize: '12px' }}>Valid for 30 days from today. Now set up your arcade.</div>
              </div>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginBottom: '20px' }}>Set Up Your Arcade</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Your Display Name *</label>
                <input name="display_name" value={form.display_name} onChange={handleChange} placeholder="e.g. Mr John, Ms Sarah, Teacher David"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontWeight: '600' }} />
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '4px 0 0' }}>This is what your students will see on your arcade page.</p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Your Arcade Name (URL) *</label>
                <div style={{ display: 'flex', alignItems: 'center', border: `2px solid ${slugError ? '#ef4444' : '#e5e7eb'}`, borderRadius: '10px', overflow: 'hidden', background: 'white' }}>
                  <span style={{ background: '#f3f4f6', padding: '12px 14px', color: '#9ca3af', fontSize: '13px', fontWeight: '600', borderRight: '1px solid #e5e7eb', whiteSpace: 'nowrap', flexShrink: 0 }}>arcade/</span>
                  <input name="arcade_slug" value={form.arcade_slug} onChange={e => { const v = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20); setForm(prev => ({ ...prev, arcade_slug: v })); setSlugError('') }}
                    placeholder="mrjohn"
                    style={{ flex: 1, padding: '12px 14px', border: 'none', fontSize: '15px', outline: 'none', fontWeight: '700', color: '#1a1a2e', fontFamily: 'monospace' }} />
                </div>
                {slugError && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{slugError}</p>}
                {!slugError && form.arcade_slug && <p style={{ color: '#22c55e', fontSize: '12px', margin: '4px 0 0', fontWeight: '600' }}>Your arcade: jobsinthailand.net/arcade/{form.arcade_slug}</p>}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>Class Level</label>
                <select name="class_level" value={form.class_level} onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '15px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <button onClick={saveProfile} disabled={saving || !form.display_name.trim() || !form.arcade_slug.trim()}
              style={{ width: '100%', marginTop: '24px', background: saving || !form.display_name.trim() ? '#e5e7eb' : 'linear-gradient(135deg, #0f172a, #1e3a5f)', color: saving || !form.display_name.trim() ? '#9ca3af' : 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: saving || !form.display_name.trim() ? 'not-allowed' : 'pointer', boxShadow: saving ? 'none' : '0 6px 20px rgba(0,0,0,0.3)', transition: 'all 0.2s' }}>
              {saving ? 'Creating Your Arcade...' : 'Create My Arcade 🕹️'}
            </button>
          </div>
        )}

        {/* STEP 3 — SUCCESS */}
        {step === 'success' && savedProfile && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>Your Arcade is Ready!</h2>
            <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px', lineHeight: '1.6' }}>
              Welcome to Teacher Arcade, <strong>{savedProfile.display_name}</strong>! Your subscription is active for 30 days.
            </p>

            <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ color: '#92400e', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Your Arcade URL</div>
              <div style={{ fontFamily: 'monospace', fontSize: '17px', fontWeight: '900', color: '#1a1a2e', marginBottom: '4px' }}>
                jobsinthailand.net/arcade/{savedProfile.arcade_slug}
              </div>
              <div style={{ color: '#92400e', fontSize: '12px' }}>Share this with your students so they can find your games</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/arcade/dashboard"
                style={{ display: 'block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '17px', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' }}>
                🕹️ Go to My Dashboard →
              </Link>
              <a href={`/arcade/${savedProfile.arcade_slug}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', background: '#f3f4f6', color: '#374151', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
                👁 Preview My Arcade Page
              </a>
            </div>

            <div style={{ marginTop: '20px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '14px' }}>
              <div style={{ color: '#14532d', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>⚠️ Important — Save this information</div>
              <div style={{ color: '#15803d', fontSize: '12px', lineHeight: '1.6' }}>
                Bookmark <strong>/arcade/dashboard</strong> — this is how you access your games.<br />
                Your subscription expires: <strong>{new Date(savedProfile.subscription_expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
