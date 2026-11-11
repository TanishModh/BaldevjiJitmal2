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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { key = 'site', value } = req.body || {};

    if (!value || typeof value !== 'object') {
      return res.status(400).json({ success: false, message: 'Missing or invalid settings value' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://brlkrualghugxskjzydi.supabase.co';
    // Use SUPABASE_SERVICE_ROLE_KEY if configured in Vercel to bypass RLS completely; otherwise fallback to anon
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybGtydWFsZ2h1Z3hza2p6eWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODQ4NjksImV4cCI6MjA5NTM2MDg2OX0.QMpHa57RDFuS6VLiadoQDj0EqXbsu1BDUUL6pKrN6Lo';

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const cleanPayload = { ...value };
    delete cleanPayload.adminPasscode;

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
        error: 'Database returned 0 rows affected (Row-Level Security active)',
        code: '42501',
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
