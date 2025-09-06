import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";

dotenv.config()

// Temporary fix for environment variables
if (!process.env.PORT) process.env.PORT = '5000';
if (!process.env.TOKEN_SECRET) process.env.TOKEN_SECRET = 'twitter_clone_jwt_secret_key_2024_very_secure_random_string_123456789abcdef';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/twitter_clone';
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

databaseConnection();
const app = express(); 

// middlewares
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:"http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions));

// api
app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet", tweetRoute);
 

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server listen at port ${process.env.PORT}`);
})