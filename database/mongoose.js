const mongoose = require("mongoose");
const { mongoURI } = require("../config.json");

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit process if DB connection fails
  }
}

module.exports = { connectToDatabase };
