// app/api/thai-friend/transcribe/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio provided.' }, { status: 400 })
    }

    // Whisper handles Thai and English (and mixed) well without needing a language hint,
    // which matters here since the student may switch languages mid-sentence.
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    })

    return NextResponse.json({ text: transcription.text })
  } catch (err) {
    console.error('Transcription error:', err)
    return NextResponse.json({ error: 'Could not transcribe audio. Please try again.' }, { status: 500 })
  }
}
