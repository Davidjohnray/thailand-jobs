'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const ACCENT = '#7c3aed'

const PARTS = [
  {
    id: 1,
    title: 'What Is a Near-Death Experience?',
    emoji: '✨',
    text: `A near-death experience, or NDE, is something that some people report after coming very close to death. This can happen during a serious accident, a heart attack, or during a difficult operation. The person is usually unconscious — sometimes their heart has even stopped — but later they wake up and describe remarkable things they experienced.

The reports from different people around the world are surprisingly similar. Many people describe a feeling of peace and calmness, even though their body was in danger. Some people say they left their body and looked down at it from above. Others describe moving through a long, dark tunnel towards a bright light.

Many people describe meeting people they knew who had already died — friends or family members who seemed happy and well. Some people say they felt complete love and warmth. Many describe not wanting to come back to their body, but feeling that it was not their time to die.

Near-death experiences are not new. Reports of these experiences have been found in ancient texts from Greece, Egypt, and China. In 1975, a doctor called Raymond Moody collected over 150 NDE stories and published a famous book called "Life After Life." This made the subject well-known around the world.`,
    vocab: [
      { word: 'unconscious', def: 'not awake; unable to feel or respond to the world around you' },
      { word: 'remarkable', def: 'very unusual or surprising; deserving attention' },
      { word: 'tunnel', def: 'a long passage under the ground or through a mountain' },
      { word: 'ancient', def: 'from a very long time ago in history' },
    ],
    questions: [
      'Have you ever heard of a near-death experience before? What did you think of it?',
      'Why do you think so many people from different countries describe similar experiences?',
      'Would you be frightened or comforted to hear someone describe their NDE?',
    ],
  },
  {
    id: 2,
    title: 'Famous Stories of NDEs',
    emoji: '🌟',
    text: `One of the most well-known NDE stories is that of Eben Alexander, an American brain doctor. In 2008, he got a serious brain infection and fell into a coma. His doctors thought he would not survive. During his coma, he says he experienced a beautiful world of light, music, and love. When he woke up, he wrote a book about his experience called "Proof of Heaven." His story was special because, as a scientist, he had never believed in life after death before.

Another famous case is that of Pam Reynolds, an American musician. During brain surgery in 1991, her body temperature was lowered and her heart was stopped. She later described watching her own operation from above the room. She could describe the medical tools the doctors used and the music that was playing in the operating theatre — things she could not have known if she had been unconscious.

In Thailand and other Buddhist countries, NDE stories often have a different quality. People describe meeting monks or holy figures, or seeing beautiful temples and gardens. This suggests that a person's culture and beliefs may influence what they experience during an NDE.

Many hospitals around the world now have doctors who study NDEs. They collect stories from patients and try to understand what these experiences mean for our understanding of the human mind.`,
    vocab: [
      { word: 'coma', def: 'a state of deep unconsciousness that lasts a long time' },
      { word: 'infection', def: 'an illness caused by bacteria or a virus entering the body' },
      { word: 'surgeon', def: 'a doctor who performs operations on the body' },
      { word: 'influence', def: 'to have an effect on how someone thinks or what they do' },
    ],
    questions: [
      'Do you think Pam Reynolds really watched her operation from outside her body? Why or why not?',
      'Why might different cultures have different types of NDE stories?',
      'Would you want to read a book written by someone who had an NDE?',
    ],
  },
  {
    id: 3,
    title: 'What Does Science Say?',
    emoji: '🔬',
    text: `Scientists have several explanations for near-death experiences. Most scientists believe that NDEs are created by the brain, not by an actual journey to another world.

One explanation involves oxygen. When the brain does not receive enough oxygen, it can behave in unusual ways. Some studies have found that a dying brain can produce a large burst of electrical activity in the final moments. This activity could create vivid visions and feelings. Some scientists compare this to a kind of "final dream" produced by the brain.

Another scientific theory involves chemicals. The brain produces natural chemicals that can cause feelings of happiness, love, and even visions. One chemical called DMT has been suggested as a possible cause of the tunnel of light and feelings of peace that many NDE patients describe.

The "out of body" feeling — the sense of floating above yourself — can be explained by the brain losing its sense of where the body is in space. Scientists have managed to create this feeling in healthy people by stimulating certain areas of the brain.

However, some researchers point out that these explanations do not fully explain all the details people report, such as Pam Reynolds knowing exactly what happened during her operation. The debate between scientists and those who believe in the spiritual explanation for NDEs continues today.`,
    vocab: [
      { word: 'oxygen', def: 'a gas in the air that living things need to survive' },
      { word: 'vivid', def: 'very clear, bright, and detailed — easy to remember' },
      { word: 'stimulating', def: 'causing activity in part of the body or brain' },
      { word: 'theory', def: 'an idea that tries to explain why something happens' },
    ],
    questions: [
      'Which scientific explanation do you find most convincing? Why?',
      'Do you think science will ever fully explain NDEs? Why or why not?',
      'Is it possible that both science and spiritual beliefs are partly correct about NDEs?',
    ],
  },
  {
    id: 4,
    title: 'How NDEs Change People\'s Lives',
    emoji: '🦋',
    text: `One of the most interesting things about near-death experiences is the effect they have on people afterwards. Studies have found that most people who have an NDE change significantly as a result.

Many people become less afraid of death after an NDE. They say they now know that death is not the end, and this gives them a feeling of peace. Some people feel that their life now has a deeper meaning or purpose. They often become more interested in helping others and less interested in money or material things.

Many NDE survivors say they feel more love for the people around them. They often repair broken relationships with family members or old friends. Some people change their careers completely — for example, doctors who had NDEs sometimes say they became more caring and patient with their patients.

NDEs can also bring difficulties. Some people find it hard to talk about their experience because they are worried others will not believe them. Some people feel confused — they were happy in their NDE world and find it difficult to return to normal life.

For researchers, the long-term effects of NDEs are just as interesting as the experience itself. Whether NDEs are spiritual, scientific, or both, they clearly have a powerful and lasting effect on the people who have them. They remind us how little we truly understand about the human mind, consciousness, and the great mystery of what happens when we die.`,
    vocab: [
      { word: 'significantly', def: 'in a way that is large or important enough to be noticed' },
      { word: 'consciousness', def: 'the state of being awake and aware of your thoughts and feelings' },
      { word: 'purpose', def: 'the reason why something is done, or why you exist' },
      { word: 'material', def: 'relating to physical objects and money, rather than feelings or spirit' },
    ],
    questions: [
      'If you had an NDE, how do you think it would change your life?',
      'Why do you think NDEs make people less afraid of death?',
      'What do you think consciousness is? Is it just the brain, or something more?',
    ],
  },
]

