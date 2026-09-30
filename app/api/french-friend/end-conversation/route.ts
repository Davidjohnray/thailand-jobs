// app/api/french-friend/end-conversation/route.ts
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

    const { data: relationship } = await supabase.from('french_friend_relationships').select('*').eq('id', relationshipId).single()
    if (!relationship) return NextResponse.json({ error: 'Relationship not found.' }, { status: 404 })

    const { error: saveError } = await supabase.from('french_friend_conversations').insert({
      relationship_id: relationshipId,
      transcript,
      ended_at: new Date().toISOString(),
    })
    if (saveError) console.error('Could not save conversation:', saveError.message)

    const conversationText = transcript.map((t: any) => `${t.speaker === 'student' ? 'Student' : 'Friend'}: ${t.english_text || t.french_text}`).join('\n')
    const existingFacts: string[] = relationship.known_facts || []
    const existingMistakes: string[] = relationship.common_mistakes || []
    const currentLevel = relationship.proficiency_level || 'A1'
    const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

    const extractionPrompt = `Read this conversation between a French person and a foreign friend learning French.

${conversationText}

Facts already known: ${existingFacts.length > 0 ? existingFacts.join('; ') : 'none yet'}
Current estimated level: ${currentLevel} (CEFR: A1-C2, beginner to fluent)

Extract:
1. Any NEW personal facts the student shared (food, hometown, job, hobbies, family, plans, feelings). Don't repeat facts already known.
2. Any recurring language mistake patterns in the student's French (if any French was used).
3. Based on the actual French the student produced — vocabulary, sentence complexity, grammar, fluency, reliance on English — should their level move up or down one step? Be conservative: only if there's clear, consistent evidence. If they mostly spoke English, keep the level the same.

Respond ONLY with valid JSON, no markdown:
{"newFacts": [], "newMistakes": [], "levelAssessment": "same" | "up" | "down", "levelReasoning": "one short sentence"}`

    const response = await anthropic.messages.create({ model: 'claude-sonnet-5', max_tokens: 500, messages: [{ role: 'user', content: extractionPrompt }] })
    const textBlock = response.content.find((b: any) => b.type === 'text')
    let newFacts: string[] = [], newMistakes: string[] = [], levelAssessment: 'same' | 'up' | 'down' = 'same'

    if (textBlock) {
      try {
        const cleaned = (textBlock as any).text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        newFacts = parsed.newFacts || []
        newMistakes = parsed.newMistakes || []
        levelAssessment = parsed.levelAssessment || 'same'
      } catch {}
    }

    const updatedFacts = [...existingFacts, ...newFacts]
    const updatedMistakes = [...existingMistakes, ...newMistakes]
    let newLevel = currentLevel
    const idx = CEFR_ORDER.indexOf(currentLevel)
    if (levelAssessment === 'up' && idx < CEFR_ORDER.length - 1) newLevel = CEFR_ORDER[idx + 1]
    else if (levelAssessment === 'down' && idx > 0) newLevel = CEFR_ORDER[idx - 1]

    await supabase.from('french_friend_relationships').update({
      known_facts: updatedFacts,
      common_mistakes: updatedMistakes,
      proficiency_level: newLevel,
      total_conversations: (relationship.total_conversations || 0) + 1,
      last_talked_at: new Date().toISOString(),
    }).eq('id', relationshipId)

    return NextResponse.json({ ok: true, saved: !saveError, saveError: saveError?.message || null, newFacts, newMistakes, levelChanged: newLevel !== currentLevel, newLevel })
  } catch (err) {
    console.error('End conversation error:', err)
    return NextResponse.json({ error: 'Something went wrong saving the conversation.' }, { status: 500 })
  }
}
