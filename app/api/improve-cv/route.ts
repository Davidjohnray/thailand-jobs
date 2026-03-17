import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text, type } = await req.json()

  const prompts: Record<string, string> = {
    summary: `Rewrite this professional CV summary to sound more impressive and professional for a job application in Thailand. Keep it under 4 sentences. Original: "${text}"`,
    experience: `Rewrite this job description to sound more professional and achievement-focused for a CV. Use action verbs. Keep it concise. Original: "${text}"`,
    skills: `Rewrite and improve this skills list for a CV. Make it more professional and well organised. Original: "${text}"`,
    cover: `Rewrite this cover letter body to sound more professional and compelling. Original: "${text}"`,
  }

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
      messages: [{ role: 'user', content: prompts[type] || prompts.summary }],
    }),
  })

  const data = await response.json()
  const improved = data.content?.[0]?.text || text
  return NextResponse.json({ improved })
}