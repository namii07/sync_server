import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ 
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        joinDate: user.createdAt,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = req.user.following.includes(user._id);
    
    res.json({ 
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        joinDate: user.createdAt,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0
      },
      isFollowing 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, location, website } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, location, website },
      { new: true }
    );
    
    res.json({ 
      user: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        joinDate: user.createdAt,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      _id: { $ne: req.user._id }
    })
    .limit(5)
    .select("username avatar bio followers");
    
    const usersWithStats = users.map(user => ({
      ...user.toObject(),
      followersCount: user.followers?.length || 0,
      isFollowing: req.user.following?.includes(user._id) || false
    }));
    
    res.json({ users: usersWithStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { username: { $regex: q.trim(), $options: "i" } },
            { bio: { $regex: q.trim(), $options: "i" } }
          ]
        }
      ]
    })
    .limit(10)
    .select("username avatar bio followers");
    
    const usersWithStats = users.map(user => ({
      ...user.toObject(),
      followersCount: user.followers?.length || 0,
      isFollowing: req.user.following?.includes(user._id) || false
    }));
    
    res.json({ users: usersWithStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!req.user.following.includes(userId)) {
      req.user.following.push(userId);
      await req.user.save();
      
      await User.findByIdAndUpdate(userId, {
        $push: { followers: req.user._id }
      });
    }
    
    res.json({ 
      message: "User followed",
      followersCount: userToFollow.followers.length + 1
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user.following = req.user.following.filter(id => id.toString() !== userId);
    await req.user.save();
    
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user._id }
    });
    
    res.json({ 
      message: "User unfollowed",
      followersCount: Math.max(0, userToUnfollow.followers.length - 1)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};