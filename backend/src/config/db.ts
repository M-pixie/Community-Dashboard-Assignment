import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ FATAL ERROR: MONGODB_URI is not defined in the environment variables.');
      console.error('Please add MONGODB_URI to your backend/.env file to connect to MongoDB Atlas.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected.');
};
