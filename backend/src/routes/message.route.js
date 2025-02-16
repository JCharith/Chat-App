import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, deleteMessage } from "../controllers/message.controller.js";
import { backupUserMessages } from "../controllers/backup.controller.js"; // Import backup function

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:userId", protectRoute, deleteMessage);

router.get("/backup/:userId", protectRoute, backupUserMessages);

export default router;
