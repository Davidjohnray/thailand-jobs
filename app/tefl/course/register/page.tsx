'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TeflRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    schoolContactName: '',
    schoolContactEmail: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/tefl/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setLoading(false)
        return
      }

      router.push('/tefl/course/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <section style={{ background: '#1a1a2e', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</div>
        <h1 style={{ color: 'white', fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>
          Jobs in Thailand TEFL Certificate
        </h1>
        <p style={{ color: '#ccc', fontSize: '15px' }}>Create your student account to get started</p>
      </section>

      <section style={{ maxWidth: '520px', margin: '0 auto', padding: '48px 24px' }}>
        <form
          onSubmit={handleSubmit}
          style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' }}>
            Your Details
          </h2>

          <Field label="Full Name" value={form.fullName} onChange={(v) => update('fullName', v)} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} required />
          <Field
            label="Password (min. 8 characters)"
            type="password"
            value={form.password}
            onChange={(v) => update('password', v)}
            required
          />
          <Field
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(v) => update('confirmPassword', v)}
            required
          />

          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '28px 0 20px' }}>
            Your School (for Teaching Practice sign-off)
          </h2>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '-12px', marginBottom: '16px' }}>
            Optional now — you can add this later before submitting your 40-hour Teaching Practice Log.
          </p>

          <Field label="School Name" value={form.schoolName} onChange={(v) => update('schoolName', v)} />
          <Field
            label="Director / Head Teacher Name"
            value={form.schoolContactName}
            onChange={(v) => update('schoolContactName', v)}
          />
          <Field
            label="Director / Head Teacher Email"
            type="email"
            value={form.schoolContactEmail}
            onChange={(v) => update('schoolContactEmail', v)}
          />

          {error && (
            <p style={{ color: '#c0392b', fontSize: '14px', marginBottom: '12px', marginTop: '4px' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#E85D26',
              color: 'white',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '8px',
            }}
          >
            {loading ? 'Creating account…' : 'Create Account & Start Course'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '16px' }}>
            Already have an account?{' '}
            <Link href="/tefl/course/login" style={{ color: '#E85D26', fontWeight: 'bold' }}>
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '15px',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
