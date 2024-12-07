import "express-async-errors";
import express from "express";
import jobRouter from "./Router/jobRouter.js";
import errorHandlerMiddleware from "./Middleware/ErrorHandler.js";
import authRouter from "./Router/authRouter.js";
import cookieParser from "cookie-parser";
import userRouter from "./Router/userRouter.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { connectDB } from "./database/db.js";

const app = express();

//midleware
app.use(cookieParser());
app.use(express.json());

dotenv.config();

// Router
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.use(errorHandlerMiddleware);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(express.static(path.resolve(__dirname, "./client/dist"))); //optional

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

try {
  // mongoose.connect("mongodb+srv://jobtracker:BBBlMdnCSQMBKbFt@cluster0.kioi2eo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  // mongoose.connect("mongodb://127.0.0.1:27017/JonSeeker");
  connectDB();
  app.listen(process.env.PORT || 5100, () => {
    console.log("server running.... 5100");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
