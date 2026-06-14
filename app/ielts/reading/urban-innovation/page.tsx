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
const PASSAGE1_TITLE = 'The Psychology of Sleep'
const PASSAGE1_DIFFICULTY = 'Easier'

const PASSAGE1_PARAGRAPHS = [
  { label: 'A', text: `Sleep is one of the most fundamental biological processes in humans, yet it remains one of the least understood. Scientists have long known that adequate sleep is essential for physical health, with the body using periods of rest to repair tissue, regulate hormones, and consolidate the immune system. More recent research, however, has shifted focus towards the profound role that sleep plays in cognitive function — including memory consolidation, emotional regulation, and creative problem-solving. Far from being a passive state of unconsciousness, sleep is now understood to be a period of intense neurological activity during which the brain processes and organises the information gathered during waking hours.` },
  { label: 'B', text: `Human sleep follows a cyclical pattern, typically consisting of four to six cycles per night, each lasting approximately ninety minutes. Within each cycle, the brain moves through a series of stages, broadly divided into non-rapid eye movement (NREM) sleep and rapid eye movement (REM) sleep. NREM sleep comprises the lighter stages of sleep in which the body begins to relax, as well as deep slow-wave sleep, during which the body carries out much of its physical restoration. REM sleep, by contrast, is characterised by vivid dreaming, temporary paralysis of the major muscle groups, and a pattern of brain activity closely resembling that of a fully awake individual. It is during REM sleep that most memory consolidation and emotional processing is believed to occur.` },
  { label: 'C', text: `The consequences of sleep deprivation are well documented and can be severe. Even a single night of significantly reduced sleep can impair concentration, slow reaction time, and reduce the ability to regulate emotions effectively. Chronic sleep deprivation — typically defined as consistently obtaining less than six hours of sleep per night over an extended period — has been associated with increased risk of cardiovascular disease, obesity, type 2 diabetes, and depression. Perhaps most alarmingly, research suggests that the subjective feeling of adapting to reduced sleep is not matched by objective improvements in cognitive performance; people often believe they have adjusted to sleeping less when their actual functioning remains significantly impaired.` },
  { label: 'D', text: `One of the most counterintuitive findings in sleep research concerns the relationship between sleep and learning. Studies have repeatedly demonstrated that sleep does not merely consolidate information that has already been learned — it actively transforms it. In a now-classic set of experiments, participants who slept after learning a set of grammar rules were significantly better at applying those rules to novel situations the following day than those who had stayed awake. This suggests that the sleeping brain does not simply store information but reorganises and integrates it in ways that enhance understanding and flexible application of knowledge.` },
  { label: 'E', text: `Despite growing scientific awareness of the importance of sleep, many people in modern societies are chronically under-slept. Artificial lighting, digital screens, demanding work schedules, and social norms that equate long working hours with productivity have all contributed to what sleep researchers have described as a widespread societal sleep deficit. Public health campaigns have begun to address this issue, encouraging individuals to prioritise sleep alongside diet and exercise as a fundamental pillar of wellbeing. Some employers have also introduced workplace policies designed to support employee rest, including flexible working hours and, in some cases, dedicated spaces for short naps during the working day.` },
]

const HEADINGS_OPTIONS1 = [
  { id: 'i', text: 'The physical and mental effects of not getting enough sleep' },
  { id: 'ii', text: 'A new understanding of what happens in the brain during rest' },
  { id: 'iii', text: 'Efforts to change attitudes towards rest in working life' },
  { id: 'iv', text: 'How sleep transforms and improves what we have learned' },
  { id: 'v', text: 'The stages and structure of a typical night of sleep' },
  { id: 'vi', text: 'The link between sleep and physical fitness' },
  { id: 'vii', text: 'Why modern lifestyles are damaging our ability to rest' },
]

