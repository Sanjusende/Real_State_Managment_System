import connectDB from './config/db.js';
import ContactEnquiry from './models/ContactEnquiry.js';
import { validateContact } from './validators/contactValidator.js';
import * as emailService from './services/emailService.js';
import * as whatsappService from './services/whatsappService.js';
import * as contactService from './services/contactService.js';

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

async function runContactTests() {
  console.log('===============================================================');
  console.log('🧪 ESTATE CRAFT PLATFORM — CONTACT FORM & NOTIFICATIONS TEST SUITE');
  console.log('===============================================================\n');

  await connectDB();

  // 1. VALID CONTACT SUBMISSION (VALIDATOR)
  console.log('--- [1/13] Testing Valid Contact Submission Payload ---');
  const validPayload = {
    name: 'Sanjay Sende',
    email: 'sanjaytest@example.com',
    phone: '+919876543210',
    subject: 'Property Enquiry',
    message: 'I am interested in one of your properties in Bhopal.',
  };
  const validResult = validateContact(validPayload);
  assert(validResult.isValid === true && validResult.errors.length === 0, 'Valid payload passes contactValidator');

  // 2. MISSING NAME
  console.log('\n--- [2/13] Testing Missing Name Validation ---');
  const noNameResult = validateContact({ ...validPayload, name: '' });
  assert(
    noNameResult.isValid === false &&
    noNameResult.errors.some((e) => e.field === 'name'),
    'Missing or empty name triggers validation error'
  );

  // 3. INVALID EMAIL
  console.log('\n--- [3/13] Testing Invalid Email Format ---');
  const badEmailResult = validateContact({ ...validPayload, email: 'notanemail' });
  assert(
    badEmailResult.isValid === false &&
    badEmailResult.errors.some((e) => e.field === 'email'),
    'Invalid email format rejected'
  );

  // 4. MISSING PHONE
  console.log('\n--- [4/13] Testing Missing/Invalid Phone Format ---');
  const noPhoneResult = validateContact({ ...validPayload, phone: '' });
  const badPhoneResult = validateContact({ ...validPayload, phone: 'abc' });
  assert(
    noPhoneResult.isValid === false && badPhoneResult.isValid === false,
    'Missing and malformed phone numbers rejected'
  );

  // 5. EMPTY/SHORT MESSAGE
  console.log('\n--- [5/13] Testing Short/Empty Message ---');
  const shortMsgResult = validateContact({ ...validPayload, message: 'Too short' });
  assert(
    shortMsgResult.isValid === false &&
    shortMsgResult.errors.some((e) => e.field === 'message'),
    'Message under 10 characters rejected'
  );

  // 6. MESSAGE OVER 2000 CHARACTERS
  console.log('\n--- [6/13] Testing Message Length Ceiling (> 2000 chars) ---');
  const longMsgResult = validateContact({ ...validPayload, message: 'A'.repeat(2001) });
  assert(
    longMsgResult.isValid === false &&
    longMsgResult.errors.some((e) => e.field === 'message'),
    'Message over 2000 characters rejected'
  );

  // 7. SPAM / HONEYPOT SUBMISSION
  console.log('\n--- [7/13] Testing Anti-Spam Honeypot Field ---');
  const countBeforeSpam = await ContactEnquiry.countDocuments();
  const spamResult = await contactService.createContactEnquiry({
    ...validPayload,
    website: 'https://spambot-link.com',
  });
  const countAfterSpam = await ContactEnquiry.countDocuments();
  assert(
    spamResult.isSpam === true && countAfterSpam === countBeforeSpam,
    'Honeypot trap caught spam submission without saving to MongoDB or notifying admin'
  );

  // 8. EMAIL SERVICE FAILURE RESILIENCE
  console.log('\n--- [8/13] Testing Email Service Safe Error Handling ---');
  const mockEnquiry = {
    _id: '67bcb0000000000000000001',
    name: 'Resilience Test User',
    email: 'test@example.com',
    phone: '+919999999999',
    subject: 'Resilience Test',
    message: 'Testing graceful fallback when SMTP is unconfigured',
  };
  const emailRes = await emailService.sendAdminContactNotification(mockEnquiry);
  assert(
    typeof emailRes === 'object' && ('skipped' in emailRes || 'success' in emailRes),
    'Email service returns structured response without throwing uncaught exceptions'
  );

  // 9. WHATSAPP SERVICE FAILURE RESILIENCE
  console.log('\n--- [9/13] Testing WhatsApp Cloud API Safe Error Handling ---');
  const waRes = await whatsappService.sendWhatsAppNotification(mockEnquiry);
  assert(
    typeof waRes === 'object' && ('skipped' in waRes || 'success' in waRes || 'error' in waRes),
    'WhatsApp service handles unconfigured or API errors safely without throwing'
  );

  // 10. MONGODB PERSISTENCE & INITIAL STATUS
  console.log('\n--- [10/13] Testing MongoDB Persistence and Model Defaults ---');
  const creationResult = await contactService.createContactEnquiry(validPayload);
  assert(Boolean(creationResult.enquiryId), 'Enquiry created and returned valid enquiryId');

  const savedDoc = await ContactEnquiry.findById(creationResult.enquiryId);
  assert(savedDoc !== null, 'Enquiry document found in MongoDB database');
  assert(savedDoc.status === 'new', 'Initial status set to "new" by default');
  assert(savedDoc.email === validPayload.email.toLowerCase(), 'Email normalized to lowercase');
  assert(savedDoc.name === validPayload.name, 'Name preserved accurately');

  // 11. DATABASE INDEX VERIFICATION
  console.log('\n--- [11/13] Testing ContactEnquiry Database Indexes ---');
  const indexes = await ContactEnquiry.collection.indexes();
  const indexKeys = indexes.map((idx) => Object.keys(idx.key)[0]);
  assert(
    indexKeys.includes('email') && indexKeys.includes('status') && indexKeys.includes('createdAt'),
    'Indexes created on email, status, and createdAt fields'
  );

  // 12. SUCCESSFUL FULL END-TO-END SUBMISSION
  console.log('\n--- [12/13] Testing End-to-End Submission Flow with Auto-Reply Logic ---');
  const e2eSubmission = await contactService.createContactEnquiry({
    name: 'Deepika Sharma',
    email: 'deepika@example.com',
    phone: '+91 98234 56789',
    subject: 'Commercial Office Space Inquiry',
    message: 'Looking for 3000 sq ft office space in MP Nagar, Bhopal.',
  });
  assert(Boolean(e2eSubmission.enquiryId), 'Full workflow executed and returned enquiry identifier');

  // 13. DUPLICATE / RAPID SUBMISSIONS
  console.log('\n--- [13/13] Testing Rapid Concurrent Submissions ---');
  const rapidRequests = await Promise.all([
    contactService.createContactEnquiry({
      name: 'User 1',
      email: 'user1@example.com',
      phone: '+919811111111',
      subject: 'Rapid Query 1',
      message: 'Testing concurrent request submission 1',
    }),
    contactService.createContactEnquiry({
      name: 'User 2',
      email: 'user2@example.com',
      phone: '+919822222222',
      subject: 'Rapid Query 2',
      message: 'Testing concurrent request submission 2',
    }),
  ]);
  assert(
    rapidRequests.length === 2 &&
    rapidRequests[0].enquiryId !== rapidRequests[1].enquiryId,
    'Concurrent submissions handled reliably and issued distinct IDs'
  );

  // Clean up created test enquiries
  await ContactEnquiry.deleteMany({
    email: {
      $in: [
        'sanjaytest@example.com',
        'deepika@example.com',
        'user1@example.com',
        'user2@example.com',
      ],
    },
  });

  console.log('\n===============================================================');
  console.log(`🎉 CONTACT TEST SUITE COMPLETED: ${passed}/${total} TESTS PASSED`);
  console.log('===============================================================\n');
  process.exit(0);
}

runContactTests().catch((err) => {
  console.error('Contact test suite encountered an unexpected failure:', err);
  process.exit(1);
});
