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

const runSearchSuite = async () => {
  console.log('\n======================================================');
  console.log('🔍 RUNNING COMPREHENSIVE PROPERTY SEARCH & FILTER SUITE');
  console.log('======================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? `-> ${JSON.stringify(details)}` : ''}`);
      failedTests++;
    }
  };

  try {
    // 1. Setup / Login Admin & Agent
    const randomSuffix = Math.floor(Math.random() * 100000);
    const agentEmail = `search_agent_${randomSuffix}@estate.com`;
    const adminEmail = `search_admin_${randomSuffix}@estate.com`;

    // Register Agent
    const agentReg = await testEndpoint('/api/v1/auth/register', 'POST', {
      name: 'Search Agent',
      email: agentEmail,
      password: 'Password123!',
      phone: '9876543210',
      role: 'AGENT',
      agencyName: 'Search Apex Realty',
    });

    let agentToken = agentReg.body.data?.tokens?.accessToken;
    if (!agentToken) {
      const agentLogin = await testEndpoint('/api/v1/auth/login', 'POST', {
        email: agentEmail,
        password: 'Password123!',
      });
      agentToken = agentLogin.body.data?.tokens?.accessToken;
    }

    // Register Admin
    const adminReg = await testEndpoint('/api/v1/auth/register', 'POST', {
      name: 'Search Admin',
      email: adminEmail,
      password: 'Password123!',
      phone: '9876543211',
      role: 'ADMIN',
    });

    let adminToken = adminReg.body.data?.tokens?.accessToken;
    if (!adminToken) {
      const adminLogin = await testEndpoint('/api/v1/auth/login', 'POST', {
        email: adminEmail,
        password: 'Password123!',
      });
      adminToken = adminLogin.body.data?.tokens?.accessToken;
    }

    // 2. Create and Approve Test Dataset
    const propertiesToCreate = [
      {
        title: `Luxury Lakeview Apartment in Bhopal ${randomSuffix}`,
        description: 'Prime 3BHK flat near Upper Lake with premium clubhouse and infinity swimming pool in Arera Colony',
        propertyType: 'APARTMENT',
        listingType: 'SALE',
        price: 5500000,
        area: 1750,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        furnishingStatus: 'FULLY_FURNISHED',
        constructionStatus: 'READY_TO_MOVE',
        amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Power Backup', '24/7 Security'],
        address: 'Arera Colony Sector E',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462016',
      },
      {
        title: `Cozy 2BHK Rental Flat in MP Nagar Bhopal ${randomSuffix}`,
        description: 'Affordable modern rental apartment close to commercial offices and coachings in MP Nagar',
        propertyType: 'APARTMENT',
        listingType: 'RENT',
        price: 22000,
        area: 1150,
        bedrooms: 2,
        bathrooms: 2,
        balconies: 1,
        furnishingStatus: 'SEMI_FURNISHED',
        constructionStatus: 'READY_TO_MOVE',
        amenities: ['Power Backup', 'Lift', 'Parking'],
        address: 'Zone II MP Nagar',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462011',
      },
      {
        title: `Royal Duplex Villa in Super Corridor Indore ${randomSuffix}`,
        description: 'Exclusive 4BHK luxury duplex villa with private landscaped garden and swimming pool in Indore',
        propertyType: 'VILLA',
        listingType: 'SALE',
        price: 13500000,
        area: 3400,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 3,
        furnishingStatus: 'UNFURNISHED',
        constructionStatus: 'UNDER_CONSTRUCTION',
        amenities: ['Swimming Pool', 'Private Garden', 'Gym', '24/7 Security'],
        address: 'Super Corridor Main Road',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452005',
      },
      {
        title: `Corporate Office Headquarters in Mumbai BKC ${randomSuffix}`,
        description: 'Furnished commercial IT corporate office space for long term lease in Bandra Kurla Complex',
        propertyType: 'COMMERCIAL',
        listingType: 'LEASE',
        price: 400000,
        area: 2800,
        bedrooms: 0,
        bathrooms: 3,
        balconies: 0,
        furnishingStatus: 'FULLY_FURNISHED',
        constructionStatus: 'READY_TO_MOVE',
        amenities: ['Power Backup', '24/7 Security', 'Central AC', 'Cafeteria'],
        address: 'G Block Bandra Kurla Complex',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051',
      },
      {
        title: `Corner Residential Plot in Kolar Road Bhopal ${randomSuffix}`,
        description: 'Clear title freehold residential plot with asphalt road frontage in gated layout',
        propertyType: 'PLOT',
        listingType: 'SALE',
        price: 3200000,
        area: 1900,
        bedrooms: 0,
        bathrooms: 0,
        balconies: 0,
        furnishingStatus: 'UNFURNISHED',
        constructionStatus: 'READY_TO_MOVE',
        amenities: ['Gated Community', '24/7 Security'],
        address: 'Kolar Road Sarvdharm Sector A',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462042',
      },
    ];

    console.log('Creating test listings...');
    const createdIds = [];
    for (const p of propertiesToCreate) {
      const createRes = await testEndpoint(
        '/api/v1/properties',
        'POST',
        p,
        { Authorization: `Bearer ${agentToken}` }
      );
      if (createRes.status === 201 && createRes.body.data?._id) {
        createdIds.push(createRes.body.data._id);
        // Approve via Admin
        await testEndpoint(
          `/api/v1/properties/${createRes.body.data._id}/approval`,
          'PATCH',
          { approvalStatus: 'APPROVED' },
          { Authorization: `Bearer ${adminToken}` }
        );
      } else {
        console.error('Property creation failed:', createRes.status, JSON.stringify(createRes.body));
      }
    }

    console.log(`Created & approved ${createdIds.length} test properties.\n`);

    // ==========================================
    // TEST 1: Keyword search
    // ==========================================
    const searchRes = await testEndpoint(`/api/v1/properties?keyword=Lakeview+${randomSuffix}`);
    assert(
      searchRes.status === 200 &&
      searchRes.body.data.properties.length === 1 &&
      searchRes.body.data.properties[0].title.includes('Lakeview'),
      'Keyword search by specific term "Lakeview"'
    );

    // ==========================================
    // TEST 2: City filter (case-insensitive)
    // ==========================================
    const cityRes = await testEndpoint(`/api/v1/properties?city=bhopal&keyword=${randomSuffix}`);
    assert(
      cityRes.status === 200 &&
      cityRes.body.data.total === 3 &&
      cityRes.body.data.properties.every((p) => p.city.toLowerCase() === 'bhopal'),
      'City filter (case-insensitive "bhopal") matches all Bhopal listings'
    );

    // ==========================================
    // TEST 3: State filter
    // ==========================================
    const stateRes = await testEndpoint(`/api/v1/properties?state=Maharashtra&keyword=${randomSuffix}`);
    assert(
      stateRes.status === 200 &&
      stateRes.body.data.total === 1 &&
      stateRes.body.data.properties[0].city === 'Mumbai',
      'State filter "Maharashtra" matches Mumbai commercial office'
    );

    // ==========================================
    // TEST 4: Property Type filter (single & comma-separated)
    // ==========================================
    const propTypeRes = await testEndpoint(`/api/v1/properties?propertyType=Apartment&keyword=${randomSuffix}`);
    assert(
      propTypeRes.status === 200 &&
      propTypeRes.body.data.total === 2 &&
      propTypeRes.body.data.properties.every((p) => p.propertyType === 'APARTMENT'),
      'Property Type filter "Apartment" matches 2 apartment listings'
    );

    const multiTypeRes = await testEndpoint(`/api/v1/properties?propertyType=Apartment,Villa&keyword=${randomSuffix}`);
    assert(
      multiTypeRes.status === 200 &&
      multiTypeRes.body.data.total === 3,
      'Property Type multi-filter "Apartment,Villa" matches 3 listings'
    );

    // ==========================================
    // TEST 5: Listing Type filter (SALE, RENT, LEASE)
    // ==========================================
    const listingTypeRes = await testEndpoint(`/api/v1/properties?listingType=RENT&keyword=${randomSuffix}`);
    assert(
      listingTypeRes.status === 200 &&
      listingTypeRes.body.data.total === 1 &&
      listingTypeRes.body.data.properties[0].price === 22000,
      'Listing Type filter "RENT" matches rental listing'
    );

    // ==========================================
    // TEST 6: Minimum and Maximum Price range
    // ==========================================
    const priceRangeRes = await testEndpoint(
      `/api/v1/properties?minPrice=2000000&maxPrice=8000000&keyword=${randomSuffix}`
    );
    assert(
      priceRangeRes.status === 200 &&
      priceRangeRes.body.data.total === 2 &&
      priceRangeRes.body.data.properties.every((p) => p.price >= 2000000 && p.price <= 8000000),
      'Price range 20L to 80L matches Apartment (55L) and Plot (32L)'
    );

    // ==========================================
    // TEST 7: Bedrooms & Bathrooms
    // ==========================================
    const bedroomRes = await testEndpoint(`/api/v1/properties?bedrooms=3&keyword=${randomSuffix}`);
    assert(
      bedroomRes.status === 200 &&
      bedroomRes.body.data.total === 2 &&
      bedroomRes.body.data.properties.every((p) => p.bedrooms >= 3),
      'Bedrooms >= 3 filter matches 3BHK Apartment and 4BHK Villa'
    );

    const bathroomRes = await testEndpoint(`/api/v1/properties?bathrooms=5&keyword=${randomSuffix}`);
    assert(
      bathroomRes.status === 200 &&
      bathroomRes.body.data.total === 1 &&
      bathroomRes.body.data.properties[0].propertyType === 'VILLA',
      'Bathrooms >= 5 filter matches Villa'
    );

    // ==========================================
    // TEST 8: Furnishing status & Construction status
    // ==========================================
    const furnishRes = await testEndpoint(
      `/api/v1/properties?furnishingStatus=FULLY_FURNISHED&keyword=${randomSuffix}`
    );
    assert(
      furnishRes.status === 200 &&
      furnishRes.body.data.total === 2 &&
      furnishRes.body.data.properties.every((p) => p.furnishingStatus === 'FULLY_FURNISHED'),
      'Furnishing Status "FULLY_FURNISHED" matches 2 listings'
    );

    const constructRes = await testEndpoint(
      `/api/v1/properties?constructionStatus=UNDER_CONSTRUCTION&keyword=${randomSuffix}`
    );
    assert(
      constructRes.status === 200 &&
      constructRes.body.data.total === 1 &&
      constructRes.body.data.properties[0].propertyType === 'VILLA',
      'Construction Status "UNDER_CONSTRUCTION" matches Villa'
    );

    // ==========================================
    // TEST 9: Area range
    // ==========================================
    const areaRes = await testEndpoint(`/api/v1/properties?minArea=2000&keyword=${randomSuffix}`);
    assert(
      areaRes.status === 200 &&
      areaRes.body.data.total === 2 &&
      areaRes.body.data.properties.every((p) => p.area >= 2000),
      'Min Area >= 2000 matches Villa and Commercial Space'
    );

    // ==========================================
    // TEST 10: Multi-Amenities match
    // ==========================================
    const amenitiesRes = await testEndpoint(
      `/api/v1/properties?amenities=Swimming+Pool,Gym&keyword=${randomSuffix}`
    );
    assert(
      amenitiesRes.status === 200 &&
      amenitiesRes.body.data.total === 2 &&
      amenitiesRes.body.data.properties.every((p) =>
        p.amenities.includes('Swimming Pool') && p.amenities.includes('Gym')
      ),
      'Amenities filter "Swimming Pool,Gym" matches listings having both'
    );

    // ==========================================
    // TEST 11: Complex Combination (from Prompt Example)
    // GET /api/v1/properties?city=Bhopal&propertyType=Apartment&minPrice=2000000&maxPrice=8000000&page=1&limit=12
    // ==========================================
    const complexRes = await testEndpoint(
      `/api/v1/properties?city=Bhopal&propertyType=Apartment&minPrice=2000000&maxPrice=8000000&page=1&limit=12&keyword=${randomSuffix}`
    );
    assert(
      complexRes.status === 200 &&
      complexRes.body.data.total === 1 &&
      complexRes.body.data.page === 1 &&
      complexRes.body.data.limit === 12 &&
      complexRes.body.data.totalPages === 1 &&
      complexRes.body.data.properties[0].title.includes('Lakeview'),
      'Combined query (city=Bhopal&propertyType=Apartment&minPrice=2000000&maxPrice=8000000&page=1&limit=12)'
    );

    // ==========================================
    // TEST 12: Pagination
    // ==========================================
    const page1Res = await testEndpoint(`/api/v1/properties?page=1&limit=2&keyword=${randomSuffix}`);
    const page2Res = await testEndpoint(`/api/v1/properties?page=2&limit=2&keyword=${randomSuffix}`);
    assert(
      page1Res.status === 200 &&
      page2Res.status === 200 &&
      page1Res.body.data.properties.length === 2 &&
      page2Res.body.data.properties.length === 2 &&
      page1Res.body.data.total === 5 &&
      page1Res.body.data.totalPages === 3 &&
      page1Res.body.data.properties[0]._id !== page2Res.body.data.properties[0]._id,
      'Pagination page=1&limit=2 and page=2&limit=2 returns non-overlapping pages'
    );

    // ==========================================
    // TEST 13: Sorting (newest, oldest, price-low-high, price-high-low, most-viewed)
    // ==========================================
    const sortPriceAsc = await testEndpoint(
      `/api/v1/properties?sort=price-low-high&keyword=${randomSuffix}`
    );
    assert(
      sortPriceAsc.status === 200 &&
      sortPriceAsc.body.data.properties[0].price === 22000 &&
      sortPriceAsc.body.data.properties[sortPriceAsc.body.data.properties.length - 1].price === 13500000,
      'Sorting by "price-low-high" sorts prices ascending (22k to 1.35Cr)'
    );

    const sortPriceDesc = await testEndpoint(
      `/api/v1/properties?sort=price-high-low&keyword=${randomSuffix}`
    );
    assert(
      sortPriceDesc.status === 200 &&
      sortPriceDesc.body.data.properties[0].price === 13500000 &&
      sortPriceDesc.body.data.properties[sortPriceDesc.body.data.properties.length - 1].price === 22000,
      'Sorting by "price-high-low" sorts prices descending (1.35Cr to 22k)'
    );

    const sortNewest = await testEndpoint(`/api/v1/properties?sort=newest&keyword=${randomSuffix}`);
    assert(
      sortNewest.status === 200 && sortNewest.body.data.properties.length === 5,
      'Sorting by "newest" executes successfully'
    );

    const sortOldest = await testEndpoint(`/api/v1/properties?sort=oldest&keyword=${randomSuffix}`);
    assert(
      sortOldest.status === 200 && sortOldest.body.data.properties.length === 5,
      'Sorting by "oldest" executes successfully'
    );

    // Increment view on the first property by calling getPropertyBySlug
    const sampleSlug = (await testEndpoint(`/api/v1/properties?keyword=Lakeview+${randomSuffix}`)).body.data.properties[0]?.slug;
    if (sampleSlug) {
      await testEndpoint(`/api/v1/properties/slug/${sampleSlug}`);
      await testEndpoint(`/api/v1/properties/slug/${sampleSlug}`);
    }

    const sortMostViewed = await testEndpoint(`/api/v1/properties?sort=most-viewed&keyword=${randomSuffix}`);
    assert(
      sortMostViewed.status === 200 &&
      sortMostViewed.body.data.properties.length === 5 &&
      sortMostViewed.body.data.properties[0].slug === sampleSlug,
      'Sorting by "most-viewed" returns the most viewed listing first'
    );

    // ==========================================
    // TEST 14: Invalid Query Parameters
    // ==========================================
    console.log('\n--- Testing Invalid Query Parameters (Validation Middleware) ---');

    const invPage = await testEndpoint('/api/v1/properties?page=-1');
    assert(invPage.status === 400 && invPage.body.success === false, 'Negative page rejected with 400 Bad Request');

    const invLimit = await testEndpoint('/api/v1/properties?limit=0');
    assert(invLimit.status === 400 && invLimit.body.success === false, 'Zero limit rejected with 400 Bad Request');

    const invMinPrice = await testEndpoint('/api/v1/properties?minPrice=-100');
    assert(invMinPrice.status === 400 && invMinPrice.body.success === false, 'Negative minPrice rejected with 400');

    const invPriceOrder = await testEndpoint('/api/v1/properties?minPrice=50000&maxPrice=10000');
    assert(invPriceOrder.status === 400 && invPriceOrder.body.success === false, 'minPrice > maxPrice rejected with 400');

    const invType = await testEndpoint('/api/v1/properties?propertyType=Spaceship');
    assert(invType.status === 400 && invType.body.success === false, 'Invalid propertyType rejected with 400');

    const invListing = await testEndpoint('/api/v1/properties?listingType=BARTER');
    assert(invListing.status === 400 && invListing.body.success === false, 'Invalid listingType rejected with 400');

    const invFurnish = await testEndpoint('/api/v1/properties?furnishingStatus=DIAMOND');
    assert(invFurnish.status === 400 && invFurnish.body.success === false, 'Invalid furnishingStatus rejected with 400');

    const invConstruct = await testEndpoint('/api/v1/properties?constructionStatus=DESTROYED');
    assert(invConstruct.status === 400 && invConstruct.body.success === false, 'Invalid constructionStatus rejected with 400');

    const invSort = await testEndpoint('/api/v1/properties?sort=magicOrder');
    assert(invSort.status === 400 && invSort.body.success === false, 'Invalid sort option rejected with 400');

    console.log(`\n======================================================`);
    console.log(`🎉 SEARCH & FILTER RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log(`======================================================\n`);

    process.exit(failedTests > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal Test Execution Error:', error);
    process.exit(1);
  }
};

runSearchSuite();
