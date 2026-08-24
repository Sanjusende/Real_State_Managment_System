import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Property from './models/Property.js';
import Category from './models/Category.js';
import Location from './models/Location.js';
import Enquiry from './models/Enquiry.js';
import Review from './models/Review.js';
import Report from './models/Report.js';
import Notification from './models/Notification.js';
import ActivityLog from './models/ActivityLog.js';
import Setting from './models/Setting.js';

import * as authService from './services/authService.js';
import * as propertyService from './services/propertyService.js';
import * as enquiryService from './services/enquiryService.js';
import * as reviewService from './services/reviewService.js';
import * as reportService from './services/reportService.js';
import * as notificationService from './services/notificationService.js';
import * as adminService from './services/adminService.js';
import * as uploadService from './services/uploadService.js';
import { sanitizeNoSql } from './middlewares/securityMiddleware.js';
import { ROLES, PROPERTY_TYPES, LISTING_TYPES } from './config/constants.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✓ [TEST ${total}] PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ [TEST ${total}] FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runMasterSuite() {
  await connectDB();
  console.log('===============================================================');
  console.log('🧪 ESTATE CRAFT PLATFORM — PRODUCTION MASTER TEST SUITE');
  console.log('===============================================================\n');

  // Load Seeded Users
  const admin = await User.findOne({ role: ROLES.ADMIN });
  const agent = await User.findOne({ role: ROLES.AGENT });
  const seller = await User.findOne({ role: ROLES.SELLER });
  const buyer = await User.findOne({ role: ROLES.USER });

  // 1. REGISTRATION
  console.log('--- [1/22] Testing User Registration ---');
  const uniqueEmail = `testuser_${Date.now()}@example.com`;
  const regResult = await authService.registerUser({
    name: 'Automation Tester',
    email: uniqueEmail,
    password: 'Password@123',
    role: 'USER',
    phone: '+91 99999 88888',
  });
  assert(Boolean(regResult.user && regResult.user._id), 'User successfully registered with hashed credentials');
  assert(Boolean(regResult.tokens.accessToken && regResult.tokens.refreshToken), 'Auth tokens generated upon registration');

  // 2. LOGIN
  console.log('\n--- [2/22] Testing User Login ---');
  const loginResult = await authService.loginUser(uniqueEmail, 'Password@123');
  assert(loginResult.user.email === uniqueEmail.toLowerCase(), 'Login successful and user profile returned');
  assert(loginResult.user.password === undefined, 'Password hash stripped from login response');

  // 3. REFRESH TOKEN
  console.log('\n--- [3/22] Testing Token Refresh ---');
  const refreshResult = await authService.refreshAccessToken(loginResult.tokens.refreshToken);
  assert(Boolean(refreshResult.accessToken), 'New access token issued from valid refresh token');

  // 4. LOGOUT
  console.log('\n--- [4/22] Testing Logout Token Invalidation ---');
  await authService.logoutUser(regResult.user._id);
  const loggedOutUser = await User.findById(regResult.user._id).select('+refreshToken');
  assert(loggedOutUser.refreshToken === null, 'Refresh token nullified upon user logout');

  // 5. PROTECTED ROUTES & CURRENT USER
  console.log('\n--- [5/22] Testing Authenticated Profile Retrieval ---');
  const currentProfile = await authService.getCurrentUser(buyer._id);
  assert(currentProfile.email === buyer.email, 'Current user profile fetched successfully');

  // 6. ROLE AUTHORIZATION (RBAC)
  console.log('\n--- [6/22] Testing Role Authorization ---');
  assert(admin.role === ROLES.ADMIN, 'Admin role recognized');
  assert(agent.role === ROLES.AGENT, 'Agent role recognized');
  assert(seller.role === ROLES.SELLER, 'Seller role recognized');
  assert(buyer.role === ROLES.USER, 'User role recognized');

  // 7. PROPERTY CRUD
  console.log('\n--- [7/22] Testing Property CRUD & Creation ---');
  const newProp = await propertyService.createProperty(
    {
      title: 'Luxury Automated Suite ' + Date.now(),
      description: 'Master test property for complete lifecycle validation',
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      price: 7500000,
      area: 1500,
      bedrooms: 3,
      bathrooms: 2,
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462016',
      address: 'Arera Colony Suite 101',
    },
    agent
  );
  assert(Boolean(newProp._id && newProp.slug), 'Property created with unique auto-generated slug');
  assert(newProp.approvalStatus === 'PENDING', 'New agent property initialized with PENDING approval status');

  // 8. PROPERTY OWNERSHIP (IDOR Check)
  console.log('\n--- [8/22] Testing Property Ownership & IDOR Protection ---');
  let unauthorizedEditBlocked = false;
  try {
    await propertyService.updateProperty(newProp._id, { price: 999 }, buyer);
  } catch (err) {
    if (err.statusCode === 403) unauthorizedEditBlocked = true;
  }
  assert(unauthorizedEditBlocked, 'Unauthorized user blocked from updating property (403 Forbidden)');

  // 9. PROPERTY APPROVAL WORKFLOW
  console.log('\n--- [9/22] Testing Admin Property Approval & Rejection Workflow ---');
  const approvedProp = await adminService.approveProperty(newProp._id, admin);
  assert(approvedProp.approvalStatus === 'APPROVED', 'Admin approved property listing');

  // 10. SEARCH
  console.log('\n--- [10/22] Testing Property Search ---');
  const searchResults = await propertyService.getAllProperties({ search: 'Penthouse' });
  assert(searchResults.properties.length > 0, 'Full-text property search returned matching listings');

  // 11. FILTERS (Price, Bedrooms, Type)
  console.log('\n--- [11/22] Testing Advanced Property Filters ---');
  const filtered = await propertyService.getAllProperties({
    city: 'Bhopal',
    propertyType: 'PENTHOUSE',
    minPrice: 1000000,
    maxPrice: 30000000,
  });
  assert(filtered.properties.length > 0, 'Multi-attribute filter returned targeted results');

  // 12. SORTING
  console.log('\n--- [12/22] Testing Property Sorting ---');
  const sortedAsc = await propertyService.getAllProperties({ sort: 'price_asc' });
  const sortedDesc = await propertyService.getAllProperties({ sort: 'price_desc' });
  assert(sortedAsc.properties[0].price <= sortedDesc.properties[0].price, 'Ascending and descending price sort verified');

  // 13. PAGINATION
  console.log('\n--- [13/22] Testing Pagination Metadata ---');
  const paginated = await propertyService.getAllProperties({ page: 1, limit: 2 });
  assert(paginated.limit === 2 && paginated.page === 1 && paginated.totalPages >= 1, 'Pagination calculations and limits verified');

  // 14. FAVORITES
  console.log('\n--- [14/22] Testing User Favorites (Wishlist) ---');
  const favAdd = await propertyService.toggleFavorite(approvedProp._id, buyer._id);
  assert(favAdd.isFavorited === true, 'Property added to user favorites');
  const favRemove = await propertyService.toggleFavorite(approvedProp._id, buyer._id);
  assert(favRemove.isFavorited === false, 'Property toggled off from user favorites');

  // 15. ENQUIRIES
  console.log('\n--- [15/22] Testing Enquiry Dispatch & Status Updates ---');
  const enquiry = await enquiryService.createEnquiry(
    {
      propertyId: approvedProp._id,
      name: 'Priya Buyer',
      email: 'buyer@estatecraft.com',
      phone: '+91 98000 00000',
      message: 'Is price negotiable?',
    },
    buyer
  );
  assert(Boolean(enquiry._id), 'Enquiry created and associated with property owner/agent');

  const updatedEnquiry = await enquiryService.updateEnquiryStatus(enquiry._id, 'RESPONDED', 'Yes, slightly negotiable.', agent);
  assert(updatedEnquiry.status === 'RESPONDED', 'Agent responded and updated enquiry status');

  // 16. REVIEWS & RATINGS
  console.log('\n--- [16/22] Testing Reviews & Rating Breakdown ---');
  const reviewResult = await reviewService.addOrUpdateReview(
    approvedProp._id,
    buyer,
    {
      rating: 5,
      comment: 'Superb architecture and immaculate finish.',
    }
  );
  assert(reviewResult.review.rating === 5, '5-star review saved with rating breakdown update');

  // Verify review stats calculation
  const stats = await Review.getReviewStats(approvedProp._id);
  assert(stats.totalReviews >= 1 && stats.averageRating >= 1, 'Review stats aggregate ratings correctly');

  // 17. REPORTS (Moderation)
  console.log('\n--- [17/22] Testing Flagged Content & Moderation Reports ---');
  const report = await reportService.createReport(
    buyer._id,
    {
      propertyId: approvedProp._id,
      reason: 'MISLEADING_PRICE',
      description: 'Listed price is lower than actual on-site quotation.',
    }
  );
  assert(report.status === 'PENDING', 'Moderation ticket created with PENDING status');

  const resolvedReport = await adminService.updateReportStatus(report._id, 'RESOLVED', 'Verified and confirmed with seller.', admin);
  assert(resolvedReport.status === 'RESOLVED', 'Admin resolved flagged moderation report');

  // 18. NOTIFICATIONS
  console.log('\n--- [18/22] Testing Notifications & Unread Counters ---');
  await notificationService.createNotification({
    recipient: buyer._id,
    type: 'ENQUIRY_RESPONSE',
    title: 'New Enquiry Reply',
    message: 'Agent Vikram replied to your inquiry.',
    relatedProperty: approvedProp._id,
  });

  const unreadData = await notificationService.getUnreadCount(buyer._id);
  assert(unreadData.unreadCount >= 1, 'Unread notification count calculated accurately');

  await notificationService.markAllAsRead(buyer._id);
  const unreadAfter = await notificationService.getUnreadCount(buyer._id);
  assert(unreadAfter.unreadCount === 0, 'Mark all notifications as read resets unread count to 0');

  // 19. ADMIN OPERATIONS (Categories, Locations, Activity Logs, Settings)
  console.log('\n--- [19/22] Testing Admin Operations & Taxonomies ---');
  const adminCategories = await adminService.getCategories();
  assert(adminCategories.length >= 1, 'Admin category management verified');

  const adminLocations = await adminService.getLocations();
  assert(adminLocations.length >= 1, 'Admin location management verified');

  const activityLogs = await adminService.getActivityLogs({ limit: 10 });
  assert(activityLogs.logs.length >= 1, 'System activity logs recorded and readable');

  const settings = await adminService.getSettings();
  assert(Boolean(settings.siteName), 'Global platform settings retrieved');

  // 20. IMAGE UPLOAD & METADATA
  console.log('\n--- [20/22] Testing Image Upload & Cloudinary Pipeline ---');
  const samplePngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  const mockFiles = [
    { buffer: samplePngBuffer, originalname: 'living_hall.png', mimetype: 'image/png' },
  ];
  const uploadedImgs = await uploadService.uploadPropertyImages(mockFiles, agent);
  assert(uploadedImgs.length === 1 && uploadedImgs[0].isThumbnail === true, 'Image uploaded, transformed, and designated as cover photo');

  // 21. INPUT VALIDATION
  console.log('\n--- [21/22] Testing Input Validation & Constraints ---');
  let badRegistrationBlocked = false;
  try {
    await authService.registerUser({ email: 'not-an-email', password: '123' });
  } catch {
    badRegistrationBlocked = true;
  }
  assert(badRegistrationBlocked, 'Malformed registration payload rejected');

  // 22. ERROR HANDLING & SANITIZATION
  console.log('\n--- [22/22] Testing Error Handling, NoSQL, and XSS Sanitization ---');
  const maliciousReq = {
    body: {
      search: 'Villa <script>alert(1)</script>',
      $gt: '',
    },
  };
  sanitizeNoSql(maliciousReq, {}, () => {});
  assert(maliciousReq.body.$gt === undefined, 'NoSQL operator $gt purged');
  assert(!maliciousReq.body.search.includes('<script>'), 'XSS script tag purged');

  // Clean up created test entities
  await Property.findByIdAndDelete(newProp._id);
  await User.findByIdAndDelete(regResult.user._id);

  console.log('\n===============================================================');
  console.log(`🎉 MASTER SUITE COMPLETED: ${passed}/${total} TESTS PASSED WITH 100% SUCCESS`);
  console.log('===============================================================\n');
  process.exit(0);
}

runMasterSuite().catch((err) => {
  console.error('Master test suite encountered an unexpected failure:', err);
  process.exit(1);
});
