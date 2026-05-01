'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const templates = [
  { id: 'classic', name: 'Classic', color: '#E85D26' },
  { id: 'modern', name: 'Modern', color: '#2D6BE4' },
  { id: 'minimal', name: 'Minimal', color: '#1a1a2e' },
  { id: 'professional', name: 'Professional', color: '#16a34a' },
  { id: 'bold', name: 'Bold', color: '#9333ea' },
]

type CVData = {
  name: string; email: string; phone: string; location: string; linkedin: string
  summary: string
  experience: { title: string; company: string; dates: string; description: string }[]
  education: { degree: string; school: string; dates: string }[]
  skills: string; languages: string; certifications: string; hobbies: string; references: string
}

function makePdfStyles(accentColor: string) {
  return StyleSheet.create({
    page: { fontFamily: 'Helvetica', padding: 40, backgroundColor: '#ffffff', fontSize: 10, color: '#333333' },
    header: { borderBottomWidth: 3, borderBottomColor: accentColor, borderBottomStyle: 'solid', paddingBottom: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
    headerText: { flex: 1 },
    name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1a1a2e', marginBottom: 6 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap' },
    contactItem: { fontSize: 9, color: '#555555', marginRight: 12 },
    sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: accentColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginTop: 14 },
    sectionDivider: { borderBottomWidth: 0.5, borderBottomColor: '#eeeeee', borderBottomStyle: 'solid', marginBottom: 8 },
    summaryText: { fontSize: 10, color: '#444444', lineHeight: 1.6 },
    expBlock: { marginBottom: 10 },
    expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    expTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1a1a2e' },
    expDates: { fontSize: 9, color: '#888888' },
    expCompany: { fontSize: 9, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
    expDesc: { fontSize: 9, color: '#666666', lineHeight: 1.5 },
    eduBlock: { marginBottom: 8 },
    eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    eduDegree: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#1a1a2e' },
    eduDates: { fontSize: 9, color: '#888888' },
    eduSchool: { fontSize: 9, color: '#555555' },
    twoCol: { flexDirection: 'row', gap: 24 },
    col: { flex: 1 },
    bodyText: { fontSize: 10, color: '#444444', lineHeight: 1.6 },
  })
}

