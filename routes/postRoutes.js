import express from "express";
import {
  getTrendingPosts,
  getRecentPosts,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/trending", protect, getTrendingPosts);
router.get("/recent", protect, getRecentPosts);

export default router;