const MATCHING_QUESTIONS1 = [
  { id: 1, paragraph: 'A', correct: 'ii', explanation: 'Paragraph A explains how sleep is now understood as a period of intense brain activity rather than passive unconsciousness — a new understanding of what the brain does during rest.' },
  { id: 2, paragraph: 'B', correct: 'v', explanation: 'Paragraph B describes the stages and structure of sleep cycles, including NREM and REM sleep.' },
  { id: 3, paragraph: 'C', correct: 'i', explanation: 'Paragraph C describes the physical and cognitive consequences of sleep deprivation.' },
  { id: 4, paragraph: 'D', correct: 'iv', explanation: 'Paragraph D explains how sleep transforms learned information and enhances understanding — not just stores it.' },
]

const TFNG_QUESTIONS1 = [
  { id: 5, statement: 'REM sleep is when the body carries out most of its physical repair.', correct: 'FALSE', explanation: 'Paragraph B states that physical restoration occurs during NREM deep slow-wave sleep, not during REM sleep.', paragraphRef: 'B' },
  { id: 6, statement: 'People who sleep fewer than six hours per night may believe they have adapted, even when their performance has not improved.', correct: 'TRUE', explanation: 'Paragraph C states that people "often believe they have adjusted to sleeping less when their actual functioning remains significantly impaired."', paragraphRef: 'C' },
  { id: 7, statement: 'The experiment described in Paragraph D involved testing participants on the same grammar rules they had already practised.', correct: 'NOT GIVEN', explanation: 'Paragraph D says participants were tested on "novel situations" but does not specify whether the test questions were the same as the original practice.', paragraphRef: 'D' },
  { id: 8, statement: 'Some companies now allow employees to sleep briefly during the working day.', correct: 'TRUE', explanation: 'Paragraph E mentions "dedicated spaces for short naps during the working day" as a workplace policy some employers have introduced.', paragraphRef: 'E' },
  { id: 9, statement: 'Public health campaigns about sleep have been largely unsuccessful.', correct: 'NOT GIVEN', explanation: 'Paragraph E mentions public health campaigns have begun but does not evaluate their success or failure.', paragraphRef: 'E' },
]

const MC1_QUESTIONS = [
  {
    id: 10,
    question: 'According to the passage, what is the main finding of the grammar experiment described in Paragraph D?',
    options: [
      'Sleeping helps people memorise rules they find difficult',
      'Sleep allows the brain to reorganise information in ways that improve its flexible use',
      'People learn grammar more effectively before sleep than after waking up',
      'REM sleep is more important for learning than NREM sleep',
    ],
    correct: 1,
    explanation: 'Paragraph D states that sleep "reorganises and integrates" information "in ways that enhance understanding and flexible application of knowledge" — not just storage.',
    paragraphRef: 'D',
  },
  {
    id: 11,
    question: 'Which of the following best describes the overall argument of the passage?',
    options: [
      'Sleep deprivation is a minor issue that only affects a small number of people',
      'Sleep is a passive process that the body uses mainly for physical recovery',
      'Sleep is a complex, active process that is essential for both physical and cognitive health',
      'Modern research has proved that eight hours of sleep is the ideal amount for all adults',
    ],
    correct: 2,
    explanation: 'The passage argues throughout that sleep is an active, complex process critical to both physical health (Paragraph A) and cognitive function (Paragraphs B, D).',
    paragraphRef: 'A',
  },
  {
    id: 12,
    question: 'What does Paragraph E suggest about modern attitudes towards sleep?',
    options: [
      'Most people now prioritise sleep as much as diet and exercise',
      'Social and technological factors have contributed to widespread sleep loss',
      'Digital screens have no significant effect on sleep quality',
      'Employers are legally required to give employees time to rest',
    ],
    correct: 1,
    explanation: 'Paragraph E lists "artificial lighting, digital screens, demanding work schedules, and social norms" as factors contributing to a "widespread societal sleep deficit."',
    paragraphRef: 'E',
  },
  {
    id: 13,
    question: 'The word "consolidate" in Paragraph A most closely means:',
    options: [
      'Destroy',
      'Strengthen and organise',
      'Reduce in size',
      'Transfer to another location',
    ],
    correct: 1,
    explanation: 'In context, "consolidate" means to strengthen and organise — the brain consolidates (strengthens and fixes) memories during sleep.',
    paragraphRef: 'A',
  },
]

