import Notification from "../models/Notification.js";

/* GET ALL */
export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    receiver: req.user._id,
  })
    .populate("sender", "username avatar")
    .sort({ createdAt: -1 });

  res.json(notifications);
};

/* MARK READ */
export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });
  res.json({ success: true });
};
