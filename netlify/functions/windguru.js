// netlify/functions/windguru.js
// Server-side proxy — fetches Windguru forecast data and returns it to the browser.

exports.handler = async function(event) {
  const SPOT_ID = '88345'; // Perú Beach

  // Try the wgfcast endpoint first (this is what the Windguru website uses for the WG model mix table)
  const urls = [
    `https://www.windguru.cz/int/iapi.php?q=forecast&id_spot=${SPOT_ID}&id_model=3&rundef=undefined&initstr=undefined&lang=en&utc_diff=-3&show_negsgn=1`,
    `https://www.windguru.cz/int/iapi.php?q=forecast&id_spot=${SPOT_ID}&id_model=100&lang=en&utc_diff=-3`,
  ];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Referer':    'https://www.windguru.cz/',
    'Accept':     'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.9',
    'X-Requested-With': 'XMLHttpRequest',
  };

  for (const url of urls) {
    try {
      const response = await fetch(url, { headers });
      const text = await response.text();

      // Check if we got meaningful data (not an error page)
      if (response.ok && text.length > 100 && (text.includes('wspd') || text.includes('hours') || text.includes('fcst'))) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=600',
          },
          body: text,
        };
      }

      // Log what we got for debugging
      console.log(`URL ${url} returned status ${response.status}, length ${text.length}, preview: ${text.slice(0, 200)}`);

    } catch(err) {
      console.error('Fetch error for', url, err.message);
    }
  }

  // If both fail, return debug info
  return {
    statusCode: 502,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Could not fetch Windguru data. The API may require authentication or have changed.' }),
  };
};