function CVDocument({ cv, accentColor }: { cv: CVData; accentColor: string }) {
  const s = makePdfStyles(accentColor)
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.headerText}>
            <Text style={s.name}>{cv.name || 'Your Name'}</Text>
            <View style={s.contactRow}>
              {cv.email ? <Text style={s.contactItem}>{cv.email}</Text> : null}
              {cv.phone ? <Text style={s.contactItem}>{cv.phone}</Text> : null}
              {cv.location ? <Text style={s.contactItem}>{cv.location}</Text> : null}
              {cv.linkedin ? <Text style={s.contactItem}>{cv.linkedin}</Text> : null}
            </View>
          </View>
        </View>

        {cv.summary ? (
          <View>
            <Text style={s.sectionTitle}>Professional Summary</Text>
            <View style={s.sectionDivider} />
            <Text style={s.summaryText}>{cv.summary}</Text>
          </View>
        ) : null}

        {cv.experience.some(e => e.title || e.company) ? (
          <View>
            <Text style={s.sectionTitle}>Work Experience</Text>
            <View style={s.sectionDivider} />
            {cv.experience.map((exp, i) => exp.title || exp.company ? (
              <View key={i} style={s.expBlock}>
                <View style={s.expRow}>
                  <Text style={s.expTitle}>{exp.title}</Text>
                  <Text style={s.expDates}>{exp.dates}</Text>
                </View>
                <Text style={s.expCompany}>{exp.company}</Text>
                {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
              </View>
            ) : null)}
          </View>
        ) : null}

        {cv.education.some(e => e.degree || e.school) ? (
          <View>
            <Text style={s.sectionTitle}>Education</Text>
            <View style={s.sectionDivider} />
            {cv.education.map((edu, i) => edu.degree || edu.school ? (
              <View key={i} style={s.eduBlock}>
                <View style={s.eduRow}>
                  <Text style={s.eduDegree}>{edu.degree}</Text>
                  <Text style={s.eduDates}>{edu.dates}</Text>
                </View>
                <Text style={s.eduSchool}>{edu.school}</Text>
              </View>
            ) : null)}
          </View>
        ) : null}

        <View style={s.twoCol}>
          <View style={s.col}>
            {cv.skills ? <View><Text style={s.sectionTitle}>Skills</Text><View style={s.sectionDivider} /><Text style={s.bodyText}>{cv.skills}</Text></View> : null}
            {cv.languages ? <View><Text style={s.sectionTitle}>Languages</Text><View style={s.sectionDivider} /><Text style={s.bodyText}>{cv.languages}</Text></View> : null}
            {cv.hobbies ? <View><Text style={s.sectionTitle}>Hobbies & Interests</Text><View style={s.sectionDivider} /><Text style={s.bodyText}>{cv.hobbies}</Text></View> : null}
          </View>
          <View style={s.col}>
            {cv.certifications ? <View><Text style={s.sectionTitle}>Certifications</Text><View style={s.sectionDivider} /><Text style={s.bodyText}>{cv.certifications}</Text></View> : null}
            {cv.references ? <View><Text style={s.sectionTitle}>References</Text><View style={s.sectionDivider} /><Text style={s.bodyText}>{cv.references}</Text></View> : null}
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default function StandardBuilderPage() {
  const router = useRouter()
  const [template, setTemplate] = useState('classic')
  const [photo, setPhoto] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [cv, setCv] = useState<CVData>({
    name: '', email: '', phone: '', location: '', linkedin: '',
    summary: '',
    experience: [{ title: '', company: '', dates: '', description: '' }],
    education: [{ degree: '', school: '', dates: '' }],
    skills: '', languages: '', certifications: '', hobbies: '', references: '',
  })

  useEffect(() => {
    const plan = localStorage.getItem('cv_plan')
    if (plan !== 'standard' && plan !== 'premium') router.push('/cv-builder/unlock')
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
    if (file) { const reader = new FileReader(); reader.onload = () => setPhoto(reader.result as string); reader.readAsDataURL(file) }
  }

  const selectedTemplate = templates.find(t => t.id === template) || templates[0]
  const accentColor = selectedTemplate.color

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await pdf(<CVDocument cv={cv} accentColor={accentColor} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${cv.name || 'my-cv'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) { console.error('PDF error:', e) }
    setDownloading(false)
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <div style={{ background: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>📄 CV Builder — ⭐ Standard Plan</h1>
        <button onClick={handleDownload} disabled={downloading}
          style={{ background: downloading ? '#aaa' : '#E85D26', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: downloading ? 'not-allowed' : 'pointer', fontSize: '15px' }}>
          {downloading ? '⏳ Generating...' : '⬇ Download PDF'}
        </button>
      </div>

      <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#555' }}>Template:</span>
        {templates.map(t => (
          <button key={t.id} onClick={() => setTemplate(t.id)}
            style={{ padding: '8px 16px', borderRadius: '20px', border: `2px solid ${t.color}`, background: template === t.id ? t.color : 'white', color: template === t.id ? 'white' : t.color, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            {t.name}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>

        {/* FORM */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>📷 Profile Photo</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {photo ? <img src={photo} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accentColor}` }} /> : <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>}
              <div>
                <label style={{ background: accentColor, color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                  Upload Photo<input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                </label>
                {photo && <button onClick={() => setPhoto(null)} style={{ marginLeft: '8px', background: 'none', border: '1px solid #ddd', color: '#666', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Remove</button>}
                <p style={{ color: '#999', fontSize: '12px', marginTop: '6px' }}>JPG or PNG, max 2MB</p>
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
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>📝 Professional Summary</h3>
            <textarea value={cv.summary} onChange={e => updateField('summary', e.target.value)} placeholder="Write a short summary about yourself and your career goals..." rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>💼 Work Experience</h3>
            {cv.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < cv.experience.length - 1 ? '1px solid #eee' : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} placeholder="Job Title" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="Company / School" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={exp.dates} onChange={e => updateExperience(i, 'dates', e.target.value)} placeholder="e.g. Jan 2023 – Present" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <textarea value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3}
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
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

          {[
            { label: '🛠 Skills', field: 'skills', placeholder: 'e.g. Classroom management, ESL teaching...' },
            { label: '🌍 Languages', field: 'languages', placeholder: 'e.g. English (Native), Thai (Conversational)...' },
            { label: '🏆 Certifications', field: 'certifications', placeholder: 'e.g. TEFL Certificate (2023)...' },
            { label: '⚽ Hobbies & Interests', field: 'hobbies', placeholder: 'e.g. Travelling, Photography, Yoga...' },
            { label: '📋 References', field: 'references', placeholder: 'e.g. Available upon request...' },
          ].map(f => (
            <div key={f.field} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', color: '#1a1a2e' }}>{f.label}</h3>
              <textarea value={(cv as any)[f.field]} onChange={e => updateField(f.field, e.target.value)} placeholder={f.placeholder} rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
          ))}

        </div>

        {/* CV PREVIEW */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ background: accentColor, color: 'white', padding: '10px 16px', borderRadius: '8px 8px 0 0', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
            LIVE PREVIEW — {selectedTemplate.name.toUpperCase()} TEMPLATE
          </div>
          <div style={{ background: 'white', padding: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minHeight: '900px' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1a1a2e' }}>{exp.title}</div><div style={{ fontSize: '11px', color: '#888' }}>{exp.dates}</div></div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}><div style={{ fontWeight: 'bold', fontSize: '13px', color: '#1a1a2e' }}>{edu.degree}</div><div style={{ fontSize: '11px', color: '#888' }}>{edu.dates}</div></div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{edu.school}</div>
                  </div>
                ) : null)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '140px' }}>
                {cv.skills && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Skills</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.skills}</p></div>}
                {cv.languages && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Languages</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.languages}</p></div>}
                {cv.hobbies && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Hobbies & Interests</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.hobbies}</p></div>}
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                {cv.certifications && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Certifications</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.certifications}</p></div>}
                {cv.references && <div style={{ marginBottom: '14px' }}><h2 style={{ fontSize: '13px', fontWeight: 'bold', color: accentColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>References</h2><p style={{ fontSize: '12px', color: '#444', lineHeight: '1.6', margin: 0 }}>{cv.references}</p></div>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
