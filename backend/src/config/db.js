import mongoose from "mongoose";

let memoryServer = null;

/**
 * Connects to MongoDB with error handling, timeout guards, and
 * automatic in-memory fallback for zero-config developer evaluation.
 * @param {string} [uri] - Optional custom connection string, defaults to process.env.MONGODB_URI
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    // If local connection failed due to missing local daemon, and in dev/test, use MongoMemoryServer fallback
    const isConnectionRefused =
      error.message?.includes("ECONNREFUSED") ||
      error.name === "MongooseServerSelectionError" ||
      error.message?.includes("connect ECONNREFUSED");

    if (isConnectionRefused && process.env.NODE_ENV !== "production") {
      console.warn(`[MongoDB] Local MongoDB on ${mongoUri} not available. Initializing embedded MongoDB daemon for seamless local execution...`);
      try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        memoryServer = await MongoMemoryServer.create();
        const fallbackUri = memoryServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`[MongoDB] Connected to embedded MongoDB at ${fallbackUri}`);
        return conn;
      } catch (memErr) {
        console.error(`[MongoDB] Embedded MongoDB daemon error: ${memErr.message}`);
        throw error;
      }
    }

    console.error(`[MongoDB] Connection failed: ${error.message}`);
    throw error;
  }
}

/**
 * Disconnects from MongoDB cleanly and stops memory server if active.
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
    console.log("[MongoDB] Disconnected successfully");
  } catch (error) {
    console.error(`[MongoDB] Error disconnecting: ${error.message}`);
  }
}
