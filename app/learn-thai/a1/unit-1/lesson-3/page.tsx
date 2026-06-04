'use client'
import { useState } from 'react'
import Link from 'next/link'

const LOW_CLASS = [
  { char: 'ค', name: 'Kho Khwai', meaning: 'Buffalo', roman: 'kh', example: { thai: 'ควาย', roman: 'khwaai', english: 'buffalo' }, note: 'Sounds like ข — aspirated "k" with a puff of air. But it\'s low class, so it produces different tones. Very common letter.', mnemonic: 'ค is the low class brother of ข — same sound, different tone rules. The buffalo (ควาย) is a symbol of hard-working Thai farmers.' },
  { char: 'ฅ', name: 'Kho Khon', meaning: 'Person', roman: 'kh', example: { thai: 'คน', roman: 'khon', english: 'person' }, note: 'Obsolete letter — almost never used in modern Thai. Same sound as ค. You may see it occasionally in old texts.', mnemonic: 'ฅ is the rare twin of ค — just recognise it. The word คน (person) is actually spelled with ค in modern Thai.' },
  { char: 'ฆ', name: 'Kho Rakhang', meaning: 'Bell', roman: 'kh', example: { thai: 'ระฆัง', roman: 'rakhang', english: 'bell' }, note: 'Same sound as ค and ฅ. Rare in modern Thai — mainly in words borrowed from Sanskrit and Pali.', mnemonic: 'ฆ is another rare "kh" letter. The bell (ระฆัง) rings high — but this letter is low class.' },
  { char: 'ง', name: 'Ngo Ngu', meaning: 'Snake', roman: 'ng', example: { thai: 'งู', roman: 'nguu', english: 'snake' }, note: 'Sounds like the "ng" in "sing" — but it can appear at the START of a syllable too, which feels unusual for English speakers. Very common letter.', mnemonic: 'ง looks like a coiled snake (งู nguu) — the curved body with a raised head. Practice saying "ng" at the start of a word.' },
  { char: 'ช', name: 'Cho Chang', meaning: 'Elephant', roman: 'ch', example: { thai: 'ช้าง', roman: 'chaang', english: 'elephant' }, note: 'Sounds like ฉ — "ch" as in "cheese". Low class version. Very common in everyday Thai words.', mnemonic: 'ช is the low class elephant (ช้าง chaang) — a beloved Thai symbol. Think of the big curved trunk in the shape of the letter.' },
  { char: 'ซ', name: 'So So', meaning: 'Chain', roman: 's', example: { thai: 'โซ่', roman: 'soo', english: 'chain' }, note: 'Sounds like "s" — the low class version. Less common than ส in everyday words but important to recognise.', mnemonic: 'ซ is the low class "s" — the chain (โซ่) links it to the other "s" letters ส and ศ.' },
  { char: 'ฌ', name: 'Cho Choe', meaning: 'Cashew Tree', roman: 'ch', example: { thai: 'เฌอ', roman: 'choe', english: 'cashew tree' }, note: 'Rare letter — same "ch" sound as ช. Found mainly in words from Sanskrit and Pali. Uncommon in everyday Thai.', mnemonic: 'ฌ is the rare third "ch" letter — after ฉ (high) and ช (low). Just recognise it when you see it.' },
  { char: 'ญ', name: 'Yo Ying', meaning: 'Woman', roman: 'y', example: { thai: 'หญิง', roman: 'ying', english: 'woman/female' }, note: 'Sounds like "y" in "yes". Notice in the example — หญิง — the ห before it is silent and just raises the tone. Common in Thai.', mnemonic: 'ญ is the "y" of woman (หญิง ying). The ห at the start is a tone raiser, not a separate sound.' },
  { char: 'ณ', name: 'No Nen', meaning: 'Novice Monk', roman: 'n', example: { thai: 'เณร', roman: 'nen', english: 'novice monk' }, note: 'Sounds like "n" — same as น. Rarer and used mainly in words from Sanskrit and Pali, especially names and formal vocabulary.', mnemonic: 'ณ is the formal "n" — the novice monk (เณร) represents its more scholarly, formal character.' },
  { char: 'น', name: 'No Nu', meaning: 'Mouse', roman: 'n', example: { thai: 'หนู', roman: 'nuu', english: 'mouse/rat' }, note: 'Sounds like "n" in "no". One of the most common consonants in Thai — appears frequently at the start AND end of syllables.', mnemonic: 'น is the everyday "n" — the mouse (หนู nuu) is small but everywhere, just like this letter in Thai words.' },
  { char: 'พ', name: 'Pho Phan', meaning: 'Tray', roman: 'ph', example: { thai: 'พาน', roman: 'phaan', english: 'pedestal tray' }, note: 'Sounds like "p" with a puff of air — aspirated "p". The low class version of ผ. Very common in Thai — พ is used far more than ผ.', mnemonic: 'พ is the common aspirated "p" — used in พ่อ (father), พระ (monk), and hundreds of everyday words.' },
  { char: 'ฟ', name: 'Fo Fan', meaning: 'Teeth', roman: 'f', example: { thai: 'ฟัน', roman: 'fan', english: 'teeth' }, note: 'Sounds like "f" in "fan". The low class version of ฝ. More common than ฝ in everyday Thai vocabulary.', mnemonic: 'ฟ is the low class "f" — teeth (ฟัน fan) are something you use every day, just like this letter.' },
  { char: 'ภ', name: 'Pho Sampao', meaning: 'Sailboat', roman: 'ph', example: { thai: 'เรือสำเภา', roman: 'ruea sampao', english: 'sailboat' }, note: 'Same sound as พ — aspirated "p". Less common in everyday words but important in many formal and borrowed terms.', mnemonic: 'ภ is the third aspirated "p" after ผ and พ — the sailboat sails the same waters as the others.' },
  { char: 'ม', name: 'Mo Ma', meaning: 'Horse', roman: 'm', example: { thai: 'ม้า', roman: 'maa', english: 'horse' }, note: 'Sounds like "m" in "man". Extremely common letter — appears at the start and end of syllables all the time.', mnemonic: 'ม is the horse (ม้า maa) — strong, reliable, and found everywhere in Thai text.' },
  { char: 'ย', name: 'Yo Yak', meaning: 'Giant', roman: 'y', example: { thai: 'ยักษ์', roman: 'yak', english: 'giant/demon' }, note: 'Sounds like "y" in "yes". Also functions as a vowel component in some vowel combinations. Very common letter.', mnemonic: 'ย is the giant (ยักษ์ yak) — you\'ll see this letter everywhere. It\'s also used in the vowel combinations เย, ยา, and others.' },
  { char: 'ร', name: 'Ro Ruea', meaning: 'Boat', roman: 'r', example: { thai: 'เรือ', roman: 'ruea', english: 'boat' }, note: 'Sounds like a soft "r" — slightly rolled, closer to the Spanish "r" than the English one. Also used as a short vowel in some words.', mnemonic: 'ร is the boat (เรือ ruea) — the rolling "r" moves like a boat on water. One of the most recognisable Thai letters.' },
  { char: 'ล', name: 'Lo Ling', meaning: 'Monkey', roman: 'l', example: { thai: 'ลิง', roman: 'ling', english: 'monkey' }, note: 'Sounds like "l" in "lion". Common at both the start and end of syllables. Sometimes confused with ร (r) by beginners.', mnemonic: 'ล is the monkey (ลิง ling) — agile and common. Look at the shape — the tail curls differently from ร.' },
  { char: 'ว', name: 'Wo Waen', meaning: 'Ring', roman: 'w/v', example: { thai: 'แหวน', roman: 'waen', english: 'ring' }, note: 'Sounds like "w" in "water". Also used as part of vowel combinations and as a final consonant. Very versatile letter.', mnemonic: 'ว is the ring (แหวน waen) — circular and useful in many different positions in a word.' },
  { char: 'ฬ', name: 'Lo Chula', meaning: 'Kite', roman: 'l', example: { thai: 'จุฬา', roman: 'chulaa', english: 'kite (also Chulalongkorn)' }, note: 'Rare letter — same sound as ล. Found in very few words. You\'ll mainly see it in จุฬาลงกรณ์ (Chulalongkorn University).', mnemonic: 'ฬ is the rare kite letter — you\'ll mostly see it in Chulalongkorn University\'s name.' },
  { char: 'ฮ', name: 'Ho Nok Huk', meaning: 'Owl', roman: 'h', example: { thai: 'นกฮูก', roman: 'nok huuk', english: 'owl' }, note: 'Sounds like "h" — the low class version of ห. Uncommon in everyday Thai. Used in some foreign loanwords.', mnemonic: 'ฮ is the low class owl (นกฮูก nok huuk) — wise but rarely seen, just like this letter.' },
  { char: 'ธ', name: 'Tho Thahan', meaning: 'Soldier', roman: 'th', example: { thai: 'ทหาร', roman: 'thahaan', english: 'soldier' }, note: 'Aspirated "t" sound — same as ถ and ฐ. Low class version. Common in formal and borrowed words.', mnemonic: 'ธ is the soldier (ทหาร thahaan) — standing tall and formal.' },
  { char: 'ท', name: 'Tho Thahan', meaning: 'Soldier', roman: 'th', example: { thai: 'ทหาร', roman: 'thahaan', english: 'soldier' }, note: 'The most common aspirated "t" letter. You\'ll see ท far more than ธ in everyday Thai words.', mnemonic: 'ท is the everyday aspirated "t" — far more common than ธ. Used in ทำ (to do), ที่ (place), ทาง (way) and countless others.' },
  { char: 'ก', name: 'note', meaning: '', roman: '', example: { thai: '', roman: '', english: '' }, note: '', mnemonic: '' }, // placeholder - will be replaced
  { char: 'ฑ', name: 'Tho Montho', meaning: 'Mythical Woman', roman: 'th', example: { thai: 'นางมณโฑ', roman: 'naang monthoo', english: 'Montho (mythical figure)' }, note: 'Rare aspirated "t" — found mainly in Sanskrit loanwords and proper names. Same sound as ท and ธ.', mnemonic: 'ฑ is the rare ceremonial "th" — you\'ll mostly see it in classical literature and formal names.' },
]

