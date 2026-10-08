import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import MarriageVisaForm from './MarriageVisaForm'

// Update this whenever you re-check the information on the page
const LAST_CHECKED = 'October 2026'

export const metadata: Metadata = {
  title: 'Fast-Track Marriage in Thailand & Marriage Visa Help | Jobs in Thailand',
  description:
    'Getting married in Thailand? Fast-track marriage registration and MFA document legalisation in Bangkok, usually in around a week, for foreigners marrying a Thai or any nationality. Plus help with the Non-O marriage visa for teachers.',
  alternates: { canonical: 'https://www.jobsinthailand.net/visa/marriage' },
  openGraph: {
    title: 'Fast-Track Marriage in Thailand & Marriage Visa Help',
    description: 'Marriage registration and MFA documents in Bangkok, usually in around a week. Foreigner to Thai or any nationality.',
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

const SERVICES = [
  {
    icon: '💍',
    title: 'Fast-track marriage in Thailand',
    who: 'Foreigner marrying a Thai national, or two foreigners of any nationality',
    points: [
      'Embassy, translation and MFA legalisation paperwork handled for you',
      'Marriage registered at the district office (amphur)',
      'Usually completed in around one week in Bangkok',
    ],
  },
  {
    icon: '🛂',
    title: 'Marriage visa (Non-O)',
    who: 'Foreigners married to a Thai national',
    points: [
      'Non-O visa and one-year extension based on marriage',
      'Live and work in Thailand without a school sponsoring your visa',
      'Help with documents, finances and yearly renewals',
    ],
  },
]

const MARRIAGE_STEPS = [
  { title: 'Embassy document', text: 'Each foreign partner gets a document from their embassy confirming they are free to marry (often called an affirmation of freedom to marry).' },
  { title: 'Translation and MFA legalisation', text: 'The documents are translated into Thai and legalised at the Ministry of Foreign Affairs (Department of Consular Affairs) in Bangkok.' },
  { title: 'Register the marriage', text: 'You both attend the district office (amphur) to register the marriage and receive your Thai marriage certificate.' },
  { title: 'Use it for your visa', text: 'If your spouse is Thai, the marriage certificate is the basis for your marriage visa (see below).' },
]

const BENEFITS = [
  { icon: '💼', title: 'You can work', text: 'A work permit can be issued on a marriage extension, so you can teach without needing a school to sponsor a Non-B visa.' },
  { icon: '🔄', title: 'Change schools more easily', text: 'Your right to stay comes from your marriage, not your job. Leaving a school doesn\'t mean losing your visa.' },
  { icon: '🏫', title: 'Easier to hire', text: 'Schools usually find it simpler to employ a teacher on a marriage visa, which can make you a stronger candidate.' },
  { icon: '📅', title: 'Renew every year', text: 'Once granted, the one-year extension can be renewed each year for as long as you stay married and meet the requirements.' },
]

const VISA_STEPS = [
  { title: 'Register your marriage', text: 'The marriage must be legally registered in Thailand. A marriage registered abroad usually needs to be recognised here first.' },
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
    q: 'Can two foreigners get married in Thailand?',
    a: 'Yes. Foreigners of any nationality can register their marriage in Thailand. Each partner needs documents from their own embassy, which are translated and legalised before the marriage is registered at a district office.',
  },
  {
    q: 'How long does it take to get married in Thailand?',
    a: 'With the paperwork handled for you, the marriage and MFA documents can usually be completed in around one week in Bangkok. Timing depends on your embassy and the documents you already have.',
  },
  {
    q: 'If I marry another foreigner, can I get a marriage visa?',
    a: 'No. The Thai marriage visa is only for spouses of Thai nationals. If your foreign spouse holds a work visa, you may be able to get a dependent visa based on theirs instead. Ask us and we\'ll check your options.',
  },
  {
    q: 'Can I work as a teacher on a marriage visa?',
    a: 'Yes. A work permit can be issued while you hold a marriage-based extension. You still need the work permit itself before you start working.',
  },
  {
    q: 'What happens if I change schools?',
    a: 'Your visa stays valid because it is based on your marriage, not your employer. Only the work permit is tied to the job, so your new school arranges a new one.',
  },
  {
    q: 'How much money do I need for the marriage visa?',
    a: 'There is a financial requirement, met through money in a Thai bank account, monthly income, or a mix of both. The exact rules and paperwork vary between immigration offices, so we\'ll confirm what applies to you.',
  },
  {
    q: 'Does this apply to same-sex couples?',
    a: 'Yes. Since Thailand\'s Marriage Equality Act took effect in January 2025, same-sex couples can register their marriage, and same-sex spouses of Thai nationals have the same right to the marriage visa.',
  },
  {
    q: 'What if I leave Thailand on holiday?',
    a: 'Get a re-entry permit before you leave. Without one, your marriage extension ends when you exit the country and you would have to start again.',
  },
]

function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {steps.map((s, i) => (
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
  )
}

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
            Marriage &amp; visa help
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, lineHeight: 1.2, margin: '0 0 14px' }}>
            Getting married in Thailand? We'll fast-track it
          </h1>
          <p style={{ color: '#ccc', fontSize: '17px', lineHeight: 1.6, margin: '0 auto 10px', maxWidth: '660px' }}>
            Marriage registration and MFA documents in Bangkok, usually in around one week.
            For foreigners marrying a Thai national <strong style={{ color: 'white' }}>or a partner of any nationality</strong>.
          </p>
          <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.6, margin: '0 auto 26px', maxWidth: '620px' }}>
            Married to a Thai? We also help with the marriage visa, so you can live and teach on your own visa.
          </p>
          <a href="#get-help"
            style={{ background: ORANGE, color: 'white', padding: '15px 34px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '16px', display: 'inline-block' }}>
            Get free advice →
          </a>
        </div>
      </section>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 16px 48px' }}>

        {/* Services */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {SERVICES.map(s => (
            <div key={s.title} style={{ ...card, marginBottom: 0, borderTop: `4px solid ${ORANGE}` }}>
              <div style={{ fontSize: '30px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontWeight: 900, color: NAVY, fontSize: '19px', marginBottom: '4px' }}>{s.title}</div>
              <div style={{ color: ORANGE, fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>{s.who}</div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#444', fontSize: '14px', lineHeight: 1.8 }}>
                {s.points.map(pt => <li key={pt}>{pt}</li>)}
              </ul>
            </div>
          ))}
        </section>

        {/* Getting married */}
        <section style={card}>
          <h2 style={h2}>Getting married in Thailand</h2>
          <p style={p}>
            Foreigners can legally marry in Thailand, whether your partner is Thai or another nationality. The hard part is the
            paperwork: embassy documents, Thai translations and legalisation at the Ministry of Foreign Affairs. Done yourself, it can
            take several trips to Bangkok. Our partner has the contacts to get it done quickly, usually in around one week.
          </p>
          <Steps steps={MARRIAGE_STEPS} />
        </section>

        {/* Why the visa matters */}
        <section style={card}>
          <h2 style={h2}>Married to a Thai? Why the marriage visa matters for teachers</h2>
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
            It's only available to spouses of Thai nationals. Since 2025 the initial Non-O visa can also be applied for online through
            Thailand's e-Visa system, and same-sex married couples have the same rights as any other couple.
          </p>
        </section>

        {/* Visa steps */}
        <section style={card}>
          <h2 style={h2}>How the marriage visa works</h2>
          <Steps steps={VISA_STEPS} />
        </section>

        {/* Documents */}
        <section style={card}>
          <h2 style={h2}>Documents you'll usually need for the visa</h2>
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
          <h2 style={{ ...h2, marginBottom: '6px' }}>Get free advice</h2>
          <p style={{ ...p, marginBottom: '20px' }}>
            Tell us whether you're getting married, need the visa, or both. Our partner will contact you to talk through your situation.
            There's no obligation.
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
          General information only, not legal advice. Thai marriage and immigration rules change and vary between offices, and
          timings depend on your embassy and documents. Always confirm your own situation with a qualified professional. Last checked: {LAST_CHECKED}.
        </p>
      </div>
    </main>
  )
}
