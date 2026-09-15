import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../lib/turso";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import crypto from "crypto";

async function seed() {
  console.log("Seeding database...");

  // 1. Create schema
  const schemaSql = fs.readFileSync(path.join(process.cwd(), "schema.sql"), "utf-8");
  const statements = schemaSql.split(";").filter((stmt) => stmt.trim() !== "");
  
  for (const stmt of statements) {
    await db.execute(stmt);
  }
  console.log("Schema created.");

  // 2. Insert admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  // Check if admin exists
  const existingAdmin = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [adminEmail]
  });

  if (existingAdmin.rows.length === 0) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = crypto.randomUUID();
    await db.execute({
      sql: "INSERT INTO users (id, name, email, password_hash, role, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [userId, "Admin", adminEmail, hashedPassword, "admin", 1, new Date().toISOString()]
    });
    console.log(`Admin user created with email: ${adminEmail}`);
  } else {
    console.log(`Admin user with email ${adminEmail} already exists.`);
  }
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
