import mongoose from "mongoose";
import { config } from "./config.js";

const DB_NAME = "snitch";

async function connectToDB() {
  try {
    await mongoose.connect(config.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log(`Connected to MongoDB database "${DB_NAME}"`);
  } catch (error) {
    console.warn(`MongoDB connection failed (${error.message}). Serving live catalog with Mock Data Fallback.`);
  }
}

export default connectToDB;
