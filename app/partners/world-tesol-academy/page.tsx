'use client'
import Link from 'next/link'
import TrackView, { trackClick } from '../../../components/TrackView'

export default function WorldTESOLAcademyPage() {
  return (
    <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <TrackView scope="banner-world-tesol" />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img src="/world-tesol-academy.png" alt="World TESOL Academy" style={{ width: '120px', height: '120px', objectFit: 'contain', background: 'white', borderRadius: '16px', padding: '12px', marginBottom: '24px' }} />
          <div style={{ display: 'inline-block', background: '#f59e0b', borderRadius: '20px', padding: '5px 16px', marginBottom: '16px' }}>
            <span style={{ color: '#1a1a2e', fontSize: '12px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase' }}>⭐ Recommended TEFL Provider</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '40px', fontWeight: '900', margin: '0 0 16px' }}>World TESOL Academy</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', margin: '0 0 12px' }}>Award-Winning & Accredited TESOL/TEFL Certification</p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: '0 0 32px' }}>Winners of Best TEFL Provider 2022 & 2023 · Dual Accredited · UK Registered</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://www.worldtesolacademy.com/?study=138946" target="_blank" rel="noopener noreferrer"
              onClick={() => trackClick('banner-world-tesol')}
              style={{ background: '#f59e0b', color: '#1a1a2e', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '17px' }}>
              Enroll Now — From $36 →
            </a>
            <Link href="/tefl" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '17px' }}>
              Learn About TEFL
            </Link>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '36px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f59e0b' }}>Available Courses</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { title: '120-Hour TESOL/TEFL Certificate', desc: 'The essential qualification to start teaching English in Thailand and around the world. Study online at your own pace.', price: 'From $36', badge: '⭐ Most Popular' },
              { title: 'Level 5 Diploma in TESOL', desc: 'A government-regulated, 200-hour CELTA-equivalent qualification for serious career advancement.', price: 'From $189', badge: '🏆 Advanced' },
              { title: '80-Hour TEOL Course', desc: 'Specialist training for teaching English online — find your own students and teach from home.', price: 'Ask for pricing', badge: '💻 Online Teaching' },
              { title: '70-Hour TEAL Course', desc: 'Specialist course for teaching English to adult students — expand your career options.', price: 'Ask for pricing', badge: '👔 Adults' },
              { title: '60-Hour TEYL Course', desc: 'Extra skills for teaching English to young learners — perfect for teachers in Thai schools.', price: 'Ask for pricing', badge: '👶 Young Learners' },
            ].map(course => (
              <div key={course.title} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', border: '1px solid #eee' }}>
                <div style={{ background: '#1a1a3e', color: '#f59e0b', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px' }}>{course.badge}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e', marginBottom: '8px' }}>{course.title}</div>
                <div style={{ color: '#666', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{course.desc}</div>
                <div style={{ color: '#f59e0b', fontWeight: '900', fontSize: '16px' }}>{course.price}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <a href="https://www.worldtesolacademy.com/?study=138946" target="_blank" rel="noopener noreferrer"
              onClick={() => trackClick('banner-world-tesol')}
              style={{ background: '#f59e0b', color: '#1a1a2e', padding: '14px 36px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '16px', display: 'inline-block' }}>
              View All Courses & Enroll →
            </a>
          </div>
        </div>

        {/* WHY WORLD TESOL */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '36px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1a1a2e', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #f59e0b' }}>Why Choose World TESOL Academy?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🏆', title: 'Award-Winning', desc: 'Winners of Best TEFL Provider 2022 & 2023' },
              { icon: '✅', title: 'Dual Accredited', desc: 'Accredited by ACCREDITAT & CPD Certification' },
              { icon: '🇬🇧', title: 'UK Registered', desc: 'Registered UK learning provider (UKPRN: 10087431)' },
              { icon: '👨‍🏫', title: 'Tutor Support', desc: 'Access to tutors throughout your course' },
              { icon: '⏱️', title: 'Study at Your Pace', desc: 'Complete in as little as 2-3 weeks online' },
              { icon: '🌍', title: 'Globally Recognised', desc: 'Accepted in Thailand, Asia and worldwide' },
            ].map(item => (
              <div key={item.title} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#1a1a2e', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ color: '#666', fontSize: '12px', lineHeight: '1.5' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a3e, #2d1b69)', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '900', margin: '0 0 12px' }}>Ready to get TEFL certified?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '0 0 24px' }}>Join thousands of teachers worldwide who have certified with World TESOL Academy</p>
          <a href="https://www.worldtesolacademy.com/?study=138946" target="_blank" rel="noopener noreferrer"
            onClick={() => trackClick('banner-world-tesol')}
            style={{ background: '#f59e0b', color: '#1a1a2e', padding: '16px 48px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '18px', display: 'inline-block' }}>
            Enroll Now — From $36 →
          </a>
          <div style={{ marginTop: '20px' }}>
            <Link href="/tefl" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'underline' }}>← Back to TEFL information</Link>
          </div>
        </div>

      </div>
    </main>
  )
}
