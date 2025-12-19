import express from "express";
import {
  getUserProfile,
  toggleFollow,
  searchUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserProfile);
router.put("/follow/:id", protect, toggleFollow);

export default router;
