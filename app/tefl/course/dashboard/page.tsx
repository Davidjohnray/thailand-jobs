import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getStudentSession } from '@/lib/tefl-auth'
import { supabase } from '@/lib/supabase'

export default async function TeflDashboardPage() {
  const studentId = await getStudentSession()
  if (!studentId) redirect('/tefl/course/login')

  const { data: student } = await supabase
    .from('tefl_students')
    .select('full_name, email, school_name, certificate_issued_at, certificate_number')
    .eq('id', studentId)
    .single()

  const { data: progress } = await supabase
    .from('tefl_progress')
    .select('module_id, status, best_quiz_score, quiz_attempts, tefl_modules(module_number, title, study_hours, has_assignment)')
    .eq('student_id', studentId)
    .order('module_id', { ascending: true })

  const { data: practiceLog } = await supabase
    .from('tefl_practice_log')
    .select('hours_logged, confirmation_status')
    .eq('student_id', studentId)

  const totalPracticeHours = (practiceLog || [])
    .filter((p) => p.confirmation_status === 'confirmed')
    .reduce((sum, p) => sum + Number(p.hours_logged), 0)

  const completedModules = (progress || []).filter((p) => p.status === 'completed').length
  const totalModules = progress?.length || 12
  const percentComplete = Math.round((completedModules / totalModules) * 100)

  const statusStyles: Record<string, { bg: string; label: string }> = {
    not_started: { bg: '#e0e0e0', label: 'Not Started' },
    in_progress: { bg: '#f5c542', label: 'In Progress' },
    quiz_passed: { bg: '#5bc0de', label: 'Quiz Passed' },
    completed: { bg: '#4caf50', label: 'Completed' },
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <section style={{ background: '#1a1a2e', padding: '40px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            Welcome back, {student?.full_name?.split(' ')[0] || 'Student'}
          </h1>
          <p style={{ color: '#ccc', fontSize: '14px' }}>Jobs in Thailand TEFL Certificate — 120 Hours</p>
        </div>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Progress summary */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Course Progress</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>
                {completedModules} / {totalModules} Modules
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Teaching Practice</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e' }}>
                {totalPracticeHours} / 40 hrs
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Overall</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#E85D26' }}>{percentComplete}%</p>
            </div>
          </div>
          <div style={{ background: '#eee', borderRadius: '999px', height: '10px', marginTop: '16px', overflow: 'hidden' }}>
            <div style={{ background: '#E85D26', height: '100%', width: `${percentComplete}%` }} />
          </div>

          {!student?.certificate_issued_at && percentComplete === 100 && totalPracticeHours >= 40 && (
            <p style={{ marginTop: '16px', color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>
              🎉 All requirements complete — your certificate is being processed!
            </p>
          )}

          {totalPracticeHours < 40 && (
            <Link
              href="/tefl/course/practice-log"
              style={{ display: 'inline-block', marginTop: '16px', color: '#E85D26', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none' }}
            >
              Submit / update your Teaching Practice Log →
            </Link>
          )}
        </div>

        {/* Module list */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {(progress || []).map((p: any) => {
            const mod = p.tefl_modules
            const style = statusStyles[p.status] || statusStyles.not_started
            return (
              <Link
                key={p.module_id}
                href={`/tefl/course/module/${mod.module_number}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid #eee',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#1a1a2e',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        flexShrink: 0,
                      }}
                    >
                      {mod.module_number}
                    </div>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', marginBottom: '2px' }}>
                        {mod.title}
                      </p>
                      <p style={{ fontSize: '13px', color: '#888' }}>
                        {mod.study_hours} hours{mod.has_assignment ? ' · Includes assignment' : ''}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      background: style.bg,
                      color: p.status === 'not_started' ? '#666' : 'white',
                      padding: '6px 14px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {style.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
