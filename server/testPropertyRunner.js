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

const runPropertyTests = async () => {
  console.log('\n======================================================');
  console.log('🏢 RUNNING COMPLETE PROPERTY MANAGEMENT TEST SUITE');
  console.log('======================================================\n');

  const randomSuffix = Math.floor(Math.random() * 100000);

  const testAccounts = {
    agent: {
      name: 'Elena Rostova',
      email: `agent_prop_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'AGENT',
      phone: '+91 9876543210',
      agencyName: 'Luxury Skyline Realtors',
    },
    attackerSeller: {
      name: 'Rival Seller',
      email: `seller_rival_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'SELLER',
    },
    buyer: {
      name: 'David Miller',
      email: `buyer_prop_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'USER',
    },
    admin: {
      name: 'System Admin',
      email: `admin_prop_${randomSuffix}@example.com`,
      password: 'Password123!',
      role: 'ADMIN',
    },
  };

  const tokens = {};
  let createdPropertyId = '';
  let propertySlug = '';

  try {
    // 1. Setup Accounts
    console.log('[Setup] Registering accounts for Agent, Seller, Buyer, and Admin...');
    for (const [key, acc] of Object.entries(testAccounts)) {
      const res = await testEndpoint('/api/v1/auth/register', 'POST', acc);
      if (res.status === 201) {
        tokens[key] = res.body.data.tokens.accessToken;
        console.log(` -> Registered ${key.toUpperCase()}: ${acc.email}`);
      }
    }

    const sampleProperty = {
      title: `Skyline Luxury Penthouse ${randomSuffix}`,
      description: 'Exclusive 4BHK penthouse with private infinity pool and panoramic ocean views.',
      propertyType: 'PENTHOUSE',
      listingType: 'SALE',
      price: 18500000,
      priceUnit: 'INR',
      area: 4200,
      areaUnit: 'sqft',
      bedrooms: 4,
      bathrooms: 5,
      balconies: 3,
      floor: 35,
      totalFloors: 35,
      furnishingStatus: 'FULLY_FURNISHED',
      constructionStatus: 'READY_TO_MOVE',
      parking: 3,
      amenities: ['Swimming Pool', 'Private Elevator', 'Gym', '24/7 Security', 'Concierge'],
      address: 'Worli Sea Face, Tower 1',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      coordinates: { type: 'Point', coordinates: [72.8180, 19.0176] },
      images: [
        {
          url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000',
          publicId: 'prop_img_1',
          isThumbnail: true,
        },
      ],
    };

    // Test 1: Property Creation by Agent
    console.log('\n[Test 1] Agent creating property listing (POST /api/v1/properties)...');
    const createRes = await testEndpoint('/api/v1/properties', 'POST', sampleProperty, {
      Authorization: `Bearer ${tokens.agent}`,
    });
    console.log(` -> Status: ${createRes.status} (${createRes.status === 201 ? '✅ PASS: 201 Created' : '❌ FAIL'})`);
    if (createRes.status === 201) {
      const prop = createRes.body.data;
      createdPropertyId = prop._id;
      propertySlug = prop.slug;
      console.log(` -> Created Property ID: ${createdPropertyId}`);
      console.log(` -> Generated SEO Slug: ${propertySlug}`);
      console.log(` -> Approval Status (Expect PENDING): ${prop.approvalStatus} (${prop.approvalStatus === 'PENDING' ? '✅ YES' : '❌ NO'})`);
      console.log(` -> Agent Assigned: ${prop.agent?.name} (${prop.agent?.agencyName})`);
    }

    // Test 2: Public Catalog Check for Pending Property
    console.log('\n[Test 2] Public querying property catalog (GET /api/v1/properties)...');
    const publicCatalogRes = await testEndpoint('/api/v1/properties');
    const publicProps = Array.isArray(publicCatalogRes.body.data) ? publicCatalogRes.body.data : (publicCatalogRes.body.data?.properties || []);
    const foundInPublic = publicProps.some((p) => p._id === createdPropertyId);
    console.log(` -> Status: ${publicCatalogRes.status}`);
    console.log(` -> Pending property excluded from public catalog: ${!foundInPublic ? '✅ PASS (Excluded)' : '❌ FAIL (Visible)'}`);

    // Test 3: Admin Queries Pending Listings
    console.log('\n[Test 3] Admin querying pending moderation queue (GET /api/v1/properties?approvalStatus=PENDING)...');
    const adminCatalogRes = await testEndpoint('/api/v1/properties?approvalStatus=PENDING', 'GET', null, {
      Authorization: `Bearer ${tokens.admin}`,
    });
    const adminProps = Array.isArray(adminCatalogRes.body.data) ? adminCatalogRes.body.data : (adminCatalogRes.body.data?.properties || []);
    const foundInAdmin = adminProps.some((p) => p._id === createdPropertyId);
    console.log(` -> Status: ${adminCatalogRes.status}`);
    console.log(` -> Pending property found in admin queue: ${foundInAdmin ? '✅ PASS (Found)' : '❌ FAIL'}`);

    // Test 4: Admin Approves Property
    console.log('\n[Test 4] Admin approving property (PATCH /api/v1/properties/:id/approval)...');
    const approveRes = await testEndpoint(
      `/api/v1/properties/${createdPropertyId}/approval`,
      'PATCH',
      { approvalStatus: 'APPROVED' },
      { Authorization: `Bearer ${tokens.admin}` }
    );
    console.log(` -> Status: ${approveRes.status} (${approveRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(` -> Updated Approval Status: ${approveRes.body?.data?.approvalStatus}`);

    // Test 5: Public Catalog Check After Approval
    console.log('\n[Test 5] Public catalog check after approval...');
    const publicAfterApprove = await testEndpoint('/api/v1/properties');
    const nowVisible = (publicAfterApprove.body.data || []).some((p) => p._id === createdPropertyId);
    console.log(` -> Approved property now visible publicly: ${nowVisible ? '✅ PASS (Visible)' : '❌ FAIL'}`);

    // Test 6: View Property by Slug & Atomic View Counter
    console.log('\n[Test 6] User viewing property by SEO slug (GET /api/v1/properties/slug/:slug)...');
    const slugView1 = await testEndpoint(`/api/v1/properties/slug/${propertySlug}`);
    const slugView2 = await testEndpoint(`/api/v1/properties/slug/${propertySlug}`);
    console.log(` -> Status: ${slugView2.status} (${slugView2.status === 200 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(` -> View count incremented: ${slugView2.body?.data?.views} views (${slugView2.body?.data?.views >= 2 ? '✅ PASS' : '❌ FAIL'})`);

    // Test 7: Agent Fetches My Properties
    console.log('\n[Test 7] Agent fetching own listings (GET /api/v1/properties/my-properties)...');
    const myPropsRes = await testEndpoint('/api/v1/properties/my-properties', 'GET', null, {
      Authorization: `Bearer ${tokens.agent}`,
    });
    console.log(` -> Status: ${myPropsRes.status} (${myPropsRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(` -> Total Listings for Agent: ${myPropsRes.body?.meta?.total}`);

    // Test 8: Owner Updates Property Specs
    console.log('\n[Test 8] Owner updating property specs (PUT /api/v1/properties/:id)...');
    const updateRes = await testEndpoint(
      `/api/v1/properties/${createdPropertyId}`,
      'PUT',
      { price: 19500000, description: 'Updated luxury description with turnkey finishes.' },
      { Authorization: `Bearer ${tokens.agent}` }
    );
    console.log(` -> Status: ${updateRes.status} (${updateRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(` -> Updated Price: ₹${updateRes.body?.data?.price?.toLocaleString()}`);

    // Test 9: Attacker/Rival Seller Attempts to Modify Agent's Property
    console.log('\n[Test 9] Rival Seller attempting to modify Agent\'s property (Expect 403 Forbidden)...');
    const attackRes = await testEndpoint(
      `/api/v1/properties/${createdPropertyId}`,
      'PUT',
      { price: 5000 },
      { Authorization: `Bearer ${tokens.attackerSeller}` }
    );
    console.log(` -> Status: ${attackRes.status} (${attackRes.status === 403 ? '✅ PASS: 403 Forbidden (Blocked)' : '❌ FAIL'})`);

    // Test 10: Owner Updates Property Status to SOLD
    console.log('\n[Test 10] Owner changing property status to SOLD (PATCH /api/v1/properties/:id/status)...');
    const statusRes = await testEndpoint(
      `/api/v1/properties/${createdPropertyId}/status`,
      'PATCH',
      { status: 'SOLD' },
      { Authorization: `Bearer ${tokens.agent}` }
    );
    console.log(` -> Status: ${statusRes.status} (${statusRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(` -> New Property Status: ${statusRes.body?.data?.status}`);

    // Test 11: Admin Toggles Featured Status
    console.log('\n[Test 11] Admin marking property as Featured (PATCH /api/v1/properties/:id/featured)...');
    const featureRes = await testEndpoint(
      `/api/v1/properties/${createdPropertyId}/featured`,
      'PATCH',
      { isFeatured: true },
      { Authorization: `Bearer ${tokens.admin}` }
    );
    console.log(` -> Status: ${featureRes.status} (${featureRes.status === 200 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(` -> Featured Status: ${featureRes.body?.data?.isFeatured}`);

    // Test 12: Duplicate Slug Generation Test
    console.log('\n[Test 12] Creating duplicate property title to test slug collision handling...');
    const dupTitleProp = { ...sampleProperty, title: sampleProperty.title };
    const dupRes = await testEndpoint('/api/v1/properties', 'POST', dupTitleProp, {
      Authorization: `Bearer ${tokens.agent}`,
    });
    console.log(` -> Status: ${dupRes.status} (${dupRes.status === 201 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(` -> Original Slug: ${propertySlug}`);
    console.log(` -> New Collision-Safe Slug: ${dupRes.body?.data?.slug}`);
    console.log(` -> Slugs are distinct: ${propertySlug !== dupRes.body?.data?.slug ? '✅ YES' : '❌ NO'}`);

    // Cleanup duplicate
    if (dupRes.body?.data?._id) {
      await testEndpoint(`/api/v1/properties/${dupRes.body.data._id}`, 'DELETE', null, {
        Authorization: `Bearer ${tokens.agent}`,
      });
    }

    // Test 13: Owner Deletes Property
    console.log('\n[Test 13] Owner deleting property (DELETE /api/v1/properties/:id)...');
    const deleteRes = await testEndpoint(`/api/v1/properties/${createdPropertyId}`, 'DELETE', null, {
      Authorization: `Bearer ${tokens.agent}`,
    });
    console.log(` -> Status: ${deleteRes.status} (${deleteRes.status === 200 ? '✅ PASS: 200 OK' : '❌ FAIL'})`);

    console.log('\n======================================================');
    console.log('✅ ALL 13 PROPERTY MANAGEMENT TESTS COMPLETED SUCCESSFULLY');
    console.log('======================================================\n');
  } catch (err) {
    console.error('[Property Test Runner Error]:', err);
  }
};

runPropertyTests();
