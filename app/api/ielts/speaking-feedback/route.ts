import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topic, mode, part, bullets } = await req.json()

    // Rewrite mode
    if (mode === 'rewrite') {
      const rewriteInstructions = part === 2
        ? 'This is a Part 2 long turn so write 5-7 sentences covering the key points naturally.'
        : part === 3
        ? 'This is a Part 3 discussion so write 4-6 sentences with a clear opinion, reasons, and consideration of other views. Use academic discussion language.'
        : 'Keep it to 3-5 sentences.'

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are an IELTS speaking coach. Rewrite this student's spoken answer at a Band 7-8 level. Keep their original ideas and personal details but improve vocabulary, grammar, and structure. Write as natural spoken English. ${rewriteInstructions}

Question: "${question}"
Student's answer: "${answer}"

Respond with ONLY the rewritten answer as plain text. No introduction, no explanation.`
          }]
        })
      })
      const data = await response.json()
      return NextResponse.json({ rewritten: data.content?.[0]?.text || '' })
    }

    // Build prompt based on part
    const bulletList = bullets ? bullets.map((b: string) => `- ${b}`).join('\n') : ''

    let prompt = ''

    if (part === 2) {
      prompt = `You are an experienced IELTS examiner. Assess this student's IELTS Speaking Part 2 long turn answer.

IMPORTANT: Spoken and converted to text via speech recognition. No punctuation or capitals expected. Do NOT penalise for this. Assess: fluency and coherence, vocabulary range, grammatical range, and whether they covered the cue card bullet points.

Topic: ${topic}
Cue card: "${question}"
Points to cover:
${bulletList}
Student's spoken answer: "${answer}"

Respond ONLY with this JSON, no other text:
{
  "bandScore": 6,
  "summary": "One sentence overall assessment focusing on fluency, development, and cue card coverage.",
  "whatWentWell": "2-3 sentences on strengths.",
  "improvements": "2-3 sentences on improvements needed. Mention any cue card points missed.",
  "modelAnswerBand6": "A realistic Band 6 long turn in 4-5 sentences. Simple vocabulary, basic linking, covers points but limited development.",
  "modelAnswerBand7": "A natural Band 7-8 long turn in 5-7 sentences. Good vocabulary, natural linking, well-developed with feelings and details.",
  "vocabularyUpgrades": [
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" }
  ],
  "roundingOffResponse": "A natural rounding-off question the examiner would ask after this talk.",
  "followUpQuestion": "",
  "discussionPhrase": ""
}`
    } else if (part === 3) {
      prompt = `You are an experienced IELTS examiner. Assess this student's IELTS Speaking Part 3 discussion answer.

IMPORTANT: Spoken and converted to text via speech recognition. No punctuation or capitals expected. Do NOT penalise for this. Assess: ability to discuss and speculate, vocabulary range, grammatical range, coherence, and depth of opinion.

Topic: ${topic}
Question: "${question}"
Student's spoken answer: "${answer}"

Respond ONLY with this JSON, no other text:
{
  "bandScore": 6,
  "summary": "One sentence overall assessment of the discussion quality.",
  "whatWentWell": "2-3 sentences on strengths — opinion clarity, vocabulary, grammar, or discussion development.",
  "improvements": "2-3 sentences on specific improvements. Does the answer go deep enough? Are both sides considered? Is the opinion well supported?",
  "modelAnswerBand6": "A realistic Band 6 discussion answer in 3-4 sentences. Basic opinion, simple vocabulary, limited development, minimal consideration of other views.",
  "modelAnswerBand7": "A natural Band 7-8 discussion answer in 4-6 sentences. Clear opinion, well-developed reasoning, considers other perspectives, uses academic vocabulary naturally.",
  "vocabularyUpgrades": [
    { "original": "word or phrase from student answer", "upgrade": "better academic alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better academic alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better academic alternative", "example": "example sentence" }
  ],
  "followUpQuestion": "A natural follow-up discussion question the examiner might ask to push the student further.",
  "discussionPhrase": "One useful academic discussion phrase the student could have used in their answer, e.g. 'It could be argued that...' or 'This can largely be attributed to...'",
  "roundingOffResponse": ""
}`
    } else {
      // Part 1
      prompt = `You are an experienced IELTS examiner. Assess this student's IELTS Speaking Part 1 answer.

IMPORTANT: Spoken and converted to text via speech recognition. No punctuation or capitals expected. Do NOT penalise for this. Assess: vocabulary range, grammatical structures, coherence, and how well the question was answered.

Topic: ${topic}
Question: "${question}"
Student's spoken answer: "${answer}"

Respond ONLY with this JSON, no other text:
{
  "bandScore": 6,
  "summary": "One sentence overall assessment.",
  "whatWentWell": "2-3 sentences on strengths.",
  "improvements": "2-3 sentences on specific improvements with examples.",
  "modelAnswerBand6": "A realistic Band 6 spoken answer in 3 sentences. Simple but correct vocabulary, basic grammar, limited range.",
  "modelAnswerBand7": "A natural Band 7-8 spoken answer in 3-4 sentences. Good vocabulary, varied grammar, well-developed.",
  "vocabularyUpgrades": [
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" }
  ],
  "followUpQuestion": "A natural follow-up question the examiner might ask, relevant to what the student said.",
  "roundingOffResponse": "",
  "discussionPhrase": ""
}`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1400,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('IELTS feedback error:', err)
    return NextResponse.json({ error: 'Failed to get feedback' }, { status: 500 })
  }
}
