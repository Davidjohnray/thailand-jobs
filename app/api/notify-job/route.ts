import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { title, location } = await req.json()
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: '4cb638c8-5ea4-46ca-9235-a10ffc51428e',
      included_segments: ['All'],
      headings: { en: '🆕 New Job Posted in Thailand!' },
      contents: { en: `${title} in ${location} — Apply now on Jobs in Thailand!` },
      url: 'https://www.jobsinthailand.net/jobs',
    }),
  })
  return NextResponse.json({ ok: true })
}