// Remove placeholder and use actual 24 low class consonants
const LOW_CLASS_FINAL = [
  { char: 'ค', name: 'Kho Khwai', meaning: 'Buffalo', roman: 'kh', example: { thai: 'ควาย', roman: 'khwaai', english: 'buffalo' }, note: 'Sounds like ข — aspirated "k". Low class, so produces different tones. Very common.', mnemonic: 'ค is the low class brother of ข — same sound, different tone rules.' },
  { char: 'ฅ', name: 'Kho Khon', meaning: 'Person', roman: 'kh', example: { thai: 'คน', roman: 'khon', english: 'person' }, note: 'Obsolete — almost never used. Same sound as ค.', mnemonic: 'ฅ is the rare twin of ค — just recognise it.' },
  { char: 'ฆ', name: 'Kho Rakhang', meaning: 'Bell', roman: 'kh', example: { thai: 'ระฆัง', roman: 'rakhang', english: 'bell' }, note: 'Rare — mainly in Sanskrit/Pali words. Same sound as ค.', mnemonic: 'ฆ rings like a bell — but rarely appears in modern Thai.' },
  { char: 'ง', name: 'Ngo Ngu', meaning: 'Snake', roman: 'ng', example: { thai: 'งู', roman: 'nguu', english: 'snake' }, note: 'Like "ng" in "sing" — but can appear at the START of a syllable too.', mnemonic: 'ง looks like a coiled snake. Practice saying "ng" at the beginning of a word.' },
  { char: 'ช', name: 'Cho Chang', meaning: 'Elephant', roman: 'ch', example: { thai: 'ช้าง', roman: 'chaang', english: 'elephant' }, note: '"ch" as in "cheese". Low class. Very common in everyday Thai.', mnemonic: 'ช is the elephant — a beloved Thai symbol. Notice the curved trunk shape.' },
  { char: 'ซ', name: 'So So', meaning: 'Chain', roman: 's', example: { thai: 'โซ่', roman: 'soo', english: 'chain' }, note: '"s" sound — the low class version. Less common than ส.', mnemonic: 'ซ is the low class "s" — the chain links it to the other s-letters.' },
  { char: 'ฌ', name: 'Cho Choe', meaning: 'Cashew Tree', roman: 'ch', example: { thai: 'เฌอ', roman: 'choe', english: 'cashew tree' }, note: 'Rare — same "ch" as ช. Found mainly in Sanskrit words.', mnemonic: 'ฌ is the rare third "ch" letter — just recognise it when you see it.' },
  { char: 'ญ', name: 'Yo Ying', meaning: 'Woman', roman: 'y', example: { thai: 'หญิง', roman: 'ying', english: 'woman' }, note: '"y" sound. The ห in หญิง is silent — it only raises the tone.', mnemonic: 'ญ is the "y" of woman (หญิง). The silent ห is a tone raiser.' },
  { char: 'ณ', name: 'No Nen', meaning: 'Novice Monk', roman: 'n', example: { thai: 'เณร', roman: 'nen', english: 'novice monk' }, note: 'Same as น — "n" sound. Used mainly in Sanskrit/Pali words and formal vocabulary.', mnemonic: 'ณ is the formal "n" — scholarly and used in classical texts.' },
  { char: 'น', name: 'No Nu', meaning: 'Mouse', roman: 'n', example: { thai: 'หนู', roman: 'nuu', english: 'mouse' }, note: '"n" as in "no". One of the most common consonants in Thai.', mnemonic: 'น is the everyday "n" — the mouse is small but everywhere, just like this letter.' },
  { char: 'พ', name: 'Pho Phan', meaning: 'Tray', roman: 'ph', example: { thai: 'พาน', roman: 'phaan', english: 'tray' }, note: 'Aspirated "p" — puff of air. Low class. Much more common than ผ in everyday use.', mnemonic: 'พ is the common aspirated "p" — พ่อ (father), พระ (monk), hundreds of everyday words.' },
  { char: 'ฟ', name: 'Fo Fan', meaning: 'Teeth', roman: 'f', example: { thai: 'ฟัน', roman: 'fan', english: 'teeth' }, note: '"f" sound. Low class version of ฝ. More common than ฝ in everyday vocabulary.', mnemonic: 'ฟ is the low class "f" — teeth (ฟัน) are used every day, just like this letter.' },
  { char: 'ภ', name: 'Pho Sampao', meaning: 'Sailboat', roman: 'ph', example: { thai: 'เรือสำเภา', roman: 'sampao', english: 'sailboat' }, note: 'Same sound as พ — aspirated "p". Used in more formal and borrowed vocabulary.', mnemonic: 'ภ is the third aspirated "p" — sailing alongside ผ and พ.' },
  { char: 'ม', name: 'Mo Ma', meaning: 'Horse', roman: 'm', example: { thai: 'ม้า', roman: 'maa', english: 'horse' }, note: '"m" sound. Extremely common — at start and end of syllables constantly.', mnemonic: 'ม is the horse — strong, reliable, and found everywhere in Thai text.' },
  { char: 'ย', name: 'Yo Yak', meaning: 'Giant', roman: 'y', example: { thai: 'ยักษ์', roman: 'yak', english: 'giant' }, note: '"y" as in "yes". Also used as a vowel component. Very common.', mnemonic: 'ย is the giant — you\'ll see this letter everywhere in Thai.' },
  { char: 'ร', name: 'Ro Ruea', meaning: 'Boat', roman: 'r', example: { thai: 'เรือ', roman: 'ruea', english: 'boat' }, note: 'Soft rolled "r" — closer to Spanish than English. Very common and recognisable.', mnemonic: 'ร is the boat — the rolling "r" moves like a boat on water.' },
  { char: 'ล', name: 'Lo Ling', meaning: 'Monkey', roman: 'l', example: { thai: 'ลิง', roman: 'ling', english: 'monkey' }, note: '"l" sound. Common at start and end of syllables. Don\'t confuse with ร.', mnemonic: 'ล is the monkey — agile and common. The tail curls differently from ร.' },
  { char: 'ว', name: 'Wo Waen', meaning: 'Ring', roman: 'w', example: { thai: 'แหวน', roman: 'waen', english: 'ring' }, note: '"w" sound. Also used in vowel combinations and as a final consonant.', mnemonic: 'ว is the ring — circular and versatile in many positions in a word.' },
  { char: 'ฬ', name: 'Lo Chula', meaning: 'Kite', roman: 'l', example: { thai: 'จุฬา', roman: 'chulaa', english: 'kite' }, note: 'Rare — same as ล. Mainly seen in จุฬาลงกรณ์ (Chulalongkorn University).', mnemonic: 'ฬ is the rare kite letter — you\'ll mostly see it in Chulalongkorn University\'s name.' },
  { char: 'ฮ', name: 'Ho Nok Huk', meaning: 'Owl', roman: 'h', example: { thai: 'นกฮูก', roman: 'nok huuk', english: 'owl' }, note: '"h" sound — low class version of ห. Uncommon in everyday Thai.', mnemonic: 'ฮ is the low class owl — wise but rarely seen, just like this letter.' },
  { char: 'ท', name: 'Tho Thahan', meaning: 'Soldier', roman: 'th', example: { thai: 'ทหาร', roman: 'thahaan', english: 'soldier' }, note: 'Aspirated "t". The most common of the three "th" letters in everyday vocabulary.', mnemonic: 'ท is the everyday aspirated "t" — ทำ (do), ที่ (place), ทาง (way).' },
  { char: 'ธ', name: 'Tho Thong', meaning: 'Flag', roman: 'th', example: { thai: 'ธง', roman: 'thong', english: 'flag' }, note: 'Same aspirated "t" as ท. More formal/literary usage.', mnemonic: 'ธ is the formal "th" — used in more scholarly vocabulary.' },
  { char: 'ฑ', name: 'Tho Montho', meaning: 'Mythical Figure', roman: 'th', example: { thai: 'นางมณโฑ', roman: 'monthoo', english: 'Montho (classical)' }, note: 'Rare aspirated "t". Mainly in Sanskrit loanwords and classical texts.', mnemonic: 'ฑ is the rare ceremonial "th" — classical literature and formal names only.' },
  { char: 'ฒ', name: 'Tho Phu Thao', meaning: 'Elder', roman: 'th', example: { thai: 'ผู้เฒ่า', roman: 'phuu thao', english: 'elderly person' }, note: 'Another rare aspirated "t". Very uncommon in modern Thai.', mnemonic: 'ฒ is the elder — rare and distinguished, like the word it represents.' },
]

