const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 4000;

// Allow any origin (development proxy) so the browser won't block responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/convert', async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing required query parameters: from, to, amount' });
  }

  const url = `https://api.exchangerate.host/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`;
  try {
    const proxied = await fetch(url);
    const json = await proxied.json();
    return res.json(json);
  } catch (err) {
    console.error('Proxy fetch error', err);
    return res.status(502).json({ error: 'Proxy fetch failed', details: String(err) });
  }
});

// DEV ONLY: Google-based conversion endpoint
// Note: scraping Google search results may violate Google's terms of service and is brittle.
// Use this endpoint only for local development and debugging. Prefer official APIs for production.
app.get('/api/convert-google', async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing required query parameters: from, to, amount' });
  }

  // Build a Google search URL like: https://www.google.com/search?q=4+EUR+to+NGN
  const q = `${encodeURIComponent(amount)}+${encodeURIComponent(from)}+to+${encodeURIComponent(to)}`;
  const url = `https://www.google.com/search?q=${q}`;
  try {
    const resp = await fetch(url, {
      headers: {
        // Emulate a real browser UA; Google may return different HTML for bots
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const text = await resp.text();

    // Attempt to parse the commonly observed span that contains the conversion value.
    // Google frequently uses a span with class containing 'DFlfde' for the numeric result.
    const re = /<span[^>]*class="[^"]*DFlfde[^"]*"[^>]*>([0-9.,]+)<\/span>/i;
    const m = text.match(re);
    if (m && m[1]) {
      const numeric = parseFloat(m[1].replace(/,/g, ''));
      if (!Number.isNaN(numeric)) {
        return res.json({ result: numeric, source: 'google' });
      }
    }

    // If parsing failed, return a 502 with a snippet to help debugging
    console.warn('Google parse failed; returning snippet for debugging');
    const snippet = text.slice(0, 6000); // return a slice to help debugging
    return res.status(502).json({ error: 'Google parse failed', snippet });
  } catch (err) {
    console.error('Google proxy fetch error', err);
    return res.status(502).json({ error: 'Google proxy fetch failed', details: String(err) });
  }
});

// RapidAPI: currency-converter-by-api-ninjas
// Requires RAPIDAPI_KEY environment variable. Do NOT commit your key into source control.
app.get('/api/convert-rapidapi', async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing required query parameters: from, to, amount' });
  }

  const key = process.env.RAPIDAPI_KEY;
  if (!key) {
    return res.status(500).json({ error: 'RAPIDAPI_KEY not set in environment. Set RAPIDAPI_KEY before starting server.' });
  }

  const url = `https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency?have=${encodeURIComponent(from)}&want=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`;
  try {
    const resp = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'currency-converter-by-api-ninjas.p.rapidapi.com',
        'x-rapidapi-key': key
      }
    });
    const json = await resp.json();

    // Try to find a numeric conversion in common fields and normalize to { result }
    let result = null;
    if (json) {
      if (typeof json.new_amount === 'number') result = json.new_amount;
      else if (typeof json.newAmount === 'number') result = json.newAmount;
      else if (typeof json.result === 'number') result = json.result;
      else if (typeof json.conversion === 'number') result = json.conversion;
      else if (typeof json.total === 'number') result = json.total;
    }

    if (result !== null) {
      return res.json({ result, source: 'rapidapi' });
    }

    // Return the raw JSON for debugging if shape unexpected
    return res.status(502).json({ error: 'RapidAPI returned unexpected shape', data: json });
  } catch (err) {
    console.error('RapidAPI proxy fetch error', err);
    return res.status(502).json({ error: 'RapidAPI proxy fetch failed', details: String(err) });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Currency proxy listening on http://localhost:${PORT}`);
});
