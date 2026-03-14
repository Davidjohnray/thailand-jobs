'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function VisitorCounter() {
  const [total, setTotal] = useState<number | null>(null)
  const [daily, setDaily] = useState<number | null>(null)

  useEffect(() => {
    const increment = async () => {
      const today = new Date().toISOString().slice(0, 10) // e.g. "2026-03-14"
      const dailyId = `visitors_${today}`

      // INCREMENT TOTAL
      const { data: totalData } = await supabase
        .from('stats')
        .select('count')
        .eq('id', 'visitors')
        .single()

      if (totalData) {
        const newTotal = totalData.count + 1
        await supabase
          .from('stats')
          .update({ count: newTotal })
          .eq('id', 'visitors')
        setTotal(newTotal)
      }

      // INCREMENT DAILY
      const { data: dailyData } = await supabase
        .from('stats')
        .select('count')
        .eq('id', dailyId)
        .single()

      if (dailyData) {
        const newDaily = dailyData.count + 1
        await supabase
          .from('stats')
          .update({ count: newDaily })
          .eq('id', dailyId)
        setDaily(newDaily)
      } else {
        // First visit today — create the row
        await supabase
          .from('stats')
          .insert({ id: dailyId, count: 1 })
        setDaily(1)
      }
    }
    increment()
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '8px 0', background: '#f5f5f5', borderTop: '1px solid #eee' }}>
      <span style={{ color: '#666', fontSize: '13px', marginRight: '16px' }}>
        📅 {daily !== null ? daily.toLocaleString() : '...'} today
      </span>
      <span style={{ color: '#666', fontSize: '13px' }}>
        👁 {total !== null ? total.toLocaleString() : '...'} total visitors
      </span>
    </div>
  )
}