const { sign } = require('../lib/token');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  res.status(200).json({ runId: sign() });
};