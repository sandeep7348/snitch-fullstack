import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment files")
}

export const config = {
  MONGO_URI,
};
