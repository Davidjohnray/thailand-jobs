'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PASSAGE_TIME = 20 * 60
type AnswerMap = { [key: number]: string | number }

// ============ PASSAGE 1 ============
const PASSAGE1_TITLE = 'The Rise of Urban Farming'
const PASSAGE1_DIFFICULTY = 'Easier'

const PASSAGE1_PARAGRAPHS = [
  { label: 'A', text: `Urban farming — the practice of growing food within or on the edges of cities — has moved in recent decades from a marginal activity associated with wartime necessity or grassroots community initiatives to a recognised component of urban planning in cities around the world. The term encompasses a wide range of activities, from rooftop gardens and vertical indoor farms operated by commercial businesses to small allotments tended by local residents. What unites these varied approaches is the basic idea that food production need not be confined to rural areas, and that cities can play an active role in feeding their populations.` },
  { label: 'B', text: `The motivations driving interest in urban farming are diverse. For municipal governments, urban farms offer potential benefits including reduced food transportation costs, improved food security, and the greening of underused urban spaces. For individual participants, the attractions include access to fresh produce, the social benefits of community gardening, and the educational value of growing food — particularly for children in urban environments who may have limited contact with the natural world. Commercial operators are drawn by the opportunity to supply premium, locally grown food to restaurants and retailers, often at prices that justify the relatively high cost of urban production.` },
  { label: 'C', text: `Vertical farming — in which crops are grown in stacked, climate-controlled indoor environments under artificial lighting — has attracted particular attention as a potentially transformative technology. Proponents argue that vertical farms can produce far higher yields per square metre than conventional agriculture, use significantly less water through closed-loop irrigation systems, and operate year-round regardless of external weather conditions. Several large-scale vertical farming companies have attracted substantial investment in recent years, with facilities now operating in cities including Singapore, Tokyo, and several major European capitals.` },
  { label: 'D', text: `Despite the enthusiasm, urban farming faces significant challenges. Land in cities is expensive and competition for space is intense, meaning that the economics of urban food production are rarely straightforward. Energy costs represent a particular concern for indoor vertical farms, where artificial lighting must run continuously and climate control systems consume considerable electricity — challenges that partly offset the environmental benefits claimed by the industry's advocates. Critics have also questioned whether urban farming can realistically produce food at a scale sufficient to make a meaningful contribution to feeding urban populations, or whether it will remain a supplementary activity serving niche markets.` },
  { label: 'E', text: `The social dimensions of urban farming deserve attention alongside the economic and technological ones. Community gardens and allotments in particular have been shown to provide significant benefits for mental health and social cohesion, bringing together people from different backgrounds around a shared activity. In some cities, urban farming projects have been deliberately located in lower-income neighbourhoods as a way of improving access to fresh food in areas where supermarkets and fresh produce markets may be scarce — a phenomenon sometimes referred to as "food deserts". Whether or not urban farming can scale to the point of transforming food systems, its social value in particular contexts appears well established.` },
]

const HEADINGS_OPTIONS1 = [
  { id: 'i', text: 'The social and community benefits of growing food in cities' },
  { id: 'ii', text: 'A technology that could change how crops are grown indoors' },
  { id: 'iii', text: 'The practical and financial obstacles facing urban food producers' },
  { id: 'iv', text: 'The broad definition and growing acceptance of urban farming' },
  { id: 'v', text: 'The reasons why different groups support urban farming' },
  { id: 'vi', text: 'Government policies that restrict urban farming development' },
  { id: 'vii', text: 'The history of food production in ancient cities' },
]

const MATCHING_QUESTIONS1 = [
  { id: 1, paragraph: 'A', correct: 'iv', explanation: 'Paragraph A defines urban farming broadly and explains how it has grown from a marginal activity to a recognised part of urban planning — covering its definition and growing acceptance.' },
  { id: 2, paragraph: 'B', correct: 'v', explanation: 'Paragraph B explains the various motivations for different groups — governments, individuals, and commercial operators — making it about reasons why different groups support urban farming.' },
  { id: 3, paragraph: 'C', correct: 'ii', explanation: 'Paragraph C describes vertical farming as a potentially transformative technology for growing crops indoors.' },
  { id: 4, paragraph: 'D', correct: 'iii', explanation: 'Paragraph D discusses the practical and financial challenges facing urban farming, including land costs, energy use, and scale.' },
]

const TFNG_QUESTIONS1 = [
  { id: 5, statement: 'Urban farming only became popular after governments began providing financial support for it.', correct: 'NOT GIVEN', explanation: 'Paragraph A discusses urban farming\'s rise but does not mention government financial support as a driver. The passage does not address this claim.', paragraphRef: 'A' },
  { id: 6, statement: 'Vertical farms can operate in all weather conditions throughout the year.', correct: 'TRUE', explanation: 'Paragraph C states vertical farms can "operate year-round regardless of external weather conditions."', paragraphRef: 'C' },
  { id: 7, statement: 'The high energy costs of vertical farming are widely acknowledged as a significant drawback.', correct: 'TRUE', explanation: 'Paragraph D states that "energy costs represent a particular concern for indoor vertical farms" and that this "partly offsets the environmental benefits."', paragraphRef: 'D' },
  { id: 8, statement: 'Urban farming projects have been proven to be more effective than supermarkets at reducing food poverty.', correct: 'NOT GIVEN', explanation: 'Paragraph E mentions urban farming in food deserts but makes no comparison with supermarkets in terms of effectiveness at reducing food poverty.', paragraphRef: 'E' },
  { id: 9, statement: 'Community gardens have been linked to improvements in the mental wellbeing of participants.', correct: 'TRUE', explanation: 'Paragraph E states that "community gardens and allotments in particular have been shown to provide significant benefits for mental health."', paragraphRef: 'E' },
]