const VOCABULARY1 = [
  { word: 'consolidate', definition: 'to make something stronger or more secure by combining and organising it' },
  { word: 'neurological', definition: 'relating to the nervous system and brain' },
  { word: 'deprivation', definition: 'the state of lacking something essential, such as sleep or food' },
  { word: 'cardiovascular', definition: 'relating to the heart and blood vessels' },
  { word: 'counterintuitive', definition: 'contrary to what common sense or instinct would suggest' },
  { word: 'societal', definition: 'relating to society as a whole' },
  { word: 'deficit', definition: 'a shortfall or lack of something needed' },
]

// ============ PASSAGE 2 ============
const PASSAGE2_TITLE = 'The History and Science of Chocolate'
const PASSAGE2_DIFFICULTY = 'Medium'

const PASSAGE2_PARAGRAPHS = [
  { label: 'A', text: `Few foods have a history as rich and complex as chocolate. The cacao tree, Theobroma cacao, whose name translates from Greek as "food of the gods", is native to the tropical regions of Central and South America and has been cultivated by human civilisations for at least three thousand years. The ancient Maya and Aztec peoples consumed cacao in the form of a bitter, spiced liquid, used both in everyday life and in religious ceremonies. For the Aztecs in particular, cacao beans held such value that they were used as a form of currency, with records indicating that a turkey could be purchased for one hundred beans and a skilled labourer might earn approximately thirty beans per day.` },
  { label: 'B', text: `Cacao arrived in Europe following the Spanish conquest of the Americas in the sixteenth century, initially as a curiosity for the wealthy. European taste preferences led to significant modifications of the original recipe — the bitter drink was sweetened with sugar and honey, and served warm rather than cold. By the seventeenth century, chocolate houses had become fashionable social venues in England and other European countries, attracting intellectuals, merchants, and politicians who gathered to discuss the events of the day. The social significance of these establishments has been compared to that of the coffee house in Continental Europe, and several modern financial institutions trace their origins to business conducted in such venues.` },
  { label: 'C', text: `The transformation of chocolate from a luxury drink to a mass-market solid food was driven largely by technological innovation in the nineteenth century. In 1828, a Dutch chemist named Coenraad van Houten developed a method of pressing cacao to separate its fat content, producing cocoa powder that was smoother and less bitter than earlier preparations. This process, known as "Dutching", made it possible to produce chocolate in a form that could be mixed with other ingredients and moulded into solid bars. Later in the century, the Swiss manufacturer Rodolphe Lindt developed the process of "conching" — an extended period of mixing and aeration — which gave chocolate the smooth, creamy texture that most consumers associate with the modern product.` },
  { label: 'D', text: `From a nutritional perspective, chocolate occupies a complex position. Unprocessed cacao is rich in flavonoids — plant-based compounds with antioxidant properties that have been associated in some studies with reduced risk of cardiovascular disease and improved cognitive function. However, most commercially produced chocolate contains only modest quantities of cacao alongside substantial amounts of sugar, milk solids, and vegetable fats, significantly altering its nutritional profile. Dark chocolate with a high cacao content is generally considered to retain more of the potential health benefits, though researchers caution that the evidence base for many claimed benefits remains limited and that consumption should be balanced against the high caloric content of chocolate products.` },
  { label: 'E', text: `The global chocolate industry today is valued at over two hundred billion dollars and continues to grow, driven by rising demand in Asia and other emerging markets. However, it faces significant challenges. The majority of the world's cacao is produced by smallholder farmers in West Africa, particularly in Ivory Coast and Ghana, many of whom earn incomes well below the poverty line despite the enormous commercial value of their crop. Concerns about child labour, deforestation, and the vulnerability of cacao cultivation to climate change have prompted growing calls for more sustainable and equitable supply chains, and a number of major producers have made public commitments to improving conditions for farmers, though critics argue that progress has been slow.` },
]

