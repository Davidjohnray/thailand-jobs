'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const templates = [
  { id: 'classic', name: 'Classic', color: '#E85D26', layout: 'standard' },
  { id: 'modern', name: 'Modern', color: '#2D6BE4', layout: 'standard' },
  { id: 'minimal', name: 'Minimal', color: '#1a1a2e', layout: 'standard' },
  { id: 'professional', name: 'Professional', color: '#16a34a', layout: 'standard' },
  { id: 'bold', name: 'Bold', color: '#9333ea', layout: 'standard' },
  { id: 'elegant', name: 'Elegant', color: '#b45309', layout: 'sidebar' },
  { id: 'creative', name: 'Creative', color: '#db2777', layout: 'sidebar' },
  { id: 'executive', name: 'Executive', color: '#0f172a', layout: 'twopage' },
]

export default function PremiumBuilderPage() {
  const router = useRouter()
  const [template, setTemplate] = useState('classic')
  const [activeTab, setActiveTab] = useState('cv')
  const [photo, setPhoto] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [cv, setCv] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '',
    summary: '',
    experience: [{ title: '', company: '', dates: '', description: '' }],
    education: [{ degree: '', school: '', dates: '' }],
    skills: '',
    languages: '',
    certifications: '',
    hobbies: '',
    references: '',
  })
  const [coverLetter, setCoverLetter] = useState({
    hiringManager: '', company: '', position: '', body: ''
  })

  useEffect(() => {
    const plan = localStorage.getItem('cv_plan')
    if (plan !== 'premium') {
      router.push('/cv-builder/unlock')
    }
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

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const improveWithAI = async (field: string, text: string, type: string) => {
    if (!text.trim()) return
    setAiLoading(field)
    try {
      const res = await fetch('/api/improve-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type }),
      })
      const data = await res.json()
      if (field === 'cover') {
        setCoverLetter(prev => ({ ...prev, body: data.improved }))
      } else {
        updateField(field, data.improved)
      }
    } catch (e) {
      console.error('AI error:', e)
    }
    setAiLoading(null)
  }

  const improveExperienceWithAI = async (index: number, text: string) => {
    if (!text.trim()) return
    setAiLoading(`exp_${index}`)
    try {
      const res = await fetch('/api/improve-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type: 'experience' }),
      })
      const data = await res.json()
      updateExperience(index, 'description', data.improved)
    } catch (e) {
      console.error('AI error:', e)
    }
    setAiLoading(null)
  }

  const AIButton = ({ field, text, type }: { field: string, text: string, type: string }) => (
    <button
      onClick={() => improveWithAI(field, text, type)}
      disabled={aiLoading === field || !text.trim()}
      style={{ background: aiLoading === field ? '#ddd' : '#7c3aed', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: aiLoading === field ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '6px' }}>
      {aiLoading === field ? '✨ Improving...' : '✨ Improve with AI'}
    </button>
  )

  const selectedTemplate = templates.find(t => t.id === template) || templates[0]
  const accentColor = selectedTemplate.color
  const layout = selectedTemplate.layout

  const CVPreview = () => (
    <div className="cv-print-area" style={{ background: 'white', padding: layout === 'sidebar' ? '0' : '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minHeight: '900px', overflow: 'hidden' }}>

      {layout === 'sidebar' ? (
        <div style={{ display: 'flex', minHeight: '900px' }}>
          <div style={{ width: '200px', background: accentColor, padding: '32px 20px', flexShrink: 0 }}>
            {photo && <img src={photo} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', display: 'block', margin: '0 auto 16px' }} />}
            <h1 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', textAlign: 'center' }}>{cv.name || 'Your Name'}</h1>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cv.email && <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', margin: 0 }}>✉ {cv.email}</p>}
              {cv.phone && <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', margin: 0 }}>📞 {cv.phone}</p>}
              {cv.location && <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', margin: 0 }}>📍 {cv.location}</p>}
              {cv.linkedin && <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', margin: 0 }}>🔗 {cv.linkedin}</p>}
            </div>
            {cv.skills && <div style={{ marginTop: '24px' }}><h3 style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Skills</h3><p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', lineHeight: '1.6', margin: 0 }}>{cv.skills}</p></div>}
            {cv.languages && <div style={{ marginTop: '16px' }}><h3 style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Languages</h3><p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', lineHeight: '1.6', margin: 0 }}>{cv.languages}</p></div>}
            {cv.hobbies && <div style={{ marginTop: '16px' }}><h3 style={{ color: 'white', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Interests</h3><p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', lineHeight: '1.6', margin: 0 }}>{cv.hobbies}</p></div>}
          </div>
          <div style={{ flex: 1, padding: '32px 28px' }}>
            {cv.summary && <div style={{ marginBottom: '20px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Profile</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.summary}</p></div>}
            {cv.experience.some(e => e.title || e.company) && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Experience</h2>
                {cv.experience.map((exp, i) => exp.title || exp.company ? (
                  <div key={i} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ fontSize: '13px', color: '#1a1a2e' }}>{exp.title}</b><span style={{ fontSize: '11px', color: '#888' }}>{exp.dates}</span></div>
                    <div style={{ fontSize: '12px', color: accentColor, fontWeight: '600' }}>{exp.company}</div>
                    {exp.description && <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.5', margin: '4px 0 0' }}>{exp.description}</p>}
                  </div>
                ) : null)}
              </div>
            )}
            {cv.education.some(e => e.degree || e.school) && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Education</h2>
                {cv.education.map((edu, i) => edu.degree || edu.school ? (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><b style={{ fontSize: '13px', color: '#1a1a2e' }}>{edu.degree}</b><span style={{ fontSize: '11px', color: '#888' }}>{edu.dates}</span></div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{edu.school}</div>
                  </div>
                ) : null)}
              </div>
            )}
            {cv.certifications && <div style={{ marginBottom: '16px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Certifications</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.certifications}</p></div>}
            {cv.references && <div><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>References</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.references}</p></div>}
          </div>
        </div>
      ) : (
        <>
          <div style={{ borderBottom: `3px solid ${accentColor}`, paddingBottom: '16px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {photo && <img src={photo} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accentColor}`, flexShrink: 0 }} />}
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 6px' }}>{cv.name || 'Your Name'}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#555' }}>
                {cv.email && <span>✉ {cv.email}</span>}
                {cv.phone && <span>📞 {cv.phone}</span>}
                {cv.location && <span>📍 {cv.location}</span>}
                {cv.linkedin && <span>🔗 {cv.linkedin}</span>}
              </div>
            </div>
          </div>
          {cv.summary && <div style={{ marginBottom: '18px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Professional Summary</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.summary}</p></div>}
          {cv.experience.some(e => e.title || e.company) && (
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Work Experience</h2>
              {cv.experience.map((exp, i) => exp.title || exp.company ? (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}><b style={{ fontSize: '13px', color: '#1a1a2e' }}>{exp.title}</b><span style={{ fontSize: '11px', color: '#888' }}>{exp.dates}</span></div>
                  <div style={{ fontSize: '12px', color: accentColor, fontWeight: '600', marginBottom: '3px' }}>{exp.company}</div>
                  {exp.description && <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.5', margin: 0 }}>{exp.description}</p>}
                </div>
              ) : null)}
            </div>
          )}
          {cv.education.some(e => e.degree || e.school) && (
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Education</h2>
              {cv.education.map((edu, i) => edu.degree || edu.school ? (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}><b style={{ fontSize: '13px', color: '#1a1a2e' }}>{edu.degree}</b><span style={{ fontSize: '11px', color: '#888' }}>{edu.dates}</span></div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{edu.school}</div>
                </div>
              ) : null)}
            </div>
          )}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '140px' }}>
              {cv.skills && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Skills</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.skills}</p></div>}
              {cv.languages && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Languages</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.languages}</p></div>}
              {cv.hobbies && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Hobbies</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.hobbies}</p></div>}
            </div>
            <div style={{ flex: 1, minWidth: '140px' }}>
              {cv.certifications && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Certifications</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.certifications}</p></div>}
              {cv.references && <div><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>References</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.references}</p></div>}
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          nav { display: none !important; }
          header { display: none !important; }
          body > *:not(main) { display: none !important; }
          main > *:not(.cv-print-area) { display: none !important; }
          .cv-print-area { display: block !important; width: 100% !important; box-shadow: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>

      <div className="no-print" style={{ background: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>📄 CV Builder — 💎 Premium Plan</h1>
        <button onClick={() => window.print()}
          style={{ background: '#E85D26', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
          ⬇ Download PDF
        </button>
      </div>

      <div className="no-print" style={{ background: 'white', borderBottom: '1px solid #eee', display: 'flex' }}>
        {[{ id: 'cv', label: '📄 CV Builder' }, { id: 'cover', label: '✉️ Cover Letter' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '14px 24px', border: 'none', background: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', color: activeTab === tab.id ? '#E85D26' : '#666', borderBottom: activeTab === tab.id ? '3px solid #E85D26' : '3px solid transparent' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="no-print" style={{ background: 'white', padding: '12px 24px', borderBottom: '1px solid #eee', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#555' }}>Template:</span>
        {templates.map(t => (
          <button key={t.id} onClick={() => setTemplate(t.id)}
            style={{ padding: '6px 12px', borderRadius: '20px', border: `2px solid ${t.color}`, background: template === t.id ? t.color : 'white', color: template === t.id ? 'white' : t.color, fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
            {t.name} {t.layout === 'sidebar' ? '⬛' : ''}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>

        {activeTab === 'cv' ? (
          <>
            <div className="no-print" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>📷 Profile Photo</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {photo ? <img src={photo} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accentColor}` }} /> : <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>}
                  <div>
                    <label style={{ background: accentColor, color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                    </label>
                    {photo && <button onClick={() => setPhoto(null)} style={{ marginLeft: '8px', background: 'none', border: '1px solid #ddd', color: '#666', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Remove</button>}
                  </div>
                </div>
              </div>

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
                      <input value={(cv as any)[f.field]} onChange={e => updateField(f.field, e.target.value)} placeholder={f.placeholder}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', color: '#1a1a2e' }}>📝 Professional Summary</h3>
                <p style={{ color: '#999', fontSize: '12px', marginBottom: '12px' }}>💎 AI can rewrite this for you</p>
                <textarea value={cv.summary} onChange={e => updateField('summary', e.target.value)} placeholder="Write a short summary about yourself..." rows={4}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                <AIButton field="summary" text={cv.summary} type="summary" />
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', color: '#1a1a2e' }}>💼 Work Experience</h3>
                <p style={{ color: '#999', fontSize: '12px', marginBottom: '12px' }}>💎 AI can improve each job description</p>
                {cv.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < cv.experience.length - 1 ? '1px solid #eee' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} placeholder="Job Title" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                      <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Company / School" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                      <input value={exp.dates} onChange={e => updateExperience(i, 'dates', e.target.value)} placeholder="e.g. Jan 2023 – Present" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                      <textarea value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} placeholder="Describe your responsibilities..." rows={3}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                      <button onClick={() => improveExperienceWithAI(i, exp.description)} disabled={aiLoading === `exp_${i}` || !exp.description.trim()}
                        style={{ background: aiLoading === `exp_${i}` ? '#ddd' : '#7c3aed', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: aiLoading === `exp_${i}` ? 'not-allowed' : 'pointer', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                        {aiLoading === `exp_${i}` ? '✨ Improving...' : '✨ Improve with AI'}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} style={{ background: 'none', border: '1px dashed #ddd', color: '#666', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', width: '100%' }}>+ Add Another Position</button>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>🎓 Education</h3>
                {cv.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < cv.education.length - 1 ? '1px solid #eee' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="Degree / Qualification" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                      <input value={edu.school} onChange={e => updateEducation(i, 'school', e.target.value)} placeholder="School / University" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                      <input value={edu.dates} onChange={e => updateEducation(i, 'dates', e.target.value)} placeholder="e.g. 2018 – 2022" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} style={{ background: 'none', border: '1px dashed #ddd', color: '#666', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', width: '100%' }}>+ Add Another Qualification</button>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', color: '#1a1a2e' }}>🛠 Skills</h3>
                <p style={{ color: '#999', fontSize: '12px', marginBottom: '12px' }}>💎 AI can improve this for you</p>
                <textarea value={cv.skills} onChange={e => updateField('skills', e.target.value)} placeholder="e.g. Classroom management, ESL teaching..." rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                <AIButton field="skills" text={cv.skills} type="skills" />
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px', color: '#1a1a2e' }}>🌍 Languages</h3>
                <textarea value={cv.languages} onChange={e => updateField('languages', e.target.value)} placeholder="e.g. English (Native), Thai (Conversational)..." rows={2}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px', color: '#1a1a2e' }}>🏆 Certifications</h3>
                <textarea value={cv.certifications} onChange={e => updateField('certifications', e.target.value)} placeholder="e.g. TEFL Certificate (2023)..." rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px', color: '#1a1a2e' }}>⚽ Hobbies & Interests</h3>
                <textarea value={cv.hobbies} onChange={e => updateField('hobbies', e.target.value)} placeholder="e.g. Travelling, Photography, Yoga..." rows={2}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px', color: '#1a1a2e' }}>📋 References</h3>
                <textarea value={cv.references} onChange={e => updateField('references', e.target.value)} placeholder="e.g. Available upon request..." rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className="no-print" style={{ background: accentColor, color: 'white', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                LIVE PREVIEW — {selectedTemplate.name.toUpperCase()} {layout === 'sidebar' ? '(SIDEBAR LAYOUT)' : ''}
              </div>
              <CVPreview />
            </div>
          </>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div className="no-print" style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', color: '#1a1a2e' }}>✉️ Cover Letter</h3>
                <p style={{ color: '#999', fontSize: '12px', marginBottom: '16px' }}>💎 AI can improve your cover letter body</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>Hiring Manager Name</label>
                    <input value={coverLetter.hiringManager} onChange={e => setCoverLetter(p => ({ ...p, hiringManager: e.target.value }))} placeholder="e.g. Mr. Smith"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>Company / School</label>
                    <input value={coverLetter.company} onChange={e => setCoverLetter(p => ({ ...p, company: e.target.value }))} placeholder="e.g. Bangkok International School"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>Position</label>
                    <input value={coverLetter.position} onChange={e => setCoverLetter(p => ({ ...p, position: e.target.value }))} placeholder="e.g. English Teacher"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '4px' }}>Cover Letter Body</label>
                    <textarea value={coverLetter.body} onChange={e => setCoverLetter(p => ({ ...p, body: e.target.value }))} placeholder="Write your cover letter here..." rows={10}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                    <AIButton field="cover" text={coverLetter.body} type="cover" />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div className="no-print" style={{ background: accentColor, color: 'white', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                COVER LETTER PREVIEW
              </div>
              <div className="cv-print-area" style={{ background: 'white', padding: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minHeight: '600px' }}>
                <div style={{ borderBottom: `3px solid ${accentColor}`, paddingBottom: '16px', marginBottom: '24px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' }}>{cv.name || 'Your Name'}</h1>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{cv.email} {cv.phone ? `• ${cv.phone}` : ''}</p>
                </div>
                <p style={{ fontSize: '13px', color: '#444', marginBottom: '16px' }}>Dear {coverLetter.hiringManager || 'Hiring Manager'},</p>
                <p style={{ fontSize: '13px', color: '#444', marginBottom: '16px', lineHeight: '1.6' }}>
                  I am writing to apply for the <strong>{coverLetter.position || '[Position]'}</strong> position at <strong>{coverLetter.company || '[Company]'}</strong>.
                </p>
                {coverLetter.body && <p style={{ fontSize: '13px', color: '#444', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>{coverLetter.body}</p>}
                <p style={{ fontSize: '13px', color: '#444', marginBottom: '8px' }}>Kind regards,</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e' }}>{cv.name || 'Your Name'}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}