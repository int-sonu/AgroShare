import mongoose from "mongoose";
import dotenv from "dotenv";
import { hashPassword } from "../utils/hash.js";
import { User } from "../models/user.model.js";

dotenv.config();

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const existingAdmin = await User.findOne({
      email: "admin@agroshare.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await hashPassword("Admin@123");

    await User.create({
      name: "Super Admin",
      email: "admin@agroshare.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "admin",
       status: "active",
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();