const MATCHING_INFO2_QUESTIONS = [
  { id: 14, prompt: 'a reference to the use of cacao as a means of exchange', correct: 'A', explanation: 'Paragraph A states that cacao beans were used as currency, with specific prices listed for goods and labour.', paragraphRef: 'A' },
  { id: 15, prompt: 'a description of how the flavour and serving style of chocolate was adapted for a new market', correct: 'B', explanation: 'Paragraph B describes how Europeans sweetened the drink and served it warm — adapting it for their own tastes.', paragraphRef: 'B' },
  { id: 16, prompt: 'an explanation of a process that improved the texture of the final product', correct: 'C', explanation: 'Paragraph C describes "conching" — an extended mixing process developed by Lindt that gave chocolate its smooth, creamy texture.', paragraphRef: 'C' },
  { id: 17, prompt: 'a warning about the limits of research into the benefits of a food product', correct: 'D', explanation: 'Paragraph D states that "researchers caution that the evidence base for many claimed benefits remains limited."', paragraphRef: 'D' },
]

const SENTENCE_COMPLETION2_QUESTIONS = [
  { id: 18, sentence: 'Van Houten\'s process of separating the fat from cacao became known as "', correct: 'Dutching', explanation: 'Paragraph C: "This process, known as \'Dutching\'..."', paragraphRef: 'C' },
  { id: 19, sentence: 'Chocolate houses in seventeenth-century England attracted people including intellectuals, merchants, and ', correct: 'politicians', explanation: 'Paragraph B lists "intellectuals, merchants, and politicians" as the people who gathered in chocolate houses.', paragraphRef: 'B' },
  { id: 20, sentence: 'The plant-based compounds found in cacao that have antioxidant properties are called ', correct: 'flavonoids', explanation: 'Paragraph D: "Unprocessed cacao is rich in flavonoids — plant-based compounds with antioxidant properties."', paragraphRef: 'D' },
  { id: 21, sentence: 'Most of the world\'s cacao is grown by smallholder farmers in ', correct: 'West Africa', explanation: 'Paragraph E: "The majority of the world\'s cacao is produced by smallholder farmers in West Africa."', paragraphRef: 'E' },
  { id: 22, sentence: 'The Aztec name for the cacao tree — Theobroma cacao — translates from Greek as "food of the ', correct: 'gods', explanation: 'Paragraph A: "whose name translates from Greek as \'food of the gods\'."', paragraphRef: 'A' },
]

const MC2_QUESTIONS = [
  {
    id: 23,
    question: 'According to Paragraph C, what was significant about van Houten\'s invention?',
    options: [
      'It made chocolate available to ordinary people for the first time',
      'It created a form of chocolate that could be shaped into bars',
      'It removed all bitterness from chocolate permanently',
      'It reduced the amount of sugar needed to make chocolate palatable',
    ],
    correct: 1,
    explanation: 'Paragraph C states van Houten\'s process produced cocoa powder "that could be mixed with other ingredients and moulded into solid bars."',
    paragraphRef: 'C',
  },
  {
    id: 24,
    question: 'What does the passage suggest about the health benefits of chocolate?',
    options: [
      'All chocolate provides significant cardiovascular benefits',
      'The health benefits of chocolate have been definitively proven by researchers',
      'Dark chocolate may have some benefits but evidence is limited and calorie content is high',
      'Milk chocolate retains more flavonoids than dark chocolate',
    ],
    correct: 2,
    explanation: 'Paragraph D notes that dark chocolate may retain more benefits, but "the evidence base for many claimed benefits remains limited" and caloric content is high.',
    paragraphRef: 'D',
  },
  {
    id: 25,
    question: 'Which of the following best summarises the issue described in Paragraph E?',
    options: [
      'The chocolate industry is declining due to falling demand in Asia',
      'Despite the industry\'s enormous value, many cacao farmers remain in poverty',
      'Major chocolate producers have successfully improved conditions for farmers',
      'Climate change has already destroyed most cacao growing regions',
    ],
    correct: 1,
    explanation: 'Paragraph E describes how farmers "earn incomes well below the poverty line despite the enormous commercial value of their crop."',
    paragraphRef: 'E',
  },
  {
    id: 26,
    question: 'The comparison made in Paragraph B between chocolate houses and coffee houses is used to illustrate:',
    options: [
      'That coffee was more popular than chocolate in Continental Europe',
      'The important social and intellectual role that chocolate houses played',
      'That chocolate houses served the same drinks as coffee houses',
      'That chocolate houses were only popular for a short period',
    ],
    correct: 1,
    explanation: 'Paragraph B compares chocolate houses to coffee houses to show their social significance — both were important venues for intellectual and business life.',
    paragraphRef: 'B',
  },
]

