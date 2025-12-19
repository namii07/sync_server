import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/736x/49/c9/7e/49c97ee312dedb1ec25b978885dbc490.jpg",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 150,
    },
    tokens: [
      {
        token: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
