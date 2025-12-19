import express from "express";
import {
  getPosts,
  getTrendingPosts,
  createPost,
  likePost,
  unlikePost,
  getUserPosts,
  savePost,
  unsavePost,
  deletePost,
  addComment,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getPosts);
router.get("/trending", protect, getTrendingPosts);
router.get("/user/:userId", protect, getUserPosts);
router.post("/", protect, createPost);
router.post("/:id/like", protect, likePost);
router.delete("/:id/like", protect, unlikePost);
router.post("/:id/save", protect, savePost);
router.delete("/:id/save", protect, unsavePost);
router.post("/:id/comments", protect, addComment);
router.delete("/:id", protect, deletePost);

export default router;