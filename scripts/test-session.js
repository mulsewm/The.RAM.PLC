const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const config = {
  host: 'localhost',
  port: 3000,
  path: '/api/auth/session',
  method: 'GET',
  protocol: 'http:',
  // Add your session cookie here if needed
  // cookies: ['next-auth.session-token=YOUR_SESSION_TOKEN'],
};

// Create request options
const requestOptions = {
  hostname: config.host,
  port: config.port,
  path: config.path,
  method: config.method,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    // Add cookies to headers if provided
    ...(config.cookies && { 'Cookie': config.cookies.join('; ') }),
  },
};

console.log('=== Testing Session Endpoint ===');
console.log(`Endpoint: ${config.protocol}//${config.host}:${config.port}${config.path}`);
console.log('Request Headers:', JSON.stringify(requestOptions.headers, null, 2));

// Choose http or https based on protocol
const client = config.protocol === 'https:' ? https : http;

const req = client.request(requestOptions, (res) => {
  console.log('\n=== Response ===');
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  
  // Log response headers
  console.log('\nHeaders:');
  Object.entries(res.headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  // Collect response data
  let data = [];
  
  res.on('data', (chunk) => {
    data.push(chunk);
  });
  
  res.on('end', () => {
    const responseBody = Buffer.concat(data).toString();
    
    try {
      console.log('\nResponse Body:');
      const json = JSON.parse(responseBody);
      console.log(JSON.stringify(json, null, 2));
      
      // Check if session is valid
      if (res.statusCode === 200 && json.authenticated) {
        console.log('\n✅ Session is valid!');
        console.log(`User: ${json.user?.email || 'Unknown'}`);
        console.log(`Role: ${json.user?.role || 'Unknown'}`);
      } else if (res.statusCode === 401) {
        console.log('\n🔐 Not authenticated');
      } else {
        console.log('\n❌ Session check failed');
      }
    } catch (e) {
      console.log('\nCould not parse response as JSON:');
      console.log(responseBody);
    }
  });
});

// Handle errors
req.on('error', (error) => {
  console.error('\n=== Request Error ===');
  console.error(error);
  
  if (error.code === 'ECONNREFUSED') {
    console.error('\n❌ Could not connect to the server. Make sure the server is running.');
  } else {
    console.error('\n❌ An error occurred:', error.message);
  }
});

// Set a timeout
req.setTimeout(5000, () => {
  req.destroy();
  console.error('\n❌ Request timed out after 5 seconds');});

// Send the request
req.end();

console.log('\nSending request...');
