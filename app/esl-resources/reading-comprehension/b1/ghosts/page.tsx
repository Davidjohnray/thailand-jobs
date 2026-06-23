'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const ACCENT = '#7c3aed'

const PARTS = [
  {
    id: 1,
    title: 'What Are Ghosts?',
    emoji: '👻',
    text: `People have believed in ghosts for thousands of years. A ghost is usually described as the spirit of a dead person that appears to the living. Stories about ghosts exist in almost every culture around the world, from ancient Egypt and China to modern Europe and America.

Many people say they have seen a ghost. They describe shapes, lights, or figures that appear and then disappear. Some people say they hear strange sounds, like footsteps or voices, in empty rooms. Others say they feel a sudden cold in a warm place, or that objects move by themselves.

Ghost stories have appeared in books, films, and television for many years. They are a popular form of entertainment because they are exciting and a little frightening. But for some people, ghosts are not just stories — they are a real part of life.

In Thailand and many other Asian countries, belief in spirits is very common. People leave offerings of food and flowers for the spirits of their ancestors. Many homes have a spirit house in the garden, where the family leaves gifts to keep the local spirits happy.`,
    vocab: [
      { word: 'spirit', def: 'the part of a person that some people believe continues after death' },
      { word: 'ancestor', def: 'a family member who lived a long time ago' },
      { word: 'offering', def: 'a gift given to a god, spirit, or holy place' },
      { word: 'figure', def: 'a shape that looks like a person' },
    ],
    questions: [
      'Do you believe in ghosts? Why or why not?',
      'Have you ever heard a ghost story from your family or friends?',
      'Why do you think ghost stories are so popular in films and books?',
    ],
  },
  {
    id: 2,
    title: 'Famous Ghost Stories',
    emoji: '🏚️',
    text: `Some of the most famous ghost stories are connected to old buildings. People often believe that ghosts stay in places where something terrible happened. Castles, old houses, and hospitals are common places for ghost sightings.

The Tower of London in England is one of the most famous haunted places in the world. Many people were killed there hundreds of years ago. Today, visitors and guards say they have seen the ghost of Anne Boleyn, who was executed there in 1536. Some guards say they have even spoken to the ghost before realising it was not a real person.

In Japan, there is a famous type of ghost called a "yurei." These are usually the spirits of people who died with strong feelings of anger or sadness. Many Japanese horror films are based on yurei stories. The film "The Ring" is one well-known example.

In Thailand, one of the most feared ghosts is "Phi Tai Hong" — the spirit of someone who died suddenly and violently. This spirit is said to be angry and dangerous. People perform special ceremonies to calm these spirits and help them move on peacefully.`,
    vocab: [
      { word: 'haunted', def: 'a place where people believe ghosts live or appear' },
      { word: 'executed', def: 'killed as a punishment, often by the government' },
      { word: 'sighting', def: 'an occasion when someone sees something unusual' },
      { word: 'ceremony', def: 'a formal event with special actions, often religious' },
    ],
    questions: [
      'Do you know any famous haunted places in your country?',
      'Would you visit a haunted building? Why or why not?',
      'Why do you think some cultures have more ghost stories than others?',
    ],
  },
  {
    id: 3,
    title: 'What Does Science Say?',
    emoji: '🔬',
    text: `Scientists do not believe that ghosts are real. They say there is no scientific evidence that the spirits of dead people can appear to the living. But they do try to explain why so many people report seeing or feeling ghosts.

One explanation is the human brain. Our brains are very good at finding patterns, especially the pattern of a human face or figure. Sometimes the brain sees a pattern that is not really there — for example, a face in the shadows, or a figure in the mist. This is called "pareidolia."

Another explanation is infrasound. This is sound at a very low frequency that humans cannot normally hear. Studies have shown that infrasound can make people feel uneasy, anxious, or even cause them to see things that are not there. Old buildings sometimes produce infrasound from wind or machines.

Sleep paralysis is another possible explanation. This happens when a person wakes up but cannot move their body. During sleep paralysis, people often see frightening figures in the room. Many scientists believe that some ghost experiences happen during sleep paralysis.`,
    vocab: [
      { word: 'evidence', def: 'facts or information that help prove something is true' },
      { word: 'pareidolia', def: 'seeing a familiar pattern, like a face, in a random image' },
      { word: 'infrasound', def: 'very low sound that humans cannot normally hear' },
      { word: 'paralysis', def: 'the inability to move part or all of the body' },
    ],
    questions: [
      'Do you find the scientific explanations convincing? Why or why not?',
      'Have you ever seen a face or figure in something like clouds or shadows?',
      'If science cannot fully explain something, does that mean it might be supernatural?',
    ],
  },
  {
    id: 4,
    title: 'Why Do We Fear and Love Ghost Stories?',
    emoji: '😱',
    text: `Even people who do not believe in ghosts often enjoy ghost stories. Psychologists say this is because fear can be exciting when we know we are safe. Watching a scary film or hearing a ghost story gives us the feeling of danger without any real risk. This produces a rush of adrenaline that many people enjoy.

Ghost stories also help us think about death and what might happen after we die. These are questions that all humans have. Stories about ghosts offer one possible answer — that something continues after death. For many people, this is a comforting idea.

Ghost stories connect us to the past. They are often set in old places and involve people from history. This can make history feel real and exciting. Many people visit haunted places as a form of historical tourism.

Finally, ghost stories bring people together. Telling scary stories around a fire or watching a horror film with friends is a social activity. The shared feeling of fear and excitement is something people enjoy doing together. Ghost stories, whether we believe them or not, are an important part of human culture.`,
    vocab: [
      { word: 'psychologist', def: 'a scientist who studies the human mind and behaviour' },
      { word: 'adrenaline', def: 'a chemical in the body that increases when we are excited or afraid' },
      { word: 'comforting', def: 'making someone feel less worried or sad' },
      { word: 'supernatural', def: 'events that cannot be explained by science or natural laws' },
    ],
    questions: [
      'Do you enjoy scary films or ghost stories? What do you like or dislike about them?',
      'Do you think ghost stories help people deal with the idea of death? How?',
      'What is your favourite ghost story — from your culture, a film, or a book?',
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
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next, system: `You are a friendly B1-level English conversation partner discussing "${partTitle}" from a reading lesson about ghosts. Keep responses short (2-3 sentences), use simple vocabulary appropriate for B1 level, ask one follow-up question, and be encouraging.` }) })
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
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false) }
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

export default function GhostsLesson() {
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
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: 1.3 }}>Ghosts — Do They Really Exist?</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '16px', margin: 0, lineHeight: 1.6 }}>Stories of the supernatural, famous hauntings, and what science says about things that go bump in the night.</p>
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
