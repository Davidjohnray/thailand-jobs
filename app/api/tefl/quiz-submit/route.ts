import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getStudentSession } from '@/lib/tefl-auth'

export async function POST(req: NextRequest) {
  const studentId = await getStudentSession()
  if (!studentId) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })
  }

  const { moduleNumber, answers, assignmentText } = await req.json()
  // answers: { [questionId: string]: 'a' | 'b' | 'c' | 'd' }

  const { data: mod } = await supabase
    .from('tefl_modules')
    .select('id, has_assignment')
    .eq('module_number', moduleNumber)
    .single()

  if (!mod) {
    return NextResponse.json({ error: 'Module not found.' }, { status: 404 })
  }

  const { data: questions } = await supabase
    .from('tefl_quiz_questions')
    .select('id, correct_option')
    .eq('module_id', mod.id)

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'No quiz found for this module.' }, { status: 404 })
  }

  let correctCount = 0
  for (const q of questions) {
    if (answers?.[q.id] === q.correct_option) correctCount++
  }
  const scorePercent = Math.round((correctCount / questions.length) * 100)
  const passed = scorePercent >= 70

  const { data: existing } = await supabase
    .from('tefl_progress')
    .select('best_quiz_score, quiz_attempts')
    .eq('student_id', studentId)
    .eq('module_id', mod.id)
    .maybeSingle()

  const bestScore = Math.max(scorePercent, existing?.best_quiz_score || 0)
  const attempts = (existing?.quiz_attempts || 0) + 1

  let newStatus: string = passed ? 'quiz_passed' : 'in_progress'
  // If there's no assignment requirement, passing the quiz completes the module
  if (passed && !mod.has_assignment) newStatus = 'completed'

  const updatePayload: Record<string, any> = {
    best_quiz_score: bestScore,
    quiz_attempts: attempts,
    status: newStatus,
  }

  if (mod.has_assignment && assignmentText) {
    updatePayload.assignment_text = assignmentText
    updatePayload.assignment_status = 'pending_review'
  }

  if (newStatus === 'completed') {
    updatePayload.completed_at = new Date().toISOString()
  }

  await supabase
    .from('tefl_progress')
    .update(updatePayload)
    .eq('student_id', studentId)
    .eq('module_id', mod.id)

  return NextResponse.json({
    correctCount,
    totalQuestions: questions.length,
    scorePercent,
    passed,
    status: newStatus,
  })
}
