const { sb } = require('../lib/db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const runId = await sb('rpc/start_run', { method: 'POST', body: '{}' });
    res.status(200).json({ runId });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: 'start failed' });
  }
};
