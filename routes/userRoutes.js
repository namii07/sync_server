import express from "express";
import {
  getCurrentUser,
  getProfile,
  updateProfile,
  getSuggestedUsers,
  searchUsers,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);
router.get("/profile/:username", protect, getProfile);
router.get("/suggested", protect, getSuggestedUsers);
router.get("/search", protect, searchUsers);
router.post("/:userId/follow", protect, followUser);
router.delete("/:userId/follow", protect, unfollowUser);

export default router;