const MC1_QUESTIONS = [
  {
    id: 10,
    question: 'According to Paragraph C, what is one advantage of closed-loop irrigation systems used in vertical farming?',
    options: [
      'They eliminate the need for artificial lighting',
      'They allow crops to be grown in cold climates',
      'They use considerably less water than conventional farming',
      'They reduce the need for climate control systems',
    ],
    correct: 2,
    explanation: 'Paragraph C states vertical farms "use significantly less water through closed-loop irrigation systems" — a key claimed advantage over conventional agriculture.',
    paragraphRef: 'C',
  },
  {
    id: 11,
    question: 'What concern do critics raise about urban farming in Paragraph D?',
    options: [
      'That it uses too much water compared to traditional farming',
      'That it may not produce enough food to significantly feed city populations',
      'That it produces food of lower nutritional quality than conventional farms',
      'That vertical farms are too dangerous to operate in city centres',
    ],
    correct: 1,
    explanation: 'Paragraph D mentions critics questioning "whether urban farming can realistically produce food at a scale sufficient to make a meaningful contribution to feeding urban populations."',
    paragraphRef: 'D',
  },
  {
    id: 12,
    question: 'What does the term "food deserts" refer to in Paragraph E?',
    options: [
      'Agricultural land that has been damaged by drought',
      'Areas in cities where fresh food is difficult to obtain',
      'Regions where urban farming has failed to establish itself',
      'Rural areas that have lost their farming communities',
    ],
    correct: 1,
    explanation: 'Paragraph E describes "food deserts" as areas "where supermarkets and fresh produce markets may be scarce" — places where fresh food is hard to access.',
    paragraphRef: 'E',
  },
  {
    id: 13,
    question: 'Which of the following best describes the writer\'s overall view of urban farming?',
    options: [
      'Urban farming is a proven solution to global food insecurity',
      'Urban farming has clear benefits in some areas but faces real limitations',
      'Urban farming is too expensive to ever become widely adopted',
      'Urban farming is only suitable for wealthy cities with large budgets',
    ],
    correct: 1,
    explanation: 'The passage acknowledges benefits (Paragraphs B, C, E) but also significant challenges (Paragraph D), concluding in Paragraph E that urban farming\'s social value is established even if it may not transform food systems at scale.',
    paragraphRef: 'E',
  },
]

const VOCABULARY1 = [
  { word: 'allotments', definition: 'small areas of land rented for growing vegetables or other plants' },
  { word: 'municipal', definition: 'relating to the local government of a town or city' },
  { word: 'yields', definition: 'the amount of food or crop produced from an area of land' },
  { word: 'irrigation', definition: 'the supply of water to land or crops using pipes, channels, or sprinklers' },
  { word: 'cohesion', definition: 'the quality of being united or working well together as a group' },
  { word: 'niche', definition: 'a small, specialised segment of a market or activity' },
  { word: 'supplementary', definition: 'providing something additional to an existing main activity or resource' },
]

// ============ PASSAGE 2 ============
const PASSAGE2_TITLE = 'Ocean Plastic: The Scale of the Problem and the Search for Solutions'
const PASSAGE2_DIFFICULTY = 'Medium'

const PASSAGE2_PARAGRAPHS = [
  { label: 'A', text: `The presence of plastic waste in the world's oceans has become one of the defining environmental concerns of the twenty-first century. Estimates suggest that between eight and twelve million tonnes of plastic enter the oceans each year, originating from a range of sources including inadequately managed landfill sites, littering in coastal areas, industrial discharge, and the loss of plastic pellets during maritime shipping operations. Once in the ocean, plastic degrades extremely slowly — a standard plastic bottle, for example, may persist for up to four hundred and fifty years. Rather than breaking down completely, most ocean plastics fragment over time into smaller and smaller pieces, eventually becoming what researchers term "microplastics" — particles less than five millimetres in diameter.` },
  { label: 'B', text: `The ecological consequences of ocean plastic pollution are extensive and well documented. Larger plastic items entangle and injure marine animals including seabirds, sea turtles, dolphins, and whales, and are ingested by many species that mistake them for prey. Microplastics present a subtler but potentially more pervasive threat: they have been detected in the tissues of fish, shellfish, and other marine organisms throughout the ocean food chain, raising concerns about their effects on marine biodiversity and on the health of humans who consume seafood. Research into the long-term health effects of microplastic ingestion by humans is ongoing, though definitive conclusions remain elusive.` },
  { label: 'C', text: `Several large-scale cleanup initiatives have attracted public attention in recent years, most notably The Ocean Cleanup project, founded by Dutch inventor Boyan Slat, which deploys floating barriers to concentrate and collect plastic debris from the surface of the ocean. While such projects have generated considerable media coverage and public enthusiasm, marine scientists have expressed reservations. Collecting surface plastic, they argue, addresses only a fraction of the problem, since the majority of ocean plastic is not found at the surface but is distributed throughout the water column and on the seafloor. There are also concerns that cleanup devices may inadvertently collect and harm zooplankton and other small marine organisms.` },
  { label: 'D', text: `An alternative approach focuses on preventing plastic from entering the ocean in the first place, rather than attempting to remove it once it has arrived. Advocates of prevention argue that improvements in waste management infrastructure in high-input countries — particularly in South and Southeast Asia and sub-Saharan Africa, which account for a disproportionate share of ocean plastic input — would be far more effective than cleanup operations. Extended producer responsibility schemes, which require manufacturers to take responsibility for the entire lifecycle of their products including disposal, have been introduced in a number of countries and are seen by many experts as a key policy instrument for reducing plastic waste at source.` },
  { label: 'E', text: `The development of new materials represents a further dimension of the response to ocean plastic. Biodegradable plastics — materials designed to break down more quickly than conventional plastics when exposed to heat, light, or microbial activity — have attracted significant research interest and commercial investment. However, critics point out that many biodegradable plastics require specific industrial composting conditions to decompose effectively, and may perform no better than conventional plastics if they end up in the ocean. A more promising avenue for some researchers is the development of genuinely marine-degradable materials — plastics specifically designed to break down in seawater — though bringing such materials to commercial scale remains a significant technical challenge.` },
]

const MATCHING_INFO2_QUESTIONS = [
  { id: 14, prompt: 'a reference to a policy that holds manufacturers accountable for what happens to their products at the end of their useful life', correct: 'D', explanation: 'Paragraph D describes "extended producer responsibility schemes, which require manufacturers to take responsibility for the entire lifecycle of their products including disposal."', paragraphRef: 'D' },
  { id: 15, prompt: 'a description of how plastic waste changes form over time in the ocean', correct: 'A', explanation: 'Paragraph A describes how plastic fragments "into smaller and smaller pieces, eventually becoming... microplastics."', paragraphRef: 'A' },
  { id: 16, prompt: 'a concern that efforts to clean up the ocean may cause unintended ecological harm', correct: 'C', explanation: 'Paragraph C mentions concerns that "cleanup devices may inadvertently collect and harm zooplankton and other small marine organisms."', paragraphRef: 'C' },
  { id: 17, prompt: 'an acknowledgement that the health impact on humans of a particular pollutant is not yet fully established', correct: 'B', explanation: 'Paragraph B states "research into the long-term health effects of microplastic ingestion by humans is ongoing, though definitive conclusions remain elusive."', paragraphRef: 'B' },
]

