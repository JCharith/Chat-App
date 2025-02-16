import express from "express";
import { backupUserMessages } from "../controllers/backup.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/upload", protectRoute, backupUserMessages);

export default router;
