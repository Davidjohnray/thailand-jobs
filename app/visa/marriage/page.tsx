import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import MarriageVisaForm from './MarriageVisaForm'

// Update this whenever you re-check the information on the page
const LAST_CHECKED = 'October 2026'

export const metadata: Metadata = {
  title: 'Thai Marriage Visa for Teachers (Non-O) | Jobs in Thailand',
  description:
    'Married to a Thai national? How the Non-O marriage visa works for teachers in Thailand: work permits, changing schools, yearly extensions, 90-day reports, and free help with your application.',
  alternates: { canonical: 'https://www.jobsinthailand.net/visa/marriage' },
  openGraph: {
    title: 'Thai Marriage Visa for Teachers',
    description: 'Stay, work and change schools on your own visa. Free help for teachers married to a Thai national.',
    url: 'https://www.jobsinthailand.net/visa/marriage',
    type: 'website',
  },
}

const NAVY = '#1a1a2e'
const ORANGE = '#E85D26'

const card: CSSProperties = {
  background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px',
}
const h2: CSSProperties = { fontSize: '22px', fontWeight: 800, color: NAVY, margin: '0 0 14px' }
const p: CSSProperties = { color: '#444', fontSize: '15px', lineHeight: 1.75, margin: '0 0 12px' }

const BENEFITS = [
  { icon: '💼', title: 'You can work', text: 'A work permit can be issued on a marriage extension, so you can teach without needing a school to sponsor a Non-B visa.' },
  { icon: '🔄', title: 'Change schools more easily', text: 'Your right to stay comes from your marriage, not your job. Leaving a school doesn\'t mean losing your visa.' },
  { icon: '🏫', title: 'Easier to hire', text: 'Schools usually find it simpler to employ a teacher on a marriage visa, which can make you a stronger candidate.' },
  { icon: '📅', title: 'Renew every year', text: 'Once granted, the one-year extension can be renewed each year for as long as you stay married and meet the requirements.' },
]

const STEPS = [
  { title: 'Register your marriage', text: 'The marriage must be legally registered. A marriage registered abroad usually needs to be recognised in Thailand first.' },
  { title: 'Get a Non-Immigrant O visa', text: 'Apply at a Thai embassy, through Thailand\'s e-Visa website, or in some cases change your visa type at immigration without leaving the country.' },
  { title: 'Apply for the one-year extension', text: 'Near the end of your Non-O stay, apply at your local immigration office with your marriage documents and financial evidence.' },
  { title: 'Keep it valid', text: 'Report your address every 90 days, get a re-entry permit before travelling abroad, and renew the extension each year.' },
]

const DOCUMENTS = [
  'Passport and current visa or extension',
  'Thai marriage certificate (Kor Ror 2 and Kor Ror 3)',
  'Your spouse\'s Thai ID card and house registration',
  'Proof of finances (bank account and/or income), as required by your immigration office',
  'Photos of you and your spouse together, and of your home',
  'Map to your home and a completed application form',
]

const FAQS = [
  {
    q: 'Can I work as a teacher on a marriage visa?',
    a: 'Yes. A work permit can be issued while you hold a marriage-based extension. You still need the work permit itself before you start working.',
  },
  {
    q: 'What happens if I change schools?',
    a: 'Your visa stays valid because it is based on your marriage, not your employer. Only the work permit is tied to the job, so your new school arranges a new one.',
  },
  {
    q: 'Can I switch from a Non-B to a marriage visa without leaving Thailand?',
    a: 'Often yes, but it depends on your immigration office and your situation. Leave your details below and we\'ll help you check.',
  },
  {
    q: 'How much money do I need?',
    a: 'There is a financial requirement, met through money in a Thai bank account, monthly income, or a mix of both. The exact rules and paperwork vary between immigration offices, so we\'ll confirm what applies to you.',
  },
  {
    q: 'Does this apply to same-sex couples?',
    a: 'Yes. Since Thailand\'s Marriage Equality Act took effect in January 2025, same-sex spouses of Thai nationals have the same right to the marriage visa.',
  },
  {
    q: 'What if I leave Thailand on holiday?',
    a: 'Get a re-entry permit before you leave. Without one, your extension ends when you exit the country and you would have to start again.',
  },
  {
    q: 'What happens if we divorce?',
    a: 'The marriage is the basis for the extension, so it ends with the marriage. You would need to change to another visa type, such as a Non-B for work.',
  },
]