const VOCABULARY2 = [
  { word: 'cultivated', definition: 'grown and maintained by humans, typically for food or other purposes' },
  { word: 'aeration', definition: 'the process of introducing air into a substance' },
  { word: 'flavonoids', definition: 'naturally occurring compounds found in plants, associated with antioxidant activity' },
  { word: 'antioxidant', definition: 'a substance that may protect cells from damage caused by unstable molecules' },
  { word: 'equitable', definition: 'fair and impartial; giving equal treatment to all involved' },
  { word: 'smallholder', definition: 'a person who owns or manages a small area of agricultural land' },
  { word: 'deforestation', definition: 'the clearing or removal of trees from forested land' },
]

// ============ PASSAGE 3 ============
const PASSAGE3_TITLE = 'Artificial Intelligence and the Future of Work'
const PASSAGE3_DIFFICULTY = 'Harder'

const PASSAGE3_PARAGRAPHS = [
  { label: 'A', text: `Few topics generate as much debate among economists, technologists, and policymakers as the potential impact of artificial intelligence on employment. Predictions range from the deeply pessimistic — with some analysts forecasting the automation of up to half of all current jobs within two decades — to the cautiously optimistic, with others arguing that technological revolutions have historically created more employment than they have destroyed, and that AI will follow the same pattern. The difficulty of making reliable predictions reflects the extraordinary breadth and pace of AI development, which is transforming industries at a speed that has outpaced many earlier projections.` },
  { label: 'B', text: `What distinguishes the current wave of AI-driven automation from previous periods of technological change is the range of tasks it is capable of performing. Earlier industrial technologies displaced physical labour, and were gradually offset by the growth of knowledge-based and service-sector roles that required human judgement, creativity, and interpersonal skills. AI systems, however, are increasingly capable of performing tasks that were previously thought to be exclusively within the domain of human cognition — including medical diagnosis, legal analysis, financial forecasting, and even the generation of creative content. This suggests that the displacement effects of AI may be broader and less easily offset than those of previous technological transitions.` },
  { label: 'C', text: `Nevertheless, a number of economists and labour market researchers argue that the pessimistic scenario underestimates the capacity of economies to adapt and generate new forms of work. They point to the fact that many occupations which today employ large numbers of people — including roles in computing, logistics management, and digital marketing — did not exist a generation ago. Moreover, they argue that AI is likely to complement rather than simply replace human workers in many contexts, augmenting their capabilities and enabling them to focus on tasks that require empathy, ethical reasoning, and complex social interaction — areas where AI currently falls well short of human performance.` },
  { label: 'D', text: `A significant concern, however, is that even if AI does ultimately create as many jobs as it destroys, the transition period may be prolonged and economically painful — particularly for workers in middle-skill occupations whose roles are highly susceptible to automation but who lack the educational qualifications typically required for the newer, higher-skill positions that AI is expected to generate. Governments and educational institutions face the challenge of retraining and upskilling large segments of the workforce at a pace that keeps step with technological change, a task for which existing systems were not designed and which will require substantial investment and policy innovation.` },
  { label: 'E', text: `Universal Basic Income (UBI) — a policy proposal under which all citizens receive a regular, unconditional payment from the government regardless of their employment status — has gained renewed attention in this context. Proponents argue that UBI could provide a financial safety net during periods of technological disruption, give workers greater freedom to retrain or pursue education, and address the inequality that is likely to accompany any significant restructuring of the labour market. Critics, however, raise concerns about the fiscal cost of such a programme, the potential for it to discourage work, and the risk that it could serve as a pretext for reducing other forms of social support.` },
  { label: 'F', text: `What seems clear is that the impact of AI on employment will not be uniform across societies, sectors, or income groups, and that the outcomes will depend heavily on the policy choices made by governments in the years ahead. Countries that invest in education, training, and social protection systems may be better positioned to ensure that the benefits of AI are broadly shared, while those that fail to adapt risk deepening inequality and social instability. The question, many observers suggest, is not whether AI will transform the world of work — that seems increasingly inevitable — but whether societies will prove capable of managing that transformation equitably and humanely.` },
]

