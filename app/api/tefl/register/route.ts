import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword, setStudentSession } from '@/lib/tefl-auth'

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password, schoolName, schoolContactName, schoolContactEmail } = await req.json()

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email and password are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('tefl_students')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const password_hash = await hashPassword(password)

    const { data: student, error } = await supabase
      .from('tefl_students')
      .insert({
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        school_name: schoolName || null,
        school_contact_name: schoolContactName || null,
        school_contact_email: schoolContactEmail || null,
      })
      .select('id')
      .single()

    if (error || !student) {
      console.error(error)
      return NextResponse.json({ error: 'Could not create account.' }, { status: 500 })
    }

    // Initialise progress rows for all 12 modules
    const { data: modules } = await supabase.from('tefl_modules').select('id')
    if (modules && modules.length) {
      await supabase.from('tefl_progress').insert(
        modules.map((m) => ({ student_id: student.id, module_id: m.id, status: 'not_started' }))
      )
    }

    await setStudentSession(student.id)

    return NextResponse.json({ success: true, studentId: student.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
