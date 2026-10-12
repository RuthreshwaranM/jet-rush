const { sb } = require('../lib/db');
const { verify } = require('../lib/token');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { runId, name, score } = req.body || {};
  const startedAt = verify(runId);
  if (!startedAt || typeof name !== 'string' || !Number.isInteger(score) || score < 0) {
    return res.status(400).json({ error: 'bad request' });
  }
  const clean = name.replace(/[\u0000-\u001f]/g, '').trim().slice(0, 16);
  const secs = (Date.now() - startedAt) / 1000;
  // score can't be higher than the time played allows (tune the 1000 if needed)
  if (!clean || secs < 1 || secs > 7200 || score > 500000 || score > secs * 1000) {
    return res.status(400).json({ error: 'rejected' });
  }
  try {
    await sb('jet_scores?on_conflict=name', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ name: clean, score })
    });
    await sb('jet_scores?name=eq.' + encodeURIComponent(clean) + '&score=lt.' + score, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ score, updated_at: new Date().toISOString() })
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'save failed' });
  }
};