'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../src/lib/supabase'

const ORANGE = '#E85D26'
const NAVY = '#14172B'

const NATIONALITIES = [
  'American', 'Australian', 'British', 'Canadian', 'Irish', 'New Zealander', 'South African', 'Other'
]

const SUBJECTS = [
  'English', 'Mathematics', 'Science', 'Social Studies', 'History', 'Geography', 
  'Art', 'Music', 'Physical Education (PE)', 'Computer/ICT', 'Thai Language', 'Other'
]

const STATUSES = [
  { value: 'Applied', color: '#6B7280' },
  { value: 'Screening', color: '#3B82F6' },
  { value: 'Interview Scheduled', color: '#8B5CF6' },
  { value: 'Offered', color: '#F59E0B' },
  { value: 'Contract Signed', color: '#10B981' },
  { value: 'Started', color: '#059669' },
  { value: 'Completed 2 Months', color: '#047857' },
  { value: 'Payment Due', color: '#EF4444' },
  { value: 'Paid', color: '#22C55E' },
  { value: 'Rejected', color: '#DC2626' },
  { value: 'Withdrawn', color: '#9CA3AF' },
]

const AGENCIES = [
  'ARNA Education', 'Teach Bridge Asia', 'Other'
]

interface Applicant {
  id: string
  recruiter_email: string
  applicant_name: string
  email: string
  phone: string
  whatsapp: string
  line_id: string
  nationality: string
  nationality_other: string
  agency: string
  school: string
  subject: string
  subject_other: string
  status: string
  hiring_date: string
  start_date: string
  payment_due_date: string
  payment_status: string
  commission_amount: number
  notes: string
  created_at: string
}

const PASSWORD = 'teachbridge2026'
const RECRUITER = 'teach-bridge'

