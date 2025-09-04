import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testConnection = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/twitter_clone";
        console.log("🔗 Attempting to connect to MongoDB...");
        console.log("📊 URI:", mongoURI);
        
        await mongoose.connect(mongoURI);
        
        console.log("✅ Successfully connected to MongoDB!");
        console.log("📊 Database:", mongoose.connection.name);
        console.log("🌐 Host:", mongoose.connection.host);
        console.log("🚪 Port:", mongoose.connection.port);
        
        // Test creating a collection
        const testCollection = mongoose.connection.collection('test');
        await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
        console.log("✅ Successfully wrote to database!");
        
        // Clean up test data
        await testCollection.deleteOne({ test: 'connection' });
        console.log("🧹 Cleaned up test data");
        
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
        
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.log("\n🔧 Troubleshooting tips:");
        console.log("1. Make sure MongoDB is running");
        console.log("2. Check if the port 27017 is available");
        console.log("3. Verify your .env file exists and has MONGODB_URI");
        console.log("4. Try running: mongod --version");
    }
};

testConnection();

