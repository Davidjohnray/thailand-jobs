import { NextResponse } from 'next/server'
import { clearStudentSession } from '@/lib/tefl-auth'

export async function POST() {
  await clearStudentSession()
  return NextResponse.json({ success: true })
}
