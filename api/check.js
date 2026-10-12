// TEMPORARY test page: open /api/check in the browser, then DELETE this file.
const { sb } = require('../lib/db');

module.exports = async (req, res) => {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SECRET_KEY || '';
  const out = {
    hasUrl: !!url,
    urlLooksRight: /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url),
    hasKey: !!key,
    keyStartsWith: key.slice(0, 10),
    keyLength: key.length
  };
  try {
    const rows = await sb('jet_scores?select=name&limit=1');
    out.db = 'OK';
    out.rowsFound = rows.length;
  } catch (e) {
    out.db = 'FAILED';
    out.message = String(e.message).slice(0, 300);
  }
  res.status(200).json(out);
};