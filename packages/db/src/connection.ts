import mongoose from "mongoose";

let isConnected = false;

const RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

/**
 * @description Connect to MongoDB via Mongoose with retry logic.
 * Safe to call multiple times — only the first call establishes the connection.
 */
export async function connectDb(uri: string): Promise<typeof mongoose> {
  if (isConnected) return mongoose;

  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const instance = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log(`[DB] Connected to MongoDB (attempt ${attempt})`);
      return instance;
    } catch (error) {
      lastError = error;
      console.warn(
        `[DB] Connection attempt ${attempt}/${RETRY_ATTEMPTS} failed. Retrying in ${RETRY_DELAY_MS / 1000}s...`,
      );
      if (attempt < RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  throw lastError;
}

/**
 * @description Gracefully close the MongoDB connection.
 */
export async function disconnectDb(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

/**
 * @description Return the underlying Mongoose connection.
 * @returns {mongoose.Connection}
 */
export function getMongooseConnection(): mongoose.Connection {
  return mongoose.connection;
}
