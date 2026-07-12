// Serverless subscribe endpoint for The Weekend Brief.
// Keeps the Beehiiv API key server-side; the public form never sees it.
//
// Requires two Vercel environment variables:
//   BEEHIIV_API_KEY   - your Beehiiv API key (secret)
//   BEEHIIV_PUB_ID    - pub_a39ab905-b77f-42d7-b91e-fa5f12ee9010
//
// Runs on Vercel's default Node serverless runtime.

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUB_ID;
  if (!apiKey || !pubId) {
    return res.status(500).json({ ok: false, error: 'Server not configured' });
  }

  // Parse body (Vercel usually parses JSON automatically; guard just in case)
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email = (body && body.email ? String(body.email) : '').trim();

  // Basic server-side validation
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }

  try {
    const resp = await fetch(
      'https://api.beehiiv.com/v2/publications/' + encodeURIComponent(pubId) + '/subscriptions',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'website',
          utm_medium: 'organic',
          referring_site: 'madetheweekend.com',
        }),
      }
    );

    if (resp.ok) {
      return res.status(200).json({ ok: true });
    }

    // Beehiiv returned an error; don't leak details to the client
    const detail = await resp.text().catch(() => '');
    console.error('Beehiiv subscribe failed', resp.status, detail);
    return res.status(502).json({ ok: false, error: 'Could not sign you up just now. Please try again.' });
  } catch (err) {
    console.error('Subscribe handler error', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
  }
}
