import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global type for Mongoose connection caching
 * Stores connection and promise states
 */
interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare const global: GlobalWithMongoose;

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

/**
 * MongoDB connection utility
 * Implements connection pooling and caching for better performance
 * 
 * Usage:
 * ```typescript
 * await dbConnect();
 * // MongoDB connection is now ready
 * ```
 * 
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 * @throws {Error} If MONGODB_URI is missing or connection fails
 */
async function dbConnect() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (e) {
    global.mongoose.promise = null;
    throw e;
  }

  return global.mongoose.conn;
}

/**
 * MongoDB client promise for NextAuth.js adapter
 * Ensures single connection instance is shared
 */
const clientPromise = (async () => {
  await dbConnect();
  const client = new MongoClient(MONGODB_URI);
  return client.connect();
})();

export { clientPromise };
export default dbConnect; 