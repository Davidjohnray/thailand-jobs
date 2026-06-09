'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useLearnThaiGate() {
  const router = useRouter()
  useEffect(() => {
    const code = localStorage.getItem('learnThaiCode')
    const expiry = localStorage.getItem('learnThaiCodeExpiry')
    if (!code) { router.replace('/learn-thai/subscribe'); return }
    if (expiry && new Date(expiry) < new Date()) {
      localStorage.removeItem('learnThaiCode')
      localStorage.removeItem('learnThaiCodeExpiry')
      router.replace('/learn-thai/subscribe')
    }
  }, [router])
}