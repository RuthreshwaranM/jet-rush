const crypto = require('crypto');
const KEY = process.env.SUPABASE_SECRET_KEY || '';
const mac = t => crypto.createHmac('sha256', KEY).update(String(t)).digest('hex');

// a signed "run ticket" = start time + signature (no database needed)
exports.sign = () => { const t = Date.now(); return t + '.' + mac(t); };

exports.verify = tok => {
  if (typeof tok !== 'string') return null;
  const [t, s] = tok.split('.');
  if (!/^\d{10,15}$/.test(t || '') || !s) return null;
  const a = Buffer.from(mac(t)), b = Buffer.from(s);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return +t;
};