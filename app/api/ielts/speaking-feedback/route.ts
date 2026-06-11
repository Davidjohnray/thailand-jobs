import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topic, mode } = await req.json()

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
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `You are an IELTS speaking coach. A student gave this spoken answer to an IELTS Speaking Part 1 question. Rewrite their answer at a Band 7-8 level, keeping their original ideas and personal details but improving the vocabulary, grammar, and structure. Write it as natural spoken English — not overly formal. Keep it to 3-5 sentences.

Question: "${question}"
Student's answer: "${answer}"

Respond with ONLY the rewritten answer as plain text. No introduction, no explanation, no quotes around it.`
          }]
        })
      })
      const data = await response.json()
      const rewritten = data.content?.[0]?.text || ''
      return NextResponse.json({ rewritten })
    }

    // Main feedback mode
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
        messages: [{
          role: 'user',
          content: `You are an experienced IELTS examiner. Assess the following student answer to an IELTS Speaking Part 1 question.

IMPORTANT: This answer was spoken aloud and converted to text via speech recognition. There will be no punctuation, capital letters, or paragraph breaks — this is completely normal. Do NOT comment on or penalise the lack of punctuation. Assess only: vocabulary range, grammatical structures, coherence of ideas, and how well the question was answered.

IELTS Speaking Part 1 — Topic: ${topic}
Question: "${question}"
Student's spoken answer: "${answer}"

Respond ONLY with a JSON object in this exact format, no other text, no markdown:
{
  "bandScore": 6,
  "summary": "One sentence overall assessment of the spoken answer.",
  "whatWentWell": "2-3 sentences on strengths.",
  "improvements": "2-3 sentences on specific things to improve — vocabulary, grammar, development, coherence. Give concrete examples.",
  "modelAnswerBand6": "A realistic Band 6 spoken answer in 3 sentences. Use simple but correct vocabulary, basic linking words, limited range of grammar. Write as it would be spoken.",
  "modelAnswerBand7": "A natural Band 7-8 spoken answer in 3-4 sentences. Use a good range of vocabulary, natural linking, varied grammar structures. Write as it would be spoken.",
  "vocabularyUpgrades": [
    { "original": "a word or phrase the student used", "upgrade": "a better alternative", "example": "short example sentence using the upgrade" },
    { "original": "another word or phrase they used", "upgrade": "a better alternative", "example": "short example sentence using the upgrade" },
    { "original": "another word or phrase they used", "upgrade": "a better alternative", "example": "short example sentence using the upgrade" }
  ],
  "followUpQuestion": "A natural follow-up question the examiner might ask next, relevant to what the student said."
}

For modelAnswerBand6: this should feel noticeably simpler than Band 7 — limited vocabulary range, repetitive grammar, basic ideas but correct. Students should be able to clearly see the difference between the two levels.
For vocabularyUpgrades: pick 3 actual words or phrases from the student's answer and suggest stronger IELTS-appropriate alternatives. Always include a short example sentence.
Band score: number between 4 and 9. Be realistic and honest.`
        }]
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
