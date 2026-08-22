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

const runAuthTests = async () => {
  console.log('\n=============================================');
  console.log('🧪 RUNNING COMPLETE AUTHENTICATION TEST SUITE');
  console.log('=============================================\n');

  const randomSuffix = Math.floor(Math.random() * 100000);
  const testUser = {
    name: 'Test Agent',
    email: `agent_${randomSuffix}@example.com`,
    password: 'Password123!',
    role: 'AGENT',
    phone: '+91 9988776655',
    agencyName: 'Skyline Properties',
  };

  let accessToken = '';
  let refreshToken = '';
  let resetToken = '';

  try {
    // Test 1: User Registration
    console.log('[Test 1] Registering New Agent Account...');
    const regRes = await testEndpoint('/api/v1/auth/register', 'POST', testUser);
    console.log(` -> Status: ${regRes.status}`, regRes.body?.message || regRes.body);
    if (regRes.status === 201) {
      accessToken = regRes.body.data.tokens.accessToken;
      refreshToken = regRes.body.data.tokens.refreshToken;
      console.log(' -> Tokens generated successfully.');
      console.log(' -> Password excluded from payload:', regRes.body.data.user.password === undefined ? '✅ YES' : '❌ NO');
    }

    // Test 2: Duplicate Email Registration Check
    console.log('\n[Test 2] Testing Duplicate Email Registration (Expect 409 Conflict)...');
    const dupRes = await testEndpoint('/api/v1/auth/register', 'POST', testUser);
    console.log(` -> Status: ${dupRes.status} (${dupRes.status === 409 ? '✅ PASS' : '❌ FAIL'})`, dupRes.body?.message);

    // Test 3: Login with Correct Credentials
    console.log('\n[Test 3] Testing User Login with Correct Credentials...');
    const loginRes = await testEndpoint('/api/v1/auth/login', 'POST', {
      email: testUser.email,
      password: testUser.password,
    });
    console.log(` -> Status: ${loginRes.status} (${loginRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, loginRes.body?.message);
    if (loginRes.status === 200) {
      accessToken = loginRes.body.data.tokens.accessToken;
      refreshToken = loginRes.body.data.tokens.refreshToken;
    }

    // Test 4: Login with Wrong Password
    console.log('\n[Test 4] Testing User Login with Wrong Password (Expect 401)...');
    const wrongPassRes = await testEndpoint('/api/v1/auth/login', 'POST', {
      email: testUser.email,
      password: 'IncorrectPassword!',
    });
    console.log(` -> Status: ${wrongPassRes.status} (${wrongPassRes.status === 401 ? '✅ PASS' : '❌ FAIL'})`, wrongPassRes.body?.message);

    // Test 5: Get Current User Profile with Token
    console.log('\n[Test 5] Fetching Current User (/api/v1/auth/me) with Bearer Token...');
    const meRes = await testEndpoint('/api/v1/auth/me', 'GET', null, {
      Authorization: `Bearer ${accessToken}`,
    });
    console.log(` -> Status: ${meRes.status} (${meRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, meRes.body?.data?.user?.email);

    // Test 6: Get Current User Profile without Token
    console.log('\n[Test 6] Fetching Current User (/api/v1/auth/me) WITHOUT Token (Expect 401)...');
    const meNoTokenRes = await testEndpoint('/api/v1/auth/me', 'GET');
    console.log(` -> Status: ${meNoTokenRes.status} (${meNoTokenRes.status === 401 ? '✅ PASS' : '❌ FAIL'})`, meNoTokenRes.body?.message);

    // Test 7: Refresh Token Rotation
    console.log('\n[Test 7] Testing Refresh Token Rotation (/api/v1/auth/refresh-token)...');
    const refreshRes = await testEndpoint('/api/v1/auth/refresh-token', 'POST', {
      refreshToken,
    });
    console.log(` -> Status: ${refreshRes.status} (${refreshRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, refreshRes.body?.message);
    if (refreshRes.status === 200) {
      accessToken = refreshRes.body.data.accessToken;
    }

    // Test 8: Update Profile
    console.log('\n[Test 8] Updating User Profile (/api/v1/auth/profile)...');
    const updateRes = await testEndpoint(
      '/api/v1/auth/profile',
      'PUT',
      { phone: '+91 9123456789', bio: 'Senior Commercial Real Estate Advisor' },
      { Authorization: `Bearer ${accessToken}` }
    );
    console.log(` -> Status: ${updateRes.status} (${updateRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, updateRes.body?.data?.user?.bio);

    // Test 9: Change Password with Incorrect Old Password
    console.log('\n[Test 9] Changing Password with Wrong Old Password (Expect 400)...');
    const wrongChangeRes = await testEndpoint(
      '/api/v1/auth/change-password',
      'PUT',
      { oldPassword: 'WrongOldPassword', newPassword: 'NewPassword123!' },
      { Authorization: `Bearer ${accessToken}` }
    );
    console.log(` -> Status: ${wrongChangeRes.status} (${wrongChangeRes.status === 400 ? '✅ PASS' : '❌ FAIL'})`, wrongChangeRes.body?.message);

    // Test 10: Change Password with Correct Credentials
    console.log('\n[Test 10] Changing Password with Correct Old Password (Expect 200)...');
    const changePassRes = await testEndpoint(
      '/api/v1/auth/change-password',
      'PUT',
      { oldPassword: testUser.password, newPassword: 'NewPassword123!' },
      { Authorization: `Bearer ${accessToken}` }
    );
    console.log(` -> Status: ${changePassRes.status} (${changePassRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, changePassRes.body?.message);

    // Test 11: Forgot Password Request
    console.log('\n[Test 11] Requesting Forgot Password Reset Token...');
    const forgotRes = await testEndpoint('/api/v1/auth/forgot-password', 'POST', {
      email: testUser.email,
    });
    console.log(` -> Status: ${forgotRes.status} (${forgotRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, forgotRes.body?.message);
    if (forgotRes.body?.data?.resetToken) {
      resetToken = forgotRes.body.data.resetToken;
    }

    // Test 12: Reset Password with Reset Token
    if (resetToken) {
      console.log('\n[Test 12] Resetting Password with Generated Token...');
      const resetPassRes = await testEndpoint('/api/v1/auth/reset-password', 'POST', {
        token: resetToken,
        newPassword: 'BrandNewSecurePassword456!',
      });
      console.log(` -> Status: ${resetPassRes.status} (${resetPassRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, resetPassRes.body?.message);
    }

    // Test 13: Logout
    console.log('\n[Test 13] Logging Out User (/api/v1/auth/logout)...');
    const logoutRes = await testEndpoint('/api/v1/auth/logout', 'POST', null, {
      Authorization: `Bearer ${accessToken}`,
    });
    console.log(` -> Status: ${logoutRes.status} (${logoutRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`, logoutRes.body?.message);

    console.log('\n=============================================');
    console.log('✅ ALL AUTHENTICATION TESTS EXECUTED SUCCESSFULLY');
    console.log('=============================================\n');
  } catch (err) {
    console.error('[Auth Test Failure]:', err);
  }
};

runAuthTests();
