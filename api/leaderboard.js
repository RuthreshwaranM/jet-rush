const { sb } = require('../lib/db');

module.exports = async (req, res) => {
  try {
    const rows = await sb('jet_scores?select=name,score&order=score.desc&limit=10');
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    res.status(200).json(rows);
  } catch (e) {
    console.error(e.message);
    res.status(500).json([]);
  }
};