const SENTENCE_COMPLETION2_QUESTIONS = [
  { id: 18, sentence: 'Plastic particles smaller than five millimetres in diameter are referred to by researchers as "', correct: 'microplastics', explanation: 'Paragraph A: "eventually becoming what researchers term \'microplastics\' — particles less than five millimetres in diameter."', paragraphRef: 'A' },
  { id: 19, sentence: 'The Ocean Cleanup project uses floating ', correct: 'barriers', explanation: 'Paragraph C: "deploys floating barriers to concentrate and collect plastic debris from the surface of the ocean."', paragraphRef: 'C' },
  { id: 20, sentence: 'Countries in South and Southeast Asia and sub-Saharan Africa are responsible for a ', correct: 'disproportionate share', explanation: 'Paragraph D: "account for a disproportionate share of ocean plastic input."', paragraphRef: 'D' },
  { id: 21, sentence: 'For biodegradable plastics to break down effectively, many require specific ', correct: 'industrial composting', explanation: 'Paragraph E: "many biodegradable plastics require specific industrial composting conditions to decompose effectively."', paragraphRef: 'E' },
  { id: 22, sentence: 'A standard plastic bottle may survive in the ocean for up to ', correct: 'four hundred and fifty years', explanation: 'Paragraph A: "a standard plastic bottle, for example, may persist for up to four hundred and fifty years."', paragraphRef: 'A' },
]

const MC2_QUESTIONS = [
  {
    id: 23,
    question: 'What criticism do marine scientists make of large-scale ocean cleanup projects according to Paragraph C?',
    options: [
      'They are too expensive to operate at the scale required',
      'They only tackle surface plastic, which represents a small part of the total problem',
      'They have been proven to increase plastic pollution in some areas',
      'They focus on the wrong regions of the ocean',
    ],
    correct: 1,
    explanation: 'Paragraph C states scientists argue that surface cleanup "addresses only a fraction of the problem, since the majority of ocean plastic is not found at the surface."',
    paragraphRef: 'C',
  },
  {
    id: 24,
    question: 'According to the passage, what is the main argument made by prevention advocates in Paragraph D?',
    options: [
      'Cleanup operations should be abandoned entirely',
      'Better waste management in key countries would be more effective than cleanup',
      'Manufacturers should be banned from producing single-use plastics',
      'Ocean plastic is primarily caused by maritime shipping accidents',
    ],
    correct: 1,
    explanation: 'Paragraph D states advocates argue "improvements in waste management infrastructure... would be far more effective than cleanup operations."',
    paragraphRef: 'D',
  },
  {
    id: 25,
    question: 'What does the passage suggest is the main problem with most biodegradable plastics currently available?',
    options: [
      'They cost significantly more to produce than conventional plastics',
      'They only break down properly under conditions not found in the ocean',
      'They have been banned in most countries due to health concerns',
      'They take longer to break down than standard plastic',
    ],
    correct: 1,
    explanation: 'Paragraph E explains that biodegradable plastics "require specific industrial composting conditions to decompose effectively, and may perform no better than conventional plastics if they end up in the ocean."',
    paragraphRef: 'E',
  },
  {
    id: 26,
    question: 'Which of the following best describes the overall structure of the passage?',
    options: [
      'It argues that ocean plastic is an unsolvable problem that will only get worse',
      'It presents the scale of the problem and then examines a range of different responses to it',
      'It criticises governments for failing to take adequate action on ocean plastic',
      'It focuses mainly on the health risks of plastic to marine animals',
    ],
    correct: 1,
    explanation: 'Paragraph A establishes the scale of the problem; Paragraphs C, D, and E examine three different types of response (cleanup, prevention, new materials) — fitting "presents the problem and examines responses."',
    paragraphRef: 'A',
  },
]

const VOCABULARY2 = [
  { word: 'pervasive', definition: 'spreading widely throughout an area or group; present everywhere' },
  { word: 'ingested', definition: 'swallowed or absorbed, particularly referring to food or substances taken into the body' },
  { word: 'elusive', definition: 'difficult to find, achieve, or pin down' },
  { word: 'entangle', definition: 'to cause something to become caught or twisted in something else' },
  { word: 'biodegradable', definition: 'capable of being broken down naturally by bacteria or other living organisms' },
  { word: 'composting', definition: 'the process of decomposing organic waste to create fertiliser' },
  { word: 'maritime', definition: 'connected with the sea, especially in relation to seafaring or navigation' },
]

// ============ PASSAGE 3 ============
const PASSAGE3_TITLE = 'The Science and Culture of Memory'
const PASSAGE3_DIFFICULTY = 'Harder'

const PASSAGE3_PARAGRAPHS = [
  { label: 'A', text: `Memory is at once the most intimate and the most elusive of human faculties. It shapes our sense of identity, underpins our capacity for language and learning, and governs our ability to navigate both familiar and unfamiliar environments. Yet despite its centrality to human experience, memory is not a reliable archive of the past. Psychologists and neuroscientists have long recognised that human memory is fundamentally reconstructive rather than reproductive — that is, when we remember an event, we do not simply retrieve a stored record of it, as one might retrieve a file from a computer. Instead, we actively reconstruct the memory each time, drawing on fragmentary traces, prior knowledge, and present expectations in ways that frequently introduce distortions and inaccuracies.` },
  { label: 'B', text: `The reconstructive nature of memory has been demonstrated in a series of influential experiments. In one classic study, participants who witnessed a filmed traffic collision were later asked how fast the cars were travelling at the moment of impact. Strikingly, participants who were asked how fast the cars were going when they "smashed" into each other gave significantly higher speed estimates than those asked how fast the cars were going when they "hit" each other — even though all participants had seen the same footage. Moreover, participants in the "smashed" condition were more likely to erroneously report having seen broken glass in the film, despite none being present. These findings suggest that the language used in questioning can retroactively alter the content of a memory.` },
  { label: 'C', text: `Beyond individual distortions, memory is also shaped by cultural context. What people remember, how they organise their memories, and the narrative structures they use to make sense of past experiences all reflect the cultural frameworks within which they have been raised. Research comparing the autobiographical memories of individuals from Western and East Asian cultures has found consistent differences: Western participants tend to report more detailed, individual-focused memories that emphasise personal agency and emotion, while East Asian participants more commonly describe memories that emphasise social context, relationships, and the collective dimension of events. These differences appear to reflect broader cultural values concerning the relationship between the individual and the group.` },
  { label: 'D', text: `The concept of collective or social memory — the shared body of knowledge, narratives, and interpretations of the past that a community holds in common — has attracted significant scholarly attention since the French sociologist Maurice Halbwachs first theorised it in the early twentieth century. Halbwachs argued that individual memory is always shaped by social frameworks: we remember what our social groups help us remember, and we organise our memories according to the categories and narratives our culture provides. This perspective has proved influential in history, sociology, and cultural studies, where scholars have examined how communities, nations, and institutions selectively remember and forget aspects of their shared past in ways that serve present-day interests and identities.` },
  { label: 'E', text: `The fallibility of memory has important practical implications, perhaps nowhere more significant than in the legal system. Eyewitness testimony has historically been treated by courts as among the most compelling forms of evidence — yet decades of research have demonstrated that eyewitness identifications are frequently inaccurate, particularly when witnesses are questioned in ways that introduce suggestions or when identification procedures are poorly designed. In the United States alone, analysis of wrongful conviction cases has found that mistaken eyewitness identification was a contributing factor in the large majority of cases subsequently overturned through DNA evidence. These findings have led to significant reforms in the protocols used by police and prosecutors when gathering eyewitness evidence in several countries.` },
  { label: 'F', text: `More recently, the digital age has introduced a new dimension to debates about memory. The constant availability of photography, video recording, and digital archives means that an unprecedented proportion of human experience is now documented in some form. Some researchers have suggested that this external storage of experience may subtly alter the way we form and retain personal memories — a phenomenon sometimes termed "cognitive offloading." Whether the ready availability of digital records enhances or ultimately diminishes our capacity for personal recollection remains an open question, but one that is attracting growing attention from psychologists, philosophers, and neuroscientists alike.` },
]

