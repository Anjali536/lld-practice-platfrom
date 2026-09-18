import dotenv from "dotenv";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { Problem } from "./models/problem.model.js";
import { SEED_PROBLEMS } from "../seed/seedProblems.js";

// 1. Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // 2. Connect to MongoDB
    await connectDB();

    // Ensure default practice problems exist in database
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      console.log("[Server] Empty database detected. Auto-seeding initial practice challenges...");
      for (const p of SEED_PROBLEMS) {
        await Problem.create(p);
      }
      console.log("[Server] Auto-seed complete: 3 problems created.");
    }

    // 3. Start Express server
    const server = app.listen(PORT, () => {
      console.log(`[Server] LLD Practice Platform Backend running on http://localhost:${PORT}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful termination handling
    const handleShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        await disconnectDB();
        console.log("[Server] Process terminated cleanly.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
  } catch (error) {
    console.error(`[Server] Fatal bootstrap error: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
