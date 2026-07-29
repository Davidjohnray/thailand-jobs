import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getStudentSession } from '@/lib/tefl-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params
  const studentId = await getStudentSession()
  if (!studentId) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })
  }

  const { data: mod } = await supabase
    .from('tefl_modules')
    .select('id')
    .eq('module_number', number)
    .single()

  if (!mod) {
    return NextResponse.json({ error: 'Module not found.' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('tefl_submissions')
    .select('content_id, submission_text, submitted_at')
    .eq('student_id', studentId)
    .eq('module_id', mod.id)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not load submissions.' }, { status: 500 })
  }

  const submissions: Record<string, { text: string; submitted_at: string }> = {}
  for (const row of data || []) {
    submissions[row.content_id] = { text: row.submission_text, submitted_at: row.submitted_at }
  }

  return NextResponse.json({ submissions })
}