export default function TeachBridgeAdmin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

  // Form state
  const [form, setForm] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    line_id: '',
    nationality: '',
    nationality_other: '',
    agency: '',
    school: '',
    subject: '',
    subject_other: '',
    status: 'Applied',
    hiring_date: '',
    start_date: '',
    payment_due_date: '',
    payment_status: 'Pending',
    commission_amount: '',
    notes: ''
  })

  const fetchApplicants = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('recruitment_tracker')
      .select('*')
      .eq('recruiter_email', RECRUITER)
      .order('created_at', { ascending: false })
    if (data) setApplicants(data)
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== PASSWORD) {
      setError('Incorrect password')
      return
    }
    setError('')
    setLoggedIn(true)
  }

  useEffect(() => {
    if (loggedIn) fetchApplicants()
  }, [loggedIn])

  const resetForm = () => {
    setForm({
      applicant_name: '',
      email: '',
      phone: '',
      whatsapp: '',
      line_id: '',
      nationality: '',
      nationality_other: '',
      agency: '',
      school: '',
      subject: '',
      subject_other: '',
      status: 'Applied',
      hiring_date: '',
      start_date: '',
      payment_due_date: '',
      payment_status: 'Pending',
      commission_amount: '',
      notes: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...form,
      recruiter_email: RECRUITER,
      commission_amount: form.commission_amount ? parseInt(form.commission_amount) : null,
      hiring_date: form.hiring_date || null,
      start_date: form.start_date || null,
      payment_due_date: form.payment_due_date || null,
    }

    if (editingId) {
      await supabase.from('recruitment_tracker').update(data).eq('id', editingId)
    } else {
      await supabase.from('recruitment_tracker').insert(data)
    }
    resetForm()
    fetchApplicants()
  }

  const handleEdit = (applicant: Applicant) => {
    setForm({
      applicant_name: applicant.applicant_name || '',
      email: applicant.email || '',
      phone: applicant.phone || '',
      whatsapp: applicant.whatsapp || '',
      line_id: applicant.line_id || '',
      nationality: applicant.nationality || '',
      nationality_other: applicant.nationality_other || '',
      agency: applicant.agency || '',
      school: applicant.school || '',
      subject: applicant.subject || '',
      subject_other: applicant.subject_other || '',
      status: applicant.status || 'Applied',
      hiring_date: applicant.hiring_date || '',
      start_date: applicant.start_date || '',
      payment_due_date: applicant.payment_due_date || '',
      payment_status: applicant.payment_status || 'Pending',
      commission_amount: applicant.commission_amount?.toString() || '',
      notes: applicant.notes || ''
    })
    setEditingId(applicant.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this applicant?')) {
      await supabase.from('recruitment_tracker').delete().eq('id', id)
      fetchApplicants()
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('recruitment_tracker').update({ status }).eq('id', id)
    fetchApplicants()
  }

  const getStatusColor = (status: string) => {
    return STATUSES.find(s => s.value === status)?.color || '#6B7280'
  }

  const filteredApplicants = applicants.filter(a => {
    const matchesFilter = !filter || a.status === filter
    const matchesSearch = !search || 
      a.applicant_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.school?.toLowerCase().includes(search.toLowerCase()) ||
      a.agency?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Stats
  const totalApplicants = applicants.length
  const pendingPayments = applicants.filter(a => a.payment_status === 'Pending' && ['Completed 2 Months', 'Payment Due'].includes(a.status)).length
  const startedThisMonth = applicants.filter(a => {
    if (!a.start_date) return false
    const start = new Date(a.start_date)
    const now = new Date()
    return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear()
  }).length

  // Login screen
  if (!loggedIn) {
    return (
      <main style={{ minHeight: '100vh', background: '#f8f8f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: NAVY, marginBottom: '8px', textAlign: 'center' }}>
            Teach Bridge Tracker
          </h1>
          <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginBottom: '24px' }}>
            Enter password to access
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }}
            />
            {error && <p style={{ color: '#EF4444', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" style={{ width: '100%', padding: '14px', background: ORANGE, color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Login
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8f8f6', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: NAVY, marginBottom: '4px' }}>Teach Bridge Tracker</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Recruitment Management</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditingId(null); }} style={{ padding: '12px 24px', background: ORANGE, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Add Applicant
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: NAVY }}>{totalApplicants}</div>
            <div style={{ fontSize: '13px', color: '#666' }}>Total Applicants</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#EF4444' }}>{pendingPayments}</div>
            <div style={{ fontSize: '13px', color: '#666' }}>Pending Payments</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981' }}>{startedThisMonth}</div>
            <div style={{ fontSize: '13px', color: '#666' }}>Started This Month</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search name, school, agency..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', minWidth: '250px' }}
          />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: 'white' }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button onClick={() => setView('cards')} style={{ padding: '10px 16px', background: view === 'cards' ? NAVY : '#e5e5e5', color: view === 'cards' ? 'white' : '#333', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Cards</button>
            <button onClick={() => setView('table')} style={{ padding: '10px 16px', background: view === 'table' ? NAVY : '#e5e5e5', color: view === 'table' ? 'white' : '#333', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Table</button>
          </div>
        </div>

        {/* Loading */}
        {loading && <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>Loading...</p>}

        {/* No applicants */}
        {!loading && applicants.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No applicants yet</p>
            <p style={{ fontSize: '14px' }}>Click "Add Applicant" to get started</p>
          </div>
        )}

        {/* Cards View */}
        {!loading && view === 'cards' && filteredApplicants.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filteredApplicants.map(applicant => (
              <div key={applicant.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {/* Card Header */}
                <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: NAVY }}>{applicant.applicant_name}</div>
                    <div style={{ fontSize: '13px', color: '#666' }}>{applicant.nationality === 'Other' ? applicant.nationality_other : applicant.nationality}</div>
                  </div>
                  <span style={{ background: getStatusColor(applicant.status), color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {applicant.status}
                  </span>
                </div>

                {/* Contact Buttons */}
                <div style={{ padding: '12px 16px', background: '#f9f9f9', display: 'flex', gap: '8px' }}>
                  {applicant.email && (
                    <a href={`mailto:${applicant.email}`} style={{ flex: 1, padding: '8px', background: '#3B82F6', color: 'white', borderRadius: '6px', textAlign: 'center', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
                      📧 Email
                    </a>
                  )}
                  {applicant.whatsapp && (
                    <a href={`https://wa.me/${applicant.whatsapp.replace(/\D/g, '')}`} target="_blank" style={{ flex: 1, padding: '8px', background: '#25D366', color: 'white', borderRadius: '6px', textAlign: 'center', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
                      📱 WhatsApp
                    </a>
                  )}
                  {applicant.line_id && (
                    <button onClick={() => { navigator.clipboard.writeText(applicant.line_id); alert('LINE ID copied!') }} style={{ flex: 1, padding: '8px', background: '#00B900', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                      💬 LINE
                    </button>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px', marginBottom: '12px' }}>
                    <div><span style={{ color: '#888' }}>Agency:</span> <span style={{ color: '#333' }}>{applicant.agency || '-'}</span></div>
                    <div><span style={{ color: '#888' }}>School:</span> <span style={{ color: '#333' }}>{applicant.school || '-'}</span></div>
                    <div><span style={{ color: '#888' }}>Subject:</span> <span style={{ color: '#333' }}>{applicant.subject === 'Other' ? applicant.subject_other : applicant.subject || '-'}</span></div>
                    <div><span style={{ color: '#888' }}>Commission:</span> <span style={{ color: '#333' }}>{applicant.commission_amount ? `฿${applicant.commission_amount.toLocaleString()}` : '-'}</span></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                    <div>Hired: {applicant.hiring_date || '-'}</div>
                    <div>Start: {applicant.start_date || '-'}</div>
                    <div>Payment: {applicant.payment_due_date || '-'}</div>
                  </div>
                  {applicant.notes && (
                    <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginBottom: '12px' }}>
                      📝 {applicant.notes}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={applicant.status}
                      onChange={e => updateStatus(applicant.id, e.target.value)}
                      style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', background: 'white' }}
                    >
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                    </select>
                    <button onClick={() => handleEdit(applicant)} style={{ padding: '8px 12px', background: '#e5e5e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => handleDelete(applicant.id)} style={{ padding: '8px 12px', background: '#fee2e2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {!loading && view === 'table' && filteredApplicants.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: NAVY, color: 'white' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Agency</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>School</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Subject</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Start Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Payment</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant, i) => (
                  <tr key={applicant.id} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '12px' }}>{applicant.applicant_name}</td>
                    <td style={{ padding: '12px' }}>{applicant.agency || '-'}</td>
                    <td style={{ padding: '12px' }}>{applicant.school || '-'}</td>
                    <td style={{ padding: '12px' }}>{applicant.subject === 'Other' ? applicant.subject_other : applicant.subject || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: getStatusColor(applicant.status), color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                        {applicant.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{applicant.start_date || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: applicant.payment_status === 'Paid' ? '#22C55E' : '#EF4444', fontWeight: 'bold' }}>
                        {applicant.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleEdit(applicant)} style={{ padding: '4px 10px', background: '#e5e5e5', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>Edit</button>
                      <button onClick={() => handleDelete(applicant.id)} style={{ padding: '4px 10px', background: '#fee2e2', color: '#DC2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: NAVY, marginBottom: '20px' }}>
                {editingId ? 'Edit Applicant' : 'Add New Applicant'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Name */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Applicant Name *</label>
                    <input type="text" required value={form.applicant_name} onChange={e => setForm({ ...form, applicant_name: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Phone</label>
                    <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>WhatsApp (with country code)</label>
                    <input type="text" placeholder="+66812345678" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* LINE */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>LINE ID</label>
                    <input type="text" value={form.line_id} onChange={e => setForm({ ...form, line_id: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Nationality */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Nationality</label>
                    <select value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', background: 'white' }}>
                      <option value="">Select...</option>
                      {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  {/* Nationality Other */}
                  {form.nationality === 'Other' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Specify Nationality</label>
                      <input type="text" value={form.nationality_other} onChange={e => setForm({ ...form, nationality_other: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                    </div>
                  )}

                  {/* Agency */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Agency</label>
                    <select value={form.agency} onChange={e => setForm({ ...form, agency: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', background: 'white' }}>
                      <option value="">Select...</option>
                      {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  {/* School */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>School</label>
                    <input type="text" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Subject</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', background: 'white' }}>
                      <option value="">Select...</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Subject Other */}
                  {form.subject === 'Other' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Specify Subject</label>
                      <input type="text" value={form.subject_other} onChange={e => setForm({ ...form, subject_other: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', background: 'white' }}>
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                    </select>
                  </div>

                  {/* Hiring Date */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Hiring Date</label>
                    <input type="date" value={form.hiring_date} onChange={e => setForm({ ...form, hiring_date: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Start Date</label>
                    <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Payment Due Date */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Payment Due Date</label>
                    <input type="date" value={form.payment_due_date} onChange={e => setForm({ ...form, payment_due_date: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Payment Status</label>
                    <select value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', background: 'white' }}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  {/* Commission */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Commission Amount (฿)</label>
                    <input type="number" value={form.commission_amount} onChange={e => setForm({ ...form, commission_amount: e.target.value })} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} />
                  </div>

                  {/* Notes */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '4px' }}>Notes</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }} />
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={resetForm} style={{ padding: '12px 24px', background: '#e5e5e5', color: '#333', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '12px 24px', background: ORANGE, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {editingId ? 'Save Changes' : 'Add Applicant'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
