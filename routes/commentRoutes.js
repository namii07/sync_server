import express from "express";
import {
  addComment,
  deleteComment,
  getCommentsByPost,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:postId", protect, getCommentsByPost);
router.delete("/:id", protect, deleteComment);

export default router;
