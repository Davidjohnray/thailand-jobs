'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const TEST_TIME = 60 * 60 // 60 minutes total for full test

// ============ PASSAGE 1 ============
const PASSAGE1_TITLE = 'Sustainable Tourism in Southeast Asia'
const PASSAGE1_DIFFICULTY = 'Easier'

const PASSAGE1_PARAGRAPHS = [
  {
    label: 'A',
    text: `Tourism has long been one of the most important economic sectors in Southeast Asia, providing employment for millions of people and generating significant revenue for governments. However, the rapid growth of the industry over the past three decades has brought with it a range of environmental and social challenges. Popular destinations such as Bali, Phuket, and Boracay have experienced overcrowding, pollution, and damage to fragile ecosystems including coral reefs and mangrove forests. In response, a growing number of governments, businesses, and travellers are turning their attention towards what has become known as sustainable tourism.`
  },
  {
    label: 'B',
    text: `Sustainable tourism can be broadly defined as tourism that takes full account of its current and future economic, social, and environmental impacts, while addressing the needs of visitors, the industry, the environment, and host communities. Unlike mass tourism models, which often prioritise short-term profit over long-term wellbeing, sustainable approaches aim to balance the interests of all stakeholders. This might involve limiting visitor numbers to certain sites, investing in renewable energy for hotels and resorts, or ensuring that a fair proportion of tourism revenue remains within local communities rather than flowing to large international corporations.`
  },
  {
    label: 'C',
    text: `One of the clearest examples of this shift can be seen in Thailand, where the closure of Maya Bay on Koh Phi Phi in 2018 marked a turning point in the country's approach to tourism management. The bay, made famous by a Hollywood film, had been receiving as many as 5,000 visitors per day, far exceeding what the delicate coral ecosystem could sustain. Authorities closed the site for several years to allow the environment to recover, and when it reopened, strict visitor caps and time limits were introduced. Early studies suggest that coral cover in the bay has increased significantly since the restrictions were put in place, offering encouraging evidence that recovery is possible when human pressure is reduced.`
  },
  {
    label: 'D',
    text: `Community-based tourism initiatives have also gained traction across the region as an alternative to large-scale resort development. In northern Thailand and parts of Laos and Vietnam, villages have begun offering homestay experiences, guided treks, and traditional craft workshops directly to visitors. These programmes are often run cooperatively, with profits shared among community members and reinvested in local infrastructure such as schools and healthcare facilities. Proponents argue that this model not only reduces the environmental footprint associated with large hotel developments but also helps to preserve cultural traditions that might otherwise be lost as younger generations move to cities in search of work.`
  },
  {
    label: 'E',
    text: `Despite these positive developments, significant obstacles remain. Sustainable tourism initiatives often require higher upfront investment and may take years to become profitable, making them less attractive to investors seeking quick returns. There is also the challenge of changing traveller behaviour and expectations; many tourists continue to prioritise low prices and convenience over environmental or social considerations. Furthermore, critics point out that some destinations have engaged in what has been termed "greenwashing" — marketing themselves as eco-friendly without making substantive changes to their operations. Without clear standards and independent verification, it can be difficult for travellers to distinguish genuinely sustainable options from those simply using the label for marketing purposes.`
  },
  {
    label: 'F',
    text: `Looking ahead, many experts believe that government regulation will play an increasingly important role in shaping the future of tourism in the region. Voluntary initiatives by individual businesses, while valuable, are unlikely to be sufficient to address challenges on the scale currently facing destinations such as Bali and Phuket. Policies such as visitor caps, environmental taxes, and mandatory certification schemes are being discussed or piloted in several countries. Whether these measures will be enough to balance the economic benefits of tourism with the need to protect natural and cultural heritage for future generations remains to be seen, but there is growing recognition that the status quo is no longer sustainable.`
  },
]

// Matching Headings (Questions 1-4, for paragraphs B, C, D, E)
const HEADINGS_OPTIONS = [
  { id: 'i', text: 'A successful case of environmental recovery' },
  { id: 'ii', text: 'Defining a more balanced approach to tourism' },
  { id: 'iii', text: 'The economic importance of the tourism industry' },
  { id: 'iv', text: 'Challenges in achieving genuine sustainability' },
  { id: 'v', text: 'Local communities benefiting directly from tourism' },
  { id: 'vi', text: 'The role of governments in future tourism policy' },
  { id: 'vii', text: 'International celebrities promoting eco-tourism' },
]

const MATCHING_QUESTIONS = [
  { id: 1, paragraph: 'B', correct: 'ii' },
  { id: 2, paragraph: 'C', correct: 'i' },
  { id: 3, paragraph: 'D', correct: 'v' },
  { id: 4, paragraph: 'E', correct: 'iv' },
]

// True/False/Not Given (Questions 5-9)
const TFNG_QUESTIONS = [
  {
    id: 5,
    statement: 'Maya Bay was closed permanently and will never reopen to tourists.',
    correct: 'FALSE',
    explanation: 'Paragraph C states the bay "reopened" with strict visitor caps and time limits — it was not closed permanently.',
    paragraphRef: 'C',
  },
  {
    id: 6,
    statement: 'Coral cover in Maya Bay increased after visitor numbers were restricted.',
    correct: 'TRUE',
    explanation: 'Paragraph C states "coral cover in the bay has increased significantly since the restrictions were put in place."',
    paragraphRef: 'C',
  },
  {
    id: 7,
    statement: 'Community-based tourism programmes in northern Thailand are usually run by large international hotel chains.',
    correct: 'FALSE',
    explanation: 'Paragraph D says these programmes "are often run cooperatively, with profits shared among community members" — the opposite of large international chains.',
    paragraphRef: 'D',
  },
  {
    id: 8,
    statement: 'All tourists in Southeast Asia are willing to pay more for environmentally friendly travel options.',
    correct: 'FALSE',
    explanation: 'Paragraph E states "many tourists continue to prioritise low prices and convenience over environmental or social considerations" — this contradicts the statement.',
    paragraphRef: 'E',
  },
  {
    id: 9,
    statement: 'The text suggests that voluntary action by businesses alone is unlikely to solve sustainability challenges.',
    correct: 'TRUE',
    explanation: 'Paragraph F states "Voluntary initiatives by individual businesses, while valuable, are unlikely to be sufficient to address challenges on the scale currently facing destinations."',
    paragraphRef: 'F',
  },
]

