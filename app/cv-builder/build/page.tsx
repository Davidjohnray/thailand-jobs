'use client'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function CVBuildPage() {
  const [cv, setCv] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '',
    summary: '',
    experience: [{ title: '', company: '', dates: '', description: '' }],
    education: [{ degree: '', school: '', dates: '' }],
    skills: '',
  })
  const printRef = useRef<HTMLDivElement>(null)
  const [downloadCount, setDownloadCount] = useState<number>(35)

  useEffect(() => {
    const fetchCount = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data } = await supabase.from('stats').select('count').eq('id', 'cv_downloads').single()
      if (data) setDownloadCount(data.count)
    }
    fetchCount()
  }, [])

  const updateField = (field: string, value: string) => setCv(prev => ({ ...prev, [field]: value }))

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...cv.experience]
    updated[index] = { ...updated[index], [field]: value }
    setCv(prev => ({ ...prev, experience: updated }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...cv.education]
    updated[index] = { ...updated[index], [field]: value }
    setCv(prev => ({ ...prev, education: updated }))
  }

  const addExperience = () => setCv(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', dates: '', description: '' }] }))
  const addEducation = () => setCv(prev => ({ ...prev, education: [...prev.education, { degree: '', school: '', dates: '' }] }))

  const handlePrint = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase.from('stats').select('count').eq('id', 'cv_downloads').single()
    if (data) {
      const newCount = data.count + 1
      await supabase.from('stats').update({ count: newCount }).eq('id', 'cv_downloads')
      setDownloadCount(newCount)
    }
    window.print()
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          nav { display: none !important; }
          header { display: none !important; }
          footer { display: none !important; }
          body > *:not(main) { display: none !important; }
          main > *:not(.cv-print-area) { display: none !important; }
          .cv-print-area { display: block !important; width: 100% !important; box-shadow: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>

      <div className="no-print" style={{ background: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>📄 CV Builder — Free Plan</h1>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#ccc', fontSize: '13px', marginBottom: '8px' }}>
            📥 <strong style={{ color: 'white' }}>{downloadCount.toLocaleString()}</strong> CVs downloaded so far!
          </div>
          <button onClick={handlePrint}
            style={{ background: '#E85D26', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>

        {/* FORM */}
        <div className="no-print" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>👤 Personal Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Full Name', field: 'name', placeholder: 'John Smith' },
                { label: 'Email', field: 'email', placeholder: 'john@email.com' },
                { label: 'Phone', field: 'phone', placeholder: '+66 12 345 6789' },
                { label: 'Location', field: 'location', placeholder: 'Bangkok, Thailand' },
                { label: 'LinkedIn', field: 'linkedin', placeholder: 'linkedin.com/in/yourname' },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                  <input value={(cv as any)[f.field]} onChange={e => updateField(f.field, e.target.value)}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>📝 Professional Summary</h3>
            <textarea value={cv.summary} onChange={e => updateField('summary', e.target.value)}
              placeholder="Write a short summary about yourself and your career goals..."
              rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>💼 Work Experience</h3>
            {cv.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < cv.experience.length - 1 ? '1px solid #eee' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)}
                    placeholder="Job Title" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)}
                    placeholder="Company / School" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={exp.dates} onChange={e => updateExperience(i, 'dates', e.target.value)}
                    placeholder="e.g. Jan 2023 – Present" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <textarea value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                </div>
              </div>
            ))}
            <button onClick={addExperience}
              style={{ background: 'none', border: '1px dashed #ddd', color: '#666', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', width: '100%' }}>
              + Add Another Position
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>🎓 Education</h3>
            {cv.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < cv.education.length - 1 ? '1px solid #eee' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)}
                    placeholder="Degree / Qualification" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)}
                    placeholder="School / University" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={edu.dates} onChange={e => updateEducation(i, 'dates', e.target.value)}
                    placeholder="e.g. 2018 – 2022" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
            ))}
            <button onClick={addEducation}
              style={{ background: 'none', border: '1px dashed #ddd', color: '#666', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', width: '100%' }}>
              + Add Another Qualification
            </button>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>🛠 Skills</h3>
            <textarea value={cv.skills} onChange={e => updateField('skills', e.target.value)}
              placeholder="e.g. Classroom management, ESL teaching, Microsoft Office, Thai language..."
              rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

        </div>

        {/* CV PREVIEW */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="no-print" style={{ background: '#E85D26', color: 'white', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
            LIVE PREVIEW
          </div>
          <div ref={printRef} className="cv-print-area" style={{ background: 'white', padding: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minHeight: '800px' }}>

            <div style={{ borderBottom: '3px solid #E85D26', paddingBottom: '16px', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>{cv.name || 'Your Name'}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#555' }}>
                {cv.email && <span>✉ {cv.email}</span>}
                {cv.phone && <span>📞 {cv.phone}</span>}
                {cv.location && <span>📍 {cv.location}</span>}
                {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
              </div>
            </div>

            {cv.summary && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#E85D26', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Professional Summary</h2>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.summary}</p>
              </div>
            )}

            {cv.experience.some(e => e.title || e.company) && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#E85D26', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Work Experience</h2>
                {cv.experience.map((exp, i) => (
                  exp.title || exp.company ? (
                    <div key={i} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a2e' }}>{exp.title}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{exp.dates}</div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>{exp.company}</div>
                      {exp.description && <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', margin: 0 }}>{exp.description}</p>}
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {cv.education.some(e => e.degree || e.school) && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#E85D26', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Education</h2>
                {cv.education.map((edu, i) => (
                  edu.degree || edu.school ? (
                    <div key={i} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a2e' }}>{edu.degree}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{edu.dates}</div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#555' }}>{edu.school}</div>
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {cv.skills && (
              <div>
                <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#E85D26', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Skills</h2>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.skills}</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  )
}