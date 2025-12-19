import User from "../models/User.js";

/* GET USER PROFILE */
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
};

/* FOLLOW / UNFOLLOW */
export const toggleFollow = async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!targetUser) return res.status(404).json({ message: "User not found" });

  const isFollowing = currentUser.following.includes(targetUser._id);

  if (isFollowing) {
    currentUser.following.pull(targetUser._id);
    targetUser.followers.pull(currentUser._id);
  } else {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
  }

  await currentUser.save();
  await targetUser.save();

  res.json({ following: !isFollowing });
};

/* SEARCH USERS */
export const searchUsers = async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  const users = await User.find({
    username: { $regex: q, $options: "i" },
  }).select("username avatar bio");

  res.json(users);
};
