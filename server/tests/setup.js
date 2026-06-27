import dotenv from "dotenv";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

dotenv.config();

beforeAll(async () => {
  await connectDB();
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});
