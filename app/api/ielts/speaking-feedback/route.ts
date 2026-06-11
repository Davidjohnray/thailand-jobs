import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { question, answer, topic } = await req.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are an experienced IELTS examiner. Assess the following student answer to an IELTS Speaking Part 1 question.

IELTS Speaking Part 1 — Topic: ${topic}
Question: "${question}"
Student's answer: "${answer}"

Respond ONLY with a JSON object in this exact format, no other text, no markdown:
{
  "bandScore": 6,
  "summary": "One sentence overall assessment.",
  "whatWentWell": "2-3 sentences on strengths.",
  "improvements": "2-3 sentences on specific things to improve with examples.",
  "modelAnswer": "A natural Band 7-8 answer to this question in 3-4 sentences."
}

Band score should be a number between 4 and 9. Be realistic and honest. Consider fluency, vocabulary, grammar, and how well the question was answered.`
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
