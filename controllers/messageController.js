import Message from "../models/Message.js";
import User from "../models/User.js";

export const getConversations = async (req, res) => {
  try {
    // Get all conversations where user is sender or receiver
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ],
          isDeleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ["$sender", req.user._id] }, { $eq: ["$isRead", false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Populate participant details
    for (let conv of conversations) {
      const otherUserId = conv.lastMessage.sender.toString() === req.user._id.toString() 
        ? conv.lastMessage.receiver 
        : conv.lastMessage.sender;
      
      const user = await User.findById(otherUserId).select("username avatar");
      conv.otherUser = user;
    }

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .limit(50);

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const conversationId = [req.user._id, receiverId].sort().join('_');

    const message = new Message({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content: content.trim()
    });

    await message.save();
    await message.populate("sender", "username avatar");
    await message.populate("receiver", "username avatar");

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const conversationId = [req.user._id, userId].sort().join('_');

    // Check if conversation already exists
    const existingMessage = await Message.findOne({ conversationId });
    
    if (existingMessage) {
      return res.json({ conversationId, exists: true });
    }

    res.json({ conversationId, exists: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    await Message.updateMany(
      { 
        conversationId, 
        receiver: req.user._id, 
        isRead: false 
      },
      { isRead: true }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};