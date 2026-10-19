'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const SPEEDS = [
  { label: '🐢 Very Slow', value: 0.55 },
  { label: '🚶 Slow', value: 0.72 },
  { label: '🏃 Normal', value: 0.9 },
  { label: '⚡ Fast', value: 1.1 },
]

const LANGUAGES = [
  { value: 'none', label: '🌍 English only' },
  { value: 'Thai', label: '🇹🇭 Thai' },
  { value: 'Japanese', label: '🇯🇵 Japanese' },
  { value: 'Korean', label: '🇰🇷 Korean' },
  { value: 'Chinese', label: '🇨🇳 Chinese' },
  { value: 'Arabic', label: '🇸🇦 Arabic' },
  { value: 'Spanish', label: '🇪🇸 Spanish' },
  { value: 'French', label: '🇫🇷 French' },
  { value: 'German', label: '🇩🇪 German' },
  { value: 'Portuguese', label: '🇧🇷 Portuguese' },
  { value: 'Russian', label: '🇷🇺 Russian' },
  { value: 'Vietnamese', label: '🇻🇳 Vietnamese' },
  { value: 'Indonesian', label: '🇮🇩 Indonesian' },
]

const COLOR = '#047857'
const COLORS = { main: '#047857', dark: '#022c22', light: '#059669', pale: '#ecfdf5', border: '#a7f3d0' }

