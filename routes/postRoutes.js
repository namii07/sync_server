import express from "express";
import { createPost, getFeed, likePost, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);
router.put("/:id/like", protect, likePost);
router.delete("/:id", protect, deletePost);

export default router;
