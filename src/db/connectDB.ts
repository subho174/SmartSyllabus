import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("Please define mongodb uri in env");

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { connection: null, promise: null };

export default async function connectDB() {
  if (cached.connection) {
    console.log("Already connected to DB");
    return cached.connection;
  }
  if (!cached.promise)
    cached.promise = mongoose.connect(MONGODB_URI).then(() => {
      console.log("connected to DB");
      return mongoose.connection;
    });

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    console.log("Failed to connect to DB");
    cached.promise = null;
    throw error;
  }

  return cached.connection;
}