// Multiple Choice (Questions 10-13)
const MC_QUESTIONS = [
  {
    id: 10,
    question: 'According to the passage, what was the main reason for closing Maya Bay in 2018?',
    options: [
      'The Hollywood film crew requested privacy',
      'The coral ecosystem could not sustain the number of visitors',
      'A new resort was being built on the site',
      'Local communities protested against tourism',
    ],
    correct: 1,
    explanation: 'Paragraph C explains the bay was receiving up to 5,000 visitors per day, "far exceeding what the delicate coral ecosystem could sustain."',
    paragraphRef: 'C',
  },
  {
    id: 11,
    question: 'What is "greenwashing" as described in the passage?',
    question_full: 'What does the term "greenwashing" refer to in the passage?',
    options: [
      'Painting buildings green to blend with the environment',
      'A government policy to plant more trees',
      'Marketing a destination as eco-friendly without real change',
      'A type of renewable energy used by hotels',
    ],
    correct: 2,
    explanation: 'Paragraph E defines greenwashing as destinations "marketing themselves as eco-friendly without making substantive changes to their operations."',
    paragraphRef: 'E',
  },
  {
    id: 12,
    question: 'Which of the following is mentioned as a potential future policy measure?',
    options: [
      'Banning tourism completely in popular destinations',
      'Mandatory certification schemes',
      'Reducing all hotel prices',
      'Increasing the number of international flights',
    ],
    correct: 1,
    explanation: 'Paragraph F lists "visitor caps, environmental taxes, and mandatory certification schemes" as policies being discussed or piloted.',
    paragraphRef: 'F',
  },
  {
    id: 13,
    question: 'What is the overall tone of the final paragraph regarding the future of tourism in the region?',
    options: [
      'Completely pessimistic — nothing can be done',
      'Entirely optimistic — all problems are already solved',
      'Cautiously uncertain, but acknowledging change is needed',
      'Focused only on the economic benefits of tourism',
    ],
    correct: 2,
    explanation: 'The paragraph says the outcome "remains to be seen" but also states there is "growing recognition that the status quo is no longer sustainable" — this reflects cautious uncertainty combined with acknowledgement of the need for change.',
    paragraphRef: 'F',
  },
]

const VOCABULARY1 = [
  { word: 'fragile ecosystems', definition: 'natural environments that are easily damaged or destroyed' },
  { word: 'stakeholders', definition: 'people or groups with an interest or concern in something' },
  { word: 'visitor caps', definition: 'limits on the number of people allowed to visit a place' },
  { word: 'gained traction', definition: 'started to become popular or successful' },
  { word: 'cooperatively', definition: 'working together towards a shared goal' },
  { word: 'substantive', definition: 'real and meaningful, not superficial' },
  { word: 'status quo', definition: 'the current situation or state of affairs' },
]

// ============ PASSAGE 2 ============
const PASSAGE2_TITLE = 'The Rise of Remote Work and Digital Nomads'
const PASSAGE2_DIFFICULTY = 'Medium'

const PASSAGE2_PARAGRAPHS = [
  {
    label: 'A',
    text: `The COVID-19 pandemic fundamentally altered global attitudes towards work, accelerating a shift towards remote and flexible working arrangements that had been gradually emerging for over a decade. As companies discovered that many roles could be performed effectively from anywhere with a reliable internet connection, a new category of worker emerged: the digital nomad. These individuals, often employed by companies based in North America, Europe, or Australia, choose to live and work from locations around the world, frequently moving between countries every few months. Southeast Asia, with its combination of affordable living costs, reliable infrastructure in major cities, and appealing climate, has become one of the most popular regions for this growing community.`
  },
  {
    label: 'B',
    text: `Thailand, in particular, has long been a magnet for remote workers, with cities such as Chiang Mai and, more recently, Bangkok and coastal towns like Hua Hin attracting thousands of long-term visitors who blend work with travel. Co-working spaces equipped with high-speed internet, comfortable furniture, and communal areas have proliferated in these locations, often doubling as social hubs where nomads can network and collaborate. Monthly membership fees for such spaces are typically a fraction of what equivalent facilities would cost in cities like London or San Francisco, making them accessible even to freelancers and remote workers on modest incomes.`
  },
  {
    label: 'C',
    text: `The economic impact of this influx has been mixed. On one hand, digital nomads contribute significantly to local economies through spending on accommodation, food, transport, and leisure activities, often for extended periods that exceed typical tourist visits. Small businesses, particularly cafes, restaurants, and short-term rental properties, have benefited considerably from this steady stream of customers. On the other hand, in popular nomad hubs, the increased demand for housing has contributed to rising rents, sometimes pricing out long-term local residents who cannot compete with the purchasing power of foreign workers earning salaries in stronger currencies.`
  },
  {
    label: 'D',
    text: `Recognising both the economic opportunities and the need for clearer regulation, several Southeast Asian governments have introduced specific visa categories designed for remote workers. Thailand launched its Long-Term Resident visa programme, which includes a category for remote workers employed by overseas companies, offering extended stays of up to ten years under certain conditions. Similar schemes have been introduced in Indonesia, Malaysia, and the Philippines, reflecting a broader regional trend of competing to attract this demographic, who are seen as bringing foreign currency into the economy without directly competing for local jobs.`
  },
  {
    label: 'E',
    text: `Despite these policy developments, digital nomads continue to face a number of practical challenges. Navigating visa renewals, opening bank accounts, and accessing affordable health insurance can be complicated and time-consuming, particularly for those without local language skills or established networks. Many nomads report feelings of social isolation despite being surrounded by other travellers, as the transient nature of nomad communities means friendships are often short-lived. Mental health support tailored to this lifestyle remains limited in most destinations, an issue that has received increasing attention in online nomad communities and forums.`
  },
  {
    label: 'F',
    text: `The presence of large numbers of remote workers has also affected local labour markets in complex ways. While digital nomads rarely compete directly for local jobs given that their employment is based overseas, their presence has driven demand for support services such as English-language tutoring, visa consultancy, and property management, creating new employment opportunities for local residents. However, some community groups have raised concerns about a growing divide between areas that cater primarily to foreign remote workers and those that remain oriented towards the local population, with differing price levels and amenities.`
  },
  {
    label: 'G',
    text: `Looking forward, policymakers across the region face the task of balancing the economic benefits that remote workers bring against the social and economic pressures their presence can create for local communities. Some analysts suggest that more sustainable approaches might involve directing infrastructure investment towards secondary cities and regions, spreading the economic benefits more evenly while reducing pressure on already popular hubs. Whether governments will adopt such strategies, or continue to focus primarily on attracting nomads to existing tourist centres, will likely shape the character of these communities for years to come.`
  },
]