export default function MarriageVisaPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <main style={{ background: '#f9f9f9', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Hero */}
      <section style={{ background: NAVY, padding: '56px 24px 48px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(232,93,38,0.18)', color: ORANGE, fontSize: '13px', fontWeight: 700, padding: '5px 14px', borderRadius: '20px', marginBottom: '16px' }}>
            Visa help for teachers
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, lineHeight: 1.2, margin: '0 0 14px' }}>
            Married to a Thai national? Teach in Thailand on your own visa
          </h1>
          <p style={{ color: '#ccc', fontSize: '17px', lineHeight: 1.6, margin: '0 auto 26px', maxWidth: '640px' }}>
            The marriage visa (Non-O) lets you live and work in Thailand without depending on a school to sponsor you.
            Here's how it works, and how we can help you get it.
          </p>
          <a href="#get-help"
            style={{ background: ORANGE, color: 'white', padding: '15px 34px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '16px', display: 'inline-block' }}>
            Get free help →
          </a>
        </div>
      </section>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 16px 48px' }}>

        {/* Why it matters */}
        <section style={card}>
          <h2 style={h2}>Why it matters for teachers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {BENEFITS.map(b => (
              <div key={b.title} style={{ background: '#f7f7f9', borderRadius: '10px', padding: '18px' }}>
                <div style={{ fontSize: '26px', marginBottom: '6px' }}>{b.icon}</div>
                <div style={{ fontWeight: 800, color: NAVY, fontSize: '15px', marginBottom: '4px' }}>{b.title}</div>
                <div style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{b.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What it is */}
        <section style={card}>
          <h2 style={h2}>What is the "marriage visa"?</h2>
          <p style={p}>
            There's no visa officially called a marriage visa. It's a <strong>Non-Immigrant O visa</strong> based on marriage to a
            Thai national, followed by a <strong>one-year extension of stay</strong> granted by immigration. That extension is renewed every year.
          </p>
          <p style={{ ...p, margin: 0 }}>
            Since 2025 the initial Non-O visa can also be applied for online through Thailand's e-Visa system, and same-sex
            married couples have the same rights as any other couple.
          </p>
        </section>

        {/* Steps */}
        <section style={card}>
          <h2 style={h2}>How it works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STEPS.map((s, i) => (
              <div key={s.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', background: ORANGE, color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: NAVY, fontSize: '16px', marginBottom: '2px' }}>{s.title}</div>
                  <div style={{ color: '#555', fontSize: '15px', lineHeight: 1.6 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documents */}
        <section style={card}>
          <h2 style={h2}>Documents you'll usually need</h2>
          <ul style={{ margin: '0 0 12px', paddingLeft: '20px', color: '#444', fontSize: '15px', lineHeight: 1.9 }}>
            {DOCUMENTS.map(d => <li key={d}>{d}</li>)}
          </ul>
          <p style={{ ...p, margin: 0, fontSize: '14px', color: '#777' }}>
            Each immigration office has its own list and may ask for extra documents or translations. We'll help you check what yours needs.
          </p>
        </section>

        {/* Pitfalls */}
        <section style={{ ...card, background: '#fff8f3', border: '1px solid #f5d6c6' }}>
          <h2 style={h2}>Common mistakes to avoid</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#444', fontSize: '15px', lineHeight: 1.9 }}>
            <li>Leaving Thailand without a <strong>re-entry permit</strong>, which cancels your extension.</li>
            <li>Missing a <strong>90-day report</strong>, which can lead to a fine.</li>
            <li>Starting work before your <strong>work permit</strong> is issued.</li>
            <li>Applying too early or too late for the one-year extension.</li>
            <li>Moving money in or out of your account at the wrong time before applying.</li>
          </ul>
        </section>

        {/* Form */}
        <section id="get-help" style={{ ...card, border: `2px solid ${ORANGE}`, scrollMarginTop: '20px' }}>
          <h2 style={{ ...h2, marginBottom: '6px' }}>Get help with your marriage visa</h2>
          <p style={{ ...p, marginBottom: '20px' }}>
            Leave your details and our visa partner will contact you to talk through your situation. There's no obligation.
          </p>
          <MarriageVisaForm />
        </section>

        {/* FAQ */}
        <section style={card}>
          <h2 style={h2}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map(f => (
              <details key={f.q} style={{ background: '#f7f7f9', borderRadius: '10px', padding: '14px 16px' }}>
                <summary style={{ fontWeight: 700, color: NAVY, fontSize: '15px', cursor: 'pointer' }}>{f.q}</summary>
                <p style={{ ...p, margin: '10px 0 0' }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontWeight: 800, color: NAVY, fontSize: '16px' }}>Looking for a teaching job?</div>
            <div style={{ color: '#555', fontSize: '14px' }}>Browse the latest teaching jobs across Thailand.</div>
          </div>
          <Link href="/jobs" style={{ background: NAVY, color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            View jobs →
          </Link>
        </section>

        {/* Disclaimer */}
        <p style={{ fontSize: '12px', color: '#999', lineHeight: 1.6, textAlign: 'center', margin: '8px 0 0' }}>
          General information only, not legal advice. Thai immigration rules change and vary between offices, so always confirm
          your own situation with immigration or a qualified visa professional. Last checked: {LAST_CHECKED}.
        </p>
      </div>
    </main>
  )
}
