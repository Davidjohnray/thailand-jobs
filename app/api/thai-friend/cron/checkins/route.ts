// app/api/thai-friend/cron/checkins/route.ts
// Runs once a day via Vercel Cron. Finds friendships that have gone quiet
// and has each character reach out with a personal, in-character message.

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)

const INACTIVITY_THRESHOLD_HOURS = 48

export async function GET(request: Request) {
  // Vercel Cron sends a secret in the Authorization header — check it matches
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - INACTIVITY_THRESHOLD_HOURS * 60 * 60 * 1000).toISOString()

  // Find friendships that have gone quiet, have talked at least once before,
  // and haven't already had a check-in generated since they went quiet.
  const { data: relationships } = await supabase
    .from('thai_friend_relationships')
    .select('*, thai_friend_characters(*), thai_friend_users(*)')
    .lt('last_talked_at', cutoff)
    .gt('total_conversations', 0)

  if (!relationships || relationships.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  let processed = 0

  for (const rel of relationships) {
    // Skip if a check-in was already sent since the last conversation
    const { data: existingCheckin } = await supabase
      .from('thai_friend_checkins')
      .select('id')
      .eq('relationship_id', rel.id)
      .gt('created_at', rel.last_talked_at)
      .limit(1)
      .maybeSingle()

    if (existingCheckin) continue

    const character = rel.thai_friend_characters
    const user = rel.thai_friend_users
    const knownFacts: string[] = rel.known_facts || []

    const prompt = `You are ${character.name}, a Thai person with this background: ${character.full_bio}

Speech style: ${character.speech_style_notes}

You haven't heard from your friend (a foreigner learning Thai) in a couple of days. Here is what you remember about them: ${knownFacts.length > 0 ? knownFacts.join('; ') : 'nothing specific yet — you have only chatted a little so far'}.

Write a short, warm, in-character message checking in on them, the way a real friend would text after a few days of silence. If you know a specific detail about them, reference it naturally. Keep it to 1-2 short sentences in Thai.

Respond ONLY with valid JSON in this exact shape, nothing else:
{"thai": "...", "roman": "...", "english": "..."}`

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-5',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      })

      const textBlock = response.content.find((b: any) => b.type === 'text')
      if (!textBlock) continue

      const cleaned = (textBlock as any).text.replace(/```json|```/g, '').trim()
      const { thai, roman, english } = JSON.parse(cleaned)

      const { data: checkin } = await supabase
        .from('thai_friend_checkins')
        .insert({
          relationship_id: rel.id,
          message_thai: thai,
          message_roman: roman,
          message_english: english,
        })
        .select()
        .single()

      // Email the student so they actually notice, not just an in-app badge
      if (checkin && user?.email) {
        await resend.emails.send({
          from: 'Thai Friend <noreply@jobsinthailand.net>', // adjust to your verified sending domain
          to: user.email,
          subject: `${character.name} sent you a message 💬`,
          html: `
            <p><strong>${character.name}:</strong> ${thai}</p>
            <p style="color:#888;font-style:italic;">${roman}</p>
            <p style="color:#888;">${english}</p>
            <p><a href="https://www.jobsinthailand.net/thai-friend/chat/${character.slug}">Reply to ${character.name} →</a></p>
          `,
        })
        await supabase.from('thai_friend_checkins').update({ emailed: true }).eq('id', checkin.id)
      }

      processed++
    } catch (err) {
      console.error(`Failed to generate check-in for relationship ${rel.id}:`, err)
      continue
    }
  }

  return NextResponse.json({ processed })
}
