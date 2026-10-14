// Contact form endpoint for Vercel (a serverless function at /api/contact).
// It emails the message through Resend (https://resend.com). Set these in the project's environment:
//   RESEND_API_KEY   your Resend API key
//   CONTACT_TO       where messages are delivered (e.g. ndmprao2001@gmail.com)
//   CONTACT_FROM     a sender address on a domain verified in Resend (e.g. "Portfolio <hello@yourdomain.com>")
// Without those variables it answers 500 and the site falls back to the visitor's email app.

const MAX = { name: 120, email: 200, message: 4000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'POST only' })
  }

  const { name = '', email = '', message = '', company = '' } = req.body || {}
  if (company) return res.status(200).json({ ok: true }) // spam trap filled in: pretend it worked
  if (!name.trim() || !EMAIL.test(email) || !message.trim()) return res.status(400).json({ ok: false, error: 'Invalid input' })
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) return res.status(413).json({ ok: false, error: 'Too long' })

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return res.status(500).json({ ok: false, error: 'Not configured' })

  const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `${message}\n\n— ${name} <${email}>`,
        html: `<p>${escape(message).replace(/\n/g, '<br>')}</p><p>— ${escape(name)} &lt;${escape(email)}&gt;</p>`,
      }),
    })
    if (!r.ok) return res.status(502).json({ ok: false, error: 'Mail provider error' })
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ ok: false, error: 'Mail provider unreachable' })
  }
}
