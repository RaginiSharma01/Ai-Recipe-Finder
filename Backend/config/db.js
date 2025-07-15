const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("MONGODB_URI is missing. Check your .env file");
    }

    console.log("Connecting to MongoDB with URI:", uri.slice(0, 25) + "..."); // Log partial URI
    await mongoose.connect(uri);
    console.log(" MongoDB Connected");
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;