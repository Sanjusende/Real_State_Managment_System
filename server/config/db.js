import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real_estate_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn(`[MongoDB Warning] Please ensure MongoDB is running at ${process.env.MONGODB_URI || 'mongodb://localhost:27017/real_estate_db'}`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB Error]: ${err.message}`);
});

export default connectDB;
