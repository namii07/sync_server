import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./Db/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* ===================== DATABASE ===================== */
connectDB();

/* ===================== ROUTES ===================== */
app.get("/", (req, res) => {
  res.send("SYNC API is running 🚀");
});

app.use("/api/auth", authRoutes);

/* ===================== ERROR HANDLER ===================== */
app.use(errorMiddleware);

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
