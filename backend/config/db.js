import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL).then(() => console.log("MongoDB Connected"))
}