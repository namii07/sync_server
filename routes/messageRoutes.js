import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
  markAsRead,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:conversationId", protect, getMessages);
router.post("/send/:receiverId", protect, sendMessage);
router.post("/conversations", protect, createConversation);
router.put("/:conversationId/read", protect, markAsRead);

export default router;