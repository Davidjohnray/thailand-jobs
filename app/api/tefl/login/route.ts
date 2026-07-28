import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyPassword, setStudentSession } from '@/lib/tefl-auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const { data: student, error } = await supabase
      .from('tefl_students')
      .select('id, password_hash, status')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (error || !student) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const valid = await verifyPassword(password, student.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    if (student.status === 'suspended') {
      return NextResponse.json({ error: 'This account has been suspended. Contact support.' }, { status: 403 })
    }

    await setStudentSession(student.id)

    return NextResponse.json({ success: true, studentId: student.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
