const http = require('http');
const { URL } = require('url');

// Configuration
const config = {
  host: 'localhost',
  port: 3000,
  path: '/api/session', // Updated to use the new session endpoint
  method: 'GET',
  protocol: 'http:',
  // Add your session cookie here if needed
  // cookies: ['next-auth.session-token=YOUR_SESSION_TOKEN'],
  timeout: 10000, // 10 seconds timeout
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
console.log(`Method: ${config.method}`);
console.log('Timeout:', config.timeout, 'ms');
  
// Log environment info
console.log('\n=== Environment Info ===');
console.log('Node.js Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Helper function to make the request
function makeRequest() {
  return new Promise((resolve, reject) => {
    const req = http.request(requestOptions, (res) => {
      let data = [];
      
      res.on('data', (chunk) => {
        data.push(chunk);
      });
      
      res.on('end', () => {
        const responseBody = Buffer.concat(data).toString();
        
        // Try to parse JSON response
        let jsonResponse;
        try {
          jsonResponse = responseBody ? JSON.parse(responseBody) : null;
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
        }
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: jsonResponse || responseBody,
          rawBody: responseBody
        });
      });
    });

    // Handle errors
    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    
    // Log response headers when received
    req.on('response', (res) => {
      console.log('\n=== Response Headers ===');
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
    });

    // Set a timeout
    req.setTimeout(config.timeout, () => {
      req.destroy(new Error(`Request timed out after ${config.timeout/1000} seconds`));
    });
    
    // Log request start
    console.log(`\nSending ${config.method} request to ${config.protocol}//${config.host}:${config.port}${config.path}`);
    console.log('Request Headers:', JSON.stringify(requestOptions.headers, null, 2));

    // Send the request
    req.end();
  });
}

// Run the test
async function runTest() {
  console.log('\nSending request...');
  
  try {
    const response = await makeRequest();
    
    console.log('\n=== Response ===');
    console.log(`Status: ${response.statusCode} ${http.STATUS_CODES[response.statusCode]}`);
    
    console.log('\nHeaders:');
    Object.entries(response.headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    console.log('\nResponse Body:');
    if (typeof response.body === 'object' && response.body !== null) {
      console.log(JSON.stringify(response.body, null, 2));
    } else {
      console.log(response.body);
    }
    
    // Check if we got a 404
    if (response.statusCode === 404) {
      console.log('\n❌ 404 Not Found - The endpoint does not exist');
      console.log('This could be due to:');
      console.log('1. The route is not properly defined in your Next.js app');
      console.log('2. The route is defined but not exported correctly');
      console.log('3. There might be a typo in the URL path');
      
      // Check if we got an HTML response (Next.js 404 page)
      if (response.rawBody.includes('<!DOCTYPE html>')) {
        console.log('\n⚠️  Received an HTML 404 page. This typically means:');
        console.log('- The route is not matched by any route handler');
        console.log('- The API route might be in the wrong directory (should be in app/api/.../route.ts)');
      }
    } else if (response.statusCode === 401) {
      console.log('\n🔐 401 Unauthorized - No valid session found');
      console.log('This is expected if you are not logged in');
    } else if (response.statusCode === 200) {
      console.log('\n✅ Success! The endpoint is working correctly');
    }
    
  } catch (error) {
    console.error('\n=== Request Failed ===');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Could not connect to the server. Make sure the server is running.');
      console.error(`Tried to connect to: http://${config.host}:${config.port}`);
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n❌ Host not found. Check your host configuration.');
    } else {
      console.error('\n❌ An unexpected error occurred:', error);
    }
  }
}

// Run the test
runTest();
