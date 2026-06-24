import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // Forward to support email via Resend (or any transactional email provider).
    // Set RESEND_API_KEY in .env.local to enable. Without it, messages are logged only.
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Modern Bond Contact <noreply@joinmodernbond.com>',
          to: ['support@joinmodernbond.com'],
          reply_to: email,
          subject: `[Contact] ${subject} — from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0c0612;color:#ffffff;padding:40px 32px;border-radius:4px;">
              <div style="margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(233,30,140,0.3);">
                <span style="font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#e91e8c;">Modern Bond — Contact Form</span>
              </div>
              <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
                <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.4);width:100px;">From</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;color:#ffffff;">${name}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.4);">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:14px;color:#e91e8c;"><a href="mailto:${email}" style="color:#e91e8c;">${email}</a></td></tr>
                <tr><td style="padding:10px 0;font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.4);">Subject</td><td style="padding:10px 0;font-size:14px;color:#ffffff;">${subject}</td></tr>
              </table>
              <div style="background:rgba(233,30,140,.07);border:1px solid rgba(233,30,140,.2);padding:24px;border-radius:2px;">
                <p style="font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.4);margin:0 0 12px;">Message</p>
                <p style="font-size:14px;line-height:1.8;color:rgba(255,255,255,.85);margin:0;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
              </div>
              <p style="margin-top:28px;font-size:12px;color:rgba(255,255,255,.3);">Reply directly to this email to respond to ${name}.</p>
            </div>
          `,
        }),
      });
    } else {
      console.log('[contact form]', { name, email, subject, message });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
