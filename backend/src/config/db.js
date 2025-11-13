const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure MongoDB is running or update MONGODB_URI in .env file');
    console.error('If using MongoDB Atlas, update MONGODB_URI with your Atlas connection string');
    console.error('The server will continue but API endpoints will not work without database connection.');
    // Don't exit - let server start but log the error
  }
};

module.exports = connectDB;

