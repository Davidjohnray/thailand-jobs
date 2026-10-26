'use client'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import AutoApplyForm from './AutoApplyForm'
import AiWriter from './AiWriter'
import { useApplyStatus } from './applyClient'
import { PRO_PRICE_30_DAYS, AI_MONTHLY_LIMIT, type ApplyStatus } from '../src/lib/applyRules'

// Decides what each visitor sees in the "apply" part of a job page:
// - partner schools (Oneness…): the site form for everyone
// - other jobs with an email: the site form for Apply Pro members (and each member's free try); contact details for everyone else
// - jobs without an email: contact details, plus the AI message writer for members who can use it
export default function ApplyPanel({ job, partner, eligible, contactBox }: {
  job: any
  partner: boolean
  eligible: boolean
  contactBox: ReactNode
}) {
  const { status } = useApplyStatus()
  const [fallback, setFallback] = useState('')

  if (partner) return <AutoApplyForm job={job} mode="partner" status={status} />

  if (fallback) return (
    <>
      <div style={{ background: '#fff3ed', border: '2px solid #E85D26', borderRadius: '10px', padding: '14px 18px', marginBottom: '16px', color: '#a8401a', fontSize: '14px', fontWeight: 'bold' }}>
        {fallback}
      </div>
      {contactBox}
    </>
  )

  if (!eligible) {
    const canAi = !!status?.loggedIn && !!status.enabled && (!!status.isPro || (status.aiRemaining || 0) > 0)
    return (
      <>
        {contactBox}
        {canAi && status && <AiWriter job={job} status={status} standalone />}
      </>
    )
  }

  if (!status) return (
    <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '32px', textAlign: 'center', marginBottom: '16px', color: '#ccc' }}>Loading…</div>
  )

  if (status.enabled && status.loggedIn && (status.isPro || status.freeTryAvailable)) {
    return <AutoApplyForm job={job} mode={status.isPro ? 'pro' : 'free_try'} status={status} onFallback={setFallback} />
  }

  return (
    <>
      {status.enabled && <UpsellCard status={status} />}
      {contactBox}
    </>
  )
}

function UpsellCard({ status }: { status: ApplyStatus }) {
  const btn: any = { padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block' }
  return (
    <div style={{ background: 'linear-gradient(135deg, #fff3ed 0%, #ffe6d6 100%)', border: '2px solid #E85D26', borderRadius: '12px', padding: '20px 22px', marginBottom: '16px' }}>
      <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '17px', marginBottom: '6px' }}>⚡ Apply in one click with Jobs in Thailand</div>
      <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 14px' }}>
        {status.loggedIn
          ? <>You've used your free try. With <strong>Apply Pro</strong> your CV, photo and an AI-written application (English + Thai) go straight to the employer — and you'll see when they view it. {AI_MONTHLY_LIMIT} AI applications a month, just {PRO_PRICE_30_DAYS} baht.</>
          : <>Members send their CV, photo and an AI-written application straight to the employer — and see when it's viewed. <strong>Your first one is free.</strong></>}
      </p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {status.loggedIn ? (
          <Link href="/apply-pro" style={{ ...btn, background: '#E85D26', color: 'white' }}>See Apply Pro →</Link>
        ) : (
          <>
            <Link href="/account/register" style={{ ...btn, background: '#E85D26', color: 'white' }}>Join Free — Try It →</Link>
            <Link href="/account/login" style={{ ...btn, background: 'white', color: '#1a1a2e', border: '1px solid #ddd' }}>Log in</Link>
          </>
        )}
      </div>
      <p style={{ color: '#888', fontSize: '12px', margin: '12px 0 0' }}>Or apply directly using the employer's details below.</p>
    </div>
  )
}
