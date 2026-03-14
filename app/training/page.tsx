import Link from 'next/link'

export default function TrainingPage() {
  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>

      <section style={{ background: '#1a1a2e', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>Training Courses in Thailand</h1>
        <p style={{ color: '#ccc', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Improve your skills with top TEFL courses and Thai language schools across Thailand
        </p>
      </section>

      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' }}>Choose a Category</h2>
        <p style={{ color: '#666', marginBottom: '48px', fontSize: '16px' }}>Select the type of training you are looking for</p>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>

          <Link href="/training/tefl" style={{ textDecoration: 'none', flex: 1, minWidth: '240px', maxWidth: '340px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '48px 32px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '2px solid #eee', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>TEFL Courses</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                Get certified to teach English in Thailand and around the world. Find accredited TEFL courses online and in-person.
              </p>
              <div style={{ background: '#E85D26', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', display: 'inline-block' }}>
                View TEFL Courses →
              </div>
            </div>
          </Link>

          <Link href="/training/thai-language" style={{ textDecoration: 'none', flex: 1, minWidth: '240px', maxWidth: '340px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '48px 32px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '2px solid #eee', cursor: 'pointer' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🇹🇭</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' }}>Thai Language Schools</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                Learn to speak, read and write Thai. Find language schools across Thailand for all levels from beginner to advanced.
              </p>
              <div style={{ background: '#2D6BE4', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', display: 'inline-block' }}>
                View Thai Schools →
              </div>
            </div>
          </Link>

        </div>
      </section>

      <section style={{ background: '#1a1a2e', padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>Want to List Your School or Course?</h2>
        <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '24px' }}>Reach thousands of expats and job seekers looking to train in Thailand</p>
        <Link href="/contact" style={{ background: '#E85D26', color: 'white', padding: '14px 40px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
          Get in Touch
        </Link>
      </section>

    </main>
  )
}

