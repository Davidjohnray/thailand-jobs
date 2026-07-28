import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'tefl_session'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// Session cookie just stores the student's UUID (httpOnly, signed by being
// server-set only). For extra safety you could sign this with a JWT, but a
// plain httpOnly cookie is consistent with the pattern used on Klong Chandee.
export async function setStudentSession(studentId: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, studentId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90, // 90 days
  })
}

export async function getStudentSession() {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value || null
}

export async function clearStudentSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
