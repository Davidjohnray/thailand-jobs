import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { topic, level, question, answer } = await req.json()

    if (!answer || answer.trim().length < 2) {
      return NextResponse.json({ feedback: 'Please write a longer answer.', score: 0 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: `You are a friendly ESL grammar teacher giving feedback to a student at ${level?.toUpperCase() ?? 'B1'} level. 
The student is practising: "${topic}".
Be encouraging but honest. Point out errors clearly. Suggest the correct form.
Keep feedback to 2-3 sentences maximum.
End with a score out of 100 on a new line in this exact format: SCORE:75
Only give SCORE between 0 and 100.`,
        },
        {
          role: 'user',
          content: `Question: ${question}\n\nStudent's answer: ${answer}`,
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const scoreMatch = raw.match(/SCORE:(\d+)/)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 50
    const feedback = raw.replace(/SCORE:\d+/g, '').trim()

    return NextResponse.json({ feedback, score })
  } catch (err) {
    console.error('Grammar feedback error:', err)
    return NextResponse.json({ feedback: 'Could not get AI feedback right now. Please try again.', score: 0 }, { status: 500 })
  }
}
