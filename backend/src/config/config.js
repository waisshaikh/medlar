import dotenv from "dotenv";
dotenv.config();

export const config = {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/medlar",
  JWT_SECRET: process.env.JWT_SECRET || "medlar_jwt_secret_dev",
  Client_ID: process.env.GOOGLE_CLIENT_ID || "",
  Client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || "",
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY || "",
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  BACKEND_ORIGIN: process.env.BACKEND_ORIGIN || "http://localhost:5000",
};