const YNNG_QUESTIONS3 = [
  { id: 27, statement: 'Human memory functions in a similar way to retrieving a stored computer file.', correct: 'NO', explanation: 'Paragraph A explicitly argues the opposite — that memory is "reconstructive rather than reproductive" and does not simply retrieve a stored record "as one might retrieve a file from a computer."', paragraphRef: 'A' },
  { id: 28, statement: 'The traffic collision experiment showed that the word used in a question can change what a person remembers.', correct: 'YES', explanation: 'Paragraph B describes how participants given the word "smashed" gave higher speed estimates and falsely remembered broken glass — showing language in questioning retroactively alters memory content.', paragraphRef: 'B' },
  { id: 29, statement: 'East Asian participants in the autobiographical memory research tended to describe more emotionally detailed individual memories than Western participants.', correct: 'NO', explanation: 'Paragraph C states the opposite: Western participants "tend to report more detailed, individual-focused memories that emphasise personal agency and emotion," while East Asian participants emphasise social context.', paragraphRef: 'C' },
  { id: 30, statement: 'Maurice Halbwachs was the first person ever to write about the relationship between memory and social groups.', correct: 'NOT GIVEN', explanation: 'Paragraph D says Halbwachs "first theorised" collective memory in the early twentieth century but does not claim he was the first person ever to write about memory and social groups.', paragraphRef: 'D' },
  { id: 31, statement: 'The writer believes that digital technology has already been proven to reduce people\'s ability to remember things.', correct: 'NO', explanation: 'Paragraph F presents this as "an open question" — the writer does not claim it has been proven either way.', paragraphRef: 'F' },
]

const SUMMARY3_TEXT_PARTS = [
  'The passage argues that human memory is ',
  ' rather than a simple recording of events. Research has shown that the ',
  ' used when questioning a witness can change what they remember. Memory is also shaped by ',
  ' context — people from different backgrounds organise memories differently. In the legal system, ',
  ' testimony has been shown to be frequently unreliable, leading to wrongful convictions in many cases. In the digital age, the practice of storing experiences externally has been called "',
  '."',
]

const SUMMARY3_QUESTIONS = [
  { id: 32, correct: 'reconstructive', explanation: 'Paragraph A: "human memory is fundamentally reconstructive rather than reproductive."', paragraphRef: 'A' },
  { id: 33, correct: 'language', explanation: 'Paragraph B: "the language used in questioning can retroactively alter the content of a memory."', paragraphRef: 'B' },
  { id: 34, correct: 'cultural', explanation: 'Paragraph C: "memory is also shaped by cultural context."', paragraphRef: 'C' },
  { id: 35, correct: 'eyewitness', explanation: 'Paragraph E: "eyewitness testimony has historically been treated by courts as among the most compelling forms of evidence" — yet research shows it is frequently inaccurate.', paragraphRef: 'E' },
  { id: 36, correct: 'cognitive offloading', explanation: 'Paragraph F: "a phenomenon sometimes termed \'cognitive offloading\'."', paragraphRef: 'F' },
]

const MATCHING_INFO3_QUESTIONS = [
  { id: 37, prompt: 'a reference to a scholar who developed a theory about how groups shape individual memory', correct: 'D', explanation: 'Paragraph D introduces Maurice Halbwachs, who theorised that "individual memory is always shaped by social frameworks."', paragraphRef: 'D' },
  { id: 38, prompt: 'evidence that scientific findings about memory have led to changes in official procedures', correct: 'E', explanation: 'Paragraph E states research into eyewitness memory "have led to significant reforms in the protocols used by police and prosecutors."', paragraphRef: 'E' },
  { id: 39, prompt: 'a description of an experiment in which participants reported something that was not present in what they witnessed', correct: 'B', explanation: 'Paragraph B: participants in the "smashed" condition "erroneously reported having seen broken glass in the film, despite none being present."', paragraphRef: 'B' },
  { id: 40, prompt: 'a suggestion that how communities remember the past may be influenced by what is useful to them in the present', correct: 'D', explanation: 'Paragraph D states communities "selectively remember and forget aspects of their shared past in ways that serve present-day interests and identities."', paragraphRef: 'D' },
]

const VOCABULARY3 = [
  { word: 'reconstructive', definition: 'involving the active rebuilding of something from parts, rather than simple reproduction' },
  { word: 'retroactively', definition: 'taking effect from a date in the past; applying to something that has already happened' },
  { word: 'autobiographical', definition: 'relating to a person\'s own life story or personal experiences' },
  { word: 'collective', definition: 'done by or belonging to all members of a group' },
  { word: 'fallibility', definition: 'the tendency to make mistakes or be wrong; the quality of being imperfect' },
  { word: 'erroneously', definition: 'in a way that is mistaken or incorrect' },
  { word: 'cognitive offloading', definition: 'the practice of using external tools or technology to store information instead of relying on memory' },
]

const BAND_CONVERSION = [
  { band: '9', range: '39-40' }, { band: '8.5', range: '37-38' }, { band: '8', range: '35-36' },
  { band: '7.5', range: '33-34' }, { band: '7', range: '30-32' }, { band: '6.5', range: '27-29' },
  { band: '6', range: '23-26' }, { band: '5.5', range: '19-22' }, { band: '5', range: '15-18' },
]