const YNNG_QUESTIONS3 = [
  { id: 27, statement: 'Previous technological revolutions have always destroyed more jobs than they created.', correct: 'NO', explanation: 'Paragraph A says some analysts argue that "technological revolutions have historically created more employment than they have destroyed" — the opposite of this statement.', paragraphRef: 'A' },
  { id: 28, statement: 'AI systems are now capable of performing tasks previously considered unique to human intelligence.', correct: 'YES', explanation: 'Paragraph B states AI can now perform tasks "previously thought to be exclusively within the domain of human cognition" such as medical diagnosis and legal analysis.', paragraphRef: 'B' },
  { id: 29, statement: 'Digital marketing is mentioned as an example of a job that did not exist a generation ago.', correct: 'YES', explanation: 'Paragraph C lists "roles in computing, logistics management, and digital marketing" as examples of occupations that "did not exist a generation ago."', paragraphRef: 'C' },
  { id: 30, statement: 'Most governments have already introduced effective retraining programmes for workers affected by AI.', correct: 'NOT GIVEN', explanation: 'Paragraph D discusses the challenge governments face but does not state that most have already introduced effective programmes.', paragraphRef: 'D' },
  { id: 31, statement: 'All economists agree that UBI is the best solution to AI-driven unemployment.', correct: 'NO', explanation: 'Paragraph E describes both proponents and critics of UBI — clearly not all economists agree it is the best solution.', paragraphRef: 'E' },
]

const SUMMARY3_TEXT_PARTS = [
  'The passage argues that the impact of AI on employment will not be ',
  ' across all groups and sectors. While some believe AI will ',
  ' human workers rather than replace them, others warn that the transition could be painful, especially for those in ',
  '-skill jobs. One proposed solution is ',
  ', which would give citizens regular unconditional payments. Ultimately, the writer suggests that what matters most is whether governments can manage the transition ',
  ' and humanely.',
]

const SUMMARY3_QUESTIONS = [
  { id: 32, correct: 'uniform', explanation: 'Paragraph F: "the impact of AI on employment will not be uniform across societies, sectors, or income groups."', paragraphRef: 'F' },
  { id: 33, correct: 'complement', explanation: 'Paragraph C: "AI is likely to complement rather than simply replace human workers in many contexts."', paragraphRef: 'C' },
  { id: 34, correct: 'middle', explanation: 'Paragraph D refers to "workers in middle-skill occupations" as particularly vulnerable to automation.', paragraphRef: 'D' },
  { id: 35, correct: 'Universal Basic Income', explanation: 'Paragraph E introduces Universal Basic Income (UBI) as a policy proposal relevant to technological disruption.', paragraphRef: 'E' },
  { id: 36, correct: 'equitably', explanation: 'Paragraph F: "whether societies will prove capable of managing that transformation equitably and humanely."', paragraphRef: 'F' },
]

const MATCHING_INFO3_QUESTIONS2 = [
  { id: 37, prompt: 'a suggestion that AI may be better at some tasks than at others', correct: 'C', explanation: 'Paragraph C notes AI "falls well short of human performance" in areas requiring empathy, ethical reasoning, and complex social interaction.', paragraphRef: 'C' },
  { id: 38, prompt: 'an argument that the negative effects of AI may be harder to reverse than those of earlier technologies', correct: 'B', explanation: 'Paragraph B states "the displacement effects of AI may be broader and less easily offset than those of previous technological transitions."', paragraphRef: 'B' },
  { id: 39, prompt: 'a reference to financial objections raised against a proposed policy', correct: 'E', explanation: 'Paragraph E: critics raise "concerns about the fiscal cost" of UBI.', paragraphRef: 'E' },
  { id: 40, prompt: 'a suggestion that the consequences of AI will depend on decisions made by governments', correct: 'F', explanation: 'Paragraph F states "outcomes will depend heavily on the policy choices made by governments in the years ahead."', paragraphRef: 'F' },
]

