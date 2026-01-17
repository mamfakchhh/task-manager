import { query } from "./pool.js";

async function cleanup() {
  try {
    console.log("Starting database cleanup...");

    // Clear data (but keep tables)
    await query("TRUNCATE TABLE user_tasks CASCADE");
    console.log("✓ user_tasks cleared");

    await query("TRUNCATE TABLE tasks CASCADE");
    console.log("✓ tasks cleared");

    await query("TRUNCATE TABLE users CASCADE");
    console.log("✓ users cleared");

    console.log("✅ Database cleanup completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    process.exit(1);
  }
}

cleanup();
