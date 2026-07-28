import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const studentId = params.id

  const { data: student, error: studentError } = await supabase
    .from('tefl_students')
    .select('id, name, email, created_at')
    .eq('id', studentId)
    .single()

  if (studentError || !student) {
    return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
  }

  const { data: modules } = await supabase
    .from('tefl_modules')
    .select('id, module_number, title')
    .order('module_number', { ascending: true })

  const { data: contentBlocks } = await supabase
    .from('tefl_module_content')
    .select('id, module_id, section_title, content_type, sort_order')
    .in('content_type', ['activity', 'download'])
    .order('sort_order', { ascending: true })

  const { data: submissions } = await supabase
    .from('tefl_submissions')
    .select('content_id, submission_text, submitted_at')
    .eq('student_id', studentId)

  const submissionByContentId: Record<string, { submission_text: string; submitted_at: string }> = {}
  for (const row of submissions || []) {
    submissionByContentId[row.content_id] = row
  }

  const result = (modules || []).map((mod) => {
    const blocksForModule = (contentBlocks || []).filter((c) => c.module_id === mod.id)
    const pieces = blocksForModule.map((block) => ({
      content_id: block.id,
      section_title: block.section_title,
      content_type: block.content_type,
      submitted: !!submissionByContentId[block.id],
      submission_text: submissionByContentId[block.id]?.submission_text || null,
      submitted_at: submissionByContentId[block.id]?.submitted_at || null,
    }))
    return {
      module_number: mod.module_number,
      title: mod.title,
      total_pieces: pieces.length,
      submitted_count: pieces.filter((p) => p.submitted).length,
      pieces,
    }
  })

  return NextResponse.json({ student, modules: result })
}
