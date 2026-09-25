import mongoose from "mongoose";
import { env } from "./env";

export const connectDb = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`[MongoDB] Connected to database: ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

export const connectDatabase = connectDb;
