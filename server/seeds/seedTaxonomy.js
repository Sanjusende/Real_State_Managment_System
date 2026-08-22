import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';

const initialCategories = [
  {
    name: 'Apartments & Flats',
    icon: 'Building2',
    description: 'Modern residential units in multi-story apartment complexes and high-rises.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    propertyCount: 18,
  },
  {
    name: 'Luxury Villas',
    icon: 'Home',
    description: 'Standalone luxury homes, estates, and villas with private gardens and amenities.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
    propertyCount: 12,
  },
  {
    name: 'Commercial Offices',
    icon: 'Briefcase',
    description: 'Premium office spaces, IT park suites, and corporate headquarters.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    propertyCount: 8,
  },
  {
    name: 'Residential Plots & Land',
    icon: 'MapPin',
    description: 'Gated community plots, farm land, and investment parcels.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    propertyCount: 6,
  },
  {
    name: 'Penthouses',
    icon: 'Sparkles',
    description: 'Ultra-luxury top-floor residences featuring private terraces and panoramic skyline views.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    propertyCount: 4,
  },
  {
    name: 'Studio Apartments',
    icon: 'Layers',
    description: 'Compact, efficient living spaces perfect for young professionals and students.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    propertyCount: 7,
  },
];

const initialLocations = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    coordinates: { type: 'Point', coordinates: [72.8777, 19.0760] },
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    propertyCount: 34,
  },
  {
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    pincode: '560001',
    coordinates: { type: 'Point', coordinates: [77.5946, 12.9716] },
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    propertyCount: 42,
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    pincode: '110001',
    coordinates: { type: 'Point', coordinates: [77.1025, 28.7041] },
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    propertyCount: 29,
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500001',
    coordinates: { type: 'Point', coordinates: [78.4867, 17.3850] },
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    propertyCount: 21,
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411001',
    coordinates: { type: 'Point', coordinates: [73.8567, 18.5204] },
    image: 'https://images.unsplash.com/photo-1620027878345-d86b8408f655?w=600&auto=format&fit=crop&q=80',
    isPopular: true,
    propertyCount: 15,
  },
];

const seedTaxonomy = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing categories and locations...');
    await Category.deleteMany({});
    await Location.deleteMany({});

    console.log('[Seed] Inserting sample categories...');
    for (const cat of initialCategories) {
      await Category.create(cat);
    }

    console.log('[Seed] Inserting sample locations...');
    for (const loc of initialLocations) {
      await Location.create(loc);
    }

    console.log('[Seed] Taxonomy seeded successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedTaxonomy();
