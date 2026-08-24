import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';
import Enquiry from '../models/Enquiry.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Setting from '../models/Setting.js';
import { generateUniquePropertySlug } from '../utils/slugifyProperty.js';
import { ROLES, PROPERTY_TYPES, LISTING_TYPES } from '../config/constants.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting EstateCraft Database Seeding...');

  // 1. Environment-driven Seed Credentials
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@estatecraft.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123456';

  const agentEmail = process.env.SEED_AGENT_EMAIL || 'vikram.agent@estatecraft.com';
  const agentPassword = process.env.SEED_AGENT_PASSWORD || 'Agent@123456';

  const sellerEmail = process.env.SEED_SELLER_EMAIL || 'rajesh.seller@estatecraft.com';
  const sellerPassword = process.env.SEED_SELLER_PASSWORD || 'Seller@123456';

  const userEmail = process.env.SEED_USER_EMAIL || 'priya.buyer@estatecraft.com';
  const userPassword = process.env.SEED_USER_PASSWORD || 'User@123456';

  // 2. Clear Old Records for idempotent clean setup
  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    Category.deleteMany({}),
    Location.deleteMany({}),
    Property.deleteMany({}),
    Enquiry.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({}),
    Setting.deleteMany({}),
  ]);

  // Keep existing user records if any, or upsert seeds
  console.log('👥 Creating / Upserting Platform Users...');
  const salt = await bcrypt.genSalt(10);
  const hashPassword = async (pwd) => bcrypt.hash(pwd, salt);

  const usersData = [
    {
      name: 'EstateCraft Super Admin',
      email: adminEmail.toLowerCase().trim(),
      password: await hashPassword(adminPassword),
      role: ROLES.ADMIN,
      phone: '+91 98000 11111',
      isVerified: true,
      bio: 'Lead platform administrator and operations manager.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Vikram Sharma',
      email: agentEmail.toLowerCase().trim(),
      password: await hashPassword(agentPassword),
      role: ROLES.AGENT,
      agencyName: 'Sharma & Associates Real Estate',
      phone: '+91 98111 22222',
      isVerified: true,
      bio: 'Senior property consultant with 10+ years expertise in luxury residential and commercial hubs.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Rajesh Patel',
      email: sellerEmail.toLowerCase().trim(),
      password: await hashPassword(sellerPassword),
      role: ROLES.SELLER,
      phone: '+91 98222 33333',
      isVerified: true,
      bio: 'Property owner and direct residential landlord.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Priya Verma',
      email: userEmail.toLowerCase().trim(),
      password: await hashPassword(userPassword),
      role: ROLES.USER,
      phone: '+91 98333 44444',
      isVerified: true,
      bio: 'Looking for 3 BHK luxury apartment or independent villa in central Bhopal.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const createdUsers = {};
  for (const u of usersData) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      existing = await User.create(u);
    } else {
      existing.role = u.role;
      existing.isVerified = true;
      existing.password = u.password;
      await existing.save();
    }
    createdUsers[u.role] = existing;
  }
  console.log(`✓ Users created: Admin (${adminEmail}), Agent (${agentEmail}), Seller (${sellerEmail}), User (${userEmail})`);

  // 3. Seed Categories
  console.log('🏷️ Creating Categories...');
  const categoriesData = [
    { name: 'Apartment', icon: 'Building', description: 'Multi-storey luxury flats, studio apartments and gated society condos.' },
    { name: 'Luxury Villa', icon: 'Home', description: 'Independent luxury bungalows, duplexes and gated villa communities.' },
    { name: 'Independent House', icon: 'Store', description: 'Private multi-floor houses with dedicated garden and parking.' },
    { name: 'Commercial Space', icon: 'Briefcase', description: 'Retail shops, showroom spaces, high-street outlets and bank branches.' },
    { name: 'Corporate Office', icon: 'Layers', description: 'Plug-and-play IT workstations, commercial towers and corporate suites.' },
    { name: 'Residential Plot', icon: 'MapPin', description: 'Freehold layout plots in approved town planning schemes.' },
    { name: 'Penthouse', icon: 'Sparkles', description: 'Top-floor sky residences with panoramic views and terrace gardens.' },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const doc = await Category.create({ ...cat, slug, isActive: true });
    createdCategories[cat.name] = doc;
  }
  console.log(`✓ ${categoriesData.length} Categories created.`);

  // 4. Seed Locations
  console.log('📍 Creating Prime Locations...');
  const locationsData = [
    { city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462016', isPopular: true, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', coordinates: { lat: 23.2599, lng: 77.4126 } },
    { city: 'Indore', state: 'Madhya Pradesh', pincode: '452001', isPopular: true, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80', coordinates: { lat: 22.7196, lng: 75.8577 } },
    { city: 'Jabalpur', state: 'Madhya Pradesh', pincode: '482001', isPopular: false, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', coordinates: { lat: 23.1815, lng: 79.9864 } },
    { city: 'Gwalior', state: 'Madhya Pradesh', pincode: '474001', isPopular: false, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', coordinates: { lat: 26.2183, lng: 78.1828 } },
    { city: 'Mumbai', state: 'Maharashtra', pincode: '400001', isPopular: true, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', coordinates: { lat: 18.9220, lng: 72.8347 } },
  ];

  const createdLocations = {};
  for (const loc of locationsData) {
    const doc = await Location.create(loc);
    createdLocations[loc.city] = doc;
  }
  console.log(`✓ ${locationsData.length} Prime Locations created.`);

  // 5. Seed Verified Property Listings
  console.log('🏡 Creating Property Catalog...');
  const propertiesData = [
    {
      title: '3 BHK Lakeview Penthouse in Arera Colony',
      description: 'Exclusive 3 BHK luxury penthouse with private panoramic terrace, Italian marble flooring, imported modular kitchen, 100% power backup, and 2 dedicated underground parking bays.',
      propertyType: 'PENTHOUSE',
      listingType: 'SALE',
      price: 18500000,
      priceUnit: 'INR',
      area: 2800,
      areaUnit: 'sqft',
      bedrooms: 3,
      bathrooms: 3,
      balconies: 2,
      floor: 8,
      totalFloors: 8,
      furnishingStatus: 'FULLY_FURNISHED',
      constructionStatus: 'READY_TO_MOVE',
      address: 'Plot 42, E-7 Arera Colony',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462016',
      amenities: ['Swimming Pool', 'Gym', 'Clubhouse', '24/7 Security', 'Power Backup', 'Lift', 'Parking', 'Private Garden'],
      category: createdCategories['Penthouse']._id,
      location: createdLocations['Bhopal']._id,
      owner: createdUsers[ROLES.SELLER]._id,
      agent: createdUsers[ROLES.AGENT]._id,
      approvalStatus: 'APPROVED',
      isFeatured: true,
      isVerified: true,
      views: 142,
      thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      images: [
        { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80', isThumbnail: true, alt: 'Living Room Panorama', order: 0 },
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', isThumbnail: false, alt: 'Master Bedroom with Balcony', order: 1 },
        { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80', isThumbnail: false, alt: 'Designer Modular Kitchen', order: 2 },
      ],
    },
    {
      title: 'Modern 4 BHK Duplex Villa in Super Corridor',
      description: 'Stunning contemporary 4 BHK villa with double-height ceiling living hall, landscaped backyard garden, EV charging port, solar water heating, and smart home automation.',
      propertyType: 'VILLA',
      listingType: 'SALE',
      price: 24000000,
      priceUnit: 'INR',
      area: 3600,
      areaUnit: 'sqft',
      bedrooms: 4,
      bathrooms: 4,
      balconies: 3,
      floor: 2,
      totalFloors: 2,
      furnishingStatus: 'SEMI_FURNISHED',
      constructionStatus: 'READY_TO_MOVE',
      address: 'Villa 18, Royal Palms, Super Corridor',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      amenities: ['Clubhouse', 'Gym', 'Private Garden', 'Parking', '24/7 Security', 'Intercom Facility', 'Children Play Area'],
      category: createdCategories['Luxury Villa']._id,
      location: createdLocations['Indore']._id,
      owner: createdUsers[ROLES.SELLER]._id,
      agent: createdUsers[ROLES.AGENT]._id,
      approvalStatus: 'APPROVED',
      isFeatured: true,
      isVerified: true,
      views: 98,
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      images: [
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80', isThumbnail: true, alt: 'Villa Front Elevation', order: 0 },
        { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80', isThumbnail: false, alt: 'Spacious Hall', order: 1 },
      ],
    },
    {
      title: '2 BHK Gated Society Apartment near DB Mall',
      description: 'Affordable and well-ventilated 2 BHK apartment in prime MP Nagar zone with quick access to metro, commercial centers, reputed schools, and hospitals.',
      propertyType: 'APARTMENT',
      listingType: 'RENT',
      price: 22000,
      priceUnit: 'INR',
      area: 1150,
      areaUnit: 'sqft',
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      floor: 3,
      totalFloors: 6,
      furnishingStatus: 'SEMI_FURNISHED',
      constructionStatus: 'READY_TO_MOVE',
      address: 'Flat 302, Maple Heights, MP Nagar Zone 1',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462011',
      amenities: ['Lift', 'Parking', '24/7 Security', 'Power Backup'],
      category: createdCategories['Apartment']._id,
      location: createdLocations['Bhopal']._id,
      owner: createdUsers[ROLES.SELLER]._id,
      agent: createdUsers[ROLES.AGENT]._id,
      approvalStatus: 'APPROVED',
      isFeatured: false,
      isVerified: true,
      views: 54,
      thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      images: [
        { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80', isThumbnail: true, alt: 'Apartment Building', order: 0 },
      ],
    },
  ];

  const createdProperties = [];
  for (const p of propertiesData) {
    const slug = await generateUniquePropertySlug(p.title);
    const doc = await Property.create({ ...p, slug });
    createdProperties.push(doc);
  }
  console.log(`✓ ${createdProperties.length} Properties seeded with verified slugs.`);

  // 6. Seed Sample Review
  console.log('⭐ Creating Client Reviews...');
  await Review.create({
    property: createdProperties[0]._id,
    user: createdUsers[ROLES.USER]._id,
    rating: 5,
    comment: 'Exceptional penthouse layout and prime residential corridor. Agent Vikram provided transparent documentation assistance.',
    status: 'APPROVED',
  });

  // 7. Seed Sample Enquiry
  console.log('📩 Creating Prospective Enquiries...');
  await Enquiry.create({
    property: createdProperties[0]._id,
    sender: createdUsers[ROLES.USER]._id,
    recipient: createdUsers[ROLES.AGENT]._id,
    name: 'Priya Verma',
    email: userEmail,
    phone: '+91 98333 44444',
    message: 'Hello, I would like to schedule a site inspection this Saturday at 11 AM.',
    status: 'PENDING',
  });

  // 8. Seed Platform Global Settings
  console.log('⚙️ Creating Platform Settings...');
  await Setting.create({
    key: 'global_platform_settings',
    siteName: 'EstateCraft Real Estate Platform',
    supportEmail: 'support@estatecraft.com',
    supportPhone: '+91 (0755) 456-7890',
    autoApproveVerifiedAgents: true,
    maintenanceMode: false,
    featuredPropertyFee: 4999,
    maxImagesPerListing: 10,
    currencySymbol: '₹',
  });

  console.log('\n====================================================');
  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
  console.log('Admin Account  :', adminEmail, '| Password:', adminPassword);
  console.log('Agent Account  :', agentEmail, '| Password:', agentPassword);
  console.log('Seller Account :', sellerEmail, '| Password:', sellerPassword);
  console.log('User Account   :', userEmail, '| Password:', userPassword);
  console.log('====================================================\n');
};

export default seedDatabase;