// Matching Information (Questions 14-17)
const MATCHING_INFO_QUESTIONS = [
  {
    id: 14,
    prompt: 'a comparison of the cost of co-working spaces in Southeast Asia with those in Western cities',
    correct: 'B',
    explanation: 'Paragraph B states monthly fees "are typically a fraction of what equivalent facilities would cost in cities like London or San Francisco."',
  },
  {
    id: 15,
    prompt: 'examples of several countries that have introduced visa categories for remote workers',
    correct: 'D',
    explanation: 'Paragraph D names Thailand, Indonesia, Malaysia, and the Philippines as countries with remote worker visa schemes.',
  },
  {
    id: 16,
    prompt: 'a mental health issue affecting some remote workers',
    correct: 'E',
    explanation: 'Paragraph E discusses "feelings of social isolation" and limited "mental health support tailored to this lifestyle."',
  },
  {
    id: 17,
    prompt: 'a suggestion for distributing the economic benefits of remote work more evenly across a region',
    correct: 'G',
    explanation: 'Paragraph G suggests "directing infrastructure investment towards secondary cities and regions, spreading the economic benefits more evenly."',
  },
]

// Sentence Completion (Questions 18-22) - NO MORE THAN TWO WORDS
const SENTENCE_COMPLETION_QUESTIONS = [
  {
    id: 18,
    sentence: 'The pandemic accelerated a shift towards remote and ______ working arrangements.',
    correct: 'flexible',
    explanation: 'Paragraph A: "a shift towards remote and flexible working arrangements."',
    paragraphRef: 'A',
  },
  {
    id: 19,
    sentence: 'In Thailand, popular destinations for remote workers include Chiang Mai, Bangkok, and coastal towns such as ______.',
    correct: 'Hua Hin',
    explanation: 'Paragraph B: "coastal towns like Hua Hin attracting thousands of long-term visitors."',
    paragraphRef: 'B',
  },
  {
    id: 20,
    sentence: 'Membership fees for co-working spaces in Thailand are often only a ______ of equivalent costs in Western cities.',
    correct: 'fraction',
    explanation: 'Paragraph B: "a fraction of what equivalent facilities would cost in cities like London or San Francisco."',
    paragraphRef: 'B',
  },
  {
    id: 21,
    sentence: "Thailand's ______ visa programme allows eligible remote workers to stay for up to ten years.",
    correct: 'Long-Term Resident',
    explanation: 'Paragraph D: "Thailand launched its Long-Term Resident visa programme."',
    paragraphRef: 'D',
  },
  {
    id: 22,
    sentence: 'Many digital nomads experience feelings of ______ despite being surrounded by other travellers.',
    correct: 'social isolation',
    explanation: 'Paragraph E: "Many nomads report feelings of social isolation despite being surrounded by other travellers."',
    paragraphRef: 'E',
  },
]

// Multiple Choice (Questions 23-26)
const MC2_QUESTIONS = [
  {
    id: 23,
    question: "What does the passage suggest about the relationship between digital nomads and local job markets?",
    options: [
      'Nomads directly compete with locals for the same jobs',
      'Nomads have no effect on local labour markets at all',
      "Nomads' employment is based overseas, but they create demand for support services",
      'Nomads are required by law to hire local employees',
    ],
    correct: 2,
    explanation: 'Paragraph F states nomads "rarely compete directly for local jobs... but their presence has driven demand for support services such as English-language tutoring, visa consultancy, and property management."',
    paragraphRef: 'F',
  },
  {
    id: 24,
    question: 'According to paragraph C, what is one negative consequence of an influx of digital nomads for local communities?',
    options: [
      'A decrease in the number of cafes and restaurants',
      'Rising rents that may price out long-term residents',
      'A reduction in tourist numbers',
      'Lower wages for foreign workers',
    ],
    correct: 1,
    explanation: 'Paragraph C states the "increased demand for housing has contributed to rising rents, sometimes pricing out long-term local residents."',
    paragraphRef: 'C',
  },
  {
    id: 25,
    question: 'Why, according to the passage, have several Southeast Asian governments introduced remote worker visa categories?',
    options: [
      'To reduce the overall number of foreign visitors',
      'Because remote workers are required to find local employment',
      'To bring foreign currency into the economy without competing for local jobs',
      'To encourage nomads to apply for permanent citizenship',
    ],
    correct: 2,
    explanation: 'Paragraph D explains these workers are "seen as bringing foreign currency into the economy without directly competing for local jobs."',
    paragraphRef: 'D',
  },
  {
    id: 26,
    question: 'What approach do some analysts suggest for a more sustainable distribution of remote-work tourism in the region?',
    options: [
      'Banning digital nomads from major cities',
      'Directing infrastructure investment towards secondary cities and regions',
      'Significantly increasing visa fees for all visitors',
      'Limiting internet access in co-working spaces',
    ],
    correct: 1,
    explanation: 'Paragraph G suggests "directing infrastructure investment towards secondary cities and regions, spreading the economic benefits more evenly."',
    paragraphRef: 'G',
  },
]

const VOCABULARY2 = [
  { word: 'transient', definition: 'lasting only for a short time; temporary' },
  { word: 'proliferated', definition: 'increased rapidly in number' },
  { word: 'influx', definition: 'an arrival of a large number of people or things' },
  { word: 'demographic', definition: 'a particular group within a population' },
  { word: 'consultancy', definition: 'a business that provides expert advice in a particular field' },
  { word: 'amenities', definition: 'desirable or useful features and facilities' },
  { word: 'magnet', definition: 'something or someone that strongly attracts people or things' },
]

// ============ PASSAGE 3 ============
const PASSAGE3_TITLE = 'Wildlife Conservation in Thailand'
const PASSAGE3_DIFFICULTY = 'Harder'

