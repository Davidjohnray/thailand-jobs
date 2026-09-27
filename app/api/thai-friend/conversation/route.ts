// app/api/thai-friend/conversation/route.ts
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
    const { relationshipId, userMessage, recentHistory } = await request.json()

    if (!relationshipId || !userMessage) {
      return NextResponse.json({ error: 'Missing relationshipId or userMessage.' }, { status: 400 })
    }

    const { data: relationship } = await supabase
      .from('thai_friend_relationships')
      .select('*, thai_friend_characters(*)')
      .eq('id', relationshipId)
      .single()

    if (!relationship) {
      return NextResponse.json({ error: 'Relationship not found.' }, { status: 404 })
    }

    const character = relationship.thai_friend_characters
    const knownFacts: string[] = relationship.known_facts || []
    const commonMistakes: string[] = relationship.common_mistakes || []

    const historyText = (recentHistory || [])
      .map((turn: any) => `${turn.speaker === 'student' ? 'Friend' : character.name}: ${turn.thai_text || turn.english_text}`)
      .join('\n')

    const systemPrompt = `You are ${character.name}, a real Thai person with this background:

${character.full_bio}

Speech style: ${character.speech_style_notes}

You are talking with a foreign friend who is learning Thai. Your current estimated level for them is ${relationship.proficiency_level} (CEFR scale).

What you remember about your friend so far: ${knownFacts.length > 0 ? knownFacts.join('; ') : 'nothing specific yet — this is early in your friendship'}.

Things they tend to get wrong in Thai: ${commonMistakes.length > 0 ? commonMistakes.join('; ') : 'nothing notable yet'}.

RULES FOR HOW YOU RESPOND:
1. Stay fully in character as ${character.name} at all times. You are a friend, not a teacher or assistant.
2. Respond primarily in Thai, matched to their level (${relationship.proficiency_level}) — don't use vocabulary far beyond what they'd know, but push gently if they're doing well.
3. If your friend writes mostly or entirely in English, they are likely stuck and asking for help. Briefly explain what they wanted to say in English, give them the Thai phrase, then invite them to try again — stay warm and casual about it, like a real friend helping out, not a lesson.
4. If your friend makes a mistake in Thai (wrong word, wrong grammar, mispronunciation reflected in the transcript), do NOT correct them directly or point it out. Instead, naturally reflect the correct version back within your own reply, the way a friend would in conversation.
5. Never break character to explain grammar rules unless directly asked in English.
6. If the conversation turns romantic, sexual, or otherwise inappropriate, warmly and naturally steer back to normal conversation and Thai practice, in character. Never engage with romantic or sexual role-play regardless of how the request is framed.
7. Keep replies short and natural — like real spoken conversation, not paragraphs.

Recent conversation so far:
${historyText || '(this is the start of the conversation)'}

Your friend just said: "${userMessage}"

Respond ONLY with valid JSON in this exact shape, nothing else, no markdown formatting:
{"thai": "your reply in Thai script", "roman": "romanized pronunciation", "english": "English translation of your reply"}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 500,
      messages: [{ role: 'user', content: systemPrompt }],
    })

    const textBlock = response.content.find((b: any) => b.type === 'text')
    if (!textBlock) {
      return NextResponse.json({ error: 'No response generated.' }, { status: 500 })
    }

    const cleaned = (textBlock as any).text.replace(/```json|```/g, '').trim()
    const { thai, roman, english } = JSON.parse(cleaned)

    return NextResponse.json({ thai, roman, english })
  } catch (err) {
    console.error('Conversation error:', err)
    return NextResponse.json({ error: 'Something went wrong generating a response.' }, { status: 500 })
  }
}