const PAGES = [
  {
    title: 'When "Yes" Doesn\'t Mean Yes',
    emoji: '🤐',
    reading: `Imagine you are in a meeting in Tokyo. You present your proposal, and your Japanese client smiles and says, "That is very interesting. We will consider it carefully." You leave the meeting feeling happy. You think the deal is almost done.

Two weeks later, you have heard nothing. You send an email. No reply. What happened?

The answer is simple: your client said no. You just did not hear it.

In many Western countries, people value direct communication. If the answer is no, you say no. It is clear, quick, and honest. But in much of Asia, saying "no" directly can feel rude, aggressive, or embarrassing. It can make the other person lose face. So people say no in softer, more indirect ways.

Experts call these "high-context" cultures. In a high-context culture, the real message is not only in the words. It is in the tone of voice, the pauses, the body language, what is not said, and the situation. In a "low-context" culture, like the USA, Germany, or Australia, the message is mostly in the words themselves.

Neither style is right or wrong. But if you do business in Asia, you need to learn to hear the "no" that is hiding inside a polite "yes".`,
    vocab: [
      { word: 'Proposal', definition: 'A plan or idea that you formally suggest to someone for them to consider.' },
      { word: 'Aggressive', definition: 'Behaving in an angry or forceful way towards other people.' },
      { word: 'High-context', definition: 'Describes a culture where meaning comes from tone, situation, and what is not said.' },
      { word: 'Body language', definition: 'Messages you send with your face, hands, and body, not with words.' },
    ],
    phrases: [] as { en: string; local: string; phonetic: string; note: string }[],
    discussion: [
      'Is your culture more direct or more indirect? Can you give an example?',
      'Have you ever thought someone said "yes" but later found out they meant "no"? What happened?',
    ],
  },
  {
    title: 'Decoding the Hidden No',
    emoji: '🔍',
    reading: `Across Asia, there are many common ways to say no without using the word "no". Learning to recognise them is one of the most useful business skills you can have.

"That might be difficult." This often means "That is impossible." The speaker is being polite — they are not asking you to try harder.

"We will study it." / "We will consider it." Sometimes this is true. But very often it is a polite way to end the discussion. If there is no date or next step, it probably means no.

"I need to check with my boss." Sometimes this is real — many Asian companies make decisions as a group. But it can also be a way to avoid saying no to your face.

"It is not convenient right now." This usually means "No, and please do not ask again soon."

"Yes, yes, I understand." Sometimes "yes" only means "I hear you" — not "I agree" and not "I will do it".

Silence. A long pause after your question is often a sign of disagreement or discomfort, not that the person is thinking about agreeing.

Changing the subject. If you ask about price and your partner starts talking about the weather or lunch, they may not want to answer.

Sucking air through the teeth. In Japan especially, a slow intake of breath through the teeth, with a slight tilt of the head, often means "this is a big problem."

The key is to look for a pattern: polite words, no clear next step, and no enthusiasm usually add up to a no.`,
    vocab: [
      { word: 'Decode', definition: 'To discover the real meaning of a message that is not clear.' },
      { word: 'Recognise', definition: 'To know or identify something because you have seen or heard it before.' },
      { word: 'Discomfort', definition: 'A feeling of being slightly uncomfortable, worried, or embarrassed.' },
      { word: 'Enthusiasm', definition: 'A feeling of strong excitement and interest in something.' },
    ],
    phrases: [
      { en: 'That might be difficult.', local: '', phonetic: '', note: 'Often means "no". Do not reply "But I\'m sure you can do it!"' },
      { en: 'We will study it.', local: '', phonetic: '', note: 'Listen for a date or next step. Without one, it is probably a no.' },
      { en: 'It\'s not convenient right now.', local: '', phonetic: '', note: 'A soft but clear no. Do not push.' },
      { en: 'Yes, I understand.', local: '', phonetic: '', note: '"Yes" may only mean "I heard you". Check with an open question.' },
    ],
    discussion: [
      'Which of these "hidden no" signals do you think is the hardest to notice? Why?',
      'Does your language have polite ways to say no without saying "no"? Give some examples.',
      'Is silence in a meeting comfortable or uncomfortable in your culture?',
    ],
  },
  {
    title: 'Japan — "Chotto..." and the Power of Silence',
    emoji: '🇯🇵',
    reading: `Japan is famous for indirect communication. Many Japanese people almost never say "iie" (いいえ), the word for "no", in business. Instead, they use softer words and leave the meaning in the air.

The most famous example is "chotto..." (ちょっと). It literally means "a little", but when someone says "Sore wa chotto..." ("That is a little...") and does not finish the sentence, it means no. The unfinished sentence is the message. You are expected to understand and change the topic.

Another common phrase is "kentō shimasu" (検討します) — "we will consider it". Even more interesting is "maemuki ni kentō shimasu" — "we will consider it positively". It sounds hopeful, but in many cases it is still a polite no.

Silence is also powerful in Japan. In Western meetings, silence often feels awkward, and people rush to fill it. In Japan, a pause can mean people are thinking carefully, or that there is a problem nobody wants to say. If you fill every silence by talking more, lowering your price, or changing your offer, you may give away too much.

Japanese decisions are often made through "nemawashi" (根回し) — quiet discussions with everyone before the official meeting. If someone has not agreed in these private talks, they will rarely say no in the meeting itself. This is why the official meeting can feel like everyone agrees, even when they do not.`,
    vocab: [
      { word: 'Literally', definition: 'Using the exact, basic meaning of a word.' },
      { word: 'Awkward', definition: 'Uncomfortable or embarrassing, making people unsure what to do or say.' },
      { word: 'Rush', definition: 'To do something very quickly, often too quickly.' },
      { word: 'Official', definition: 'Formal and approved by people in authority.' },
    ],
    phrases: [
      { en: 'That is a little... (No.)', local: 'それはちょっと…', phonetic: 'So-re wa chot-to...', note: 'The unfinished sentence means no. Change the topic politely.' },
      { en: 'We will consider it.', local: '検討します', phonetic: 'Ken-tō shi-ma-su', note: 'Without a clear next step, this is often a soft no.' },
      { en: 'That is difficult, isn\'t it.', local: '難しいですね', phonetic: 'Mu-zu-ka-shii de-su ne', note: 'In business, this very often means "it is not possible".' },
      { en: 'Let me think about it a little.', local: '少し考えさせてください', phonetic: 'Su-ko-shi kan-ga-e-sa-se-te ku-da-sai', note: 'A polite way to avoid giving an answer now.' },
    ],
    discussion: [
      'Why do you think Japanese people avoid saying "iie" (no) in business?',
      'What do you usually do when there is a long silence in a meeting or conversation?',
      'What are the good and bad points of making decisions privately before the meeting (nemawashi)?',
    ],
  },
  {
    title: 'China and Korea — "We\'ll Talk About It Later"',
    emoji: '🇨🇳',
    reading: `In China, saying no directly can damage guanxi — the relationship. So Chinese businesspeople often use phrases that delay the answer or show that something is difficult.

"Wǒ kǎolǜ yīxià" (我考虑一下) means "I'll think about it." "Yánjiū yánjiū" (研究研究) means "let's study it" — and is so often used as a polite no that some Chinese people joke about it. "Zài shuō ba" (再说吧) means "let's talk about it later", and "later" may never come.

Chinese partners may also say yes to a general idea but not to the details. "Yes, we want to work together" does not mean "yes, we accept your price." Always check the specific points.

In South Korea, communication is often more direct than in Japan or China, especially between people of the same age. But when speaking to seniors, clients, or new partners, Koreans also soften their no. A common answer is "geulsseyo..." (글쎄요) — "Well... I'm not sure." Like the Japanese "chotto", the hesitation tells you the answer.

Another common phrase is "jom eoryeoul geot gatayo" (좀 어려울 것 같아요) — "It seems like it might be a little difficult." Notice how many soft words are in this one sentence: "a little", "it seems", "might". Each one makes the no gentler.

In both countries, the person may also give a reason that is not the real reason — like a busy schedule — so that nobody loses face.`,
    vocab: [
      { word: 'Delay', definition: 'To make something happen later than planned.' },
      { word: 'Specific', definition: 'Clear and exact, about a particular detail.' },
      { word: 'Hesitation', definition: 'A pause before you speak or act, because you are unsure.' },
      { word: 'Soften', definition: 'To make something gentler, less strong, or less direct.' },
    ],
    phrases: [
      { en: 'I\'ll think about it.', local: '我考虑一下', phonetic: 'Wǒ kǎolǜ yīxià (Chinese)', note: 'Can be real, but often a polite way to say no.' },
      { en: 'Let\'s talk about it later.', local: '再说吧', phonetic: 'Zài shuō ba (Chinese)', note: 'Very often means "no" or "not now, maybe never".' },
      { en: 'Well... I\'m not sure.', local: '글쎄요', phonetic: 'Geul-sse-yo (Korean)', note: 'The hesitation is the message. Do not push for a yes.' },
      { en: 'It seems a little difficult.', local: '좀 어려울 것 같아요', phonetic: 'Jom eo-ryeo-ul geot ga-ta-yo (Korean)', note: 'A gentle Korean no, softened with "a little" and "it seems".' },
    ],
    discussion: [
      'Why might saying yes to a general idea but not to the details cause problems in business?',
      'The Korean phrase uses "a little", "it seems", and "might". What soft words do you use in your language?',
      'Is it OK to give a polite reason that is not the real reason? Why or why not?',
    ],
  },
  {
    title: 'Thailand and Southeast Asia — The Smiling No',
    emoji: '🇹🇭',
    reading: `In Thailand, kreng jai — not wanting to bother or upset someone — makes direct refusal very uncomfortable. Thai people often smile, say something positive, and avoid the word "mai" (no) in business.

A common soft no is "mai sa-duak" (ไม่สะดวก) — "it's not convenient." Another is "wai gon" (ไว้ก่อน) — "let's leave it for now." "Kit duu gon" (คิดดูก่อน) means "let me think about it first." All three sound gentle, and all three can mean no.

The famous Thai phrase "mai pen rai" (ไม่เป็นไร) — "never mind" or "no problem" — is also important. It is used to keep situations calm. But when a foreigner hears "mai pen rai" after a problem, it does not always mean the problem is solved. Sometimes it means "let's not talk about it."

In Indonesia, people often say "belum" — "not yet" — instead of "no". "Are you married?" "Belum." "Have you finished the report?" "Belum." It keeps the door open and avoids a hard refusal.

In the Philippines, people may say "I'll try" or "maybe" when they really mean no, especially to someone senior or to a guest. Saying no directly to a boss or customer can feel disrespectful.

Across Southeast Asia, the smile is very important. A smile can mean happiness — but it can also mean embarrassment, disagreement, or "I don't want to say no". Watch the whole situation, not just the face.`,
    vocab: [
      { word: 'Refusal', definition: 'The act of saying that you will not do or accept something.' },
      { word: 'Upset', definition: 'To make someone unhappy, worried, or annoyed.' },
      { word: 'Keep the door open', definition: 'To leave a possibility for something to happen in the future.' },
      { word: 'Disrespectful', definition: 'Showing a lack of respect towards someone.' },
    ],
    phrases: [
      { en: 'It\'s not convenient.', local: 'ไม่สะดวก', phonetic: 'Mâi sà-dùak (Thai)', note: 'A polite Thai way to say no to a request or meeting.' },
      { en: 'Let\'s leave it for now.', local: 'ไว้ก่อน', phonetic: 'Wái gòn (Thai)', note: 'Often means "not now — and maybe not later either".' },
      { en: 'Let me think about it first.', local: 'คิดดูก่อน', phonetic: 'Kít duu gòn (Thai)', note: 'Common when shopping or in business. Often a soft no.' },
      { en: 'Not yet.', local: 'Belum', phonetic: 'Bə-lum (Indonesian)', note: 'Used instead of "no" to keep things positive and open.' },
    ],
    discussion: [
      'A smile can mean many things in Southeast Asia. What can a smile mean in your culture?',
      'Do you think "not yet" is a kinder answer than "no"? Why?',
      'If a Thai colleague says "mai pen rai" after a problem, how could you check that everything is really OK?',
    ],
  },
  {
    title: 'How to Say No — and Hear Yes',
    emoji: '🗝️',
    reading: `Now you know how to hear a hidden no. But how do you say no yourself, without damaging the relationship? And how do you check that a "yes" is real?

A useful formula for a soft no has three steps.

Step 1 — Appreciate. Thank the person or say something positive. "Thank you for thinking of us. It's a really interesting idea."

Step 2 — Explain the difficulty. Use soft language. "Unfortunately, our budget this year might make it difficult."

Step 3 — Offer an alternative. Keep the relationship moving. "Could we look at a smaller project first?" or "Maybe we could talk again in the new year?"

To check if a "yes" is real, do not ask yes/no questions like "Do you understand?" or "Is that OK?" Most people will just say yes. Instead, ask open questions:

"How do you plan to start this?"
"What might be difficult about this deadline?"
"Which part do you think we should change?"

Also, ask for a next step. A real yes usually comes with a date, a name, or an action. "Great — shall we meet on Friday to discuss the details?" If the other person avoids setting a date, the yes may not be real.

Finally, give people a private way to say no. Some people cannot say no in a meeting but will tell you honestly in a one-to-one chat, a message, or over coffee.`,
    vocab: [
      { word: 'Appreciate', definition: 'To be thankful for something, or to understand its value.' },
      { word: 'Budget', definition: 'The amount of money that is available to spend on something.' },
      { word: 'Alternative', definition: 'Another option or choice that you can use instead.' },
      { word: 'Open question', definition: 'A question that needs a full answer, not just "yes" or "no".' },
    ],
    phrases: [
      { en: 'Thank you for thinking of us, but I\'m afraid this might be difficult.', local: '', phonetic: '', note: 'Appreciate + difficulty. Polite and clear without the word "no".' },
      { en: 'Could we look at another option?', local: '', phonetic: '', note: 'Offers an alternative so the conversation continues.' },
      { en: 'How do you plan to start this?', local: '', phonetic: '', note: 'An open question to check that a "yes" really means yes.' },
      { en: 'Shall we set a date for the next step?', local: '', phonetic: '', note: 'A real yes usually comes with a date. If not, be careful.' },
    ],
    discussion: [
      'Practise: Use the three-step formula to say no to your boss, who asks you to work this Saturday.',
      'Why are open questions better than "Do you understand?" when checking a yes?',
      'Is it ever better to say a direct "no"? When?',
    ],
  },
  {
    title: 'What Would You Do?',
    emoji: '🤔',
    reading: `Read each situation carefully. Is someone saying no without saying no? What is really happening, and what should the person do next?

Situation 1: The Interesting Proposal
Chris presents a new software system to a Japanese company in Osaka. At the end, the manager pauses for a long time, sucks air through his teeth, and says, "Sore wa chotto... We will consider it." Chris says, "Great! When can we sign the contract?" What did Chris miss? What should he say instead?

Situation 2: The Deadline
Sophie asks her Thai team, "Can you finish the report by Friday?" Everyone smiles and says "Yes, yes, no problem." On Friday, the report is not finished. Why did this happen? How could Sophie have asked the question differently?

Situation 3: The Price Negotiation
Mark is negotiating with a Chinese supplier in Shenzhen. He asks for a 20% discount. The supplier smiles, offers him more tea, and starts talking about the excellent restaurant they will visit tonight. Mark repeats his question three times. What is the supplier trying to tell him? What should Mark do?

Situation 4: The Invitation
A Korean colleague invites Ana to a weekend hiking trip with the team. Ana does not want to go. She says, "No thanks, I don't like hiking." Her colleague looks surprised and does not invite her again. How could Ana have said no in a softer way?

Situation 5: The Silent Meeting
In a meeting in Jakarta, Ben asks, "Does everyone agree with the new plan?" Nobody says anything. Ben says, "Great, so we all agree!" and ends the meeting. A month later, nobody is following the plan. What went wrong?`,
    vocab: [
      { word: 'Negotiate', definition: 'To discuss something to try to reach an agreement.' },
      { word: 'Discount', definition: 'A reduction in the usual price of something.' },
      { word: 'Repeat', definition: 'To say or do something again.' },
      { word: 'Follow', definition: 'To do what a plan, rule, or instruction says.' },
    ],
    phrases: [],
    discussion: [
      'Which situation shows the clearest "hidden no"? How do you know?',
      'Choose one situation. What exactly should the person say next?',
      'In Situation 5, how could Ben find out what people really think about the plan?',
    ],
  },
  {
    title: 'Review & Final Discussion',
    emoji: '✅',
    reading: `Let us review what you have learned in this lesson.

High-context communication: In much of Asia, the real message is in tone, pauses, body language, and the situation — not only in the words. "Yes" may only mean "I hear you."

Hidden no signals: "That might be difficult", "We will study it", "I need to check with my boss", "It's not convenient", silence, changing the subject, and polite words with no clear next step.

Japan: "Chotto..." with an unfinished sentence means no. "Kentō shimasu" — we will consider it — is often a soft no. Silence is powerful. Decisions are often made before the meeting through nemawashi.

China and Korea: "Kǎolǜ yīxià", "yánjiū yánjiū", and "zài shuō ba" delay or soften a no. Check the details, not just the general idea. In Korea, "geulsseyo..." and "jom eoryeoul geot gatayo" are gentle refusals.

Thailand and Southeast Asia: "Mai sa-duak", "wai gon", and "kit duu gon" are soft Thai no's. Indonesians say "belum" (not yet). A smile can hide disagreement.

Saying no yourself: Appreciate, explain the difficulty, offer an alternative.

Checking a yes: Ask open questions, ask for a next step with a date, and give people a private way to tell you the truth.`,
    vocab: [
      { word: 'Signal', definition: 'A sign, action, or sound that gives a message.' },
      { word: 'Gentle', definition: 'Kind and soft, not strong or rough.' },
      { word: 'Formula', definition: 'A fixed method or set of steps for doing something.' },
      { word: 'Truth', definition: 'The real facts about something; what is really true.' },
    ],
    phrases: [],
    discussion: [
      'Which hidden "no" from this lesson surprised you the most?',
      'Do you prefer direct or indirect communication at work? Why?',
      'Think of a time you said "yes" but meant "no". How would you say it now using the three-step formula?',
      'What was the most useful thing you learned in this lesson?',
    ],
  },
]