const VOCABULARY3 = [
  { word: 'automation', definition: 'the use of technology to perform tasks with minimal human involvement' },
  { word: 'cognition', definition: 'mental processes involved in thinking, understanding, and learning' },
  { word: 'augmenting', definition: 'increasing or enhancing something, making it greater or better' },
  { word: 'susceptible', definition: 'likely to be affected by or vulnerable to something' },
  { word: 'upskilling', definition: 'teaching workers new or more advanced skills, particularly for technological roles' },
  { word: 'proponents', definition: 'people who support or advocate for a particular idea or policy' },
  { word: 'equitably', definition: 'in a fair and just way that treats everyone equally' },
]

const BAND_CONVERSION = [
  { band: '9', range: '39-40' }, { band: '8.5', range: '37-38' }, { band: '8', range: '35-36' },
  { band: '7.5', range: '33-34' }, { band: '7', range: '30-32' }, { band: '6.5', range: '27-29' },
  { band: '6', range: '23-26' }, { band: '5.5', range: '19-22' }, { band: '5', range: '15-18' },
]

export default function ReadingMockTest2Page() {
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
    if (!checkingAccess) {
      setStage(hasAccess ? 'intro' : 'locked')
    }
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
    MATCHING_INFO3_QUESTIONS2.filter(q => answers[q.id] !== undefined).length

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
    ...MATCHING_INFO3_QUESTIONS2.map(q => ({ id: q.id, passage: 3, type: 'Matching Information', correct: q.correct, explanation: q.explanation, paragraphRef: q.correct, promptText: q.prompt, correctDisplay: `Paragraph ${q.correct}` })),
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

  const TimerBar = ({ passageNum }: { passageNum: number }) => (
    useTimer ? (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: timeLeft < 300 ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', padding: '6px 14px' }}>
        <span style={{ fontSize: '11px', color: timeLeft < 300 ? '#ef4444' : '#94a3b8', fontWeight: '600' }}>This passage:</span>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: timeLeft < 300 ? '#ef4444' : '#555', fontFamily: 'monospace' }}>⏱️ {formatTime(timeLeft)}</span>
        {timeLeft === 0 && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>TIME UP</span>}
      </div>
    ) : null
  )

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
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px' }}>Reading Mock Test 2</h1>
          <p style={{ opacity: 0.85, fontSize: '14px', margin: '0 0 6px' }}>The Psychology of Sleep · The History of Chocolate · AI & the Future of Work</p>
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
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px' }}>Mock Test 2</h1>
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
          Start Mock Test 2 →
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <TeacherBtn />
            <TimerBar passageNum={1} />
          </div>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 1</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Warm-up:</strong> Ask students how many hours they slept last night — excellent entry point that connects immediately to the topic.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Matching Headings tip:</strong> Remind students to read each paragraph for the main idea, not just keywords. Heading vi (physical fitness) is a distractor — the passage mentions physical health but never specifically discusses fitness.</p>
              <p style={{ margin: 0 }}><strong>Extension:</strong> Q7 (NOT GIVEN) is a good discussion point — students often choose FALSE because they assume the grammar test used the same rules. Emphasise the distinction between FALSE and NOT GIVEN.</p>
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
            {/* Matching Headings */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#78350f', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 1–4 — Matching Headings</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 12px', lineHeight: 1.5 }}>Match each paragraph with the correct heading. Write the letter (i–vii) in the box. There are more headings than paragraphs.</p>
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

            {/* True/False/Not Given */}
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

            {/* Multiple Choice */}
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <TeacherBtn />
            <TimerBar passageNum={2} />
          </div>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 2</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Warm-up:</strong> Ask students their favourite chocolate brand — universally engaging and immediately relevant.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Sentence Completion tip:</strong> Remind students to write NO MORE THAN TWO WORDS and copy exact words from the text. Q22 answer is "West Africa" — both words required.</p>
              <p style={{ margin: 0 }}><strong>Extension:</strong> Discuss Q26 (chocolate houses vs coffee houses) — a good critical thinking exercise about how social venues shape intellectual history.</p>
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
            {/* Matching Information */}
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

            {/* Sentence Completion */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 18–22 — Sentence Completion</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Complete the sentences using <strong>NO MORE THAN TWO WORDS</strong> from the passage.</p>
              {SENTENCE_COMPLETION2_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{q.sentence}</span>
                    <input type="text" value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} placeholder="answer" style={{ padding: '6px 10px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', outline: 'none', minWidth: '120px', color: '#1a1a2e' }} />
                    {q.id === 18 && <span style={{ fontSize: '13px', color: '#374151' }}>"</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Multiple Choice */}
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <TeacherBtn />
            <TimerBar passageNum={3} />
          </div>
        </div>

        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 3</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Warm-up:</strong> Ask students whether they think AI will take their job in the next 10 years — immediately engaging and personally relevant.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Summary Completion tip:</strong> Read the whole summary first before filling gaps — students should predict what type of word is needed (noun, adjective) for each blank.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Extension:</strong> Q35 (Universal Basic Income) is an excellent discussion or writing task — ask students to write a short paragraph arguing for or against UBI.</p>
              <p style={{ margin: 0 }}><strong>Writing link:</strong> Passage 3 maps directly to a Writing Task 2 Discussion Essay topic — good springboard for combined skills practice.</p>
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
            {/* Yes/No/Not Given */}
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

            {/* Summary Completion */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 32–36 — Summary Completion</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Complete the summary using <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>
              <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 2.2 }}>
                  {SUMMARY3_TEXT_PARTS[0]}
                  <input type="text" value={answers[32] as string || ''} onChange={e => setAnswer(32, e.target.value)} placeholder="32" style={{ display: 'inline-block', width: '100px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[1]}
                  <input type="text" value={answers[33] as string || ''} onChange={e => setAnswer(33, e.target.value)} placeholder="33" style={{ display: 'inline-block', width: '100px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[2]}
                  <input type="text" value={answers[34] as string || ''} onChange={e => setAnswer(34, e.target.value)} placeholder="34" style={{ display: 'inline-block', width: '80px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[3]}
                  <input type="text" value={answers[35] as string || ''} onChange={e => setAnswer(35, e.target.value)} placeholder="35" style={{ display: 'inline-block', width: '160px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[4]}
                  <input type="text" value={answers[36] as string || ''} onChange={e => setAnswer(36, e.target.value)} placeholder="36" style={{ display: 'inline-block', width: '100px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY3_TEXT_PARTS[5]}
                </p>
              </div>
            </div>

            {/* Matching Information */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 37–40 — Matching Information</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>The passage has six paragraphs, A–F. Which paragraph contains the following information?</p>
              {MATCHING_INFO3_QUESTIONS2.map(q => (
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

        {/* Score */}
        <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', borderRadius: '16px', padding: '32px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Score — Mock Test 2</p>
          <div style={{ fontSize: '56px', fontWeight: 'bold', lineHeight: 1, marginBottom: '8px' }}>{totalCorrect} / 40</div>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 20px', fontSize: '16px', fontWeight: 'bold' }}>
            Estimated Band Score: {getEstimatedBand(totalCorrect)}
          </div>
        </div>

        {/* Breakdown */}
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

        {/* Band Conversion */}
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

        {/* Q by Q Review */}
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
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#166534', margin: 0 }}>{q.correctDisplay}</p>
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

        {/* Vocabulary Recap */}
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

        {/* Teacher Mode Summary */}
        <div style={{ background: '#78350f', borderRadius: '16px', padding: '24px 28px', marginBottom: '20px', color: 'white' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Overall Summary</h3>
          <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
            <p style={{ margin: '0 0 6px' }}><strong>Passage 3 writing link:</strong> The AI & Work passage is excellent preparation for a Writing Task 2 Discussion Essay ("Some people believe AI will destroy jobs, others think it will create new ones. Discuss both views and give your opinion") — assign this as a follow-up task.</p>
            <p style={{ margin: '0 0 6px' }}><strong>Vocabulary focus:</strong> Choose 5–6 words from the recap (e.g. consolidate, counterintuitive, equitably, augmenting) and set a homework task — write original sentences using each word correctly.</p>
            <p style={{ margin: 0 }}><strong>Timing analysis:</strong> Ask students whether they managed their time well — did they spend too long on Passage 1 and rush Passage 3? This is a very common exam mistake.</p>
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
