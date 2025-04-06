const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Successfully connected to MongoDB at host: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("Failed to establish a connection to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
