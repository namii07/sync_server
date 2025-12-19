import express from "express";
import { signup, login, logoutAll } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.post("/logout-all", authMiddleware, logoutAll);

export default router;
