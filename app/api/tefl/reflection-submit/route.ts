import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getStudentSession } from '@/lib/tefl-auth'

export async function POST(req: NextRequest) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })
  }

  const { moduleNumber, prompt, response } = await req.json()

  const { data: mod } = await supabase
    .from('tefl_modules')
    .select('id')
    .eq('module_number', moduleNumber)
    .single()

  if (!mod) {
    return NextResponse.json({ error: 'Module not found.' }, { status: 404 })
  }

  const { error } = await supabase
    .from('tefl_reflections')
    .upsert(
      {
        student_id: studentId,
        module_id: mod.id,
        prompt,
        response,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,module_id' }
    )

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not save reflection.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
