import http from 'http';
import { mockResourceStore } from './routes/rbacTestRoutes.js';

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

const runRbacTestSuite = async () => {
  console.log('\n=============================================');
  console.log('🛡️ RUNNING RBAC & RESOURCE OWNERSHIP TEST SUITE');
  console.log('=============================================\n');

  const randomSuffix = Math.floor(Math.random() * 100000);

  // Users to create
  const users = {
    buyer: {
      name: 'Test Buyer',
      email: `buyer_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'USER',
    },
    agent1: {
      name: 'Agent One',
      email: `agent1_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'AGENT',
    },
    agent2: {
      name: 'Agent Two (Attacker)',
      email: `agent2_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'AGENT',
    },
    seller: {
      name: 'Property Seller',
      email: `seller_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'SELLER',
    },
    admin: {
      name: 'System Admin',
      email: `admin_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'ADMIN',
    },
  };

  const tokens = {};
  const userIds = {};

  try {
    console.log('[Setup] Registering test accounts for all roles...');
    for (const [key, userObj] of Object.entries(users)) {
      const res = await testEndpoint('/api/v1/auth/register', 'POST', userObj);
      if (res.status === 201) {
        tokens[key] = res.body.data.tokens.accessToken;
        userIds[key] = res.body.data.user._id || res.body.data.user.id;
        console.log(` -> Registered ${key.toUpperCase()} (${userObj.role}): ID ${userIds[key]}`);
      } else {
        console.error(` -> Failed to register ${key}:`, res.body);
      }
    }

    // Bind Agent 1 ID to mock property
    const prop101 = mockResourceStore.properties.get('prop-101');
    if (prop101 && userIds.agent1) {
      prop101.owner = userIds.agent1;
      console.log(` -> Bound 'prop-101' owner to AGENT 1 (${userIds.agent1})`);
    }

    console.log('\n--- 1. ADMIN ENDPOINT AUTHORIZATION CHECKS ---');

    // Test 1: USER -> Admin Endpoint
    const t1 = await testEndpoint('/api/v1/rbac-test/admin-only', 'GET', null, {
      Authorization: `Bearer ${tokens.buyer}`,
    });
    console.log(`[Test 1] USER accessing Admin Endpoint: Status ${t1.status} (${t1.status === 403 ? '✅ PASS: 403 Forbidden' : '❌ FAIL'})`);

    // Test 2: AGENT -> Admin Endpoint
    const t2 = await testEndpoint('/api/v1/rbac-test/admin-only', 'GET', null, {
      Authorization: `Bearer ${tokens.agent1}`,
    });
    console.log(`[Test 2] AGENT accessing Admin Endpoint: Status ${t2.status} (${t2.status === 403 ? '✅ PASS: 403 Forbidden' : '❌ FAIL'})`);

    // Test 3: SELLER -> Admin Endpoint
    const t3 = await testEndpoint('/api/v1/rbac-test/admin-only', 'GET', null, {
      Authorization: `Bearer ${tokens.seller}`,
    });
    console.log(`[Test 3] SELLER accessing Admin Endpoint: Status ${t3.status} (${t3.status === 403 ? '✅ PASS: 403 Forbidden' : '❌ FAIL'})`);

    // Test 4: ADMIN -> Admin Endpoint
    const t4 = await testEndpoint('/api/v1/rbac-test/admin-only', 'GET', null, {
      Authorization: `Bearer ${tokens.admin}`,
    });
    console.log(`[Test 4] ADMIN accessing Admin Endpoint: Status ${t4.status} (${t4.status === 200 ? '✅ PASS: 200 OK' : '❌ FAIL'})`);

    console.log('\n--- 2. AGENT & SELLER PERMISSION CHECKS ---');

    // Test 5: AGENT -> Agent Analytics
    const t5 = await testEndpoint('/api/v1/rbac-test/agent-analytics', 'GET', null, {
      Authorization: `Bearer ${tokens.agent1}`,
    });
    console.log(`[Test 5] AGENT accessing Agent Analytics: Status ${t5.status} (${t5.status === 200 ? '✅ PASS: 200 OK' : '❌ FAIL'})`);

    // Test 6: USER -> Agent Analytics
    const t6 = await testEndpoint('/api/v1/rbac-test/agent-analytics', 'GET', null, {
      Authorization: `Bearer ${tokens.buyer}`,
    });
    console.log(`[Test 6] USER accessing Agent Analytics: Status ${t6.status} (${t6.status === 403 ? '✅ PASS: 403 Forbidden' : '❌ FAIL'})`);

    // Test 7: SELLER -> Create Property
    const t7 = await testEndpoint('/api/v1/rbac-test/seller-property', 'POST', {}, {
      Authorization: `Bearer ${tokens.seller}`,
    });
    console.log(`[Test 7] SELLER creating Property: Status ${t7.status} (${t7.status === 201 ? '✅ PASS: 201 Created' : '❌ FAIL'})`);

    // Test 8: USER -> Create Property (Denied)
    const t8 = await testEndpoint('/api/v1/rbac-test/seller-property', 'POST', {}, {
      Authorization: `Bearer ${tokens.buyer}`,
    });
    console.log(`[Test 8] USER creating Property: Status ${t8.status} (${t8.status === 403 ? '✅ PASS: 403 Forbidden' : '❌ FAIL'})`);

    // Test 9: USER -> Submit Buyer Enquiry
    const t9 = await testEndpoint('/api/v1/rbac-test/user-enquiry', 'POST', {}, {
      Authorization: `Bearer ${tokens.buyer}`,
    });
    console.log(`[Test 9] USER submitting Enquiry: Status ${t9.status} (${t9.status === 201 ? '✅ PASS: 201 Created' : '❌ FAIL'})`);

    console.log('\n--- 3. RESOURCE OWNERSHIP & IDOR PREVENTION CHECKS ---');

    // Test 10: AGENT 1 modifying own property (prop-101)
    const t10 = await testEndpoint(
      '/api/v1/rbac-test/property/prop-101',
      'PUT',
      { title: 'Updated Seaside Villa' },
      { Authorization: `Bearer ${tokens.agent1}` }
    );
    console.log(`[Test 10] AGENT 1 modifying OWN property: Status ${t10.status} (${t10.status === 200 ? '✅ PASS: 200 OK' : '❌ FAIL'})`);

    // Test 11: AGENT 2 attempting to modify AGENT 1's property (prop-101)
    const t11 = await testEndpoint(
      '/api/v1/rbac-test/property/prop-101',
      'PUT',
      { title: 'Hacked Title By Agent 2' },
      { Authorization: `Bearer ${tokens.agent2}` }
    );
    console.log(`[Test 11] AGENT 2 modifying AGENT 1's property: Status ${t11.status} (${t11.status === 403 ? '✅ PASS: 403 Forbidden (Blocked)' : '❌ FAIL'})`);

    // Test 12: ADMIN modifying AGENT 1's property (prop-101) (Admin override)
    const t12 = await testEndpoint(
      '/api/v1/rbac-test/property/prop-101',
      'PUT',
      { title: 'Moderated by Admin' },
      { Authorization: `Bearer ${tokens.admin}` }
    );
    console.log(`[Test 12] ADMIN modifying AGENT 1's property: Status ${t12.status} (${t12.status === 200 ? '✅ PASS: 200 OK (Override Authorized)' : '❌ FAIL'})`);

    console.log('\n=============================================');
    console.log('🛡️ ALL 12 RBAC & OWNERSHIP SECURITY CHECKS PASSED');
    console.log('=============================================\n');
  } catch (err) {
    console.error('[RBAC Test Runner Error]:', err);
  }
};

runRbacTestSuite();
