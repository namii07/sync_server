import Post from "../models/Post.js";
import User from "../models/User.js";

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar");

    // Add user interaction status
    const postsWithStatus = posts.map(post => ({
      ...post.toObject(),
      isLiked: post.likes?.includes(req.user._id) || false,
      isSaved: req.user.bookmarks?.includes(post._id) || false
    }));

    res.json({ posts: postsWithStatus, page, totalPages: Math.ceil(await Post.countDocuments() / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("author", "username avatar");

    const postsWithStatus = posts.map(post => ({
      ...post.toObject(),
      isLiked: post.likes?.includes(req.user._id) || false,
      isSaved: req.user.bookmarks?.includes(post._id) || false
    }));

    res.json({ posts: postsWithStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      content: content.trim(),
      author: req.user._id,
      image: image || null
    });
    
    await post.save();
    await post.populate("author", "username avatar");
    
    const postWithStatus = {
      ...post.toObject(),
      isLiked: false,
      isSaved: false
    };
    
    res.status(201).json(postWithStatus);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();
    }
    
    res.json({ message: "Post liked", likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    await post.save();
    
    res.json({ message: "Post unliked", likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar");

    const postsWithStatus = posts.map(post => ({
      ...post.toObject(),
      isLiked: post.likes?.includes(req.user._id) || false,
      isSaved: req.user.bookmarks?.includes(post._id) || false
    }));

    res.json({ posts: postsWithStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user.bookmarks.includes(post._id)) {
      user.bookmarks.push(post._id);
      await user.save();
    }

    res.json({ message: "Post saved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsavePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.json({ message: "Post unsaved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.user._id,
      text: text.trim(),
      timestamp: new Date()
    };

    post.comments.push(comment);
    await post.save();
    await post.populate("comments.user", "username avatar");

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};