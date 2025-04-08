import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import multer from "multer";
import fs from "fs";

// Multer setup
const storage = multer.diskStorage({});
export const upload = multer({ storage });

// ✅ Send Message (Text & Image Support)
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    let imageUrl = "";

    // Handle image upload if present
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "chat_images",
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path); // Delete local file
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // Save message to DB
    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get All Messages Between Two Users
export const getMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: otherUserId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete All Messages Between Two Users
export const deleteMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId: otherUserId } = req.params;
    const currentUserId = req.user._id;

    const result = await Message.deleteMany({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No messages found to delete" });
    }

    res.status(200).json({ message: "Messages deleted successfully" });
  } catch (err) {
    console.error("Delete Messages Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
