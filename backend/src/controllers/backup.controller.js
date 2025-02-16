import Message from "../models/message.model.js";
import { uploadChatBackup } from "../lib/googledrive.js";

export const backupUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ createdAt: 1 });

    if (!messages.length) {
      return res.status(404).json({ message: "No messages found!" });
    }

    const fileId = await uploadChatBackup(messages, userId);
    res.status(200).json({ message: "Backup successful", fileId });
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    res.status(500).json({ message: "Backup failed", error: error.message });
  }
};
