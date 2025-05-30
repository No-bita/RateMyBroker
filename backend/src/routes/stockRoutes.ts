import express from 'express';
import yahooFinance from 'yahoo-finance2';
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    // Add more stocks as needed
  ]);
});

router.get('/search', async (req, res) => {
  const q = req.query.q as string;
  if (!q) return res.json([]);
  try {
    const results = await yahooFinance.search(q);
    const stocks = (results.quotes || []).map(item => ({
      symbol: item.symbol,
      name: item.shortname || item.longname || item.symbol,
    }));
    res.json(stocks);
  } catch (e) {
    res.status(500).json([]);
  }
});

router.get('/price/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const quote = await yahooFinance.quote(symbol);
    res.json({ price: quote.regularMarketPrice });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

export default router; 