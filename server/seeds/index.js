import connectDB from '../config/db.js';
import { seedDatabase } from './seedDatabase.js';

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

run();
