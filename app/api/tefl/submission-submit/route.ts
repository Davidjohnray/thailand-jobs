import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getStudentSession } from '@/lib/tefl-auth'

export async function POST(req: NextRequest) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })
  }

  const { moduleNumber, contentId, text } = await req.json()

  if (!contentId || !text || !text.trim()) {
    return NextResponse.json({ error: 'Nothing to submit.' }, { status: 400 })
  }

  const { data: mod } = await supabase
    .from('tefl_modules')
    .select('id')
    .eq('module_number', moduleNumber)
    .single()

  if (!mod) {
    return NextResponse.json({ error: 'Module not found.' }, { status: 404 })
  }

  const { error } = await supabase
    .from('tefl_submissions')
    .upsert(
      {
        student_id: studentId,
        module_id: mod.id,
        content_id: contentId,
        submission_text: text,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,content_id' }
    )

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save submission.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
