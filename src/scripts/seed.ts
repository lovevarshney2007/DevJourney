/**
 * Admin seed script
 * Run with: npm run seed
 * Creates the initial admin account in MongoDB
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },
  skills: { type: [String], default: [] },
  totalPoints: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not set. Create a .env.local file.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // Admin credentials — change these before seeding
  const adminData = {
    name: "CCC Admin",
    email: "admin@akgec.ac.in",
    password: "Admin@CCC2025",
    role: "admin",
  };

  const existing = await User.findOne({ email: adminData.email });
  if (existing) {
    console.log(`⚠️  Admin already exists: ${adminData.email}`);
    await mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(adminData.password, salt);

  await User.create({
    ...adminData,
    password: hashedPassword,
  });

  console.log("🎉 Admin account created!");
  console.log(`   Email:    ${adminData.email}`);
  console.log(`   Password: ${adminData.password}`);
  console.log("\n⚠️  Change the admin password after first login!");

  await mongoose.disconnect();
  console.log("✅ Done");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
