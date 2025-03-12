import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // ✅ Handle disconnections & auto-reconnect
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Reconnecting...");
      setTimeout(connectDB, 5000); // Retry connection after 5 seconds
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Connection Error:", err);
      setTimeout(connectDB, 5000); // Retry connection on error
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds if failed
  }
};
