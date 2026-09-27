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
    await supabase.from('thai_friend_conversations').insert({
      relationship_id: relationshipId,
      transcript,
      ended_at: new Date().toISOString(),
    })

    // Ask Claude to extract new personal facts and notable mistakes from this conversation
    const conversationText = transcript
      .map((t: any) => `${t.speaker === 'student' ? 'Student' : 'Friend'}: ${t.english_text || t.thai_text}`)
      .join('\n')

    const existingFacts: string[] = relationship.known_facts || []
    const existingMistakes: string[] = relationship.common_mistakes || []

    const extractionPrompt = `Read this conversation between a Thai person and a foreign friend learning Thai.

${conversationText}

Facts already known about the student: ${existingFacts.length > 0 ? existingFacts.join('; ') : 'none yet'}

Extract:
1. Any NEW personal facts the student shared about themselves (things like food preferences, hometown, job, hobbies, family, plans, feelings — anything a real friend would remember). Do not repeat facts already known above.
2. Any recurring language mistake patterns visible in the student's Thai (if any Thai was used).

Respond ONLY with valid JSON, no markdown:
{"newFacts": ["short fact 1", "short fact 2"], "newMistakes": ["mistake pattern 1"]}

If there is nothing new to add for either, return an empty array for that field.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 400,
      messages: [{ role: 'user', content: extractionPrompt }],
    })

    const textBlock = response.content.find((b: any) => b.type === 'text')
    let newFacts: string[] = []
    let newMistakes: string[] = []

    if (textBlock) {
      try {
        const cleaned = (textBlock as any).text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        newFacts = parsed.newFacts || []
        newMistakes = parsed.newMistakes || []
      } catch {
        // If extraction parsing fails, just skip it rather than failing the whole request —
        // the conversation is already saved, which matters more than the fact extraction.
      }
    }

    const updatedFacts = [...existingFacts, ...newFacts]
    const updatedMistakes = [...existingMistakes, ...newMistakes]

    await supabase
      .from('thai_friend_relationships')
      .update({
        known_facts: updatedFacts,
        common_mistakes: updatedMistakes,
        total_conversations: (relationship.total_conversations || 0) + 1,
        last_talked_at: new Date().toISOString(),
      })
      .eq('id', relationshipId)

    return NextResponse.json({ ok: true, newFacts, newMistakes })
  } catch (err) {
    console.error('End conversation error:', err)
    return NextResponse.json({ error: 'Something went wrong saving the conversation.' }, { status: 500 })
  }
}
