// app/api/thai-friend/transcribe/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const languageHint = formData.get('language') as string | null // 'th', 'en', or null for auto

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio provided.' }, { status: 400 })
    }

    // If the student has explicitly told us which language they're about to speak,
    // pass it straight to Whisper — this sidesteps auto-detection guesswork entirely
    // and is far more reliable than the prompt-bias trick for short/accented clips.
    // If no hint is given, fall back to auto-detect with a bilingual bias prompt so
    // mixed Thai/English conversation still works without the student picking every time.
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      ...(languageHint
        ? { language: languageHint }
        : { prompt: 'สวัสดีครับ ผมกำลังฝึกพูดภาษาไทย Hello, I am practicing speaking Thai.' }),
    })

    return NextResponse.json({ text: transcription.text })
  } catch (err) {
    console.error('Transcription error:', err)
    return NextResponse.json({ error: 'Could not transcribe audio. Please try again.' }, { status: 500 })
  }
}
