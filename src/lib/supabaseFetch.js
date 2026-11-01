/**
 * Ultra-Lightweight Zero-Dependency Supabase REST Client
 * 
 * Replaces the heavy @supabase/supabase-js client on public pages,
 * saving ~58 KB gzipped / 227 KB uncompressed JS from the initial critical bundle.
 * Executes purely via native browser fetch().
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://brlkrualghugxskjzydi.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJybGtydWFsZ2h1Z3hza2p6eWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3ODQ4NjksImV4cCI6MjA5NTM2MDg2OX0.QMpHa57RDFuS6VLiadoQDj0EqXbsu1BDUUL6pKrN6Lo';

/**
 * Fetch rows from Supabase PostgREST API with native fetch.
 * 
 * @param {string} table - Table name (e.g. 'site_settings', 'categories', 'gallery_items')
 * @param {object} [params] - Query parameters (select, order, key, limit, etc.)
 * @returns {Promise<any[]>}
 */
export async function fetchFromSupabase(table, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Supabase query failed [${res.status}]: ${errorText}`);
  }

  return res.json();
}

/**
 * Insert a row into a Supabase table with native fetch.
 * 
 * @param {string} table - Table name
 * @param {object} payload - Record payload
 * @returns {Promise<boolean>}
 */
export async function insertToSupabase(table, payload) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Supabase insert failed [${res.status}]: ${errorText}`);
  }

  return true;
}
