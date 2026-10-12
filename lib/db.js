const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;

async function sb(path, options = {}) {
  const r = await fetch(`${BASE}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: KEY, 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!r.ok) throw new Error(typeof data === 'string' ? data : (data.message || JSON.stringify(data)));
  return data;
}
module.exports = { sb };