function ListenBtn({ text, small }: { text: string; small?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const play = async () => {
    if (playing) { sourceRef.current?.stop(); setPlaying(false); return }
    setPlaying(true)
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice: 'nova' }) })
      const buf = await res.arrayBuffer()
      const ctx = new AudioContext()
      const decoded = await ctx.decodeAudioData(buf)
      const source = ctx.createBufferSource()
      source.buffer = decoded
      source.connect(ctx.destination)
      sourceRef.current = source
      source.start()
      source.onended = () => setPlaying(false)
    } catch { setPlaying(false) }
  }
  return (
    <button onClick={play} style={{ background: playing ? '#7c3aed' : '#ede9fe', color: playing ? 'white' : '#7c3aed', border: 'none', borderRadius: small ? '6px' : '8px', padding: small ? '4px 10px' : '7px 14px', fontSize: small ? '12px' : '13px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {playing ? '■ Stop' : '🔊 Listen'}
    </button>
  )
}

function TranslateBtn({ text }: { text: string }) {
  const open = () => window.open(`https://translate.google.com/?sl=en&tl=th&text=${encodeURIComponent(text)}`, '_blank')
  return (
    <button onClick={open} style={{ background: '#fef9c3', color: '#854d0e', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
      🌍 Translate
    </button>
  )
}

function ConversationBox({ partTitle }: { partTitle: string }) {
  const [msgs, setMsgs] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const recRef = useRef<any>(null)

  const send = async (text: string) => {
    if (!text.trim()) return
    const next = [...msgs, { role: 'user', content: text }]
    setMsgs(next); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next, system: `You are a friendly B1-level English conversation partner discussing "${partTitle}" from a reading lesson about near-death experiences. Keep responses short (2-3 sentences), use simple vocabulary appropriate for B1 level, ask one follow-up question, and be encouraging.` }) })
      const data = await res.json()
      setMsgs([...next, { role: 'assistant', content: data.content?.[0]?.text || '' }])
    } catch { setLoading(false) }
    setLoading(false)
  }

  const toggleVoice = () => {
    if (listening) { recRef.current?.stop(); setListening(false); return }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR(); rec.lang = 'en-US'; rec.interimResults = false
    rec.onresult = (e: SpeechRecognitionEvent) => { setInput(e.results[0][0].transcript); setListening(false) }
    rec.onend = () => setListening(false)
    rec.start(); recRef.current = rec; setListening(true)
  }

  return (
    <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
      <div style={{ fontWeight: '700', color: '#6d28d9', marginBottom: '10px', fontSize: '14px' }}>🤖 AI Conversation Practice</div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {msgs.length === 0 && <div style={{ color: '#9ca3af', fontSize: '13px' }}>Start a conversation about this topic…</div>}
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#7c3aed' : 'white', color: m.role === 'user' ? 'white' : '#1a1a2e', borderRadius: '10px', padding: '8px 12px', fontSize: '14px', maxWidth: '85%', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: '#9ca3af', fontSize: '13px' }}>Typing…</div>}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} placeholder="Type your answer…" style={{ flex: 1, border: '1px solid #ddd6fe', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', outline: 'none' }} />
        <button onClick={toggleVoice} style={{ background: listening ? '#ef4444' : '#ede9fe', color: listening ? 'white' : '#7c3aed', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>{listening ? '■' : '🎤'}</button>
        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>Send</button>
      </div>
    </div>
  )
}

function HighlightPopup({ children }: { children: React.ReactNode }) {
  const [popup, setPopup] = useState<{ word: string; x: number; y: number } | null>(null)
  const handleMouseUp = () => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) { setPopup(null); return }
    const word = sel.toString().trim()
    if (!word) return
    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    setPopup({ word, x: rect.left + rect.width / 2, y: rect.top + window.scrollY - 10 })
  }
  return (
    <div onMouseUp={handleMouseUp}>
      {children}
      {popup && (
        <div style={{ position: 'absolute', top: popup.y, left: popup.x, transform: 'translate(-50%, -100%)', background: '#1a1a2e', borderRadius: '10px', padding: '8px 12px', display: 'flex', gap: '8px', zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <ListenBtn text={popup.word} small />
          <TranslateBtn text={popup.word} />
          <button onClick={() => setPopup(null)} style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
        </div>
      )}
    </div>
  )
}

export default function NDELesson() {
  const [openPart, setOpenPart] = useState(1)

  return (
    <main style={{ background: '#f4f6fa', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/esl-resources/reading-comprehension/b1" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← B1 Reading</Link>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>B1 Intermediate</span>
            <span style={{ background: 'rgba(124,58,237,0.5)', color: 'white', fontSize: '12px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px' }}>Mystery & the Unknown</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px' }}>4 Parts · 12 Questions</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: 1.3 }}>Near-Death Experiences</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', margin: 0, lineHeight: 1.6 }}>Tunnels of light, meetings with the dead, and out-of-body journeys — what happens when we come close to death?</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[{ icon: '📄', label: '4 reading parts' }, { icon: '💬', label: '12 discussion questions' }, { icon: '📚', label: '16 vocabulary words' }, { icon: '✍️', label: 'Highlight any text' }, { icon: '🌍', label: 'Multi-language lookup' }, { icon: '🤖', label: 'AI conversation partner' }].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}><span>{s.icon}</span> {s.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Part tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '4px', overflowX: 'auto' }}>
          {PARTS.map(p => (
            <button key={p.id} onClick={() => setOpenPart(p.id)} style={{ padding: '14px 18px', border: 'none', borderBottom: openPart === p.id ? `3px solid ${ACCENT}` : '3px solid transparent', background: 'none', color: openPart === p.id ? ACCENT : '#6b7280', fontWeight: openPart === p.id ? '700' : '500', fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {p.emoji} Part {p.id}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
        {PARTS.filter(p => p.id === openPart).map(part => (
          <div key={part.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>{part.emoji} Part {part.id}: {part.title}</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <ListenBtn text={part.text} />
                <TranslateBtn text={part.text} />
              </div>
            </div>

            <HighlightPopup>
              <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px', fontSize: '16px', lineHeight: '1.85', color: '#2d2d2d' }}>
                {part.text.split('\n\n').map((para, i) => <p key={i} style={{ margin: '0 0 16px' }}>{para}</p>)}
              </div>
            </HighlightPopup>

            {/* Vocabulary */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' }}>📚 Vocabulary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                {part.vocab.map(v => (
                  <div key={v.word} style={{ background: '#f5f3ff', borderRadius: '10px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '700', color: ACCENT, fontSize: '16px' }}>{v.word}</span>
                      <ListenBtn text={v.word} small />
                    </div>
                    <span style={{ color: '#4b5563', fontSize: '14px' }}>{v.def}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Discussion */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' }}>💬 Discussion Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {part.questions.map((q, i) => (
                  <div key={i} style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ background: ACCENT, color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: '15px', color: '#2d2d2d', lineHeight: 1.6 }}>{q}</span>
                  </div>
                ))}
              </div>
              <ConversationBox partTitle={`Part ${part.id}: ${part.title}`} />
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              {openPart > 1 ? (
                <button onClick={() => setOpenPart(openPart - 1)} style={{ background: 'white', color: ACCENT, border: `2px solid ${ACCENT}`, borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>← Previous Part</button>
              ) : <div />}
              {openPart < PARTS.length ? (
                <button onClick={() => setOpenPart(openPart + 1)} style={{ background: ACCENT, color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Next Part →</button>
              ) : (
                <Link href="/esl-resources/reading-comprehension/b1" style={{ background: ACCENT, color: 'white', textDecoration: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', fontSize: '14px' }}>← Back to B1 Lessons</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
