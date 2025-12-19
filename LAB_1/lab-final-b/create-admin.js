// Script to create an admin user
// Run with: node create-admin.js

const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const config = require("config");

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.get("db"));
    console.log("Connected to MongoDB...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      // Update to ensure admin role
      existingAdmin.roles = ["admin"];
      await existingAdmin.save();
      console.log("Admin role updated!");
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt);

    const admin = new User({
      name: "Usman Akram",
      email: "admin@admin.com",
      password: hashedPassword,
      roles: ["admin"],
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@admin.com");
    console.log("Password: admin");
    console.log("\nPlease change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();