const PASSAGE3_PARAGRAPHS = [
  {
    label: 'A',
    text: `Thailand is home to an extraordinary range of biodiversity, from the dense rainforests of the south to the mountainous national parks of the north, hosting species such as Asian elephants, tigers, hornbills, and countless marine creatures along its extensive coastlines. The country's network of national parks and wildlife sanctuaries, established mainly from the 1960s onwards, now covers a significant proportion of its land area. Despite these protections, conservation efforts continue to face substantial challenges, including habitat fragmentation, human-wildlife conflict, and the ongoing threat of illegal wildlife trade, all of which require sustained attention from both government agencies and civil society.`
  },
  {
    label: 'B',
    text: `Few animals are as closely associated with Thailand as the Asian elephant, which has played a central role in the country's history, culture, and economy for centuries. For much of the twentieth century, elephants were widely used in the logging industry, and following a nationwide logging ban in 1989, many were redirected into the tourism sector, offering rides and performances to visitors. In recent years, however, growing awareness among international travellers of the physical and psychological toll that such practices can take on elephants has driven a noticeable shift in demand. A growing number of operators now offer "observation-only" experiences, where visitors watch elephants bathe, forage, and socialise without direct physical contact, a model that proponents argue is both more ethical and, in the long run, more sustainable for the animals involved.`
  },
  {
    label: 'C',
    text: `The illegal wildlife trade remains one of the most persistent threats to Thailand's biodiversity, with the country serving both as a source and as a transit point for trafficked animals and animal products moving between other parts of Asia and international markets. Species such as pangolins, tigers, and various reptiles are particularly affected, often poached for use in traditional medicine or sold as exotic pets. While Thai authorities have increased enforcement efforts in recent years, including high-profile seizures and prosecutions, conservationists argue that penalties remain insufficient to act as a meaningful deterrent, and that corruption at various levels continues to undermine enforcement efforts in certain regions.`
  },
  {
    label: 'D',
    text: `Thailand's marine environments, including extensive coral reef systems along both the Gulf of Thailand and the Andaman Sea coastlines, support a remarkable diversity of fish, invertebrates, and other marine life, and are a major draw for diving tourism. However, these ecosystems face pressures from coastal development, unsustainable fishing practices, and the effects of climate change, including coral bleaching events linked to rising sea temperatures. Marine national parks have been established to protect some of the most ecologically significant areas, with measures such as restrictions on anchoring, designated diving zones, and seasonal closures of particularly sensitive sites during coral spawning periods.`
  },
  {
    label: 'E',
    text: `Increasingly, conservation organisations and government agencies have recognised that long-term success depends heavily on the involvement of local communities living near protected areas. In several regions, community members have been trained and employed as rangers, guides, and researchers, providing income that is directly tied to the health of the ecosystems they help protect. Revenue-sharing arrangements, in which a portion of park entry fees or tourism income is allocated to nearby villages, have also been introduced in some areas, intended to ensure that communities have a tangible stake in conservation outcomes rather than viewing protected areas solely as a restriction on land use.`
  },
  {
    label: 'F',
    text: `Despite these positive developments, significant obstacles remain. Conservation funding is often insufficient and inconsistent, leaving many protected areas understaffed and under-resourced relative to the scale of the challenges they face. Human-wildlife conflict, particularly involving elephants that move beyond park boundaries into agricultural land, continues to cause economic losses for farmers and, in some cases, danger to both people and animals. Climate change adds a further layer of complexity, altering habitats and potentially forcing species to shift their ranges in ways that existing protected area boundaries may not accommodate.`
  },
  {
    label: 'G',
    text: `Looking to the future, technology is increasingly being incorporated into conservation efforts across Thailand. Camera traps and acoustic monitoring devices allow researchers to track elusive species such as tigers and clouded leopards without direct human presence, while drone surveys are being used to monitor forest cover and detect illegal logging activity in remote areas. International cooperation, including partnerships with neighbouring countries to address cross-border wildlife trafficking routes, is also seen as essential, given that many species and the threats they face do not respect national boundaries. Whether these combined efforts will be sufficient to reverse longer-term declines in some species populations remains an open question, but there is broad agreement that a multi-faceted approach offers the best chance of success.`
  },
]

// Yes/No/Not Given (Questions 27-31)
const YNNG_QUESTIONS = [
  {
    id: 27,
    statement: "Thailand's national parks have completely resolved the country's conservation challenges.",
    correct: 'NO',
    explanation: 'Paragraph A states that "despite these protections, conservation efforts continue to face substantial challenges" — the opposite of being completely resolved.',
    paragraphRef: 'A',
  },
  {
    id: 28,
    statement: 'The shift towards observation-only elephant experiences has been influenced by changing attitudes among international tourists.',
    correct: 'YES',
    explanation: 'Paragraph B states this shift has been driven by "growing awareness among international travellers of the physical and psychological toll" of traditional practices.',
    paragraphRef: 'B',
  },
  {
    id: 29,
    statement: 'All elephant tourism operators in Thailand have now adopted observation-only models.',
    correct: 'NOT GIVEN',
    explanation: 'Paragraph B says "a growing number of operators" offer this model — it does not state that all operators have adopted it.',
    paragraphRef: 'B',
  },
  {
    id: 30,
    statement: 'Conservationists believe current penalties for wildlife trafficking are adequate.',
    correct: 'NO',
    explanation: 'Paragraph C states "conservationists argue that penalties remain insufficient to act as a meaningful deterrent."',
    paragraphRef: 'C',
  },
  {
    id: 31,
    statement: 'Local communities can receive direct financial benefits from taking part in conservation work.',
    correct: 'YES',
    explanation: 'Paragraph E describes community members being employed as rangers, guides, and researchers, and revenue-sharing arrangements that benefit villages.',
    paragraphRef: 'E',
  },
]

// Summary Completion (Questions 32-36) - NO MORE THAN TWO WORDS
const SUMMARY_TEXT_PARTS = [
  'Conservation organisations now recognise that long-term success depends on involving local ',
  ' living near protected areas. Community members can be trained and employed as rangers, guides, or ',
  '. Some areas have introduced ',
  ' arrangements, where a portion of park fees is allocated to nearby villages. However, conservation funding often remains ',
  ' and inconsistent, and conflict between elephants and ',
  ' continues to cause economic losses.',
]

const SUMMARY_QUESTIONS = [
  { id: 32, correct: 'communities', explanation: 'Paragraph E: "the involvement of local communities living near protected areas."', paragraphRef: 'E' },
  { id: 33, correct: 'researchers', explanation: 'Paragraph E: community members "trained and employed as rangers, guides, and researchers."', paragraphRef: 'E' },
  { id: 34, correct: 'revenue-sharing', explanation: 'Paragraph E: "Revenue-sharing arrangements, in which a portion of park entry fees... is allocated to nearby villages."', paragraphRef: 'E' },
  { id: 35, correct: 'insufficient', explanation: 'Paragraph F: "Conservation funding is often insufficient and inconsistent."', paragraphRef: 'F' },
  { id: 36, correct: 'farmers', explanation: 'Paragraph F: human-wildlife conflict "continues to cause economic losses for farmers."', paragraphRef: 'F' },
]

// Matching Information (Questions 37-40)
const MATCHING_INFO3_QUESTIONS = [
  {
    id: 37,
    prompt: 'a reference to a specific year when a major policy change took place',
    correct: 'B',
    explanation: 'Paragraph B mentions "a nationwide logging ban in 1989."',
  },
  {
    id: 38,
    prompt: 'examples of technology used to monitor wildlife without direct human presence',
    correct: 'G',
    explanation: 'Paragraph G mentions "camera traps and acoustic monitoring devices" and "drone surveys."',
  },
  {
    id: 39,
    prompt: 'a description of measures to protect a marine habitat during a sensitive biological period',
    correct: 'D',
    explanation: 'Paragraph D mentions "seasonal closures of particularly sensitive sites during coral spawning periods."',
  },
  {
    id: 40,
    prompt: 'a reference to corruption affecting enforcement efforts',
    correct: 'C',
    explanation: 'Paragraph C states "corruption at various levels continues to undermine enforcement efforts in certain regions."',
  },
]

