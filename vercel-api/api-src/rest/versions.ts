import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, x-license-key, x-session-id, x-device-id, x-signature, x-nonce, x-timestamp');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const upstreamBase = process.env.UPSTREAM_API_BASE || 'https://lov.powerkits.net';
  const masterApiKey = process.env.POWERKITS_API_KEY || '';

  if (!masterApiKey) {
    return res.status(500).json({ success: false, error: 'POWERKITS_API_KEY environment variable is required.' });
  }

  const queryString = req.url?.split('?')[1] || '';
  const url = `${upstreamBase}/rest/v1/extension_versions${queryString ? '?' + queryString : ''}`;

  try {
    const upstreamResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': masterApiKey,
        'Authorization': `Bearer ${masterApiKey}`,
      },
    });

    const status = upstreamResponse.status;
    const text = await upstreamResponse.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    res.status(status).json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
