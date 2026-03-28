import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 60

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(req: Request) {
  try {
    // Verify cron secret so only Vercel can trigger this
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get jobs posted in the last 24 hours
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)

    const { data: newJobs } = await adminSupabase
      .from('jobs')
      .select('*')
      .gt('created_at', yesterday.toISOString())
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!newJobs || newJobs.length === 0) {
      console.log('No new jobs in last 24 hours — skipping digest')
      return NextResponse.json({ message: 'No new jobs today', sent: 0 })
    }

    console.log(`Found ${newJobs.length} new jobs — sending digests`)

    // Get all members with their preferences
    const { data: allUsers } = await adminSupabase.auth.admin.listUsers()
    if (!allUsers?.users) return NextResponse.json({ error: 'No users found' }, { status: 500 })

    // Get all profiles with preferences
    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, preferred_location, preferred_category')

    const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || [])

    let sent = 0

    for (const user of allUsers.users) {
      if (!user.email) continue

      const profile = profileMap.get(user.id) as any
      const prefLocation = profile?.preferred_location || 'All Thailand'
      const prefCategory = profile?.preferred_category || 'All'

      // Filter jobs for this member
      let matchingJobs = [...newJobs]

      if (prefLocation !== 'All Thailand') {
        matchingJobs = matchingJobs.filter(j =>
          j.location?.toLowerCase() === prefLocation.toLowerCase()
        )
      }

      if (prefCategory !== 'All') {
        matchingJobs = matchingJobs.filter(j => {
          if (prefCategory === 'Teaching / ESL') {
            const teachingCategories = [
              'Nursery / Pre-Kindergarten', 'Kindergarten (Anuban)',
              'Primary / Prathom (Grades 1–6)', 'Secondary / Matthayom (Grades 7–9)',
              'High School / Matthayom (Grades 10–12)', 'International School (All Levels)',
              'University / Higher Education', 'Adult Classes', 'Business English',
              'IELTS / TOEIC / Exam Prep', 'Online Teaching', 'Private Tutoring',
              'Language School / ESL Centre', 'Special Needs Education', 'Other'
            ]
            return teachingCategories.includes(j.category)
          }
          return j.category?.toLowerCase().includes(prefCategory.toLowerCase())
        })
      }

      if (matchingJobs.length === 0) continue

      // Build email HTML
      const jobCards = matchingJobs.map(job => `
        <div style="background: white; border: 1px solid #eee; border-radius: 10px; padding: 20px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <h3 style="margin: 0 0 4px; color: #1a1a2e; font-size: 17px;">${job.title}</h3>
              <p style="margin: 0; color: #666; font-size: 14px;">${job.company} • ${job.location}</p>
            </div>
            ${job.featured ? '<span style="background: #E85D26; color: white; font-size: 11px; padding: 3px 8px; border-radius: 20px; font-weight: bold;">⭐ Featured</span>' : ''}
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
            <span style="background: #f0f0f0; color: #555; font-size: 12px; padding: 3px 10px; border-radius: 20px;">${job.job_type}</span>
            <span style="background: #f0f0f0; color: #555; font-size: 12px; padding: 3px 10px; border-radius: 20px;">${job.category}</span>
            ${job.salary ? `<span style="background: #fff3ed; color: #E85D26; font-size: 12px; padding: 3px 10px; border-radius: 20px; font-weight: bold;">${job.salary}</span>` : ''}
            ${job.visa_sponsor ? '<span style="background: #e8f5e9; color: #2e7d32; font-size: 12px; padding: 3px 10px; border-radius: 20px; font-weight: bold;">✓ Visa Sponsor</span>' : ''}
          </div>
          <a href="https://www.jobsinthailand.net/jobs/${job.id}"
            style="display: inline-block; background: #E85D26; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
            View Job →
          </a>
        </div>
      `).join('')

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px;">

          <div style="background: #E85D26; padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🇹🇭 Jobs in Thailand</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Your Daily Job Digest</p>
          </div>

          <div style="background: white; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
            <p style="color: #444; font-size: 15px; margin: 0 0 8px;">
              Good morning! Here are <strong>${matchingJobs.length} new job${matchingJobs.length === 1 ? '' : 's'}</strong> posted in the last 24 hours
              ${prefLocation !== 'All Thailand' ? ` in <strong>${prefLocation}</strong>` : ' across Thailand'}
              ${prefCategory !== 'All' ? ` in <strong>${prefCategory}</strong>` : ''}.
            </p>
            <p style="color: #999; font-size: 13px; margin: 0 0 24px;">
              ⭐ As a member you saw these jobs 1 hour before the public!
            </p>

            ${jobCards}

            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.jobsinthailand.net/jobs"
                style="display: inline-block; background: #1a1a2e; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                View All Jobs →
              </a>
            </div>
          </div>

          <div style="text-align: center; padding: 16px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              You're receiving this because you're a member of Jobs in Thailand.<br/>
              <a href="https://www.jobsinthailand.net/account/dashboard" style="color: #E85D26;">Update your preferences</a>
            </p>
          </div>

        </div>
      `

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Jobs in Thailand <hello@jobsinthailand.net>',
          to: user.email,
          subject: `🇹🇭 ${matchingJobs.length} New Job${matchingJobs.length === 1 ? '' : 's'} Today${prefLocation !== 'All Thailand' ? ` in ${prefLocation}` : ' in Thailand'}`,
          html,
        }),
      })

      if (res.ok) sent++
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    return NextResponse.json({
      success: true,
      newJobs: newJobs.length,
      sent,
      total: allUsers.users.length
    })

  } catch (err: any) {
    console.error('Digest error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}