
import mongoose from "mongoose";

const databaseConnection = () => {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/twitter_clone";
    
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("✅ Connected to MongoDB successfully!");
            console.log("📊 Database:", mongoURI);
        })
        .catch((error) => {
            console.error("❌ MongoDB connection error:", error);
        });
};

export default databaseConnection;