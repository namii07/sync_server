import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  drafts: { type: Boolean, default: false },
  comments: [CommentSchema],
  polls: [{ option: String, votes: Number }],
  emojiReactions: [{ emoji: String, users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] }],
}, { timestamps: true });

// Virtual for likes count
PostSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Ensure virtual fields are serialized
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

export default mongoose.model("Post", PostSchema);
