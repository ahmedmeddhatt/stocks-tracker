import mongoose from "mongoose";
import config from "../config";

export async function connectDB(uri?: string) {
  const mongoUri = uri ?? config.mongoUri;
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected to", mongoUri);
}
