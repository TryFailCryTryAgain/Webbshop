import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI|| "";// Replace with your MongoDB URI

let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to MongoDB using Mongoose
  await mongoose.connect(uri as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  // Cache the connection
  cachedDb = mongoose.connection;

  // Log connection status
  cachedDb.on('connected', () => {
    console.log('Connected to MongoDB');
  });

  cachedDb.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  return cachedDb;
}