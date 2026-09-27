// app/api/thai-friend/speak/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Maps each character to a distinct OpenAI TTS voice.
// Adjust these to whichever voices you found work best for Thai in your existing course.
const VOICE_MAP: Record<string, string> = {
  bank: 'echo',      // younger male
  somchai: 'onyx',   // older, deeper male
  nueng: 'nova',     // warm female
  tong: 'shimmer',   // more energetic female
}

export async function POST(request: Request) {
  try {
    const { text, characterSlug } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 })
    }

    const voice = VOICE_MAP[characterSlug] || 'alloy'

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: voice as any,
      input: text,
      speed: 0.85, // noticeably more relaxed pace, for everyone
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (err) {
    console.error('TTS error:', err)
    return NextResponse.json({ error: 'Could not generate audio.' }, { status: 500 })
  }
}
