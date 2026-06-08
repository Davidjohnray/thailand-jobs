import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { text } = await req.json()
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'nova',
    input: text,
  })
  const buffer = Buffer.from(await mp3.arrayBuffer())
  return new NextResponse(buffer, {
    headers: { 'Content-Type': 'audio/mpeg' },
  })
}