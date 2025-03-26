import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({});
const upload = multer({ storage });

// ✅ Send Message (Text & Image Support)
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    let imageUrl = null;

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "chat_images",
          resource_type: "auto",
        });
        imageUrl = uploadResult.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl || "",
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get All Messages Between Two Users
export const getMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete All Messages Between Two Users
export const deleteMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.params;
    const currentUserId = req.user._id;

    const deletedMessages = await Message.deleteMany({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    });

    if (deletedMessages.deletedCount === 0) {
      return res.status(404).json({ message: "No messages found to delete" });
    }

    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
  