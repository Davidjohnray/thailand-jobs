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
    const { relationshipId, userMessage, recentHistory, topic, showChoices } = await request.json()

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

    // Server-side access check — without this the paywall would only be cosmetic,
    // since anyone could skip the page redirect and call this route directly.
    const { data: accessUser } = await supabase
      .from('thai_friend_users')
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

    const character = relationship.thai_friend_characters

    // Model answers are only for beginners (A1/A2), and only when the learner has them switched on.
    const offerChoices = !!showChoices && ['A1', 'A2'].includes(relationship.proficiency_level || 'A1')
    const knownFacts: string[] = relationship.known_facts || []
    const commonMistakes: string[] = relationship.common_mistakes || []

    // Work out what time it actually is in Thailand right now, and how long it's
    // been since this specific friendship last talked — lets the character greet
    // naturally (time-of-day appropriate, or "long time no see!") like a real friend.
    const now = new Date()
    const thaiTimeString = now.toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    let gapDescription = 'This is your very first conversation together.'
    if (relationship.last_talked_at) {
      const hoursSince = (now.getTime() - new Date(relationship.last_talked_at).getTime()) / (1000 * 60 * 60)
      if (hoursSince < 2) {
        gapDescription = 'You were just talking a little while ago — this is a continuation of the same conversation, no need to re-greet.'
      } else if (hoursSince < 20) {
        gapDescription = `You last talked earlier today, about ${Math.round(hoursSince)} hour(s) ago.`
      } else if (hoursSince < 48) {
        gapDescription = 'You last talked yesterday.'
      } else {
        const daysSince = Math.round(hoursSince / 24)
        gapDescription = `You haven't talked in about ${daysSince} days — a real friend would naturally notice this gap.`
      }
    }

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
2. Respond primarily in Thai, strictly matched to their level (${relationship.proficiency_level}). Follow these concrete guardrails, not just a general impression of difficulty:
   - A1: ONE short, simple sentence only, maximum about 6-8 Thai words. Only the most common everyday vocabulary. Simple present-tense statements and questions. No complex clauses, no idioms.
   - A2: One or two short sentences. Slightly wider vocabulary. Simple past/future is okay. Still avoid compound or multi-clause sentences.
   - B1: Two sentences is fine. More natural vocabulary and everyday idioms okay. Can include one simple connecting clause (e.g. "because", "but").
   - B2: Natural conversational length, similar to how you'd actually speak to a Thai friend, with common idioms and more complex sentence structure.
   - C1-C2: Fully natural, unrestricted — speak exactly as you would to a fluent Thai friend.
   Never combine multiple long clauses or ask more than one meaningful question in a single reply if the level is A1 or A2 — a beginner needs room to process and respond before being given more.
3. If your friend writes mostly or entirely in English, they are likely stuck and asking for help. Briefly explain what they wanted to say in English, give them the Thai phrase, then invite them to try again — stay warm and casual about it, like a real friend helping out, not a lesson.
4. If your friend makes a mistake in Thai (wrong word, wrong grammar, mispronunciation reflected in the transcript), do NOT correct them directly or point it out. Instead, naturally reflect the correct version back within your own reply, the way a friend would in conversation.
5. Never break character to explain grammar rules unless directly asked in English.
6. If the conversation turns romantic, sexual, or otherwise inappropriate, warmly and naturally steer back to normal conversation and Thai practice, in character. Never engage with romantic or sexual role-play regardless of how the request is framed.
7. Keep replies short and natural — like real spoken conversation, not paragraphs.
8. If your friend asks to practice a specific situation (e.g. "can we practice at a supermarket", "let's do a restaurant conversation", "I want to practice a job interview"), enthusiastically agree in character and shift the conversation into that scenario. Briefly set the scene in one short line (e.g. "okay! imagine I'm the cashier..."), then actually play that role within the scenario while still being yourself — your personality doesn't disappear, you're just now having that kind of conversation together. Keep it going naturally rather than a rigid script.
9. If your friend seems stuck repeating or pronouncing the same phrase and it hasn't gone well after about 3 attempts, don't keep asking them to try again. Instead, warmly move on — something like "no worries, keep practicing that one when you can!" — and shift to a new question or direction rather than dwelling on it.
10. Keep the conversation actively moving. If a topic or scenario naturally winds down or reaches a natural conclusion, don't let the conversation stall or go quiet — proactively bring up a new related question or gently shift to a fresh angle, the way a real friend keeps a conversation flowing rather than running out of things to say.
11. If your friend asks you to repeat or say something again (in English or Thai — for example "can you say that again", "please repeat", "I didn't catch that"), simply say your last message again, in the same words or slightly simpler. Do not move on to a new topic or ask a new question until they have had the chance to hear it clearly.${offerChoices ? `
12. ANSWER CHOICES ARE SWITCHED ON for this learner, who is a beginner. After your reply, give 3 short, natural things your friend could say next, in "suggestedReplies". Each one must be a real answer to the question you just asked (or, if you did not ask a question, a natural thing to say back — like thanking you or asking you something). Vary the key detail so there is a genuine choice: for example, if you ask where they come from, offer three different countries. Keep every option at their level — for A1, only 3 to 7 Thai words and only very common vocabulary. Give each option its Thai script, its romanization (in the same style as your own reply) and its English meaning.` : ''}

${topic ? `Your friend wants to practice this specific situation today: "${topic}". If this is the start of the conversation, warmly set up that scenario in character right away rather than waiting to be asked.` : ''}

Current time in Thailand: ${thaiTimeString}. ${gapDescription}

If this is the very start of the conversation (no recent history below), let the time of day and the gap since you last talked naturally shape how you open — e.g. a time-appropriate greeting, or warmly noting it's been a while if it has. Don't force this if you're mid-conversation already.

Recent conversation so far:
${historyText || '(this is the start of the conversation)'}

Your friend just said: "${userMessage}"

Respond ONLY with valid JSON in this exact shape, nothing else, no markdown formatting:
{"thai": "your reply in Thai script", "roman": "romanized pronunciation", "english": "English translation of your reply", "studentMessageRoman": "romanization of what your friend just said, ONLY if their message was in Thai script — otherwise just repeat their message as-is"${offerChoices ? ', "suggestedReplies": [{"thai": "Thai script", "roman": "romanization", "english": "English meaning"}, {"thai": "...", "roman": "...", "english": "..."}, {"thai": "...", "roman": "...", "english": "..."}]' : ''}}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: systemPrompt }],
    })

    const textBlock = response.content.find((b: any) => b.type === 'text')
    if (!textBlock) {
      return NextResponse.json({ error: 'No response generated.' }, { status: 500 })
    }

    const cleaned = (textBlock as any).text.replace(/```json|```/g, '').trim()

    let thai, roman, english, studentMessageRoman, suggestedReplies
    try {
      ;({ thai, roman, english, studentMessageRoman, suggestedReplies } = JSON.parse(cleaned))
    } catch (parseErr) {
      console.error('JSON parse failed. Raw Claude output was:', cleaned)
      return NextResponse.json({ error: `Could not parse response. Raw output: ${cleaned.slice(0, 400)}` }, { status: 500 })
    }

    return NextResponse.json({
      thai,
      roman,
      english,
      studentMessageRoman,
      suggestedReplies: offerChoices && Array.isArray(suggestedReplies) ? suggestedReplies.slice(0, 4) : [],
    })
  } catch (err: any) {
    console.error('Conversation error:', err)
    return NextResponse.json({ error: `Generation error: ${err?.message || 'unknown'}` }, { status: 500 })
  }
}
