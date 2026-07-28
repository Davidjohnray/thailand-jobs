'use client'

import { useEffect, useState } from 'react'

// Change this to your own password.
const ADMIN_PASSWORD = 'TeflAdmin2026!'

type Student = { id: string; name: string; email: string; created_at: string; submission_count: number }
type Piece = {
  content_id: string
  section_title: string
  content_type: 'activity' | 'download'
  submitted: boolean
  submission_text: string | null
  submitted_at: string | null
}
type ModuleBlock = { module_number: number; title: string; total_pieces: number; submitted_count: number; pieces: Piece[] }

export default function TeflAdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)

  const [students, setStudents] = useState<Student[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [modules, setModules] = useState<ModuleBlock[]>([])
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [expandedModule, setExpandedModule] = useState<number | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('teflAdminAuthed') === 'true') {
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (authed) loadStudents()
  }, [authed])

  function handleLogin(e: any) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      sessionStorage.setItem('teflAdminAuthed', 'true')
    } else {
      setWrongPassword(true)
    }
  }

  async function loadStudents() {
    setLoadingStudents(true)
    const res = await fetch('/api/tefl/admin/students')
    const data = await res.json()
    setStudents(data.students || [])
    setLoadingStudents(false)
  }

  async function openStudent(student: Student) {
    setSelectedStudent(student)
    setLoadingDetail(true)
    setExpandedModule(null)
    const res = await fetch(`/api/tefl/admin/student/${student.id}`)
    const data = await res.json()
    setModules(data.modules || [])
    setLoadingDetail(false)
  }

  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', width: '320px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px', textAlign: 'center' }}>🔐 TEFL Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setWrongPassword(false) }}
            placeholder="Password"
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              border: wrongPassword ? '2px solid red' : '1px solid #ddd',
              fontSize: '15px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px', textAlign: 'center',
            }}
          />
          {wrongPassword && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>Incorrect password</p>}
          <button
            type="submit"
            style={{ width: '100%', background: '#E85D26', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}
          >
            Login →
          </button>
        </form>
      </main>
    )
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ background: '#1a1a2e', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>🔐 TEFL Course Admin</h1>
          <p style={{ color: '#ccc', fontSize: '13px', margin: 0 }}>Student submissions</p>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem('teflAdminAuthed'); setAuthed(false) }}
          style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* STUDENT LIST */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <h2 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Students</h2>
          {loadingStudents ? (
            <p style={{ color: '#888', fontSize: '14px' }}>Loading…</p>
          ) : students.length === 0 ? (
            <p style={{ color: '#888', fontSize: '14px' }}>No students yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => openStudent(s)}
                  style={{
                    textAlign: 'left', background: selectedStudent?.id === s.id ? '#1a1a2e' : 'white',
                    color: selectedStudent?.id === s.id ? 'white' : '#333',
                    border: '1px solid #ddd', borderRadius: '10px', padding: '12px 14px', cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{s.name || s.email}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{s.submission_count} submissions</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DETAIL VIEW */}
        <div style={{ flex: 1 }}>
          {!selectedStudent ? (
            <div style={{ background: 'white', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#888' }}>
              Select a student to view their submitted work.
            </div>
          ) : loadingDetail ? (
            <p style={{ color: '#888' }}>Loading submissions…</p>
          ) : (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>
                {selectedStudent.name || selectedStudent.email}
              </h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>{selectedStudent.email}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {modules.map((mod) => (
                  <div key={mod.module_number} style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <button
                      onClick={() => setExpandedModule(expandedModule === mod.module_number ? null : mod.module_number)}
                      style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px' }}>
                        Module {mod.module_number} — {mod.title}
                      </span>
                      <span
                        style={{
                          fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '999px',
                          background: mod.total_pieces === 0 ? '#eee' : mod.submitted_count === mod.total_pieces ? '#e8f5e9' : '#fff3e0',
                          color: mod.total_pieces === 0 ? '#888' : mod.submitted_count === mod.total_pieces ? '#2e7d32' : '#b26a00',
                        }}
                      >
                        {mod.total_pieces === 0 ? 'No activities' : `${mod.submitted_count} / ${mod.total_pieces} submitted`}
                      </span>
                    </button>

                    {expandedModule === mod.module_number && (
                      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {mod.pieces.length === 0 ? (
                          <p style={{ color: '#888', fontSize: '13px' }}>This module has no activities or worksheets.</p>
                        ) : (
                          mod.pieces.map((piece, idx) => (
                            <div
                              key={piece.content_id}
                              style={{
                                border: piece.submitted ? '1px solid #c8e6c9' : '1px solid #eee',
                                background: piece.submitted ? '#f7fdf8' : '#fafafa',
                                borderRadius: '10px', padding: '14px 16px',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e' }}>
                                  Piece {idx + 1}: {piece.section_title}
                                  <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 'normal', color: '#888' }}>
                                    ({piece.content_type === 'activity' ? 'Activity' : 'Worksheet'})
                                  </span>
                                </span>
                                {piece.submitted ? (
                                  <span style={{ fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>
                                    ✓ Submitted {piece.submitted_at ? new Date(piece.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '12px', color: '#c0392b' }}>Not submitted</span>
                                )}
                              </div>
                              {piece.submitted && (
                                <p style={{ fontSize: '13px', color: '#333', whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>
                                  {piece.submission_text}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
