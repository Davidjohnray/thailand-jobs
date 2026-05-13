'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'

export default function TEFLPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', study_mode: '', start_date: '', interest: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit() {
    if (!form.name || !form.email) return alert('Please fill in your name and email')
    if (!form.interest) return alert('Please select which option interests you')
    setSending(true)
    await supabase.from('tefl_leads').insert([{ ...form }])
    setSending(false)
    setSent(true)
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', padding: '8px 20px', marginBottom: '24px' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '600' }}>🎓 TEFL Certification in Thailand</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', margin: '0 0 20px', lineHeight: '1.2' }}>
            Get TEFL Certified.<br />
            <span style={{ color: '#f59e0b' }}>Teach Better. Earn More.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px', margin: '0 0 36px', lineHeight: '1.7', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            TEFL certification is the single most important qualification a teacher in Thailand can have. It opens doors, increases your salary and gives you the skills to become a truly effective classroom teacher.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#register" style={{ background: '#f59e0b', color: '#1a1a2e', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
              Register Your Interest →
            </a>
            <a href="#what-is-tefl" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
              Learn More
            </a>
          </div>
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '48px', flexWrap: 'wrap' }}>
            {[['120', 'Course Hours'], ['P1–M3', 'Age Groups Covered'], ['฿0', 'To Register Interest']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: '#f59e0b', fontSize: '36px', fontWeight: 'bold' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS TEFL */}
      <section id="what-is-tefl" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>What is TEFL?</h2>
            <p style={{ color: '#666', fontSize: '17px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
              TEFL stands for Teaching English as a Foreign Language. It is the internationally recognised qualification for teachers of English to non-native speakers.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { emoji: '📚', title: '120 Hours of Training', desc: 'A full TEFL certificate requires a minimum of 120 hours of training covering lesson planning, grammar, phonics, classroom management and more.' },
              { emoji: '🌍', title: 'Recognised Worldwide', desc: 'TEFL certification is accepted by schools and language centres across Thailand, Asia and around the world.' },
              { emoji: '🏫', title: 'Practical Teaching Hours', desc: 'The course includes a practical teaching component completed in a real classroom setting and signed off by the school.' },
              { emoji: '✅', title: 'Required for Work Permits', desc: 'NNES teachers in Thailand need a TEFL certificate as part of their work permit application alongside their degree and English test score.' },
            ].map(item => (
              <div key={item.title} style={{ background: '#f8f9fa', borderRadius: '16px', padding: '28px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 10px' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY THAI SCHOOLS WANT IT */}
      <section style={{ padding: '80px 24px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Why Thai Schools Want TEFL</h2>
            <p style={{ color: '#666', fontSize: '17px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
              TEFL certification is not just a nice-to-have — for most teaching positions in Thailand it is a requirement.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '48px' }}>
            {[
              { icon: '📋', title: 'Work Permit Requirement', desc: 'The Thai Ministry of Labour requires NNES teachers to present a TEFL certificate as part of their work permit application.' },
              { icon: '💰', title: 'Higher Salary', desc: 'Teachers with TEFL certification consistently earn more. Schools view it as proof of commitment and professional training.' },
              { icon: '🏆', title: 'Competitive Advantage', desc: 'With hundreds of teachers applying for the same roles, TEFL certification immediately separates you from unqualified candidates.' },
              { icon: '👨‍🏫', title: 'Better Teaching', desc: 'Schools hire TEFL-certified teachers because they arrive knowing how to plan lessons, manage a classroom and teach grammar effectively.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: '14px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '32px', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Salary table */}
          <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ background: '#1a1a2e', padding: '20px 28px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>💰 Salary Comparison — With vs Without TEFL</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'left', color: '#444', fontWeight: '600' }}>School Type</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', color: '#dc2626', fontWeight: '600' }}>Without TEFL</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: '600' }}>With TEFL</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Government School', '฿22,000–฿28,000', '฿28,000–฿35,000'],
                    ['Language Centre', '฿22,000–฿30,000', '฿30,000–฿45,000'],
                    ['Private MEP School', '฿28,000–฿38,000', '฿35,000–฿50,000'],
                    ['University / College', '฿30,000–฿45,000', '฿40,000–฿60,000'],
                  ].map(([type, without, with_], i) => (
                    <tr key={type} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                      <td style={{ padding: '14px 20px', color: '#444', fontWeight: '500' }}>{type}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'center', color: '#dc2626' }}>{without}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'center', color: '#16a34a', fontWeight: '600' }}>{with_}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>What a 120-Hour TEFL Course Covers</h2>
            <p style={{ color: '#666', fontSize: '17px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
              A full TEFL course gives you the theory and the practice to walk into any classroom with confidence.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { emoji: '📝', topic: 'Lesson Planning' },
              { emoji: '🗣️', topic: 'Teaching Speaking & Listening' },
              { emoji: '📖', topic: 'Reading & Writing Skills' },
              { emoji: '🔤', topic: 'Grammar for Teachers' },
              { emoji: '🔊', topic: 'Phonics & Pronunciation' },
              { emoji: '👨‍🏫', topic: 'Classroom Management' },
              { emoji: '🎮', topic: 'Games & Activities' },
              { emoji: '📊', topic: 'Testing & Assessment' },
              { emoji: '👶', topic: 'Teaching Young Learners' },
              { emoji: '🏫', topic: 'Practical Teaching Hours' },
            ].map(item => (
              <div key={item.topic} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.emoji}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>{item.topic}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMING SOON BANNER */}
      <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #E85D26, #f59e0b)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔜</div>
          <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px' }}>Online Self-Study TEFL Course — Coming Soon</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '17px', margin: '0 0 24px', lineHeight: '1.7', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Jobs in Thailand is developing its own fully certified 120-hour online TEFL course. Study at your own pace, complete your practical teaching hours in a local school and receive a globally recognised certificate.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            {['120 Hours', 'Self-Paced', 'Fully Certified', 'Practical Teaching Included'].map(tag => (
              <div key={tag} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '30px', padding: '8px 20px', color: 'white', fontWeight: '600', fontSize: '14px' }}>{tag}</div>
            ))}
          </div>
          <a href="#register" style={{ background: 'white', color: '#E85D26', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px', display: 'inline-block' }}>
            Join the Waiting List →
          </a>
        </div>
      </section>

      {/* REGISTER FORM */}
      <section id="register" style={{ padding: '80px 24px', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 16px' }}>Register Your Interest</h2>
            <p style={{ color: '#666', fontSize: '17px', lineHeight: '1.7' }}>
              Tell us what you're looking for and we'll be in touch with the right options for you. No obligation, completely free.
            </p>
          </div>

          {sent ? (
            <div style={{ background: 'white', borderRadius: '20px', padding: '60px 40px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px' }}>Thank you, {form.name}!</h3>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.7', margin: '0 0 24px' }}>
                We've received your interest and will be in touch soon with TEFL options that match what you're looking for.
              </p>
              <Link href="/jobs/teaching" style={{ background: '#E85D26', color: 'white', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}>
                Browse Teaching Jobs →
              </Link>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

              {/* Interest selector */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '15px', color: '#1a1a2e', display: 'block', marginBottom: '12px' }}>What are you interested in? *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { value: 'partner-now', label: '🏫 I want to find a TEFL course now', desc: 'We\'ll connect you with a trusted TEFL provider in Thailand' },
                    { value: 'online-waitlist', label: '🔜 I want to join the waiting list for the Jobs in Thailand online TEFL course', desc: 'Be first to know when our own self-study course launches' },
                    { value: 'both', label: '✅ Both — I want to find a course now and be on the waiting list', desc: '' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setForm({ ...form, interest: opt.value })}
                      style={{ padding: '16px 20px', borderRadius: '12px', border: `2px solid ${form.interest === opt.value ? '#E85D26' : '#e5e7eb'}`, background: form.interest === opt.value ? '#fff4f0' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1a1a2e' }}>{opt.label}</div>
                      {opt.desc && <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>{opt.desc}</div>}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name *"
                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address *" type="email"
                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone / LINE / WhatsApp"
                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Where in Thailand are you?"
                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <select value={form.study_mode} onChange={e => setForm({ ...form, study_mode: e.target.value })}
                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none', color: form.study_mode ? '#333' : '#888' }}>
                    <option value="">Preferred study mode</option>
                    <option>Online self-study</option>
                    <option>In-person course</option>
                    <option>Either — I'm flexible</option>
                  </select>
                  <select value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                    style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', outline: 'none', color: form.start_date ? '#333' : '#888' }}>
                    <option value="">When do you want to start?</option>
                    <option>As soon as possible</option>
                    <option>Within 1 month</option>
                    <option>Within 3 months</option>
                    <option>Within 6 months</option>
                    <option>Just exploring for now</option>
                  </select>
                </div>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any questions or anything else we should know? (optional)" rows={3}
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                <button onClick={submit} disabled={sending}
                  style={{ background: sending ? '#ccc' : '#E85D26', color: 'white', padding: '16px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: sending ? 'not-allowed' : 'pointer' }}>
                  {sending ? 'Submitting...' : '🎓 Register My Interest'}
                </button>
                <p style={{ color: '#aaa', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                  Your details are kept private and never shared without your permission. No spam, ever.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 40px', textAlign: 'center' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: 'How long does a 120-hour TEFL course take?', a: 'Most people complete a 120-hour course in 4 to 8 weeks studying part-time. Some intensive courses can be completed in as little as 2 weeks.' },
              { q: 'How much does a TEFL course cost?', a: 'Costs vary by provider and course type. Online courses typically range from ฿5,000 to ฿15,000. In-person courses in Thailand range from ฿15,000 to ฿35,000. Our own online course pricing will be confirmed at launch.' },
              { q: 'Can NNES teachers get TEFL certified?', a: 'Absolutely. TEFL certification is open to anyone regardless of nationality. For NNES teachers in Thailand it is actually a requirement for your work permit, so completing it is essential.' },
              { q: 'Will a TEFL certificate help me get a teaching job in Thailand?', a: 'Yes — significantly. Most schools require TEFL certification and it is a standard requirement for an NNES teacher\'s work permit. Having TEFL also puts you ahead of candidates without it and generally means a higher starting salary.' },
              { q: 'Do I need a degree as well as TEFL?', a: 'Yes. Thai immigration requires both a bachelor\'s degree and a TEFL certificate to issue a Non-B visa and work permit for teaching. TEFL alone is not sufficient without a degree.' },
              { q: 'What is the difference between TEFL, TESOL and CELTA?', a: 'TEFL (Teaching English as a Foreign Language) and TESOL (Teaching English to Speakers of Other Languages) are broadly equivalent qualifications recognised across Asia. CELTA is a Cambridge University qualification that is more rigorous and more expensive. All three are accepted by Thai schools and immigration.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 10px' }}>❓ {item.q}</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.7' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: '80px 24px', background: '#1a1a2e', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 16px' }}>Ready to take the next step?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', margin: '0 0 32px', lineHeight: '1.7' }}>
            Register your interest today — free, no obligation, and we'll help you find the right TEFL course for your situation.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#register" style={{ background: '#E85D26', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
              Register Your Interest →
            </a>
            <Link href="/jobs/teaching" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '17px' }}>
              Browse Teaching Jobs
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
