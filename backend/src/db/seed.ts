import { query } from "./pool.js";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Hash team passwords
    const adminPasswordHash = await bcrypt.hash("MR@MCC26", 10);
    const user1PasswordHash = await bcrypt.hash("NL@MCC26", 10);
    const user2PasswordHash = await bcrypt.hash("HF@MCC26", 10);
    const user3PasswordHash = await bcrypt.hash("WW@MCC26", 10);

    // Check if users already exist
    const usersCheck = await query("SELECT COUNT(*) FROM users");
    if (usersCheck.rows[0].count > 0) {
      console.log("ℹ️  Users already exist, skipping user seeding");
    } else {
      // Insert team users
      await query(
        `INSERT INTO users (username, password_hash, role) VALUES
        ($1, $2, $3),
        ($4, $5, $6),
        ($7, $8, $9),
        ($10, $11, $12)`,
        [
          "Mohammed Rhazal",
          adminPasswordHash,
          "MANAGER",
          "Naoufal Laamouri",
          user1PasswordHash,
          "USER",
          "Houda Fariana",
          user2PasswordHash,
          "USER",
          "Wissal",
          user3PasswordHash,
          "USER",
        ],
      );
      console.log("✓ Team users created");
    }

    // Check if tasks already exist
    const tasksCheck = await query("SELECT COUNT(*) FROM tasks");
    if (tasksCheck.rows[0].count > 0) {
      console.log("ℹ️  Tasks already exist, skipping task seeding");
    } else {
      // Insert default tasks
      await query(
        `INSERT INTO tasks (designation) VALUES
        ($1),
        ($2),
        ($3),
        ($4),
        ($5)`,
        [
          "Vérifier la calibration des instruments",
          "Analyser les résultats de test",
          "Rédiger le rapport technique",
          "Valider la conformité ISO",
          "Former l'équipe aux nouveaux équipements",
        ],
      );
      console.log("✓ Default tasks created");
    }

    console.log("✅ Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