function speak(text: string, rate = 0.7) {
  if (typeof window === 'undefined') return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'; u.rate = rate; u.pitch = 1.05
  window.speechSynthesis.speak(u)
}

function shuffleFour(correct: string, others: string[]): string[] {
  const picks = others.sort(() => Math.random() - 0.5).slice(0, 3)
  return [correct, ...picks].sort(() => Math.random() - 0.5)
}

const QUIZ_Q = LOW_CLASS_FINAL.slice(0, 8).map(c => ({
  correct: c.char, name: c.name, roman: c.roman,
  options: shuffleFour(c.char, LOW_CLASS_FINAL.map(x => x.char).filter(x => x !== c.char)),
}))

export default function Unit1Lesson3() {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'complete'>('learn')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizQ] = useState(QUIZ_Q)

  const card = LOW_CLASS_FINAL[cardIndex]
  const pct = Math.round((correct / quizQ.length) * 100)

  const handleAnswer = (ans: string) => {
    if (selected) return
    setSelected(ans)
    const isCorrect = ans === quizQ[quizIndex].correct
    if (isCorrect) setCorrect(prev => prev + 1)
    setAnswers(prev => [...prev, isCorrect])
    speak(quizQ[quizIndex].correct)
  }

  const nextQ = () => {
    if (quizIndex + 1 >= quizQ.length) { setPhase('complete'); return }
    setQuizIndex(prev => prev + 1); setSelected(null)
  }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #1c1917, #c2410c)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/learn-thai/a1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px' }}>← A1 Overview</Link>
        <div style={{ color: 'white', fontWeight: '900', fontSize: '17px', flex: 1 }}>Unit 1 · Lesson 3 — Low Class Consonants</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { setPhase('learn'); setCardIndex(0) }} style={{ background: phase === 'learn' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>📖 Learn</button>
          <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }} style={{ background: phase === 'quiz' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>🧠 Quiz</button>
        </div>
      </div>

      {phase === 'learn' && (
        <div style={{ background: 'rgba(194,65,12,0.06)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(194,65,12,0.1)' }}>
          <span style={{ color: '#c2410c', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>{cardIndex + 1} / {LOW_CLASS_FINAL.length}</span>
          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: '#ea580c', borderRadius: '10px', width: `${((cardIndex + 1) / LOW_CLASS_FINAL.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <span style={{ color: '#c2410c', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>Low Class Consonants</span>
        </div>
      )}

      {phase === 'learn' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>
          {cardIndex === 0 && (
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderLeft: '5px solid #ea580c' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px' }}>🔤 About Low Class Consonants</h2>
              <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px' }}>
                There are <strong>24 low class consonants</strong> — the largest group. Many are low class pairs of high class consonants, with the same sound but different tone behaviour. Low class consonants with no tone mark produce a <strong>mid tone</strong> in live syllables. Several are rare or obsolete, so don't worry about memorising every detail — focus on recognising them.
              </p>
              <div style={{ background: '#fff7ed', borderRadius: '10px', padding: '12px 16px', border: '1px solid #fed7aa' }}>
                <div style={{ color: '#c2410c', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>💡 Don't be overwhelmed</div>
                <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>Several of these letters are obsolete or extremely rare (ฅ, ฆ, ฌ, ฑ, ฒ, ฬ, ฮ). Focus your energy on the common ones: ค ง ช น พ ฟ ม ย ร ล ว ท.</div>
              </div>
            </div>
          )}

          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1c1917, #c2410c)', padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ background: '#ea580c', color: 'white', fontSize: '11px', fontWeight: '800', padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Low Class</span>
              </div>
              <div style={{ fontSize: '120px', fontWeight: '900', color: 'white', lineHeight: 1, marginBottom: '8px', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{card.char}</div>
              <button onClick={() => speak(card.char)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>🔊 Hear it</button>
            </div>
            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Name</div>
                  <div style={{ color: '#1a1a2e', fontWeight: '900', fontSize: '18px' }}>{card.name}</div>
                  <div style={{ color: '#9ca3af', fontSize: '13px' }}>{card.meaning}</div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Sound</div>
                  <div style={{ color: '#1a1a2e', fontWeight: '900', fontSize: '18px', fontFamily: 'monospace' }}>{card.roman}</div>
                </div>
              </div>
              {card.example.thai && (
                <div style={{ background: '#fff7ed', borderRadius: '14px', padding: '18px 20px', marginBottom: '16px', border: '2px solid #fed7aa' }}>
                  <div style={{ color: '#c2410c', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Example Word</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '44px', fontWeight: '900', color: '#c2410c', lineHeight: 1 }}>{card.example.thai}</div>
                    <div>
                      <div style={{ color: '#374151', fontWeight: '700', fontSize: '16px' }}>{card.example.roman}</div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>{card.example.english}</div>
                    </div>
                    <button onClick={() => speak(card.example.thai)} style={{ marginLeft: 'auto', background: '#ea580c', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>🔊 Hear</button>
                  </div>
                </div>
              )}
              <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', border: '1px solid #fde68a' }}>
                <div style={{ color: '#92400e', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>📝 Note</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.note}</p>
              </div>
              <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '14px 16px', border: '1px solid #ede9fe' }}>
                <div style={{ color: '#6d28d9', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💡 Memory Tip</div>
                <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{card.mnemonic}</p>
              </div>
            </div>
          </div>

          {/* Grid of all 24 */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>All 24 Low Class Consonants</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {LOW_CLASS_FINAL.map((c, i) => (
                <button key={c.char + i} onClick={() => { setCardIndex(i); speak(c.char) }}
                  style={{ background: i === cardIndex ? '#c2410c' : '#f9fafb', color: i === cardIndex ? 'white' : '#1a1a2e', border: `2px solid ${i === cardIndex ? '#c2410c' : '#e5e7eb'}`, borderRadius: '10px', padding: '10px 14px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.15s', minWidth: '52px', textAlign: 'center' }}>
                  {c.char}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {cardIndex > 0 && <button onClick={() => setCardIndex(prev => prev - 1)} style={{ background: 'white', color: '#374151', border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>← Previous</button>}
            {cardIndex + 1 < LOW_CLASS_FINAL.length ? (
              <button onClick={() => { setCardIndex(prev => prev + 1); speak(LOW_CLASS_FINAL[cardIndex + 1].char) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #c2410c, #ea580c)', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                Next ({LOW_CLASS_FINAL[cardIndex + 1].char}) →
              </button>
            ) : (
              <button onClick={() => { setPhase('quiz'); setQuizIndex(0); setSelected(null); setCorrect(0); setAnswers([]) }}
                style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1a1a2e', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
                ✅ Take the Quiz →
              </button>
            )}
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <span style={{ color: '#c2410c', fontWeight: '700', fontSize: '14px' }}>Question {quizIndex + 1} of {quizQ.length}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '8px', background: '#ea580c', borderRadius: '10px', width: `${((quizIndex + 1) / quizQ.length) * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '14px' }}>⭐ {correct}</span>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>What is the name of this letter?</div>
              <div style={{ fontSize: '96px', fontWeight: '900', color: '#1a1a2e', lineHeight: 1, marginBottom: '16px' }}>{quizQ[quizIndex].correct}</div>
              <button onClick={() => speak(quizQ[quizIndex].correct)} style={{ background: '#fff7ed', color: '#c2410c', border: '2px solid #fed7aa', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>🔊 Hear it</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {quizQ[quizIndex].options.map(opt => {
                const isCorrect = opt === quizQ[quizIndex].correct
                const isSelected = opt === selected
                let bg = '#f9fafb', border = '#e5e7eb', textColor = '#1a1a2e'
                if (selected) {
                  if (isCorrect) { bg = '#fff7ed'; border = '#ea580c'; textColor = '#c2410c' }
                  else if (isSelected) { bg = '#fef2f2'; border = '#ef4444'; textColor = '#dc2626' }
                }
                const charData = LOW_CLASS_FINAL.find(c => c.char === opt)
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: '14px', padding: '18px 12px', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', fontWeight: '900', color: textColor, marginBottom: '6px' }}>{opt}</div>
                    <div style={{ color: selected ? textColor : '#9ca3af', fontSize: '13px', fontWeight: '700' }}>{selected ? charData?.name : '?'}</div>
                    {selected && isCorrect && <div style={{ color: '#ea580c', fontSize: '18px', marginTop: '4px' }}>✓</div>}
                    {selected && isSelected && !isCorrect && <div style={{ color: '#ef4444', fontSize: '18px', marginTop: '4px' }}>✗</div>}
                  </button>
                )
              })}
            </div>
          </div>
          {selected && (
            <div style={{ background: selected === quizQ[quizIndex].correct ? '#fff7ed' : '#fef2f2', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', border: `2px solid ${selected === quizQ[quizIndex].correct ? '#fed7aa' : '#fca5a5'}` }}>
              {selected === quizQ[quizIndex].correct
                ? <div style={{ color: '#c2410c', fontWeight: '700', fontSize: '15px' }}>✅ Correct! <span style={{ fontWeight: '400' }}>That is <strong>{quizQ[quizIndex].correct}</strong> — {LOW_CLASS_FINAL.find(c => c.char === quizQ[quizIndex].correct)?.name}.</span></div>
                : <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '15px' }}>❌ Not quite. <span style={{ fontWeight: '400' }}>The correct answer is <strong>{quizQ[quizIndex].correct}</strong> — {LOW_CLASS_FINAL.find(c => c.char === quizQ[quizIndex].correct)?.name}.</span></div>
              }
            </div>
          )}
          {selected && <button onClick={nextQ} style={{ width: '100%', background: 'linear-gradient(135deg, #c2410c, #ea580c)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '17px', cursor: 'pointer' }}>{quizIndex + 1 >= quizQ.length ? '🏆 See Results →' : 'Next Question →'}</button>}
        </div>
      )}

      {phase === 'complete' && (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '💪'}</div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', marginBottom: '8px' }}>{pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great work!' : 'Keep practising!'}</h2>
            <div style={{ fontSize: '52px', fontWeight: '900', color: pct >= 70 ? '#ea580c' : '#f59e0b', marginBottom: '8px' }}>{pct}%</div>
            <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{correct} out of {quizQ.length} correct</div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {answers.map((a, i) => <div key={i} style={{ width: '32px', height: '32px', borderRadius: '8px', background: a ? '#fff7ed' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a ? '✓' : '✗'}</div>)}
            </div>
            <div style={{ background: '#fff7ed', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '2px solid #fed7aa', textAlign: 'left' }}>
              <div style={{ color: '#c2410c', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>🎉 Unit 1 Complete!</div>
              <div style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6' }}>You now know all 44 Thai consonants across all 3 classes. Next: Unit 2 — Vowels and Tone Marks.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/learn-thai/a1/unit-2/lesson-1" style={{ display: 'block', background: 'linear-gradient(135deg, #c2410c, #ea580c)', color: 'white', padding: '16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '16px' }}>
                Next: Unit 2 — Vowels →
              </Link>
              <Link href="/learn-thai/a1" style={{ display: 'block', background: '#f3f4f6', color: '#374151', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
                ← Back to A1 Overview
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
