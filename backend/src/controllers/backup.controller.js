import mongoose from "mongoose";
import Message from "../models/message.model.js";
import { uploadChatBackup } from "../lib/googledrive.js";

export const backupUserMessages = async (req, res) => {
  try {
    // const userId = req.user._id; // ✅ Get userId from authenticated JWT token
    const {userId:userId} = req.params;
    console.log(`🔄 Fetching messages for user: ${userId}...`);

    // ✅ Ensure userId is converted to a MongoDB ObjectId
    const messages = await Message.find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) }
      ]
    }).sort({ createdAt: 1 });

    if (!messages.length) {
      console.warn(`⚠️ No messages found for user ${userId}`);
      return res.status(404).json({ message: "No messages found!" });
    }

    console.log(`📂 Uploading ${messages.length} messages to Google Drive...`);
    const fileId = await uploadChatBackup(messages, userId);

    console.log(`✅ Backup successful! File ID: ${fileId}`);

    res.status(200).json({ message: "Backup successful", fileId });
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    res.status(500).json({ message: "Backup failed", error: error.message });
  }
};
