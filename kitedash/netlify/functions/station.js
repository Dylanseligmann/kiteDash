// netlify/functions/station.js
// Proxies live wind data from CNSI station (ID 2042) on Windguru

exports.handler = async function(event) {
  const STATION_ID = '2042'; // Club Náutico San Isidro

  const url = `https://www.windguru.cz/int/iapi.php?q=station_data_recent&id_station=${STATION_ID}&limit=30`;

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
        body: JSON.stringify({ error: `Station returned ${response.status}` })
      };
    }

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control':               'public, max-age=120', // 2 min for live data
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
