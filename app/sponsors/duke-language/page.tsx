import Link from 'next/link'

export default function DukeLanguagePage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh', padding: '60px 24px', textAlign: 'center' }}>
      <img src="/sponsors/dukelanguage_school.png" alt="Duke Language School" style={{ width: '180px', marginBottom: '24px' }} />
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>
        Duke Language School
      </h1>
      <p style={{ maxWidth: '600px', margin: '0 auto 32px', color: '#555', fontSize: '16px', lineHeight: 1.7 }}>
        Duke Language School offers professional Thai language courses in Bangkok for expats and teachers living in Thailand — from complete beginners to advanced learners. Courses are available one-on-one, in groups, online, or as intensive programs.
      </p>
      <a href="https://dukelanguage.com/" target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', background: '#c9a84c', color: '#1a1a2e', padding: '14px 36px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
        Visit Duke Language School
      </a>
      <div style={{ marginTop: '40px' }}>
        <Link href="/jobs/teaching" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px' }}>← Back to Teaching Jobs</Link>
      </div>
    </main>
  )
}