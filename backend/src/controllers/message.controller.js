import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({});
const upload = multer({ storage });

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    let imageUrl = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "chat_images"
      });
      imageUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};
