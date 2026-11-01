export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, phone, email, message, website } = req.body || {};

    // 1. Honeypot check for bots
    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ success: true, message: 'Inquiry received' });
    }

    // 2. Validation
    if (!name || !String(name).trim() || !message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: 'Name and message are required' });
    }

    const cleanName = String(name).trim();
    const cleanPhone = phone && String(phone).trim().length > 0 ? String(phone).trim() : 'Not provided';
    const cleanEmail = email && String(email).trim().length > 0 ? String(email).trim() : 'Not provided';
    const cleanMessage = String(message).trim();
    const recipientEmail = 'tmodh49449@gmail.com';

    // 3. Option A: Resend API if configured in environment
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Baldevji Jitmal <onboarding@resend.dev>',
            to: [recipientEmail],
            reply_to: cleanEmail !== 'Not provided' ? cleanEmail : undefined,
            subject: `New Customer Inquiry: ${cleanName} — Baldevji Jitmal`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #fcf9f2; color: #221d19;">
                <h2 style="color: #5a1f1c; margin-top: 0; border-bottom: 2px solid #dfb76c; padding-bottom: 8px;">New Website Inquiry — Baldevji Jitmal</h2>
                <p style="font-size: 14px; color: #5a1f1c;">A new inquiry has been submitted through <a href="https://www.baldevjijitmal.in" style="color: #7d5218; font-weight: bold;">baldevjijitmal.in</a>:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb;">
                  <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px; font-weight: bold; width: 120px; color: #5a1f1c; background: #faf5ec;">Name:</td><td style="padding: 12px; font-weight: 600;">${cleanName}</td></tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px; font-weight: bold; color: #5a1f1c; background: #faf5ec;">Phone:</td><td style="padding: 12px;"><a href="tel:${cleanPhone}" style="color: #17523f; font-weight: 600;">${cleanPhone}</a></td></tr>
                  <tr style="border-bottom: 1px solid #e5e7eb;"><td style="padding: 12px; font-weight: bold; color: #5a1f1c; background: #faf5ec;">Email:</td><td style="padding: 12px;"><a href="mailto:${cleanEmail}" style="color: #17523f;">${cleanEmail}</a></td></tr>
                  <tr><td style="padding: 12px; font-weight: bold; vertical-align: top; color: #5a1f1c; background: #faf5ec;">Message:</td><td style="padding: 12px; white-space: pre-wrap; line-height: 1.5;">${cleanMessage}</td></tr>
                </table>
                <p style="font-size: 12px; color: #6a6054; margin-top: 24px; border-top: 1px solid #dfb76c; padding-top: 12px; text-align: center;">
                  Baldevji Jitmal · 221, M.T. Cloth Market, Indore · Est. 1937
                </p>
              </div>
            `,
          }),
        });

        if (resendRes.ok) {
          const resendData = await resendRes.json();
          return res.status(200).json({ success: true, provider: 'resend', id: resendData.id });
        }
      } catch (err) {
        console.warn('Resend send failed, falling back to FormSubmit:', err);
      }
    }

    // 4. Default / Fallback: Forward via FormSubmit server-to-server
    const fsResponse = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://www.baldevjijitmal.in',
        Referer: 'https://www.baldevjijitmal.in/contact',
      },
      body: JSON.stringify({
        _subject: `New Customer Inquiry: ${cleanName} — Baldevji Jitmal`,
        Name: cleanName,
        Phone: cleanPhone,
        Email: cleanEmail,
        Message: cleanMessage,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const fsData = await fsResponse.json().catch(() => ({}));
    return res.status(200).json({ success: true, provider: 'formsubmit', data: fsData });
  } catch (error) {
    console.error('Inquiry API Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
