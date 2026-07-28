import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: students, error } = await supabase
    .from('tefl_students')
    .select('id, name, email, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not load students.' }, { status: 500 })
  }

  const { data: submissions } = await supabase
    .from('tefl_submissions')
    .select('student_id')

  const counts: Record<string, number> = {}
  for (const row of submissions || []) {
    counts[row.student_id] = (counts[row.student_id] || 0) + 1
  }

  const result = (students || []).map((s) => ({
    ...s,
    submission_count: counts[s.id] || 0,
  }))

  return NextResponse.json({ students: result })
}
