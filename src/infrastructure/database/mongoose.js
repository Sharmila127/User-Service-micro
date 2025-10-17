import mongoose from 'mongoose';
import pino from 'pino';
const logger = pino();
export const connectDB = async (mongoUri) => {
  try {
    await mongoose.connect(mongoUri);
    logger.info('✅ MongoDB connected (User)');
  } catch (err) {
    logger.error({ err }, '❌ MongoDB connection error (User)');
    throw err;
  }
};
