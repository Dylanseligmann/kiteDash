// netlify/functions/tides.js
// Proxies Windguru tide predictions for Perú Beach (spot 88345)

exports.handler = async function(event) {
  const SPOT_ID = '88345';

  const url = `https://www.windguru.cz/int/iapi.php?q=tides&id_spot=${SPOT_ID}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer':    'https://www.windguru.cz/',
        'Accept':     'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });

    const text = await response.text();
    console.log('Tides response status:', response.status, 'length:', text.length, 'preview:', text.slice(0, 200));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // tides change slowly, cache 1hr
      },
      body: text,
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
