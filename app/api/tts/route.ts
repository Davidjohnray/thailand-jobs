import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
      response_format: 'mp3',
    })
    const arrayBuffer = await mp3.arrayBuffer()
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err: any) {
    console.error('TTS error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}