import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-passcode'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Quick status probe to check if GitHub auto-sync is configured
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      githubConfigured: Boolean(process.env.GITHUB_TOKEN),
      repo: process.env.GITHUB_REPO || 'TanishModh/BaldevjiJitmal2',
      branch: 'main',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { key = 'site', value } = req.body || {};

    if (!value || typeof value !== 'object') {
      return res.status(400).json({ success: false, message: 'Missing or invalid settings value' });
    }

    const cleanPayload = { ...value };
    delete cleanPayload.adminPasscode;
    cleanPayload.updatedAt = new Date().toISOString();

    // Strategy 1: If GITHUB_TOKEN is configured in Vercel, commit directly to GitHub repository!
    // This allows 100% database-free, permanently synchronized updates across all devices via Vercel CI/CD.
    if (process.env.GITHUB_TOKEN) {
      try {
        const repo = process.env.GITHUB_REPO || 'TanishModh/BaldevjiJitmal2';
        const filePath = 'src/data/defaultSettings.json';
        const branch = 'main';

        const rawToken = process.env.GITHUB_TOKEN.trim();
        const authHeader = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

        const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`, {
          headers: {
            Authorization: authHeader,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Baldevji-Admin',
          },
        });

        let sha = undefined;
        if (getRes.ok) {
          const getJson = await getRes.json();
          sha = getJson.sha;
        }

        const commitRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            Authorization: authHeader,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Baldevji-Admin',
          },
          body: JSON.stringify({
            message: `chore(settings): update from admin portal [${new Date().toISOString()}]`,
            content: Buffer.from(JSON.stringify(cleanPayload, null, 2), 'utf-8').toString('base64'),
            sha,
            branch,
          }),
        });

        if (commitRes.ok) {
          const commitData = await commitRes.json().catch(() => ({}));
          return res.status(200).json({
            success: true,
            method: 'github',
            commitSha: commitData?.commit?.sha,
            data: [{ key, value: cleanPayload }],
            message: 'Changes permanently saved to GitHub! Vercel is auto-deploying worldwide.',
          });
        } else {
          const errText = await commitRes.text();
          console.warn('GitHub commit failed with status:', commitRes.status, errText);
        }
      } catch (ghErr) {
        console.warn('GitHub commit route failed, trying Supabase fallback:', ghErr);
      }
    }

    // Strategy 2: Supabase with service role or anon key
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://brlkrualghugxskjzydi.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybGtydWFsZ2h1Z3hza2p6eWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODQ4NjksImV4cCI6MjA5NTM2MDg2OX0.QMpHa57RDFuS6VLiadoQDj0EqXbsu1BDUUL6pKrN6Lo';

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key,
          value: cleanPayload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select();

    if (error) {
      return res.status(500).json({ success: false, error: error.message, code: error.code });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Database returned 0 rows affected (Supabase Row-Level Security active)',
        code: '42501',
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
