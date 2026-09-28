// app/api/thai-friend/end-conversation/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { relationshipId, transcript } = await request.json()

    if (!relationshipId || !transcript || transcript.length === 0) {
      return NextResponse.json({ error: 'Missing relationshipId or transcript.' }, { status: 400 })
    }

    const { data: relationship } = await supabase
      .from('thai_friend_relationships')
      .select('*')
      .eq('id', relationshipId)
      .single()

    if (!relationship) {
      return NextResponse.json({ error: 'Relationship not found.' }, { status: 404 })
    }

    // Save the full conversation transcript
    const { error: saveError } = await supabase.from('thai_friend_conversations').insert({
      relationship_id: relationshipId,
      transcript,
      ended_at: new Date().toISOString(),
    })
    if (saveError) console.error('Could not save conversation:', saveError.message)

    // Ask Claude to extract new personal facts and notable mistakes from this conversation
    const conversationText = transcript
      .map((t: any) => `${t.speaker === 'student' ? 'Student' : 'Friend'}: ${t.english_text || t.thai_text}`)
      .join('\n')

    const existingFacts: string[] = relationship.known_facts || []
    const existingMistakes: string[] = relationship.common_mistakes || []

    const currentLevel = relationship.proficiency_level || 'A1'
    const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

    const extractionPrompt = `Read this conversation between a Thai person and a foreign friend learning Thai.

${conversationText}

Facts already known about the student: ${existingFacts.length > 0 ? existingFacts.join('; ') : 'none yet'}

The student's current estimated Thai level is ${currentLevel} (CEFR scale: A1, A2, B1, B2, C1, C2, from beginner to fluent).

Extract:
1. Any NEW personal facts the student shared about themselves (things like food preferences, hometown, job, hobbies, family, plans, feelings — anything a real friend would remember). Do not repeat facts already known above.
2. Any recurring language mistake patterns visible in the student's Thai (if any Thai was used).
3. Based on the actual Thai the student produced in this conversation (vocabulary range, sentence complexity, grammatical accuracy, fluency, ability to handle the scenario without falling back to English) — does their level in THIS relationship seem accurately rated, or should it move up or down one step? Be conservative: only suggest a change if there's clear, consistent evidence across the conversation, not from a single good or bad sentence. If the student mostly spoke English rather than Thai, there usually isn't enough evidence to change the level — keep it the same.

Respond ONLY with valid JSON, no markdown:
{"newFacts": ["short fact 1", "short fact 2"], "newMistakes": ["mistake pattern 1"], "levelAssessment": "same" | "up" | "down", "levelReasoning": "one short sentence explaining why"}

If there is nothing new to add for facts or mistakes, return an empty array for that field.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 400,
      messages: [{ role: 'user', content: extractionPrompt }],
    })

    const textBlock = response.content.find((b: any) => b.type === 'text')
    let newFacts: string[] = []
    let newMistakes: string[] = []
    let levelAssessment: 'same' | 'up' | 'down' = 'same'
    let levelReasoning = ''

    if (textBlock) {
      try {
        const cleaned = (textBlock as any).text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        newFacts = parsed.newFacts || []
        newMistakes = parsed.newMistakes || []
        levelAssessment = parsed.levelAssessment || 'same'
        levelReasoning = parsed.levelReasoning || ''
      } catch {
        // If extraction parsing fails, just skip it rather than failing the whole request —
        // the conversation is already saved, which matters more than the fact extraction.
      }
    }

    const updatedFacts = [...existingFacts, ...newFacts]
    const updatedMistakes = [...existingMistakes, ...newMistakes]

    // Only ever move one CEFR step per conversation, and never past the ends of the scale —
    // keeps level changes gradual and hard to game from a single unusually good/bad exchange.
    let newLevel = currentLevel
    const currentIndex = CEFR_ORDER.indexOf(currentLevel)
    if (levelAssessment === 'up' && currentIndex < CEFR_ORDER.length - 1) {
      newLevel = CEFR_ORDER[currentIndex + 1]
    } else if (levelAssessment === 'down' && currentIndex > 0) {
      newLevel = CEFR_ORDER[currentIndex - 1]
    }

    await supabase
      .from('thai_friend_relationships')
      .update({
        known_facts: updatedFacts,
        common_mistakes: updatedMistakes,
        proficiency_level: newLevel,
        total_conversations: (relationship.total_conversations || 0) + 1,
        last_talked_at: new Date().toISOString(),
      })
      .eq('id', relationshipId)

    return NextResponse.json({ ok: true, saved: !saveError, saveError: saveError?.message || null, newFacts, newMistakes, levelChanged: newLevel !== currentLevel, newLevel, levelReasoning })
  } catch (err) {
    console.error('End conversation error:', err)
    return NextResponse.json({ error: 'Something went wrong saving the conversation.' }, { status: 500 })
  }
}
