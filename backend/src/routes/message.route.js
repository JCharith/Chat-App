import express from "express";
import multer from "multer";
import protectRoute from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage
} from "../controllers/message.controller.js";
import { backupUserMessages } from "../controllers/backup.controller.js";

const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.get("/users", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);

router.delete("/:userId", protectRoute, deleteMessage);

router.get("/backup/:userId", protectRoute, backupUserMessages);

export default router;