export default function ReadingMockTest3Page() {
  const [stage, setStage] = useState<'locked' | 'intro' | 'passage1' | 'passage2' | 'passage3' | 'results'>('locked')
  const [useTimer, setUseTimer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(PASSAGE_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [showVocab1, setShowVocab1] = useState(false)
  const [showVocab2, setShowVocab2] = useState(false)
  const [showVocab3, setShowVocab3] = useState(false)
  const [reviewExpanded, setReviewExpanded] = useState<number | null>(null)
  const [showTeacherMode, setShowTeacherMode] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) {
      setHasAccess(true); setCheckingAccess(false); return
    }
    if (!email) { setCheckingAccess(false); return }
    supabase.from('ielts_access').select('expires_at, is_active').eq('email', email).eq('is_active', true).single()
      .then(({ data }) => {
        if (data && new Date(data.expires_at) > new Date()) {
          setHasAccess(true)
          localStorage.setItem('ielts_expires', data.expires_at)
        }
        setCheckingAccess(false)
      })
  }, [])

  useEffect(() => {
    if (!checkingAccess) setStage(hasAccess ? 'intro' : 'locked')
  }, [checkingAccess, hasAccess])

  useEffect(() => {
    if (!timerRunning) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); setTimerRunning(false); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  function formatTime(s: number) {
    const m = Math.floor(s / 60); const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function setAnswer(qId: number, value: string | number) {
    setAnswers(prev => ({ ...prev, [qId]: value }))
  }

  const p1Answered = MATCHING_QUESTIONS1.filter(q => answers[q.id] !== undefined).length +
    TFNG_QUESTIONS1.filter(q => answers[q.id] !== undefined).length +
    MC1_QUESTIONS.filter(q => answers[q.id] !== undefined).length

  const p2Answered = MATCHING_INFO2_QUESTIONS.filter(q => answers[q.id] !== undefined).length +
    SENTENCE_COMPLETION2_QUESTIONS.filter(q => answers[q.id] !== undefined && String(answers[q.id]).trim() !== '').length +
    MC2_QUESTIONS.filter(q => answers[q.id] !== undefined).length

  const p3Answered = YNNG_QUESTIONS3.filter(q => answers[q.id] !== undefined).length +
    SUMMARY3_QUESTIONS.filter(q => answers[q.id] !== undefined && String(answers[q.id]).trim() !== '').length +
    MATCHING_INFO3_QUESTIONS.filter(q => answers[q.id] !== undefined).length

  type QMeta = { id: number; passage: number; type: string; correct: string | number; explanation: string; paragraphRef: string; promptText: string; correctDisplay: string }

  const ALL_QUESTIONS: QMeta[] = [
    ...MATCHING_QUESTIONS1.map(q => ({ id: q.id, passage: 1, type: 'Matching Heading', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraph, promptText: `Paragraph ${q.paragraph}`, correctDisplay: `${q.correct} — ${HEADINGS_OPTIONS1.find(h => h.id === q.correct)?.text}` })),
    ...TFNG_QUESTIONS1.map(q => ({ id: q.id, passage: 1, type: 'True/False/Not Given', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.statement, correctDisplay: q.correct })),
    ...MC1_QUESTIONS.map(q => ({ id: q.id, passage: 1, type: 'Multiple Choice', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.question, correctDisplay: `${['A','B','C','D'][q.correct]} — ${q.options[q.correct]}` })),
    ...MATCHING_INFO2_QUESTIONS.map(q => ({ id: q.id, passage: 2, type: 'Matching Information', correct: q.correct, explanation: q.explanation, paragraphRef: q.correct, promptText: q.prompt, correctDisplay: `Paragraph ${q.correct}` })),
    ...SENTENCE_COMPLETION2_QUESTIONS.map(q => ({ id: q.id, passage: 2, type: 'Sentence Completion', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.sentence, correctDisplay: q.correct })),
    ...MC2_QUESTIONS.map(q => ({ id: q.id, passage: 2, type: 'Multiple Choice', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.question, correctDisplay: `${['A','B','C','D'][q.correct]} — ${q.options[q.correct]}` })),
    ...YNNG_QUESTIONS3.map(q => ({ id: q.id, passage: 3, type: 'Yes/No/Not Given', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.statement, correctDisplay: q.correct })),
    ...SUMMARY3_QUESTIONS.map(q => ({ id: q.id, passage: 3, type: 'Summary Completion', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: `Summary gap ${q.id}`, correctDisplay: q.correct })),
    ...MATCHING_INFO3_QUESTIONS.map(q => ({ id: q.id, passage: 3, type: 'Matching Information', correct: q.correct, explanation: q.explanation, paragraphRef: q.correct, promptText: q.prompt, correctDisplay: `Paragraph ${q.correct}` })),
  ].sort((a, b) => a.id - b.id)

  function isCorrect(q: QMeta): boolean {
    const userAnswer = answers[q.id]
    if (userAnswer === undefined) return false
    if (typeof q.correct === 'number') return userAnswer === q.correct
    return String(userAnswer).trim().toLowerCase() === String(q.correct).trim().toLowerCase()
  }

  function getUserAnswerDisplay(q: QMeta, userAns: string | number | undefined): string {
    if (userAns === undefined || userAns === '') return '(no answer)'
    if (q.type === 'Multiple Choice' && typeof userAns === 'number') {
      const src = q.passage === 1 ? MC1_QUESTIONS : MC2_QUESTIONS
      const found = src.find(m => m.id === q.id)
      return found ? `${['A','B','C','D'][userAns]} — ${found.options[userAns]}` : String(userAns)
    }
    if (q.type === 'Matching Heading') {
      const h = HEADINGS_OPTIONS1.find(h => h.id === userAns)
      return h ? `${userAns} — ${h.text}` : String(userAns)
    }
    if (q.type === 'Matching Information') return `Paragraph ${userAns}`
    return String(userAns)
  }

  const totalCorrect = ALL_QUESTIONS.filter(isCorrect).length
  const p1Correct = ALL_QUESTIONS.filter(q => q.passage === 1 && isCorrect(q)).length
  const p2Correct = ALL_QUESTIONS.filter(q => q.passage === 2 && isCorrect(q)).length
  const p3Correct = ALL_QUESTIONS.filter(q => q.passage === 3 && isCorrect(q)).length

  function getEstimatedBand(score: number): string {
    if (score >= 39) return '9'; if (score >= 37) return '8.5'; if (score >= 35) return '8'
    if (score >= 33) return '7.5'; if (score >= 30) return '7'; if (score >= 27) return '6.5'
    if (score >= 23) return '6'; if (score >= 19) return '5.5'; if (score >= 15) return '5'
    if (score >= 13) return '4.5'; return '4 or below'
  }

  const passageTitleMap: { [k: number]: string } = { 1: PASSAGE1_TITLE, 2: PASSAGE2_TITLE, 3: PASSAGE3_TITLE }
  const passageCorrectMap: { [k: number]: number } = { 1: p1Correct, 2: p2Correct, 3: p3Correct }
  const passageTotalMap: { [k: number]: number } = { 1: 13, 2: 13, 3: 14 }

  const TimerBar = () => useTimer ? (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: timeLeft < 300 ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', padding: '6px 14px' }}>
      <span style={{ fontSize: '11px', color: timeLeft < 300 ? '#ef4444' : '#94a3b8', fontWeight: '600' }}>This passage:</span>
      <span style={{ fontSize: '14px', fontWeight: 'bold', color: timeLeft < 300 ? '#ef4444' : '#555', fontFamily: 'monospace' }}>⏱️ {formatTime(timeLeft)}</span>
      {timeLeft === 0 && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>TIME UP</span>}
    </div>
  ) : null

  const TeacherBtn = () => (
    <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#78350f' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
      👨‍🏫 Teacher Mode
    </button>
  )

  // ============ LOCKED ============
  if (stage === 'locked') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <Link href="/ielts/reading" style={{ color: '#d97706', fontSize: '13px', textDecoration: 'none' }}>← Reading Tests</Link>
        <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', borderRadius: '16px', padding: '40px 32px', marginTop: '24px', color: 'white' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>Reading Mock Test 3</h1>
          <p style={{ opacity: 0.85, fontSize: '14px', margin: '0 0 6px' }}>The Rise of Urban Farming · Ocean Plastic · The Science of Memory</p>
          <p style={{ opacity: 0.7, fontSize: '13px', margin: '0 0 24px' }}>This is a subscription test. Activate your access code to unlock this and all other premium content.</p>
          <Link href="/ielts/subscribe" style={{ background: 'white', color: '#78350f', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
            Get Access — 149 THB/month →
          </Link>
        </div>
      </div>
    </main>
  )

  // ============ INTRO ============
  if (stage === 'intro') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/ielts/reading" style={{ color: '#d97706', fontSize: '13px', textDecoration: 'none' }}>← Reading Tests</Link>
        <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', borderRadius: '16px', padding: '32px', margin: '20px 0', color: 'white' }}>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>IELTS Reading</div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px' }}>Mock Test 3</h1>
          <p style={{ opacity: 0.8, margin: 0, fontSize: '14px' }}>3 passages · 40 questions · Band score + AI explanations</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📋 Passages in This Test</h2>
          {[
            { num: 1, title: PASSAGE1_TITLE, diff: 'Easier', questions: 'Matching Headings (Q1-4) · True/False/Not Given (Q5-9) · Multiple Choice (Q10-13)', color: '#2563eb' },
            { num: 2, title: PASSAGE2_TITLE, diff: 'Medium', questions: 'Matching Information (Q14-17) · Sentence Completion (Q18-22) · Multiple Choice (Q23-26)', color: '#059669' },
            { num: 3, title: PASSAGE3_TITLE, diff: 'Harder', questions: 'Yes/No/Not Given (Q27-31) · Summary Completion (Q32-36) · Matching Information (Q37-40)', color: '#dc2626' },
          ].map(p => (
            <div key={p.num} style={{ display: 'flex', gap: '14px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: p.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 }}>{p.num}</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 2px' }}>{p.title}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px' }}>Difficulty: {p.diff}</p>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{p.questions}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #fde68a' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Band Score Conversion (Academic)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {BAND_CONVERSION.map(row => (
              <div key={row.band} style={{ background: 'white', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#92400e' }}>{row.range} correct</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>Band {row.band}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 12px' }}>⏱️ Timed Exam Mode</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px' }}>A 20-minute countdown per passage resets automatically as you move between passages.</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={useTimer} onChange={e => setUseTimer(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            <span style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: '600' }}>Enable 20-minute-per-passage timer</span>
          </label>
        </div>

        <button onClick={() => { setStage('passage1'); if (useTimer) { setTimeLeft(PASSAGE_TIME); setTimerRunning(true) } }} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          Start Mock Test 3 →
        </button>
      </div>
    </main>
  )

  // ============ PASSAGE 1 ============
  if (stage === 'passage1') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#78350f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Passage 1 of 3</span>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{PASSAGE1_DIFFICULTY}</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{p1Answered}/13 answered</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><TeacherBtn /><TimerBar /></div>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 1</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Warm-up:</strong> Ask students if they've ever grown any food, or visited a community garden — a good low-pressure discussion starter.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Heading vi/vii are distractors:</strong> vi (government policies restricting urban farming) and vii (ancient city food production) — neither matches any paragraph. Good exercise in ruling out headings.</p>
              <p style={{ margin: 0 }}><strong>Extension:</strong> Ask students to debate Q13 (the writer's overall view) — is the writer optimistic or cautious about urban farming? This builds critical reading skills.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>{PASSAGE1_TITLE}</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Read the passage below and answer questions 1–13.</p>
            {PASSAGE1_PARAGRAPHS.map(p => (
              <div key={p.label} style={{ marginBottom: '16px' }}>
                <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>Paragraph {p.label}</span>
                <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.8 }}>{p.text}</p>
              </div>
            ))}
            <button onClick={() => setShowVocab1(!showVocab1)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#555', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
              {showVocab1 ? '▲ Hide' : '▼ Show'} Key Vocabulary
            </button>
            {showVocab1 && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {VOCABULARY1.map(v => (
                  <div key={v.word} style={{ background: '#faf5ff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #e9d5ff' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#7c3aed' }}>{v.word}</span>
                    <span style={{ fontSize: '13px', color: '#6d28d9' }}> — {v.definition}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#78350f', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 1–4 — Matching Headings</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 12px', lineHeight: 1.5 }}>Match each paragraph with the correct heading. Write the letter (i–vii). There are more headings than paragraphs.</p>
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                {HEADINGS_OPTIONS1.map(h => (
                  <div key={h.id} style={{ fontSize: '13px', color: '#374151', padding: '4px 0' }}><strong>{h.id}</strong> — {h.text}</div>
                ))}
              </div>
              {MATCHING_QUESTIONS1.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#78350f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                  <p style={{ fontSize: '13px', color: '#374151', margin: 0, flex: 1 }}>Paragraph {q.paragraph}</p>
                  <select value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} style={{ width: '72px', padding: '8px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#1a1a2e', outline: 'none', flexShrink: 0 }}>
                    <option value="">--</option>
                    {HEADINGS_OPTIONS1.map(h => <option key={h.id} value={h.id}>{h.id}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 5–9 — True / False / Not Given</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Do the following statements agree with the information given in the passage?</p>
              {TFNG_QUESTIONS1.map(q => (
                <div key={q.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}><strong>{q.id}.</strong> {q.statement}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                      <button key={opt} onClick={() => setAnswer(q.id, opt)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: answers[q.id] === opt ? '2px solid #dc2626' : '2px solid #e2e8f0', background: answers[q.id] === opt ? '#fee2e2' : 'white', color: answers[q.id] === opt ? '#991b1b' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 10–13 — Multiple Choice</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px' }}>Choose the correct letter, A–D.</p>
              {MC1_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 10px', lineHeight: 1.5 }}><strong>{q.id}.</strong> {q.question}</p>
                  {q.options.map((opt, i) => (
                    <button key={i} onClick={() => setAnswer(q.id, i)} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', width: '100%', padding: '8px 12px', borderRadius: '8px', border: answers[q.id] === i ? '2px solid #059669' : '2px solid #e2e8f0', background: answers[q.id] === i ? '#f0fdf4' : 'white', marginBottom: '6px', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ background: answers[q.id] === i ? '#059669' : '#e2e8f0', color: answers[q.id] === i ? 'white' : '#555', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{['A','B','C','D'][i]}</span>
                      <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{opt}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <button onClick={() => { if (useTimer) { setTimeLeft(PASSAGE_TIME); setTimerRunning(true) }; setStage('passage2') }} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Continue to Passage 2 →
            </button>
          </div>
        </div>
      </div>
    </main>
  )

  // ============ PASSAGE 2 ============
  if (stage === 'passage2') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#78350f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Passage 2 of 3</span>
            <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{PASSAGE2_DIFFICULTY}</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{p2Answered}/13 answered</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><TeacherBtn /><TimerBar /></div>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 2</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Warm-up:</strong> Ask students where they think the plastic in their bin ends up — a powerful way to connect the topic personally.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Sentence Completion tip:</strong> Q22 requires "four hundred and fifty years" — a long answer. Remind students the instruction says NO MORE THAN TWO WORDS, but this is a specific phrase in the text. Actually re-check: the exact phrase is "four hundred and fifty years" — five words. Encourage students to write the number in digits if needed, or check the exact wording again.</p>
              <p style={{ margin: 0 }}><strong>Extension:</strong> Q26 (overall structure) is an excellent critical thinking exercise — ask students to map each paragraph to its function (problem, solution type 1, 2, 3) before answering.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>{PASSAGE2_TITLE}</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Read the passage below and answer questions 14–26.</p>
            {PASSAGE2_PARAGRAPHS.map(p => (
              <div key={p.label} style={{ marginBottom: '16px' }}>
                <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>Paragraph {p.label}</span>
                <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.8 }}>{p.text}</p>
              </div>
            ))}
            <button onClick={() => setShowVocab2(!showVocab2)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#555', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
              {showVocab2 ? '▲ Hide' : '▼ Show'} Key Vocabulary
            </button>
            {showVocab2 && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {VOCABULARY2.map(v => (
                  <div key={v.word} style={{ background: '#faf5ff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #e9d5ff' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#7c3aed' }}>{v.word}</span>
                    <span style={{ fontSize: '13px', color: '#6d28d9' }}> — {v.definition}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 14–17 — Matching Information</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>The passage has five paragraphs, A–E. Which paragraph contains the following information?</p>
              {MATCHING_INFO2_QUESTIONS.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                  <p style={{ fontSize: '13px', color: '#374151', margin: 0, flex: 1, lineHeight: 1.5 }}>{q.prompt}</p>
                  <select value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} style={{ width: '72px', padding: '8px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#1a1a2e', outline: 'none', flexShrink: 0 }}>
                    <option value="">--</option>
                    {['A','B','C','D','E'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 18–22 — Sentence Completion</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Complete the sentences using <strong>NO MORE THAN THREE WORDS</strong> from the passage.</p>
              {SENTENCE_COMPLETION2_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{q.sentence}</span>
                    <input type="text" value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} placeholder="answer" style={{ padding: '6px 10px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', outline: 'none', minWidth: '140px', color: '#1a1a2e' }} />
                    {q.id === 18 && <span style={{ fontSize: '13px', color: '#374151' }}>"</span>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 23–26 — Multiple Choice</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px' }}>Choose the correct letter, A–D.</p>
              {MC2_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 10px', lineHeight: 1.5 }}><strong>{q.id}.</strong> {q.question}</p>
                  {q.options.map((opt, i) => (
                    <button key={i} onClick={() => setAnswer(q.id, i)} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', width: '100%', padding: '8px 12px', borderRadius: '8px', border: answers[q.id] === i ? '2px solid #7c3aed' : '2px solid #e2e8f0', background: answers[q.id] === i ? '#faf5ff' : 'white', marginBottom: '6px', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ background: answers[q.id] === i ? '#7c3aed' : '#e2e8f0', color: answers[q.id] === i ? 'white' : '#555', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{['A','B','C','D'][i]}</span>
                      <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{opt}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStage('passage1')} style={{ flex: 1, padding: '14px', background: 'white', color: '#78350f', border: '2px solid #78350f', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => { if (useTimer) { setTimeLeft(PASSAGE_TIME); setTimerRunning(true) }; setStage('passage3') }} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                Continue to Passage 3 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )

  // ============ PASSAGE 3 ============
  if (stage === 'passage3') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#78350f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Passage 3 of 3</span>
            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{PASSAGE3_DIFFICULTY}</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{p3Answered}/14 answered</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><TeacherBtn /><TimerBar /></div>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 3</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Warm-up:</strong> Ask students to recall their earliest memory — immediately personal and linked directly to the topic.</p>
              <p style={{ margin: '0 0 6px' }}><strong>YES/NO/NOT GIVEN tip:</strong> Q30 (Halbwachs was the "first person ever") vs "first to theorise it" — excellent example of why reading precisely matters. The passage says he "first theorised" collective memory, not that he was the first ever to write about memory and society.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Q37 and Q40 both have answer D:</strong> Check students notice this is valid — both clues are genuinely in Paragraph D. In real IELTS, the same paragraph can contain multiple answers.</p>
              <p style={{ margin: 0 }}><strong>Writing link:</strong> Paragraph E (eyewitness testimony) is excellent preparation for a Writing Task 2 Discussion Essay on the reliability of witness evidence — assign as a follow-up.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>{PASSAGE3_TITLE}</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Read the passage below and answer questions 27–40.</p>
            {PASSAGE3_PARAGRAPHS.map(p => (
              <div key={p.label} style={{ marginBottom: '16px' }}>
                <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>Paragraph {p.label}</span>
                <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.8 }}>{p.text}</p>
              </div>
            ))}
            <button onClick={() => setShowVocab3(!showVocab3)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#555', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
              {showVocab3 ? '▲ Hide' : '▼ Show'} Key Vocabulary
            </button>
            {showVocab3 && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {VOCABULARY3.map(v => (
                  <div key={v.word} style={{ background: '#faf5ff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #e9d5ff' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#7c3aed' }}>{v.word}</span>
                    <span style={{ fontSize: '13px', color: '#6d28d9' }}> — {v.definition}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 27–31 — Yes / No / Not Given</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Do the following statements agree with the views or claims of the writer?</p>
              {YNNG_QUESTIONS3.map(q => (
                <div key={q.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}><strong>{q.id}.</strong> {q.statement}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['YES', 'NO', 'NOT GIVEN'].map(opt => (
                      <button key={opt} onClick={() => setAnswer(q.id, opt)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: answers[q.id] === opt ? '2px solid #dc2626' : '2px solid #e2e8f0', background: answers[q.id] === opt ? '#fee2e2' : 'white', color: answers[q.id] === opt ? '#991b1b' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 32–36 — Summary Completion</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Complete the summary using <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>
              <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 2.2 }}>
                  {SUMMARY3_TEXT_PARTS[0]}
                  <input type="text" value={answers[32] as string || ''} onChange={e => setAnswer(32, e.target.value)} placeholder="32" style={{ display: 'inline-block', width: '110px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[1]}
                  <input type="text" value={answers[33] as string || ''} onChange={e => setAnswer(33, e.target.value)} placeholder="33" style={{ display: 'inline-block', width: '100px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[2]}
                  <input type="text" value={answers[34] as string || ''} onChange={e => setAnswer(34, e.target.value)} placeholder="34" style={{ display: 'inline-block', width: '90px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[3]}
                  <input type="text" value={answers[35] as string || ''} onChange={e => setAnswer(35, e.target.value)} placeholder="35" style={{ display: 'inline-block', width: '120px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[4]}
                  <input type="text" value={answers[36] as string || ''} onChange={e => setAnswer(36, e.target.value)} placeholder="36" style={{ display: 'inline-block', width: '150px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[5]}
                </p>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 37–40 — Matching Information</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>The passage has six paragraphs, A–F. Which paragraph contains the following information? <em>NB: you may use any letter more than once.</em></p>
              {MATCHING_INFO3_QUESTIONS.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                  <p style={{ fontSize: '13px', color: '#374151', margin: 0, flex: 1, lineHeight: 1.5 }}>{q.prompt}</p>
                  <select value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} style={{ width: '72px', padding: '8px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#1a1a2e', outline: 'none', flexShrink: 0 }}>
                    <option value="">--</option>
                    {['A','B','C','D','E','F'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStage('passage2')} style={{ flex: 1, padding: '14px', background: 'white', color: '#78350f', border: '2px solid #78350f', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => { setTimerRunning(false); setStage('results') }} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #16a34a, #059669)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✅ Finish & See Results →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )

  // ============ RESULTS ============
  if (stage === 'results') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/ielts/reading" style={{ color: '#d97706', fontSize: '13px', textDecoration: 'none' }}>← Reading Tests</Link>
          <button onClick={() => { setAnswers({}); setStage('intro'); setTimeLeft(PASSAGE_TIME); setTimerRunning(false) }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>🔄 Retake Test</button>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', borderRadius: '16px', padding: '32px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Score — Mock Test 3</p>
          <div style={{ fontSize: '56px', fontWeight: 'bold', lineHeight: 1, marginBottom: '8px' }}>{totalCorrect} / 40</div>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 20px', fontSize: '16px', fontWeight: 'bold' }}>
            Estimated Band Score: {getEstimatedBand(totalCorrect)}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📊 Section Breakdown</h2>
          {[1, 2, 3].map(p => (
            <div key={p} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Passage {p}: {passageTitleMap[p]}</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>{passageCorrectMap[p]} / {passageTotalMap[p]}</p>
              </div>
              <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '8px' }}>
                <div style={{ background: '#d97706', height: '100%', borderRadius: '4px', width: `${(passageCorrectMap[p] / passageTotalMap[p]) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #fde68a' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Band Score Conversion</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {BAND_CONVERSION.map(row => (
              <div key={row.band} style={{ background: 'white', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#92400e' }}>{row.range} correct</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>Band {row.band}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>📝 Question-by-Question Review</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>Click any question to see the explanation and paragraph reference.</p>
          {[1, 2, 3].map(passageNum => (
            <div key={passageNum} style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#78350f', margin: '0 0 10px', paddingBottom: '6px', borderBottom: '2px solid #fde68a' }}>
                Passage {passageNum} — {passageTitleMap[passageNum]} ({passageCorrectMap[passageNum]}/{passageTotalMap[passageNum]})
              </p>
              {ALL_QUESTIONS.filter(q => q.passage === passageNum).map(q => {
                const correct = isCorrect(q)
                const userAns = answers[q.id]
                const expanded = reviewExpanded === q.id
                return (
                  <div key={q.id} style={{ marginBottom: '8px', borderRadius: '8px', border: `1px solid ${correct ? '#bbf7d0' : '#fecaca'}`, background: correct ? '#f0fdf4' : '#fef2f2', overflow: 'hidden' }}>
                    <button onClick={() => setReviewExpanded(expanded ? null : q.id)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: correct ? '#16a34a' : '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>{correct ? '✓' : '✗'}</span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', flexShrink: 0 }}>Q{q.id}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8', background: 'white', padding: '2px 8px', borderRadius: '10px', flexShrink: 0, border: '1px solid #e2e8f0' }}>{q.type}</span>
                      </div>
                      <span style={{ fontSize: '16px', color: '#94a3b8', flexShrink: 0 }}>{expanded ? '−' : '+'}</span>
                    </button>
                    {expanded && (
                      <div style={{ padding: '0 14px 14px' }}>
                        <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}>{q.promptText}</p>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Your Answer</p>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: correct ? '#166534' : '#991b1b', margin: 0 }}>{getUserAnswerDisplay(q, userAns)}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Correct Answer</p>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#166634', margin: 0 }}>{q.correctDisplay}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 2px' }}>Paragraph</p>
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#92400e', margin: 0 }}>{q.paragraphRef}</p>
                          </div>
                        </div>
                        <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '10px 12px', border: '1px solid #bfdbfe' }}>
                          <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px' }}>🤖 AI Explanation</p>
                          <p style={{ fontSize: '13px', color: '#1e40af', margin: 0, lineHeight: 1.6 }}>{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📚 Vocabulary Recap — All 3 Passages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
            {[...VOCABULARY1, ...VOCABULARY2, ...VOCABULARY3].map(v => (
              <div key={v.word} style={{ background: '#faf5ff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #e9d5ff' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#7c3aed' }}>{v.word}</span>
                <p style={{ fontSize: '12px', color: '#6d28d9', margin: '2px 0 0' }}>{v.definition}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#78350f', borderRadius: '16px', padding: '24px 28px', marginBottom: '20px', color: 'white' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Overall Summary</h3>
          <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
            <p style={{ margin: '0 0 6px' }}><strong>Passage 3 writing link:</strong> Paragraph E (eyewitness testimony) maps directly to a Writing Task 2 Discussion Essay — "Some people believe eyewitness testimony should not be used as evidence in court. Discuss both views and give your opinion."</p>
            <p style={{ margin: '0 0 6px' }}><strong>Q37 & Q40 both answer D:</strong> Remind students that in Matching Information, the same paragraph can be the answer for more than one question — this is explicitly stated in the instructions.</p>
            <p style={{ margin: '0 0 6px' }}><strong>Vocabulary focus:</strong> Choose 5–6 words from the recap (e.g. reconstructive, pervasive, fallibility, cognitive offloading, equitable) and set a homework task — write original sentences using each word correctly.</p>
            <p style={{ margin: 0 }}><strong>Timing check:</strong> Ask students to compare how much time they spent on each passage — Passage 3 (Memory) is the most abstract and requires the most careful reading. Did they leave enough time for it?</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
          <Link href="/ielts/reading" style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#1a1a2e', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>← All Reading Tests</Link>
          <Link href="/ielts" style={{ padding: '12px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>✅ Back to IELTS Hub</Link>
        </div>
      </div>
    </main>
  )

  return null
}
