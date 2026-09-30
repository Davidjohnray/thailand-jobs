// app/api/french-friend/transcribe/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const languageHint = formData.get('language') as string | null // 'fr', 'en', or null for auto

    if (!audioFile) return NextResponse.json({ error: 'No audio provided.' }, { status: 400 })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      ...(languageHint
        ? { language: languageHint }
        : { prompt: 'Bonjour, je m\'entraîne à parler français. Hello, I am practicing speaking French.' }),
    })

    return NextResponse.json({ text: transcription.text })
  } catch (err) {
    console.error('Transcription error:', err)
    return NextResponse.json({ error: 'Could not transcribe audio. Please try again.' }, { status: 500 })
  }
}
