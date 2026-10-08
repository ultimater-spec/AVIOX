import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // If recipient is null, it might be a broadcast or an admin notification.
      // We can use a separate field or specific types for admin notifications.
    },
    recipientType: {
      type: String,
      enum: ['USER', 'ADMIN'],
      required: true,
      default: 'USER',
    },
    type: {
      type: String,
      enum: [
        'TICKET_CREATED',
        'TICKET_REPLY',
        'TICKET_STATUS_CHANGED',
        'TICKET_RESOLVED',
        'TICKET_CLOSED',
        'USER_TICKET_REPLY',
        'ADMIN_NEW_TICKET',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedTicket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes to speed up queries
notificationSchema.index({ recipient: 1, recipientType: 1, createdAt: -1 });
notificationSchema.index({ recipientType: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
