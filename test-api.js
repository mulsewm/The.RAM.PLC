const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';
const BASE_URL = `http://${HOST}:${PORT}`;

async function testEndpoint(path, method = 'GET', data = null) {
  const url = new URL(path, BASE_URL);
  console.log(`\n=== Testing ${method} ${url.toString()} ===`);
  
  const options = {
    hostname: HOST,
    port: PORT,
    path: url.pathname + url.search,
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 5000 // 5 second timeout
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let response = {
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        headers: res.headers,
        body: '',
        isHtml: false,
        isJson: false
      };
      
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
      
      res.setEncoding('utf8');
      
      res.on('data', (chunk) => {
        response.body += chunk;
      });
      
      res.on('end', () => {
        try {
          // Check if response is HTML
          if (response.body.trim().startsWith('<!DOCTYPE html>') || 
              response.body.trim().startsWith('<html')) {
            response.isHtml = true;
            console.log('Response is HTML');
            console.log('Response length:', response.body.length, 'characters');
            
            // Try to extract title from HTML
            const titleMatch = response.body.match(/<title>(.*?)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
              console.log('Page title:', titleMatch[1]);
            }
            
            // Check for common error pages
            if (response.body.includes('404') && 
                (response.body.includes('not found') || response.body.includes('Not Found'))) {
              console.log('⚠️  This appears to be a 404 Not Found page');
            }
          } 
          // Try to parse as JSON if content-type is JSON
          else if (res.headers['content-type']?.includes('application/json')) {
            response.isJson = true;
            response.body = JSON.parse(response.body);
            console.log('JSON Response:', JSON.stringify(response.body, null, 2));
          }
          // If not HTML or JSON, just log the raw response
          else {
            console.log('Raw Response:', response.body);
          }
        } catch (e) {
          console.error('Error processing response:', e.message);
          console.log('Raw response (first 500 chars):', response.body.substring(0, 500));
        }
        
        console.log('\n');
        resolve(response);
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request failed: ${e.message}`);
      resolve({ 
        error: e.message,
        code: e.code
      });
    });

    req.on('timeout', () => {
      console.error('⌛ Request timed out');
      req.destroy();
      resolve({ error: 'Request timed out' });
    });

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting API tests...');
  
  // Test hello endpoint (should work)
  console.log('\n🔹 Testing /api/hello endpoint...');
  await testEndpoint('/api/hello');
  
  // Test health endpoint
  console.log('\n🔹 Testing /api/health endpoint...');
  await testEndpoint('/api/health');
  
  // Test test endpoint
  console.log('\n🔹 Testing /api/test endpoint...');
  await testEndpoint('/api/test');
  
  // Test auth session endpoint
  console.log('\n🔹 Testing /api/auth/session endpoint...');
  await testEndpoint('/api/auth/session');
  
  // Test non-existent endpoint
  console.log('\n🔹 Testing non-existent endpoint...');
  await testEndpoint('/api/non-existent-endpoint');
  
  console.log('\n✅ Tests completed');
}

// Run the tests
runTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Test runner error:', error);
    process.exit(1);
  });
