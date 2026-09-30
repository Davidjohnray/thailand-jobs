// app/api/french-friend/conversation/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Reads Claude's reply as JSON, tolerating code fences or stray text around it.
function readJson(text: string): any {
  const cleaned = text.replace(/```json|```/g, '').trim()
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  const candidate = first >= 0 && last > first ? cleaned.slice(first, last + 1) : cleaned
  return JSON.parse(candidate)
}

// Last resort if the full JSON is broken — recover the main reply so the learner
// isn't left with a bare error.
function salvageMainReply(text: string) {
  const grab = (key: string): string | null => {
    const m = text.match(new RegExp('"' + key + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"'))
    return m ? m[1] : null
  }
  const french = grab('french')
  const english = grab('english')
  if (french && english) return { french, english, suggestedReplies: [] }
  return null
}

export async function POST(request: Request) {
  try {
    const { relationshipId, userMessage, recentHistory, topic, showChoices, opening } = await request.json()

    if (!relationshipId || (!userMessage && !opening)) {
      return NextResponse.json({ error: 'Missing relationshipId or userMessage.' }, { status: 400 })
    }

    const { data: relationship } = await supabase
      .from('french_friend_relationships')
      .select('*, french_friend_characters(*)')
      .eq('id', relationshipId)
      .single()

    if (!relationship) return NextResponse.json({ error: 'Relationship not found.' }, { status: 404 })

    // Server-side access check — without this the paywall would only be cosmetic.
    const { data: accessUser } = await supabase
      .from('french_friend_users')
      .select('trial_ends_at, subscription_expires_at')
      .eq('id', relationship.user_id)
      .maybeSingle()
    const expiry = Math.max(
      accessUser?.trial_ends_at ? new Date(accessUser.trial_ends_at).getTime() : 0,
      accessUser?.subscription_expires_at ? new Date(accessUser.subscription_expires_at).getTime() : 0
    )
    if (!accessUser || expiry <= Date.now()) {
      return NextResponse.json({ error: 'Your access has ended. Please add a new access code to keep talking.' }, { status: 403 })
    }

    const character = relationship.french_friend_characters
    const knownFacts: string[] = relationship.known_facts || []
    const commonMistakes: string[] = relationship.common_mistakes || []
    const offerChoices = !!showChoices && ['A1', 'A2'].includes(relationship.proficiency_level || 'A1')

    const nowDate = new Date()
    const parisTimeString = nowDate.toLocaleString('en-US', { timeZone: 'Europe/Paris', weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true })
    let gapDescription = 'This is your very first conversation together.'
    if (relationship.last_talked_at) {
      const hoursSince = (nowDate.getTime() - new Date(relationship.last_talked_at).getTime()) / (1000 * 60 * 60)
      if (hoursSince < 2) gapDescription = 'You were just talking a little while ago — this is a continuation, no need to re-greet.'
      else if (hoursSince < 20) gapDescription = `You last talked earlier today, about ${Math.round(hoursSince)} hour(s) ago.`
      else if (hoursSince < 48) gapDescription = 'You last talked yesterday.'
      else gapDescription = `You haven't talked in about ${Math.round(hoursSince / 24)} days — a real friend would naturally notice this gap.`
    }

    const historyText = (recentHistory || [])
      .map((turn: any) => `${turn.speaker === 'student' ? 'Friend' : character.name}: ${turn.french_text || turn.english_text}`)
      .join('\n')

    const systemPrompt = `You are ${character.name}, a real French person with this background:

${character.full_bio}

Speech style: ${character.speech_style_notes}

You are talking with a foreign friend who is learning French. Their current estimated level is ${relationship.proficiency_level} (CEFR scale).

What you remember about your friend so far: ${knownFacts.length > 0 ? knownFacts.join('; ') : 'nothing specific yet — this is early in your friendship'}.

Things they tend to get wrong in French: ${commonMistakes.length > 0 ? commonMistakes.join('; ') : 'nothing notable yet'}.

RULES FOR HOW YOU RESPOND:
1. Stay fully in character as ${character.name} at all times. You are a friend, not a teacher or assistant.
2. Respond primarily in French, strictly matched to their level. Follow these concrete guardrails:
   - A1: ONE short, simple sentence only, maximum about 6-8 words. Only the most common everyday vocabulary. Simple present-tense statements and questions. No complex clauses, no idioms.
   - A2: One or two short sentences. Slightly wider vocabulary. Simple past/future okay. Avoid multi-clause sentences.
   - B1: Two sentences fine. More natural vocabulary and everyday idioms okay. One simple connecting clause (e.g. "parce que", "mais") is fine.
   - B2: Natural conversational length, common idioms, more complex sentence structure.
   - C1-C2: Fully natural, unrestricted — speak exactly as you would to a fluent French friend.
   Never ask more than one meaningful question per reply at A1 or A2 — a beginner needs room to process before being given more.
3. If your friend writes mostly or entirely in English, they are likely stuck. Briefly explain what they wanted to say in English, give them the French phrase, then invite them to try again — warm and casual, like a friend helping out, not a lesson.
4. If your friend makes a mistake in French, do NOT correct them directly. Instead, naturally reflect the correct version back within your own reply.
5. Never break character to explain grammar rules unless directly asked in English.
6. If the conversation turns romantic, sexual, or otherwise inappropriate, warmly and naturally steer back to normal conversation. Never engage with romantic or sexual role-play regardless of how the request is framed.
7. Keep replies short and natural — like real spoken conversation, not paragraphs.
8. If your friend asks to practice a specific situation (e.g. "at a bakery", "ordering food", "a job interview"), enthusiastically agree in character and shift into that scenario, briefly setting the scene in one line, while staying yourself throughout.
9. If your friend seems stuck on the same phrase after about 3 attempts, don't keep asking them to try again — warmly move on to something new instead.
10. Keep the conversation actively moving — if a topic winds down, bring up something new rather than letting it stall.
11. If your friend asks you to repeat or say something again (in English or French), simply say your last message again, in the same words or slightly simpler. Do not move to a new topic until they've had the chance to hear it clearly.
${offerChoices ? `
12. ANSWER CHOICES ARE ON for this beginner. After your reply, give 3 short, natural things your friend could say next, in "suggestedReplies" — real answers to your question (or a natural thing to say if you didn't ask one), each varying the key detail for genuine choice. Keep every option at their level. Give each option's French text and its English meaning.` : ''}

${topic ? `Your friend wants to practice this specific situation today: "${topic}". If this is the start of the conversation, warmly set up that scenario in character right away.` : ''}

Current time in Paris: ${parisTimeString}. ${gapDescription}

${opening
  ? 'Your friend has just opened the chat and has not said anything yet. YOU speak first: greet them warmly in a way that fits the time of day and the gap since you last talked, then ask ONE simple, easy question to get things going. Keep it at their level.'
  : `Your friend just said: "${userMessage}"`}

Recent conversation so far:
${historyText || '(this is the start of the conversation)'}

Respond ONLY with valid JSON, nothing else, no markdown formatting:
{"french": "your reply in French", "english": "English translation of your reply"${offerChoices ? ', "suggestedReplies": [{"french": "...", "english": "..."}, {"french": "...", "english": "..."}, {"french": "...", "english": "..."}]' : ''}}`

    let parsed: any = null
    let lastText = ''
    for (let attempt = 1; attempt <= 2 && !parsed; attempt++) {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: systemPrompt }],
      })
      const textBlock = response.content.find((b: any) => b.type === 'text')
      if (!textBlock) continue
      lastText = (textBlock as any).text
      try { parsed = readJson(lastText) } catch { console.error(`JSON parse failed (attempt ${attempt}):`, lastText) }
    }

    if (!parsed) parsed = salvageMainReply(lastText)
    if (!parsed) {
      return NextResponse.json({ error: 'Sorry, that reply did not come through properly. Please tap the mic and try again.' }, { status: 500 })
    }

    const { french, english, suggestedReplies } = parsed
    return NextResponse.json({ french, english, suggestedReplies: offerChoices && Array.isArray(suggestedReplies) ? suggestedReplies.slice(0, 4) : [] })
  } catch (err: any) {
    console.error('Conversation error:', err)
    return NextResponse.json({ error: `Generation error: ${err?.message || 'unknown'}` }, { status: 500 })
  }
}
