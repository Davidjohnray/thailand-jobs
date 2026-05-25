'use client'
import Link from 'next/link'

export default function ESLResourcesPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E85D26 100%)', padding: '70px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>📖</div>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 14px', letterSpacing: '-1px' }}>ESL Resources</h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '560px', margin: '0 auto 10px' }}>Ready-to-teach ESL resources for all ages</p>
        <p style={{ fontSize: '14px', opacity: 0.75, maxWidth: '480px', margin: '0 auto' }}>Designed for bilingual schools, private kindergartens, and ESL programs in Thailand</p>
      </div>

      {/* TWO MAIN SECTION BUTTONS */}
      <div style={{ background: '#1a1a2e', padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Choose a section</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

            {/* LESSON PLANS */}
            <Link href="#lesson-plans" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #7C3AED, #E85D26)', borderRadius: '20px', padding: '32px 28px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 8px 28px rgba(124,58,237,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>📋</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>Lesson Plans</h2>
                <p style={{ opacity: 0.85, fontSize: '14px', margin: '0 0 16px', lineHeight: '1.5' }}>Ready-to-teach plans for Pre-K through Secondary — print and teach, no prep needed.</p>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>Browse Lesson Plans →</div>
              </div>
            </Link>

            {/* READING COMPREHENSION */}
            <Link href="/esl-resources/reading-comprehension" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'linear-gradient(135deg, #0f3460, #0ea5e9)', borderRadius: '20px', padding: '32px 28px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 8px 28px rgba(14,165,233,0.3)', border: '2px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>🗞️</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>Reading Comprehension</h2>
                <p style={{ opacity: 0.85, fontSize: '14px', margin: '0 0 16px', lineHeight: '1.5' }}>Visual reading passages with discussion questions and vocabulary — perfect for 1-to-1 classes.</p>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' }}>Browse Lessons →</div>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* LESSON PLANS SECTION */}
      <div id="lesson-plans" style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '15px' }}>💰 Premium plans: 10฿ each</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 'bold' }}>✅ Free plans available in every subject</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '8px', textAlign: 'center' }}>Choose an Age Group</h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '36px', fontSize: '15px' }}>Select the age group you teach to browse lesson plans</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '56px' }}>

          <Link href="/esl-resources/under-5s" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,115,22,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🐣</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Under 5s</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>Ages 3-4 · Pre-K</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>Simple vocabulary, movement, and songs. No reading or writing.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Browse Plans →</span>
            </div>
          </Link>

          <Link href="/esl-resources/ages-5-6" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C3AED, #9f67f5)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🌟</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 5-6</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>K1-K2</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>Vocabulary, guided practice, and speaking activities.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Browse Plans →</span>
            </div>
          </Link>

          <Link href="/esl-resources/ages-7-10" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(8,145,178,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>📗</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 7-10</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>Primary School</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>English, Math, Science, and Social Studies.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Browse Plans →</span>
            </div>
          </Link>

          <Link href="/esl-resources/ages-11-plus" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #2D6BE4, #4f8ef7)', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,107,228,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>📘</div>
              <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px' }}>Ages 11+</h3>
              <p style={{ opacity: 0.9, fontSize: '14px', margin: '0 0 16px' }}>Secondary School</p>
              <p style={{ opacity: 0.8, fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>English, Math, Science, and Social Studies.</p>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '8px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>Browse Plans →</span>
            </div>
          </Link>

        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '36px 40px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {[
            { icon: '🎯', title: 'All Ages', desc: 'Pre-K through to secondary school, with new plans added regularly.' },
            { icon: '⏱️', title: '30-50 Min', desc: 'Structured stages: routine, vocabulary, activity, practice, review.' },
            { icon: '🏫', title: 'School Ready', desc: 'Used by bilingual schools and private kindergartens across Thailand.' },
            { icon: '✅', title: 'No Prep', desc: 'Print and teach. Flashcards, worksheets, and teacher notes included.' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px', fontSize: '15px' }}>{item.title}</h3>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
