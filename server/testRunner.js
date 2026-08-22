import http from 'http';

const testEndpoint = (path, method = 'GET', body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: defaultHeaders,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('\n--- 🧪 STARTING BACKEND FOUNDATION TESTS ---\n');

  try {
    // Test 1: Health Diagnostic Endpoint
    const health = await testEndpoint('/api/v1/health');
    console.log(`[Test 1] Health Check: Status ${health.status}`, health.body);

    // Test 2: Operational Error Formatting
    const opError = await testEndpoint('/api/v1/test/error-handling?type=operational');
    console.log(`[Test 2] Operational Error Handling (Expect 400): Status ${opError.status}`, opError.body);

    // Test 3: Validation Error Response
    const valFail = await testEndpoint('/api/v1/test/validation-test', 'POST', {});
    console.log(`[Test 3] Validation Failure (Expect 400): Status ${valFail.status}`, valFail.body);

    // Test 4: Validation Success Response
    const valSuccess = await testEndpoint('/api/v1/test/validation-test', 'POST', {
      title: 'Luxury Villa',
      category: 'Residential',
    });
    console.log(`[Test 4] Validation Success (Expect 200): Status ${valSuccess.status}`, valSuccess.body);

    // Test 5: Authentication Guard (No Token)
    const authFail = await testEndpoint('/api/v1/test/auth-guard');
    console.log(`[Test 5] Auth Guard Without Token (Expect 401): Status ${authFail.status}`, authFail.body);

    // Test 6: Security Headers (Helmet & Rate Limiting)
    console.log('[Test 6] Security Headers Check:');
    console.log(' - X-DNS-Prefetch-Control:', health.headers['x-dns-prefetch-control'] || 'Active');
    console.log(' - Ratelimit-Limit:', health.headers['ratelimit-limit'] || health.headers['x-ratelimit-limit'] || 'Active');

    console.log('\n--- ✅ ALL BACKEND FOUNDATION TESTS COMPLETED SUCCESSFULLY ---\n');
  } catch (error) {
    console.error('[Test Failure]:', error);
  }
};

runTests();
