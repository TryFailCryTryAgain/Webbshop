import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || "";

let cachedDb: mongoose.Connection | null = null;

async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cachedDb) {
    return cachedDb;
  }

  await mongoose.connect(uri as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  cachedDb = mongoose.connection;

  cachedDb.on('connected', () => {
    console.log('Connected to MongoDB');
  });

  cachedDb.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  return cachedDb;
}

export default {
  connectToDatabase
};