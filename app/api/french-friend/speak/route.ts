// app/api/french-friend/speak/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const VOICE_MAP: Record<string, string> = {
  leo: 'echo',
  henri: 'onyx',
  camille: 'nova',
  odette: 'shimmer',
}

// Strips things that make text-to-speech stumble or garble: emoji, "haha"-style
// laughter, ellipses, stray symbols.
function cleanForSpeech(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\.{2,}|…/g, ' ')
    .replace(/[~*_#`"“”()\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function POST(request: Request) {
  try {
    const { text, characterSlug } = await request.json()
    const cleaned = cleanForSpeech(text || '')
    if (!cleaned) return NextResponse.json({ error: 'No text provided.' }, { status: 400 })

    const voice = VOICE_MAP[characterSlug] || 'alloy'

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: voice as any,
      input: cleaned,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    return new NextResponse(buffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length.toString() },
    })
  } catch (err) {
    console.error('TTS error:', err)
    return NextResponse.json({ error: 'Could not generate audio.' }, { status: 500 })
  }
}
