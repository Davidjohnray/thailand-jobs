import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name, planTitle, token } = await req.json()

    const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/esl-resources/download/${token}`

    const { error } = await resend.emails.send({
      from: 'Thailand Jobs <noreply@jobsinthailand.net>',
      to: email,
      subject: `Your download is ready — ${planTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px;">
          <div style="background: linear-gradient(135deg, #7C3AED, #E85D26); padding: 32px; border-radius: 12px; text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 8px;">📖</div>
            <h1 style="color: white; font-size: 24px; margin: 0;">Your ESL Resource is Ready!</h1>
          </div>
          <p style="font-size: 16px; color: #444;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 15px; color: #444; line-height: 1.6;">Your payment has been verified and your lesson plan is ready to download:</p>
          <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin: 24px 0; border-left: 4px solid #7C3AED;">
            <div style="font-weight: bold; color: #7C3AED; font-size: 16px;">📚 ${planTitle}</div>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${downloadUrl}" style="background: #7C3AED; color: white; padding: 16px 40px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
              ⬇️ Download Your Lesson Plan
            </a>
          </div>
          <p style="font-size: 13px; color: #888; text-align: center;">This download link is unique to your order. Please do not share it.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 13px; color: #aaa; text-align: center;">
            Thank you for your purchase — <a href="https://www.jobsinthailand.net/esl-resources" style="color: #7C3AED;">Browse more ESL resources</a>
          </p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}