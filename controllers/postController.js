import Post from "../models/Post.js";

/* TRENDING POSTS */
export const getTrendingPosts = async (req, res) => {
  const posts = await Post.find({ isDraft: false })
    .sort({ likes: -1 })
    .limit(12)
    .populate("author", "username avatar");

  res.json(posts);
};

/* RECENT POSTS */
export const getRecentPosts = async (req, res) => {
  const posts = await Post.find({ isDraft: false })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("author", "username avatar");

  res.json(posts);
};
