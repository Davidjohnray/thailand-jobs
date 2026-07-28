import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getStudentSession } from '@/lib/tefl-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })
  }

  const { number } = await params
  const moduleNumber = parseInt(number, 10)

  const { data: mod, error: modError } = await supabase
    .from('tefl_modules')
    .select('id, module_number, title, description, study_hours, has_assignment, reflection_prompt')
    .eq('module_number', moduleNumber)
    .single()

  if (modError || !mod) {
    return NextResponse.json({ error: 'Module not found.' }, { status: 404 })
  }

  const { data: content } = await supabase
    .from('tefl_module_content')
    .select('id, section_title, content_html, content_type, video_url, download_url, download_label, estimated_minutes, sort_order')
    .eq('module_id', mod.id)
    .order('sort_order', { ascending: true })

  // Quiz questions WITHOUT the correct_option — never send answers to the client
  const { data: quiz } = await supabase
    .from('tefl_quiz_questions')
    .select('id, question, option_a, option_b, option_c, option_d, sort_order')
    .eq('module_id', mod.id)
    .order('sort_order', { ascending: true })

  const { data: progress } = await supabase
    .from('tefl_progress')
    .select('status, best_quiz_score, quiz_attempts, assignment_text, assignment_status')
    .eq('student_id', studentId)
    .eq('module_id', mod.id)
    .maybeSingle()

  const { data: reflection } = await supabase
    .from('tefl_reflections')
    .select('response, submitted_at')
    .eq('student_id', studentId)
    .eq('module_id', mod.id)
    .maybeSingle()

  // Mark as in_progress the first time they open it
  if (progress && progress.status === 'not_started') {
    await supabase
      .from('tefl_progress')
      .update({ status: 'in_progress', started_at: new Date().toISOString() })
      .eq('student_id', studentId)
      .eq('module_id', mod.id)
  }

  return NextResponse.json({
    module: mod,
    content: content || [],
    quiz: quiz || [],
    progress: progress || { status: 'not_started', quiz_attempts: 0 },
    reflection: reflection || null,
  })
}