const VOCABULARY3 = [
  { word: 'habitat fragmentation', definition: 'the breaking up of a large natural habitat into smaller, separated areas' },
  { word: 'deterrent', definition: 'something that discourages a particular action from happening' },
  { word: 'trafficked', definition: 'illegally traded or transported, often across borders' },
  { word: 'invertebrates', definition: 'animals without a backbone, such as insects or crabs' },
  { word: 'coral bleaching', definition: 'a process where corals lose colour and health due to stress, often from warm water' },
  { word: 'elusive', definition: 'difficult to find, catch, or observe' },
  { word: 'multi-faceted', definition: 'having many different parts or aspects' },
]

const BAND_CONVERSION = [
  { range: '39-40', band: '9' },
  { range: '37-38', band: '8.5' },
  { range: '35-36', band: '8' },
  { range: '33-34', band: '7.5' },
  { range: '30-32', band: '7' },
  { range: '27-29', band: '6.5' },
  { range: '23-26', band: '6' },
  { range: '19-22', band: '5.5' },
  { range: '15-18', band: '5' },
]

type AnswerMap = { [key: number]: string | number }

export default function ReadingLesson1Page() {
  const [stage, setStage] = useState<'intro' | 'passage1' | 'passage2' | 'passage3' | 'results'>('intro')
  const [useTimer, setUseTimer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TEST_TIME)
  const [timerRunning, setTimerRunning] = useState(false)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [showVocab, setShowVocab] = useState(false)
  const [showVocab2, setShowVocab2] = useState(false)
  const [showVocab3, setShowVocab3] = useState(false)
  const [reviewExpanded, setReviewExpanded] = useState<number | null>(null)
  const [showTeacherMode, setShowTeacherMode] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('ielts_email')
    const expires = localStorage.getItem('ielts_expires')
    if (email && expires && new Date(expires) > new Date()) setHasAccess(true)
  }, [])

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
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m}:${sec.toString().padStart(2, '0')}`
  }

  function setAnswer(qId: number, value: string | number) {
    setAnswers(prev => ({ ...prev, [qId]: value }))
  }

  const passage1QCount = MATCHING_QUESTIONS.length + TFNG_QUESTIONS.length + MC_QUESTIONS.length
  const passage1Answered = MATCHING_QUESTIONS.filter(q => answers[q.id] !== undefined).length +
    TFNG_QUESTIONS.filter(q => answers[q.id] !== undefined).length +
    MC_QUESTIONS.filter(q => answers[q.id] !== undefined).length

  const passage2QCount = MATCHING_INFO_QUESTIONS.length + SENTENCE_COMPLETION_QUESTIONS.length + MC2_QUESTIONS.length
  const passage2Answered = MATCHING_INFO_QUESTIONS.filter(q => answers[q.id] !== undefined).length +
    SENTENCE_COMPLETION_QUESTIONS.filter(q => answers[q.id] !== undefined && String(answers[q.id]).trim() !== '').length +
    MC2_QUESTIONS.filter(q => answers[q.id] !== undefined).length

  const passage3QCount = YNNG_QUESTIONS.length + SUMMARY_QUESTIONS.length + MATCHING_INFO3_QUESTIONS.length
  const passage3Answered = YNNG_QUESTIONS.filter(q => answers[q.id] !== undefined).length +
    SUMMARY_QUESTIONS.filter(q => answers[q.id] !== undefined && String(answers[q.id]).trim() !== '').length +
    MATCHING_INFO3_QUESTIONS.filter(q => answers[q.id] !== undefined).length

  // Unified question metadata for scoring & results review
  type QMeta = { id: number; passage: number; type: string; correct: string | number; explanation: string; paragraphRef: string; promptText: string; correctDisplay: string }

  const ALL_QUESTIONS: QMeta[] = [
    ...MATCHING_QUESTIONS.map(q => ({ id: q.id, passage: 1, type: 'Matching Heading', correct: q.correct, explanation: `The correct heading for Paragraph ${q.paragraph} is "${HEADINGS_OPTIONS.find(h => h.id === q.correct)?.text}".`, paragraphRef: q.paragraph, promptText: `Paragraph ${q.paragraph}`, correctDisplay: `${q.correct} — ${HEADINGS_OPTIONS.find(h => h.id === q.correct)?.text}` })),
    ...TFNG_QUESTIONS.map(q => ({ id: q.id, passage: 1, type: 'True/False/Not Given', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.statement, correctDisplay: q.correct })),
    ...MC_QUESTIONS.map(q => ({ id: q.id, passage: 1, type: 'Multiple Choice', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.question_full || q.question, correctDisplay: `${['A','B','C','D'][q.correct]} — ${q.options[q.correct]}` })),
    ...MATCHING_INFO_QUESTIONS.map(q => ({ id: q.id, passage: 2, type: 'Matching Information', correct: q.correct, explanation: q.explanation, paragraphRef: q.correct, promptText: q.prompt, correctDisplay: `Paragraph ${q.correct}` })),
    ...SENTENCE_COMPLETION_QUESTIONS.map(q => ({ id: q.id, passage: 2, type: 'Sentence Completion', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.sentence, correctDisplay: q.correct })),
    ...MC2_QUESTIONS.map(q => ({ id: q.id, passage: 2, type: 'Multiple Choice', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.question, correctDisplay: `${['A','B','C','D'][q.correct]} — ${q.options[q.correct]}` })),
    ...YNNG_QUESTIONS.map(q => ({ id: q.id, passage: 3, type: 'Yes/No/Not Given', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: q.statement, correctDisplay: q.correct })),
    ...SUMMARY_QUESTIONS.map(q => ({ id: q.id, passage: 3, type: 'Summary Completion', correct: q.correct, explanation: q.explanation, paragraphRef: q.paragraphRef, promptText: `Summary gap ${q.id}`, correctDisplay: q.correct })),
    ...MATCHING_INFO3_QUESTIONS.map(q => ({ id: q.id, passage: 3, type: 'Matching Information', correct: q.correct, explanation: q.explanation, paragraphRef: q.correct, promptText: q.prompt, correctDisplay: `Paragraph ${q.correct}` })),
  ].sort((a, b) => a.id - b.id)

  function getUserAnswerDisplay(q: QMeta, userAns: string | number | undefined): string {
    if (userAns === undefined || userAns === '') return '(no answer)'
    if (q.type === 'Multiple Choice' && typeof userAns === 'number') {
      const mcSource = q.passage === 1 ? MC_QUESTIONS : MC2_QUESTIONS
      const found = mcSource.find(m => m.id === q.id)
      return found ? `${['A','B','C','D'][userAns]} — ${found.options[userAns]}` : String(userAns)
    }
    if (q.type === 'Matching Heading') {
      const heading = HEADINGS_OPTIONS.find(h => h.id === userAns)
      return heading ? `${userAns} — ${heading.text}` : String(userAns)
    }
    if (q.type === 'Matching Information') {
      return `Paragraph ${userAns}`
    }
    return String(userAns)
  }

  function isCorrect(q: QMeta): boolean {
    const userAnswer = answers[q.id]
    if (userAnswer === undefined) return false
    if (typeof q.correct === 'number') return userAnswer === q.correct
    return String(userAnswer).trim().toLowerCase() === String(q.correct).trim().toLowerCase()
  }

  const totalCorrect = ALL_QUESTIONS.filter(isCorrect).length
  const passage1Correct = ALL_QUESTIONS.filter(q => q.passage === 1 && isCorrect(q)).length
  const passage2Correct = ALL_QUESTIONS.filter(q => q.passage === 2 && isCorrect(q)).length
  const passage3Correct = ALL_QUESTIONS.filter(q => q.passage === 3 && isCorrect(q)).length

  function getEstimatedBand(score: number): string {
    if (score >= 39) return '9'
    if (score >= 37) return '8.5'
    if (score >= 35) return '8'
    if (score >= 33) return '7.5'
    if (score >= 30) return '7'
    if (score >= 27) return '6.5'
    if (score >= 23) return '6'
    if (score >= 19) return '5.5'
    if (score >= 15) return '5'
    if (score >= 13) return '4.5'
    return '4 or below'
  }

  // ============ INTRO STAGE ============
  if (stage === 'intro') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link href="/ielts/reading" style={{ color: '#d97706', fontSize: '13px', textDecoration: 'none' }}>← Reading Tests</Link>

        <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', borderRadius: '16px', padding: '32px', margin: '20px 0', color: 'white' }}>
          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>IELTS Reading — Full Mock Test 1</div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px' }}>3 Passages · 40 Questions · 60 Minutes</h1>
          <p style={{ opacity: 0.8, margin: 0, fontSize: '14px' }}>Realistic IELTS Reading practice with mixed question types, AI explanations, and band score conversion.</p>
        </div>

        {/* How IELTS Reading Works */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📖 How IELTS Reading Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: '3 Passages', desc: 'Texts increase in difficulty from Passage 1 (easier) to Passage 3 (harder).' },
              { label: '40 Questions Total', desc: 'Around 13-14 questions per passage, with several different question types mixed together.' },
              { label: '60 Minutes', desc: 'No extra time for transferring answers — manage your time across all 3 passages.' },
              { label: 'One Mark Per Question', desc: 'Your raw score out of 40 is converted to a band score using the table below.' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 2px' }}>{item.label}</p>
                  <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Band Conversion Table */}
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '10px' }}>Band Score Conversion (Academic)</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {BAND_CONVERSION.map(row => (
              <div key={row.band} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#92400e' }}>{row.range} correct</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>Band {row.band}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timer Option */}
        <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 4px' }}>⏱️ Timed Exam Mode</p>
              <p style={{ fontSize: '13px', color: '#1e40af', margin: 0 }}>Simulate real exam conditions with a 60-minute countdown for all 3 passages.</p>
            </div>
            <button
              onClick={() => setUseTimer(!useTimer)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', background: useTimer ? '#2563eb' : '#e2e8f0', color: useTimer ? 'white' : '#555', whiteSpace: 'nowrap' }}
            >
              {useTimer ? '✓ Timer On' : 'Timer Off'}
            </button>
          </div>
        </div>

        {/* What you get */}
        <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid #bbf7d0' }}>
          <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 8px', fontWeight: 'bold' }}>What's included in this test:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {['🎯 Score out of 40 + band estimate','📝 AI explanation for every question','📚 Key vocabulary from each passage','👨‍🏫 Teacher mode with discussion points','🔄 Mixed question types per passage','⏱️ Optional 60-minute timer'].map(item => (
              <div key={item} style={{ fontSize: '13px', color: '#166534' }}>{item}</div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setStage('passage1'); if (useTimer) { setTimeLeft(TEST_TIME); setTimerRunning(true) } }}
          style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Start Reading Test →
        </button>
      </div>
    </main>
  )

  // ============ PASSAGE 1 STAGE ============
  if (stage === 'passage1') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#78350f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Passage 1 of 3</span>
            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{PASSAGE1_DIFFICULTY}</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{passage1Answered}/{passage1QCount} answered</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {hasAccess && (
              <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#78350f' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                👨‍🏫 Teacher Mode
              </button>
            )}
            {useTimer && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: timeLeft < 600 ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', padding: '6px 14px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: timeLeft < 600 ? '#ef4444' : '#555', fontFamily: 'monospace' }}>⏱️ {formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Mode */}
        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 1</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 18-20 minutes for this passage if doing the full test (60 min / 3 passages).</p>
              <p style={{ margin: '0 0 6px' }}><strong>Matching Headings strategy:</strong> Read each paragraph's first and last sentences first — they often summarise the main idea. Discuss why "vii" (celebrities) is a distractor not used anywhere.</p>
              <p style={{ margin: '0 0 6px' }}><strong>True/False/Not Given tip:</strong> Remind students "Not Given" means the information is not in the text at all — not that it's false. This passage has no "Not Given" answers, which is worth discussing.</p>
              <p style={{ margin: 0 }}><strong>Classroom use:</strong> After completing, discuss the vocabulary list together and ask students to use 3 words in new sentences about tourism in their own region.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

          {/* LEFT — Passage */}
          <div style={{ position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>{PASSAGE1_TITLE}</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Read the passage below and answer questions 1-13.</p>
            {PASSAGE1_PARAGRAPHS.map(p => (
              <div key={p.label} style={{ marginBottom: '16px' }}>
                <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', marginBottom: '6px' }}>Paragraph {p.label}</span>
                <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: 1.8 }}>{p.text}</p>
              </div>
            ))}

            <button onClick={() => setShowVocab(!showVocab)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#555', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}>
              {showVocab ? '▲ Hide' : '▼ Show'} Key Vocabulary
            </button>
            {showVocab && (
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

          {/* RIGHT — Questions */}
          <div>

            {/* Matching Headings */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 1-4 — Matching Headings</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>The passage has six paragraphs, A-F. Choose the correct heading for paragraphs B-E from the list of headings below. Paragraphs A and F have been done for you as examples.</p>

              {/* Headings list */}
              <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', border: '1px solid #bfdbfe' }}>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 8px' }}>List of Headings</p>
                {HEADINGS_OPTIONS.map(h => (
                  <p key={h.id} style={{ fontSize: '13px', color: '#1e40af', margin: '0 0 4px' }}><strong>{h.id}.</strong> {h.text}</p>
                ))}
              </div>

              {/* Example */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', opacity: 0.6 }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>A</span>
                <span style={{ fontSize: '13px', color: '#555' }}>Paragraph A — <strong>iii</strong> (Example)</span>
              </div>

              {MATCHING_QUESTIONS.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                  <span style={{ fontSize: '13px', color: '#374151', flexShrink: 0, minWidth: '90px' }}>Paragraph {q.paragraph}</span>
                  <select value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#1a1a2e', outline: 'none' }}>
                    <option value="">Select a heading...</option>
                    {HEADINGS_OPTIONS.map(h => <option key={h.id} value={h.id}>{h.id}. {h.text}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* True/False/Not Given */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 5-9 — True / False / Not Given</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Do the following statements agree with the information given in the passage?</p>
              {TFNG_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}><strong>{q.id}.</strong> {q.statement}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                      <button key={opt} onClick={() => setAnswer(q.id, opt)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: answers[q.id] === opt ? '2px solid #059669' : '2px solid #e2e8f0', background: answers[q.id] === opt ? '#dcfce7' : 'white', color: answers[q.id] === opt ? '#166534' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Multiple Choice */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 10-13 — Multiple Choice</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Choose the correct letter, A, B, C, or D.</p>
              {MC_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}><strong>{q.id}.</strong> {q.question_full || q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {q.options.map((opt, i) => (
                      <button key={i} onClick={() => setAnswer(q.id, i)} style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: answers[q.id] === i ? '2px solid #7c3aed' : '2px solid #e2e8f0', background: answers[q.id] === i ? '#faf5ff' : 'white', color: answers[q.id] === i ? '#6d28d9' : '#374151', fontSize: '13px', cursor: 'pointer' }}>
                        <strong>{['A', 'B', 'C', 'D'][i]}.</strong> {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStage('passage2')} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Continue to Passage 2 →
            </button>
          </div>
        </div>
      </div>
    </main>
  )

  // ============ PASSAGE 2 STAGE ============
  if (stage === 'passage2') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#78350f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Passage 2 of 3</span>
            <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{PASSAGE2_DIFFICULTY}</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{passage2Answered}/{passage2QCount} answered</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {hasAccess && (
              <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#78350f' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                👨‍🏫 Teacher Mode
              </button>
            )}
            {useTimer && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: timeLeft < 600 ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', padding: '6px 14px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: timeLeft < 600 ? '#ef4444' : '#555', fontFamily: 'monospace' }}>⏱️ {formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Mode */}
        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 2</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage if doing the full test.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Matching Information strategy:</strong> Unlike Matching Headings, here students scan for specific details, names, numbers, or examples — not overall ideas. Skimming for proper nouns (country names, place names) can help locate answers quickly.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Sentence Completion tip:</strong> Remind students the word limit is strict — "Long-Term Resident" (Q21) is two words and must be written exactly as in the text, including capitalisation conventions.</p>
              <p style={{ margin: 0 }}><strong>Discussion:</strong> This topic is highly relevant in Thailand. Ask students for their own views — do they think digital nomads are good or bad for their local area?</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

          {/* LEFT — Passage */}
          <div style={{ position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>{PASSAGE2_TITLE}</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Read the passage below and answer questions 14-26.</p>
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

          {/* RIGHT — Questions */}
          <div>

            {/* Matching Information */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 14-17 — Matching Information</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>The passage has seven paragraphs, A-G. Which paragraph contains the following information? Write the correct letter, A-G.</p>

              {MATCHING_INFO_QUESTIONS.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                  <p style={{ fontSize: '13px', color: '#374151', margin: 0, flex: 1, lineHeight: 1.5 }}>{q.prompt}</p>
                  <select value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} style={{ width: '72px', padding: '8px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#1a1a2e', outline: 'none', flexShrink: 0 }}>
                    <option value="">--</option>
                    {['A','B','C','D','E','F','G'].map(letter => <option key={letter} value={letter}>{letter}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Sentence Completion */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 18-22 — Sentence Completion</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Complete the sentences below. Write <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>
              {SENTENCE_COMPLETION_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '14px' }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 6px', lineHeight: 1.6 }}>
                    <strong>{q.id}.</strong> {q.sentence.split('______')[0]}
                    <input
                      type="text"
                      value={answers[q.id] as string || ''}
                      onChange={e => setAnswer(q.id, e.target.value)}
                      placeholder="............."
                      style={{ display: 'inline-block', width: '140px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center' }}
                    />
                    {q.sentence.split('______')[1]}
                  </p>
                </div>
              ))}
            </div>

            {/* Multiple Choice */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 23-26 — Multiple Choice</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Choose the correct letter, A, B, C, or D.</p>
              {MC2_QUESTIONS.map(q => (
                <div key={q.id} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}><strong>{q.id}.</strong> {q.question}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {q.options.map((opt, i) => (
                      <button key={i} onClick={() => setAnswer(q.id, i)} style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: answers[q.id] === i ? '2px solid #7c3aed' : '2px solid #e2e8f0', background: answers[q.id] === i ? '#faf5ff' : 'white', color: answers[q.id] === i ? '#6d28d9' : '#374151', fontSize: '13px', cursor: 'pointer' }}>
                        <strong>{['A', 'B', 'C', 'D'][i]}.</strong> {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStage('passage1')} style={{ flex: 1, padding: '14px', background: 'white', color: '#78350f', border: '2px solid #78350f', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                ← Back to Passage 1
              </button>
              <button onClick={() => setStage('passage3')} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                Continue to Passage 3 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )

  // ============ PASSAGE 3 STAGE ============
  if (stage === 'passage3') return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#78350f', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Passage 3 of 3</span>
            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{PASSAGE3_DIFFICULTY}</span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{passage3Answered}/{passage3QCount} answered</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {hasAccess && (
              <button onClick={() => setShowTeacherMode(!showTeacherMode)} style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', background: showTeacherMode ? '#78350f' : 'white', color: showTeacherMode ? 'white' : '#555', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                👨‍🏫 Teacher Mode
              </button>
            )}
            {useTimer && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: timeLeft < 600 ? '#fee2e2' : '#f1f5f9', borderRadius: '8px', padding: '6px 14px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: timeLeft < 600 ? '#ef4444' : '#555', fontFamily: 'monospace' }}>⏱️ {formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Teacher Mode */}
        {showTeacherMode && (
          <div style={{ background: '#78350f', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Passage 3</h3>
            <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ margin: '0 0 6px' }}><strong>Suggested timing:</strong> 20 minutes for this passage if doing the full test — this is the hardest passage, encourage students not to rush early sections at the cost of this one.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Yes/No/Not Given vs True/False/Not Given:</strong> Discuss the difference — Yes/No/Not Given is used when the passage presents the writer's claims or arguments, while True/False/Not Given tests factual information. The skill is similar but framing differs.</p>
              <p style={{ margin: '0 0 6px' }}><strong>Summary Completion strategy:</strong> Read the whole summary first to understand its overall topic before filling gaps — this helps predict word types (noun, adjective, etc.) needed for each blank.</p>
              <p style={{ margin: 0 }}><strong>Extension:</strong> Q29 (NOT GIVEN) is a good discussion point — ask students to explain why this is NOT GIVEN rather than YES, reinforcing the key distinction between "not stated" and "false."</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

          {/* LEFT — Passage */}
          <div style={{ position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto', background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' }}>{PASSAGE3_TITLE}</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Read the passage below and answer questions 27-40.</p>
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

          {/* RIGHT — Questions */}
          <div>

            {/* Yes/No/Not Given */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 27-31 — Yes / No / Not Given</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Do the following statements agree with the views or claims made in the passage?</p>
              {YNNG_QUESTIONS.map(q => (
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
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 32-36 — Summary Completion</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>Complete the summary below using <strong>NO MORE THAN TWO WORDS</strong> from the passage for each answer.</p>
              <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '16px', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '14px', color: '#166534', margin: 0, lineHeight: 2 }}>
                  {SUMMARY_TEXT_PARTS[0]}
                  <input type="text" value={answers[32] as string || ''} onChange={e => setAnswer(32, e.target.value)} placeholder="32" style={{ display: 'inline-block', width: '110px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY_TEXT_PARTS[1]}
                  <input type="text" value={answers[33] as string || ''} onChange={e => setAnswer(33, e.target.value)} placeholder="33" style={{ display: 'inline-block', width: '110px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY_TEXT_PARTS[2]}
                  <input type="text" value={answers[34] as string || ''} onChange={e => setAnswer(34, e.target.value)} placeholder="34" style={{ display: 'inline-block', width: '120px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY_TEXT_PARTS[3]}
                  <input type="text" value={answers[35] as string || ''} onChange={e => setAnswer(35, e.target.value)} placeholder="35" style={{ display: 'inline-block', width: '110px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY_TEXT_PARTS[4]}
                  <input type="text" value={answers[36] as string || ''} onChange={e => setAnswer(36, e.target.value)} placeholder="36" style={{ display: 'inline-block', width: '110px', padding: '4px 8px', borderRadius: '4px', border: '2px solid #bbf7d0', fontSize: '13px', color: '#1a1a2e', outline: 'none', margin: '0 4px', textAlign: 'center', background: 'white' }} />
                  {SUMMARY_TEXT_PARTS[5]}
                </p>
              </div>
            </div>

            {/* Matching Information */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>Questions 37-40 — Matching Information</p>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>The passage has seven paragraphs, A-G. Which paragraph contains the following information? Write the correct letter, A-G.</p>
              {MATCHING_INFO3_QUESTIONS.map(q => (
                <div key={q.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>{q.id}</span>
                  <p style={{ fontSize: '13px', color: '#374151', margin: 0, flex: 1, lineHeight: 1.5 }}>{q.prompt}</p>
                  <select value={answers[q.id] as string || ''} onChange={e => setAnswer(q.id, e.target.value)} style={{ width: '72px', padding: '8px', borderRadius: '6px', border: '2px solid #e2e8f0', fontSize: '13px', color: '#1a1a2e', outline: 'none', flexShrink: 0 }}>
                    <option value="">--</option>
                    {['A','B','C','D','E','F','G'].map(letter => <option key={letter} value={letter}>{letter}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStage('passage2')} style={{ flex: 1, padding: '14px', background: 'white', color: '#78350f', border: '2px solid #78350f', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                ← Back to Passage 2
              </button>
              <button onClick={() => { setTimerRunning(false); setStage('results') }} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #16a34a, #059669)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
                ✅ Finish Test & See Results →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )

  // ============ RESULTS STAGE ============
  if (stage === 'results') {
    const passageCorrectMap: { [key: number]: number } = { 1: passage1Correct, 2: passage2Correct, 3: passage3Correct }
    const passageTotalMap: { [key: number]: number } = { 1: 13, 2: 13, 3: 14 }
    const passageTitleMap: { [key: number]: string } = { 1: PASSAGE1_TITLE, 2: PASSAGE2_TITLE, 3: PASSAGE3_TITLE }

    return (
      <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <Link href="/ielts/reading" style={{ color: '#d97706', fontSize: '13px', textDecoration: 'none' }}>← Reading Tests</Link>
            <button onClick={() => { setAnswers({}); setStage('intro'); setTimeLeft(TEST_TIME); setTimerRunning(false) }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#555', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>🔄 Retake Test</button>
          </div>

          {/* Overall Score */}
          <div style={{ background: 'linear-gradient(135deg, #78350f, #d97706)', borderRadius: '16px', padding: '32px', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', opacity: 0.8, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Score</p>
            <div style={{ fontSize: '56px', fontWeight: 'bold', lineHeight: 1, marginBottom: '8px' }}>{totalCorrect} / 40</div>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 20px', fontSize: '16px', fontWeight: 'bold' }}>
              Estimated Band Score: {getEstimatedBand(totalCorrect)}
            </div>
          </div>

          {/* Section Breakdown */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' }}>📊 Section Breakdown</h2>
            {[1, 2, 3].map(p => (
              <div key={p} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 }}>Passage {p}: {passageTitleMap[p]}</p>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>{passageCorrectMap[p]} / {passageTotalMap[p]}</p>
                </div>
                <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '8px' }}>
                  <div style={{ background: '#d97706', height: '100%', borderRadius: '4px', width: `${(passageCorrectMap[p] / passageTotalMap[p]) * 100}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Band Conversion Reference */}
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

          {/* Question by Question Review */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' }}>📝 Question-by-Question Review</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>Click any question to see the AI explanation and where to find the answer in the passage.</p>

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
                          <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: correct ? '#16a34a' : '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>
                            {correct ? '✓' : '✗'}
                          </span>
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
          {hasAccess && (
            <div style={{ background: '#78350f', borderRadius: '16px', padding: '24px 28px', marginBottom: '20px', color: 'white' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>👨‍🏫 Teacher Mode — Overall Test Summary</h3>
              <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                <p style={{ margin: '0 0 6px' }}><strong>Suggested classroom use:</strong> Go through each incorrect question together. Ask students to locate the answer in the passage themselves before revealing the AI explanation — this builds scanning skills.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Common difficulty areas:</strong> Matching Headings (Q1-4) and Summary Completion (Q32-36) tend to be the most challenging — both require understanding of overall meaning rather than just locating keywords.</p>
                <p style={{ margin: '0 0 6px' }}><strong>Vocabulary follow-up:</strong> Choose 5-6 words from the recap list and set a homework task — students write original sentences using each word correctly.</p>
                <p style={{ margin: 0 }}><strong>Timing analysis:</strong> If timed, discuss whether students managed their 60 minutes well — did they spend too long on Passage 1 and rush Passage 3?</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
            <Link href="/ielts/reading" style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#1a1a2e', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>← All Reading Tests</Link>
            <Link href="/ielts" style={{ padding: '12px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #78350f, #d97706)', color: 'white', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none' }}>✅ Back to IELTS Hub</Link>
          </div>

        </div>
      </main>
    )
  }

  return null
}
