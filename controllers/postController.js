import Post from "../models/Post.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Feed
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author likes comments.user");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like/Unlike
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const index = post.likes.indexOf(req.user._id);
    if (index === -1) post.likes.push(req.user._id);
    else post.likes.splice(index, 1);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete own Post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });
    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
