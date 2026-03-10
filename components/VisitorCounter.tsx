'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const increment = async () => {
      const { data } = await supabase
        .from('stats')
        .select('count')
        .eq('id', 'visitors')
        .single()
      if (data) {
        const newCount = data.count + 1
        await supabase
          .from('stats')
          .update({ count: newCount })
          .eq('id', 'visitors')
        setCount(newCount)
      }
    }
    increment()
  }, [])

  return (
    <div style={{ textAlign: 'center', padding: '4px 0' }}>
      <span style={{ color: '#666', fontSize: '13px' }}>
        👁 {count !== null ? count.toLocaleString() : '...'} total visitors
      </span>
    </div>
  )
}