async function fetchTranslation(text: string, lang: string, type: 'word' | 'question' | 'message'): Promise<string> {
  const systems: Record<string, string> = {
    word: `You are a language learning assistant. Translate this English vocabulary entry to ${lang}. Return ONLY the translated word and a brief explanation in ${lang} (max 25 words). No extra text, no English.`,
    question: `You are a translator. Translate this English discussion question to ${lang}. Return ONLY the translated question. No extra text.`,
    message: `You are a translator. Translate this English text to ${lang}. Return ONLY the translation. No extra text.`,
  }
  const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: systems[type], messages: [{ role: 'user', content: text }] }) })
  const data = await res.json()
  return data.content || ''
}

function TranslateBtn({ text, type, lang, onTranslated }: { text: string; type: 'word' | 'question' | 'message'; lang: string; onTranslated: (t: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const handleClick = async () => {
    if (lang === 'none' || loading || done) return
    setLoading(true)
    const result = await fetchTranslation(text, lang, type)
    onTranslated(result); setDone(true); setLoading(false)
  }
  const isDisabled = lang === 'none'
  return (
    <button onClick={handleClick} disabled={isDisabled || loading || done}
      title={isDisabled ? 'Select a language above to translate' : done ? 'Translated' : `Translate to ${lang}`}
      style={{ background: isDisabled ? '#f3f4f6' : done ? '#f0fdf4' : '#04785715', color: isDisabled ? '#d1d5db' : done ? '#16a34a' : COLOR, border: `1px solid ${isDisabled ? '#e5e7eb' : done ? '#86efac' : '#04785740'}`, padding: '2px 8px', borderRadius: '6px', fontSize: '12px', cursor: isDisabled ? 'not-allowed' : done ? 'default' : 'pointer', fontWeight: '700', flexShrink: 0, transition: 'all 0.2s' }}>
      {loading ? '...' : done ? '✓ 🌍' : '🌍'}
    </button>
  )
}

function ShortListenBtn({ text }: { text: string }) {
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const handleClick = async () => {
    if (playing && sourceRef.current) { try { sourceRef.current.stop() } catch {} sourceRef.current = null; setPlaying(false); return }
    setLoading(true)
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
      if (!res.ok) { setLoading(false); return }
      const arrayBuffer = await res.arrayBuffer()
      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer; source.playbackRate.value = 0.85
      source.connect(audioContext.destination)
      source.onended = () => { setPlaying(false); sourceRef.current = null }
      sourceRef.current = source; setLoading(false); setPlaying(true); source.start(0)
    } catch { setLoading(false); setPlaying(false) }
  }
  return (
    <button onClick={handleClick}
      style={{ background: playing ? COLOR : '#04785715', color: playing ? 'white' : COLOR, border: `1px solid ${COLOR}40`, padding: '2px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '700', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}>
      {loading ? '...' : playing ? '⏹ Stop' : '🔊'}
    </button>
  )
}

type Message = { role: 'user' | 'assistant'; content: string; translation?: string }

function ConversationBox({ question, translationLang, speed }: { question: string; translationLang: string; speed: number }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [open, setOpen] = useState(false)
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')

  const SYSTEM = `You are a thoughtful English conversation partner helping a B1 intermediate student practise discussion skills. The reading topic is "The Art of Saying No Without Saying No — indirect communication and hidden refusals in business in Japan, China, Korea, Thailand and Southeast Asia, and how to say no politely and check that a yes is real". The current discussion question is: "${question}". Keep responses to 2-3 sentences. Use clear, accessible B1-level English. End with one probing follow-up question. If the student makes a significant grammar error, gently correct it using "💡 Quick tip: ..." at the very end. Be intellectually engaging and encouraging.`

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: SYSTEM, messages: updated.map(m => ({ role: m.role, content: m.content })) }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content || 'Sorry, try again.' }])
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — please try again.' }]) }
    setLoading(false)
  }

  const setMessageTranslation = (idx: number, translation: string) => {
    setMessages(prev => prev.map((m, i) => i === idx ? { ...m, translation } : m))
  }

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input requires Chrome browser.'); return }
    transcriptRef.current = ''
    const r = new SR(); r.lang = 'en-US'; r.continuous = true; r.interimResults = true
    r.onstart = () => { setListening(true); setInterimText('') }
    r.onresult = (e: any) => {
      let final = ''; let interim = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) { final += e.results[i][0].transcript + ' ' }
        else { interim += e.results[i][0].transcript }
      }
      transcriptRef.current = final; setInterimText(final + interim)
    }
    r.onerror = () => { setListening(false); setInterimText('') }
    r.onend = () => {
      setListening(false)
      const text = transcriptRef.current.trim() || interimText.trim()
      if (text) { setInterimText(''); transcriptRef.current = ''; sendMessage(text) }
      else { setInterimText(''); transcriptRef.current = '' }
    }
    recognitionRef.current = r; r.start()
  }
  const stopVoice = () => { recognitionRef.current?.stop() }
  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ marginTop: '8px', width: '100%', background: '#04785712', border: `2px dashed ${COLOR}40`, borderRadius: '12px', padding: '10px', color: COLOR, fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      🤖 Practice answering with AI
    </button>
  )

  return (
    <div style={{ marginTop: '8px', background: '#ecfdf5', borderRadius: '14px', border: `2px solid ${COLOR}30`, overflow: 'hidden' }}>
      <div style={{ background: COLOR, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>🤖 AI Conversation Partner</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setMessages([])} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>🔄 Reset</button>
          <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>✕ Close</button>
        </div>
      </div>
      {messages.length === 0 && <div style={{ padding: '14px 16px', color: '#6b7280', fontSize: '13px', lineHeight: '1.6', borderBottom: `1px solid ${COLORS.border}` }}>💡 Type your answer or tap <strong>🎤 Start Recording</strong> — speak your full answer, then tap <strong>⏹ Stop & Send</strong>.</div>}
      {messages.length > 0 && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ fontSize: '20px', flexShrink: 0 }}>{m.role === 'user' ? '🧑‍🎓' : '🤖'}</div>
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ background: m.role === 'user' ? COLOR : 'white', color: m.role === 'user' ? 'white' : '#374151', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', fontSize: '14px', lineHeight: '1.6', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: m.role === 'assistant' ? '1px solid #e5e7eb' : 'none' }}>{m.content}</div>
                {m.role === 'assistant' && !m.translation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShortListenBtn text={m.content} />
                    <TranslateBtn text={m.content} type="message" lang={translationLang} onTranslated={(t) => setMessageTranslation(i, t)} />
                  </div>
                )}
                {m.translation && <div style={{ background: '#ecfdf5', border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}><span style={{ color: COLOR, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>🌍 {currentLang?.label}</span>{m.translation}</div>}
              </div>
            </div>
          ))}
          {loading && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ fontSize: '20px' }}>🤖</span><div style={{ background: 'white', padding: '10px 14px', borderRadius: '4px 16px 16px 16px', fontSize: '14px', color: '#9ca3af', border: '1px solid #e5e7eb' }}>Thinking...</div></div>}
        </div>
      )}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }} placeholder="Type your answer here..." rows={2} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: '2px solid #e5e7eb', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={listening ? stopVoice : startVoice} style={{ background: listening ? '#ef4444' : '#22c55e', color: 'white', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: listening ? '0 0 0 4px rgba(239,68,68,0.3)' : 'none', transition: 'all 0.2s' }}>{listening ? '⏹' : '🎤'}</button>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{ background: input.trim() && !loading ? COLOR : '#e5e7eb', color: input.trim() && !loading ? 'white' : '#9ca3af', border: 'none', width: '42px', height: '42px', borderRadius: '10px', fontSize: '18px', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
        </div>
      </div>
      {listening && (
        <div style={{ padding: '10px 16px 14px', borderTop: '1px solid #fee2e2', background: '#fef2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite', flexShrink: 0 }} /><span style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700' }}>Recording... speak your full answer</span></div>
            <button onClick={stopVoice} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.4)' }}>⏹ Stop & Send</button>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: interimText ? '#374151' : '#9ca3af', lineHeight: '1.6', border: '1px solid #fca5a5', fontStyle: 'italic', minHeight: '40px' }}>{interimText || 'Waiting for speech...'}</div>
        </div>
      )}
    </div>
  )
}

export default function SayingNoWithoutSayingNoPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [speed, setSpeed] = useState(0.9)
  const [translationLang, setTranslationLang] = useState('none')
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const [vocabTranslations, setVocabTranslations] = useState<Record<string, string>>({})
  const [questionTranslations, setQuestionTranslations] = useState<Record<string, string>>({})
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [lookupDef, setLookupDef] = useState('')
  const [lookupTranslation, setLookupTranslation] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)

  const page = PAGES[currentPage]
  const currentLang = LANGUAGES.find(l => l.value === translationLang)

  // Stop ALL audio on page change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.onended = null
      audioRef.current = null
    }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    setAudioState('idle')
    setVocabTranslations({})
    setQuestionTranslations({})
    setSelectedText(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // Update playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) { audioRef.current.playbackRate = speed }
  }, [speed])

  // Main page audio: play / pause / resume
  const handlePageAudio = async () => {
    if (audioState === 'playing' && audioRef.current) {
      audioRef.current.pause()
      setAudioState('paused')
      return
    }
    if (audioState === 'paused' && audioRef.current) {
      audioRef.current.play()
      setAudioState('playing')
      return
    }
    // New playback
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    setAudioState('loading')
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: page.reading }) })
      if (!res.ok) { setAudioState('idle'); return }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      blobUrlRef.current = url
      const audio = new Audio(url)
      audio.playbackRate = speed
      audio.onended = () => { setAudioState('idle') }
      audioRef.current = audio
      await audio.play()
      setAudioState('playing')
    } catch { setAudioState('idle') }
  }

  // Text highlight lookup
  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection()
      if (!sel) return
      const text = sel.toString().trim().replace(/\s+/g, ' ')
      if (!text || text.split(' ').length > 6) return
      const anchor = sel.anchorNode?.parentElement
      if (!anchor?.closest('[data-passage]')) return
      handleLookup(text)
    }
    document.addEventListener('mouseup', handleSelection)
    document.addEventListener('touchend', handleSelection)
    return () => { document.removeEventListener('mouseup', handleSelection); document.removeEventListener('touchend', handleSelection) }
  }, [translationLang])

  const handleLookup = async (text: string) => {
    if (!text || text.length < 2) return
    setSelectedText(text); setLookupDef(''); setLookupTranslation(''); setLookupLoading(true)
    // Speak the word
    if (typeof window !== 'undefined') { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-GB'; u.rate = 0.85; window.speechSynthesis.speak(u) }
    const isPhrase = text.includes(' ')
    try {
      if (translationLang === 'none') {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: isPhrase ? 'You are an English dictionary for B1 learners. Respond with ONLY one sentence (max 20 words) explaining what the phrase means. No extra text.' : 'You are an English dictionary for B1 learners. Respond with ONLY one sentence (max 15 words) defining this word. No extra text.', messages: [{ role: 'user', content: isPhrase ? `What does "${text}" mean?` : `Define: "${text}"` }] }) })
        const data = await res.json(); setLookupDef(data.content || 'No definition found.')
      } else {
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: `You are a language learning assistant for B1 English students. Respond ONLY with valid JSON (no markdown, no backticks): {"definition": "one simple English sentence max 15 words", "translation": "the word/phrase in ${translationLang} with a brief explanation in ${translationLang}, max 25 words"}`, messages: [{ role: 'user', content: `Word or phrase: "${text}"` }] }) })
        const data = await res.json()
        try { const parsed = JSON.parse(data.content); setLookupDef(parsed.definition || 'No definition found.'); setLookupTranslation(parsed.translation || '') }
        catch { setLookupDef(data.content || 'No definition found.'); setLookupTranslation('') }
      }
    } catch { setLookupDef('Could not load definition.') }
    setLookupLoading(false)
  }

  const goNext = () => { if (currentPage < PAGES.length - 1) setCurrentPage(currentPage + 1) }
  const goPrev = () => { if (currentPage > 0) setCurrentPage(currentPage - 1) }

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh', paddingBottom: '100px' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* HEADER */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.main} 60%, ${COLORS.light} 100%)`, padding: '40px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <Link href="/esl-resources/courses/business-in-asia" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' }}>← Business in Asia</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '64px', flexShrink: 0 }}>🤐</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>Lesson 4 of 10</span>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>30–60 minutes</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 6px', lineHeight: '1.3' }}>The Art of Saying No Without Saying No</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>Indirect communication across cultures</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            {['✍️ Highlight any text', '🌍 13-language translation', '🤖 AI conversation partner', '🎤 Push-to-talk voice', '🔊 4-speed audio', '🔊 Pause & resume'].map(f => (
              <span key={f} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: '600' }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTROLS BAR */}
      <section style={{ background: 'white', borderBottom: '1px solid #eee', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>🔊 Speed:</span>
            {SPEEDS.map(s => (
              <button key={s.value} onClick={() => setSpeed(s.value)} style={{ padding: '3px 10px', borderRadius: '20px', border: '2px solid', borderColor: speed === s.value ? COLOR : '#e5e7eb', background: speed === s.value ? COLOR : 'white', color: speed === s.value ? 'white' : '#555', fontWeight: '700', fontSize: '11px', cursor: 'pointer', transition: 'all 0.2s' }}>{s.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#888', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>🌍</span>
            <select value={translationLang} onChange={e => { setTranslationLang(e.target.value); setVocabTranslations({}); setQuestionTranslations({}) }} style={{ padding: '4px 10px', borderRadius: '20px', border: '2px solid', borderColor: translationLang !== 'none' ? COLOR : '#e5e7eb', background: translationLang !== 'none' ? COLORS.pale : 'white', color: translationLang !== 'none' ? COLORS.dark : '#555', fontWeight: '700', fontSize: '11px', cursor: 'pointer', outline: 'none' }}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* PAGE PROGRESS */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {PAGES.map((_, i) => (
            <div key={i} onClick={() => setCurrentPage(i)} style={{ flex: 1, height: '6px', borderRadius: '3px', background: i <= currentPage ? COLOR : '#e5e7eb', cursor: 'pointer', transition: 'background 0.3s' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>Page {currentPage + 1} of {PAGES.length}</span>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{page.emoji} {page.title}</span>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px 24px' }}>
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>

          {/* Page Title */}
          <div style={{ background: `linear-gradient(135deg, ${COLOR}22, ${COLOR}08)`, borderLeft: `5px solid ${COLOR}`, padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '36px', flexShrink: 0 }}>{page.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLOR, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Page {currentPage + 1}</div>
              <h2 style={{ color: '#1a1a2e', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{page.title}</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={handlePageAudio} style={{ background: audioState === 'playing' ? '#ef4444' : audioState === 'paused' ? '#f59e0b' : COLOR, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: `0 3px 10px ${audioState === 'playing' ? 'rgba(239,68,68,0.4)' : audioState === 'paused' ? 'rgba(245,158,11,0.4)' : COLOR + '40'}`, transition: 'all 0.2s', minWidth: '120px' }}>
                {audioState === 'loading' ? '⏳ Loading...' : audioState === 'playing' ? '⏸ Pause' : audioState === 'paused' ? '▶ Resume' : '▶ Listen'}
              </button>
              {audioState !== 'idle' && audioState !== 'loading' && (
                <button onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null }; if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }; setAudioState('idle') }} style={{ background: 'white', color: '#6b7280', border: '2px solid #e5e7eb', padding: '8px 12px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹ Stop</button>
              )}
            </div>
          </div>

          {/* Highlight tip */}
          <div style={{ background: COLORS.pale, padding: '8px 28px', borderBottom: `1px solid ${COLORS.border}` }}>
            <span style={{ color: COLORS.dark, fontSize: '12px', fontWeight: '600' }}>✍️ Highlight any word or phrase to hear it and see its meaning{translationLang !== 'none' && <span style={{ color: COLOR }}> + {currentLang?.label} translation</span>}</span>
          </div>

          {/* Reading Content */}
          <div data-passage="true" style={{ padding: '24px 28px 20px', userSelect: 'text', cursor: 'text' }}>
            {page.reading.split('\n\n').map((para, i) => <p key={i} style={{ color: '#374151', fontSize: '16px', lineHeight: '1.85', margin: i === 0 ? '0 0 18px' : '18px 0 0', fontFamily: 'Georgia, serif' }}>{para}</p>)}
          </div>

          {/* Vocabulary */}
          <div style={{ margin: '0 28px 20px', background: COLOR + '08', border: `1px solid ${COLOR}25`, borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ background: COLOR + '18', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${COLOR}20` }}>
              <span style={{ fontSize: '16px' }}>📚</span>
              <span style={{ color: COLOR, fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Vocabulary</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {page.vocab.map((v, i) => {
                const vKey = `${currentPage}-${v.word}`
                return (
                  <div key={v.word} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: i < page.vocab.length - 1 ? '10px' : '0', borderBottom: i < page.vocab.length - 1 ? `1px solid ${COLOR}15` : 'none' }}>
                    <div style={{ background: COLOR, color: 'white', width: '22px', height: '22px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '11px', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span data-passage="true" style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px', userSelect: 'text', cursor: 'text' }}>{v.word}</span>
                        <ShortListenBtn text={v.word} />
                        <TranslateBtn text={`Word: "${v.word}"\nDefinition: "${v.definition}"`} type="word" lang={translationLang} onTranslated={(t) => setVocabTranslations(prev => ({ ...prev, [vKey]: t }))} />
                      </div>
                      <span data-passage="true" style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5', userSelect: 'text', cursor: 'text' }}>{v.definition}</span>
                      {vocabTranslations[vKey] && <div style={{ marginTop: '6px', background: COLORS.pale, border: `1px solid ${COLORS.border}`, borderRadius: '8px', padding: '8px 12px' }}><span style={{ color: COLOR, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{vocabTranslations[vKey]}</span></div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Key Phrases (if any) */}
          {page.phrases && page.phrases.length > 0 && (
            <div style={{ margin: '0 28px 20px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ background: '#fef3c7', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #fde68a' }}>
                <span style={{ fontSize: '16px' }}>🗣️</span>
                <span style={{ color: '#92400e', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Key Phrases</span>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {page.phrases.map((p, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '15px' }}>"{p.en}"</span>
                      <ShortListenBtn text={p.en} />
                    </div>
                    {p.local && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '18px', color: '#374151' }}>{p.local}</span>
                        <span style={{ fontSize: '13px', color: '#92400e', fontStyle: 'italic' }}>({p.phonetic})</span>
                      </div>
                    )}
                    <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5', fontStyle: 'italic' }}>💡 {p.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion Questions */}
          <div style={{ background: COLORS.dark, padding: '20px 28px', borderRadius: '0 0 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '18px' }}>💬</span>
              <span style={{ color: COLORS.border, fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discussion Questions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {page.discussion.map((q, qi) => {
                const qKey = `${currentPage}-${qi}`
                return (
                  <div key={qi}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div style={{ background: COLOR, color: 'white', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '13px', flexShrink: 0, marginTop: '1px' }}>{qi + 1}</div>
                      <div style={{ flex: 1 }}>
                        <p data-passage="true" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 6px', userSelect: 'text', cursor: 'text' }}>{q}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <TranslateBtn text={q} type="question" lang={translationLang} onTranslated={(t) => setQuestionTranslations(prev => ({ ...prev, [qKey]: t }))} />
                        </div>
                        {questionTranslations[qKey] && <div style={{ marginTop: '8px', background: 'rgba(4,120,87,0.15)', border: '1px solid rgba(4,120,87,0.3)', borderRadius: '10px', padding: '10px 14px' }}><span style={{ color: COLORS.border, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '3px' }}>{currentLang?.label}</span><span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6' }}>{questionTranslations[qKey]}</span></div>}
                      </div>
                    </div>
                    <div style={{ marginLeft: '42px' }}><ConversationBox question={q} translationLang={translationLang} speed={speed} /></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e5e7eb', padding: '12px 24px', zIndex: 150, boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={goPrev} disabled={currentPage === 0} style={{ background: currentPage === 0 ? '#f3f4f6' : COLOR, color: currentPage === 0 ? '#d1d5db' : 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', minWidth: '120px' }}>
            ← Previous
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>Page {currentPage + 1} of {PAGES.length}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{page.title}</div>
          </div>
          <button onClick={goNext} disabled={currentPage === PAGES.length - 1} style={{ background: currentPage === PAGES.length - 1 ? '#f3f4f6' : COLOR, color: currentPage === PAGES.length - 1 ? '#d1d5db' : 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: currentPage === PAGES.length - 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', minWidth: '120px' }}>
            Next →
          </button>
        </div>
      </div>

      {/* WORD LOOKUP POPUP */}
      {selectedText && (
        <div style={{ position: 'fixed', bottom: '80px', left: 0, right: 0, zIndex: 200, animation: 'slideUp 0.25s ease' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)', border: `2px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '18px', fontWeight: '900', color: '#1a1a2e', fontFamily: 'Georgia, serif' }}>"{selectedText}"</span>
                  <ShortListenBtn text={selectedText} />
                </div>
                <button onClick={() => setSelectedText(null)} style={{ background: '#f3f4f6', border: 'none', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', flexShrink: 0 }}>✕</button>
              </div>
              {lookupLoading ? (
                <div style={{ background: COLORS.pale, borderRadius: '10px', padding: '12px 16px', border: `1px solid ${COLORS.border}`, color: '#9ca3af', fontSize: '14px' }}>Looking up...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: COLORS.pale, borderRadius: '10px', padding: '12px 16px', border: `1px solid ${COLORS.border}` }}>
                    <div style={{ color: COLORS.dark, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>📖 Definition</div>
                    <span style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5' }}>{lookupDef}</span>
                  </div>
                  {translationLang !== 'none' && lookupTranslation && (
                    <div style={{ background: COLORS.pale, borderRadius: '10px', padding: '12px 16px', border: `1px solid ${COLOR}60` }}>
                      <div style={{ color: COLOR, fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{currentLang?.label}</div>
                      <span style={{ color: '#374151', fontSize: '15px', lineHeight: '1.5' }}>{lookupTranslation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
