import express from "express";
import multer from "multer";
import protectRoute from "../middleware/auth.middleware.js";
import { getMessages, sendMessage, deleteMessage } from "../controllers/message.controller.js";
import { getUsersForSidebar } from "../controllers/user.controller.js"; // ✅ FIXED: Correct import
import { backupUserMessages } from "../controllers/backup.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);
router.delete("/:userId", protectRoute, deleteMessage);
router.get("/backup/:userId", protectRoute, backupUserMessages);

export default router;
