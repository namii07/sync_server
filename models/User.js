import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* ================= BASIC AUTH ================= */
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      lowercase: true,
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
      select: false, // never send password in queries
    },

    /* ================= PROFILE ================= */
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

    location: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    /* ================= SOCIAL ================= */
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    /* ================= ACCOUNT ================= */
    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    /* ================= TOKENS ================= */
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: "7d", // auto-expire token docs
        },
      },
    ],
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* ================= VIRTUALS ================= */
// follower count
userSchema.virtual("followersCount").get(function () {
  return this.followers.length;
});

// following count
userSchema.virtual("followingCount").get(function () {
  return this.following.length;
});

/* ================= INDEXES ================= */
// Indexes are already created by unique: true in schema

export default mongoose.model("User", userSchema);
