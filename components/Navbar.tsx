import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{ background: '#E85D26', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

      <Link href="/" style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', textDecoration: 'none' }}>
        Thailand Jobs
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <Link href="/jobs/teaching" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          🏫 Teaching Jobs
        </Link>
        <Link href="/jobs/other" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          💼 Other Jobs
        </Link>
        <Link href="/jobs" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          All Jobs
        </Link>
        <Link href="/training" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          🎓 Training
        </Link>
        <Link href="/cv-builder" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'white', fontWeight: 'bold' }}>
          📄 CV Builder
        </Link>
        <Link href="/advertise" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          📢 Advertise
        </Link>
        <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}>
          💬 Contact
        </Link>
        <Link href="/employers" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', border: '1px solid white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold' }}>
          Post a Job
        </Link>
        <span className="admin-desktop-only">
          <Link href="/admin" style={{ color: '#E85D26', textDecoration: 'none', fontSize: '14px', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: 'white' }}>
            🔐 Admin
          </Link>
        </span>
      </div>

    </nav>
  )
}