import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

/* ADD COMMENT */
export const addComment = async (req, res) => {
  const { postId, text } = req.body;

  const comment = await Comment.create({
    post: postId,
    user: req.user._id,
    text,
  });

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  /* 🔔 Notification */
  const post = await Post.findById(postId);
  if (post.author.toString() !== req.user._id.toString()) {
    await Notification.create({
      sender: req.user._id,
      receiver: post.author,
      type: "comment",
      post: postId,
    });
  }

  res.status(201).json(comment);
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (comment.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted" });
};

/* FETCH COMMENTS */
export const getCommentsByPost = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username profileImage")
    .sort({ createdAt: -1 });

  res.json(comments);
};
