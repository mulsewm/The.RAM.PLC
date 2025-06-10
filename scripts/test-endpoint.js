const http = require('http');

const testEndpoint = async (path, method = 'GET', headers = {}) => {
  console.log(`\n=== Testing ${method} ${path} ===`);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path,
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers
    },
    timeout: 5000
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
      console.log('Headers:', JSON.stringify(res.headers, null, 2));
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('Response:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('Raw response (first 200 chars):', data.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      resolve();
    });

    req.on('timeout', () => {
      console.error('Request timed out');
      req.destroy();
      resolve();
    });

    req.end();
  });
};

const runTests = async () => {
  console.log('🚀 Starting API endpoint tests...');
  
  // Test a basic API route that should work
  await testEndpoint('/api/hello');
  
  // Test the auth session endpoint
  await testEndpoint('/api/auth/session');
  
  // Test with credentials
  await testEndpoint('/api/auth/session', 'GET', {
    'Cookie': 'next-auth.session-token=test' // This will be invalid, but should return 401, not 404
  });
  
  console.log('\n✅ Tests completed');};

runTests().catch(console.error);
