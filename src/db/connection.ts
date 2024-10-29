import mongoose from "mongoose";
import { env } from "../env";

const DATABASE_URL = env.DATABASE_URL;

export async function connectDB() {
  mongoose
    .connect(DATABASE_URL)
    .then(() => {
      console.log("Promise: MongoDB connected");
    })
    .catch((err) => console.error("Error db connection", err));

  const db = mongoose.connection;

  db.on("open", () => {
    console.log("MongoDB connected");
  });

  db.on("error", () => {
    console.error("MongoDB connection error");
  });

  db.on("disconnect", () => {
    console.log("MongoDB disconnect");
  });
}

// interface MongooseGlobal {
//   conn: mongoose.Connection | null;
//   promise: Promise<mongoose.Connection> | null;
// }

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// let cached = (global as any).mongoose as MongooseGlobal;

// if (!cached) {
//   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// export async function connectDB(): Promise<mongoose.Connection | undefined> {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const options = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose
//       .connect(DATABASE_URL)
//       .then((mongoose) => mongoose.connection);
//   }

//   cached.conn = await cached.promise;

//   return cached.conn;
// }
