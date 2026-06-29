import mongoose from "mongoose";
import { config } from "./config.js";

const DB_NAME = "snitch";

async function connectToDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(`Connected to MongoDB database "${DB_NAME}"`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default connectToDB;
