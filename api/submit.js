const { sb } = require('../lib/db');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { runId, name, score } = req.body || {};
  if (typeof runId !== 'string' || !UUID.test(runId) ||
      typeof name !== 'string' || name.trim().length < 1 || name.length > 40 ||
      !Number.isInteger(score) || score < 0) {
    return res.status(400).json({ error: 'bad request' });
  }
  try {
    await sb('rpc/submit_score', {
      method: 'POST',
      body: JSON.stringify({ p_run: runId, p_name: name, p_score: score })
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e.message);
    res.status(400).json({ error: 'rejected' });
  }
};
