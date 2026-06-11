import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topic, mode, part, bullets } = await req.json()

    // Rewrite mode
    if (mode === 'rewrite') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are an IELTS speaking coach. Rewrite this student's spoken answer at a Band 7-8 level. Keep their original ideas and personal details but improve the vocabulary, grammar, and structure. Write it as natural spoken English. ${part === 2 ? 'This is a Part 2 long turn so the rewrite should be 5-7 sentences covering all the cue card points.' : 'Keep it to 3-5 sentences.'}

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
    const isPart2 = part === 2
    const bulletList = bullets ? bullets.map((b: string) => `- ${b}`).join('\n') : ''

    const prompt = isPart2
      ? `You are an experienced IELTS examiner. Assess this student's IELTS Speaking Part 2 long turn answer.

IMPORTANT: This was spoken aloud and converted to text via speech recognition. No punctuation or capitals are expected. Do NOT penalise for this. Assess: fluency and coherence, vocabulary range, grammatical range, and task completion (did they cover the cue card points?).

Topic: ${topic}
Cue card: "${question}"
Points to cover:
${bulletList}

Student's spoken answer: "${answer}"

Respond ONLY with this JSON, no other text:
{
  "bandScore": 6,
  "summary": "One sentence overall assessment focusing on fluency, development, and cue card coverage.",
  "whatWentWell": "2-3 sentences on strengths — fluency, coherence, vocabulary, or content.",
  "improvements": "2-3 sentences on specific improvements needed. Mention if any cue card points were missed.",
  "modelAnswerBand6": "A realistic Band 6 long turn in 4-5 sentences. Simple vocabulary, basic linking words, covers the points but limited development.",
  "modelAnswerBand7": "A natural Band 7-8 long turn in 5-7 sentences. Good vocabulary range, natural linking, well-developed with feelings and details, covers all points.",
  "vocabularyUpgrades": [
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" },
    { "original": "word or phrase from student answer", "upgrade": "better alternative", "example": "example sentence" }
  ],
  "roundingOffResponse": "A natural rounding-off question an examiner would ask after this talk, e.g. about the general topic.",
  "followUpQuestion": ""
}`
      : `You are an experienced IELTS examiner. Assess this student's IELTS Speaking Part 1 answer.

IMPORTANT: Spoken and converted to text via speech recognition. No punctuation expected. Do NOT penalise for this. Assess: vocabulary range, grammatical structures, coherence, and how well the question was answered.

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
  "roundingOffResponse": ""
}

Band score: 4–9. Be realistic and honest.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
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
