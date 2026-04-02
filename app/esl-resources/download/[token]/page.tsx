'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../../src/lib/supabase'

export default function ESLDownloadPage() {
  const { token } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    supabase
      .from('lesson_plan_orders')
      .select('*, lesson_plans(*)')
      .eq('download_token', token)
      .eq('status', 'approved')
      .single()
      .then(({ data }) => {
        if (!data) {
          setInvalid(true)
        } else {
          setOrder(data)
          setPlan(data.lesson_plans)
        }
        setLoading(false)
      })
  }, [token])

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading...</div>

  if (invalid) return (
    <main style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Invalid Download Link</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>This link is invalid or has expired. Please contact us if you need help.</p>
        <Link href="/contact" style={{ display: 'inline-block', background: '#7C3AED', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
          Contact Support
        </Link>
      </div>
    </main>
  )

  return (
    <main style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', maxWidth: '480px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📖</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px' }}>Your Download is Ready</h2>
        <p style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '16px', marginBottom: '24px' }}>{plan?.title}</p>
        <a href={plan?.file_url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', background: '#7C3AED', color: 'white', padding: '16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginBottom: '16px' }}>
          ⬇️ Download Now
        </a>
        <Link href="/esl-resources" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>
          Browse more resources
        </Link>
      </div>
    </main>
  )
}