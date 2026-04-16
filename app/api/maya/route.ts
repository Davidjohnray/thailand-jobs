import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const SYSTEM = `You are Maya, a warm and helpful AI assistant for jobsinthailand.net — a website for ESL teachers and job seekers in Thailand.

You can help with:
- Finding teaching and other jobs listed on the site (live data will be provided to you when relevant)
- Free ESL games (90+ games organised by age group: Under 5s, Ages 5-6, Ages 7-10)
- Premium lesson plans at 10 baht each in the ESL Resources marketplace
- Teacher profile listings (200 THB to be listed in the directory)
- General advice about teaching in Thailand — visas, salaries, school types, cities
- How to post a job as an employer
- How to register or contact the website

If someone asks about jobs, job data from the database will be included below your instructions — use it to give accurate, specific answers with school names, locations, salaries and links where available.

If you genuinely do not know the answer to something, say so honestly and suggest the person either:
1. Registers on the site at jobsinthailand.net
2. Contacts the site directly through the contact page

Keep answers warm, concise and helpful. Use bullet points for lists of jobs. Always include the link jobsinthailand.net when directing someone to the site.`

function isJobQuery(message: string): boolean {
  const keywords = [
    'job', 'jobs', 'vacancy', 'vacancies', 'position', 'hiring', 'work',
    'teach', 'teacher', 'teaching', 'school', 'salary', 'baht', 'bangkok',
    'chiang mai', 'phuket', 'pattaya', 'hua hin', 'available', 'opening',
    'esl', 'english', 'recruit', 'apply', 'application', 'international'
  ]
  const lower = message.toLowerCase()
  return keywords.some(k => lower.includes(k))
}

async function fetchRelevantJobs(message: string): Promise<string> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    const lower = message.toLowerCase()

    let query = supabase
      .from('jobs')
      .select('id, title, company, location, salary, job_type, teaching_level, visa_sponsor')
      .eq('status', 'live')
      .order('created_at', { ascending: false })
      .limit(8)

    const locations = ['bangkok', 'chiang mai', 'phuket', 'pattaya', 'hua hin', 'rayong', 'korat', 'udon', 'khon kaen', 'samui']
    const mentionedLocation = locations.find(l => lower.includes(l))
    if (mentionedLocation) {
      query = query.ilike('location', `%${mentionedLocation}%`)
    }

    if (lower.includes('kindergarten')) {
      query = query.ilike('teaching_level', '%kindergarten%')
    } else if (lower.includes('primary') || lower.includes('elementary')) {
      query = query.ilike('teaching_level', '%primary%')
    } else if (lower.includes('secondary') || lower.includes('high school')) {
      query = query.ilike('teaching_level', '%secondary%')
    } else if (lower.includes('university') || lower.includes('college')) {
      query = query.ilike('teaching_level', '%university%')
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error.message)
      return 'Job search unavailable right now.'
    }

    if (!data || data.length === 0) {
      return 'No active job listings found matching that search at this time.'
    }

    const jobList = data.map(job =>
      `- ${job.title} at ${job.company || 'School'} | Location: ${job.location || 'Thailand'} | Salary: ${job.salary || 'Not specified'} | Visa: ${job.visa_sponsor ? 'Sponsored' : 'Not specified'} | View: jobsinthailand.net/jobs/${job.id}`
    ).join('\n')

    return `Current active job listings:\n${jobList}`
  } catch (err: any) {
    console.error('fetchRelevantJobs error:', err.message)
    return 'Job search unavailable right now.'
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const latestMessage = messages[messages.length - 1]?.content || ''

    let jobContext = ''
    if (isJobQuery(latestMessage)) {
      jobContext = await fetchRelevantJobs(latestMessage)
    }

    const systemWithJobs = jobContext
      ? `${SYSTEM}\n\n--- LIVE JOB DATA ---\n${jobContext}\n--- END JOB DATA ---`
      : SYSTEM

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemWithJobs,
        messages,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Anthropic API error:', res.status, errText)
      return NextResponse.json(
        { reply: `API error ${res.status} — please check your ANTHROPIC_API_KEY in Vercel environment variables.` },
        { status: 500 }
      )
    }

    const data = await res.json()
    const reply = data.content?.[0]?.text || 'Sorry, I could not get a response. Please try again.'
    return NextResponse.json({ reply })

  } catch (err: any) {
    console.error('Maya API error:', err?.message || err)
    return NextResponse.json(
      { reply: `Error: ${err?.message || 'unknown error'}` },
      { status: 500 }
    )
  }
}