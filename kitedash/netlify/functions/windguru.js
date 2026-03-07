// netlify/functions/windguru.js
// Server-side proxy — fetches Windguru forecast data and returns it to the browser.
// Windguru blocks browser requests (CORS) but allows server-to-server requests.

exports.handler = async function(event) {
  const SPOT_ID = '88345'; // Perú Beach
  const MODEL   = '0';     // WG Model Mix (weighted average of all models)

  // Windguru's internal data endpoint (same one their website uses)
  const url = `https://www.windguru.cz/int/iapi.php?q=forecast&id_spot=${SPOT_ID}&id_model=${MODEL}&rundef=undefined&initstr=undefined&lang=en&utc_diff=undefined&show_negsgn=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KiteDash/1.0)',
        'Referer':    'https://www.windguru.cz/',
        'Accept':     'application/json, text/javascript, */*',
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Windguru returned ${response.status}` })
      };
    }

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control':               'public, max-age=600', // cache 10 min
      },
      body: text,
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
