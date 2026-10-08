import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
      recipientType: 'USER',
    })
      .populate('relatedTicket', 'ticketId subject status priority')
      .sort({ createdAt: -1 })
      .limit(50);
      
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      recipientType: 'USER',
      isRead: false,
    });

    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
};

export const getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientType: 'ADMIN',
    })
      .populate('relatedTicket', 'ticketId subject status priority')
      .sort({ createdAt: -1 })
      .limit(50);
      
    const unreadCount = await Notification.countDocuments({
      recipientType: 'ADMIN',
      isRead: false,
    });

    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = !!req.admin;
    
    const query = isAdmin
      ? { _id: id, recipientType: 'ADMIN' }
      : { _id: id, recipient: req.user._id, recipientType: 'USER' };

    const notification = await Notification.findOneAndUpdate(query, { isRead: true }, { new: true });
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification marked as read', data: { notification } });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const isAdmin = !!req.admin;
    
    const query = isAdmin
      ? { recipientType: 'ADMIN', isRead: false }
      : { recipient: req.user._id, recipientType: 'USER', isRead: false };

    await Notification.updateMany(query, { isRead: true });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
