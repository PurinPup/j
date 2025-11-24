// netlify/functions/proxy.js

const fetch = require('node-fetch'); // Netlify includes node-fetch automatically

exports.handler = async function(event, context) {
    const targetUrl = event.queryStringParameters.targetUrl;

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Target URL is required.' })
        };
    }

    try {
        const response = await fetch(targetUrl);
        if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
        }
        const data = await response.text();

        return {
            statusCode: 200,
            headers: {
                // This is important for CORS, allowing your frontend to read the response
                'Access-Control-Allow-Origin': '*' 
            },
            body: data,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Proxy fetch failed: ${error.message}` })
        };
    }
};
