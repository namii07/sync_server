import Message from "../models/Message.js";

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    text,
  });

  res.status(201).json(message);
};

/* FETCH CONVERSATION */
export const fetchConversation = async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "username avatar");

  res.json(messages);
};

/* DELETE MESSAGE */
export const deleteMessage = async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) return res.status(404).json({ message: "Message not found" });
  if (message.sender.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  message.isDeleted = true;
  await message.save();

  res.json({ success: true });
};
