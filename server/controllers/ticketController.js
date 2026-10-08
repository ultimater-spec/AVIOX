import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';
import { nanoid } from 'nanoid';

const generateTicketId = () => `TKT-${nanoid(8).toUpperCase()}`;

export const createTicket = async (req, res, next) => {
  try {
    const { subject, category, priority, description } = req.body;
    const ticketId = generateTicketId();

    const ticket = await Ticket.create({
      ticketId,
      user: req.user._id,
      subject,
      category,
      priority: priority || 'MEDIUM',
      description,
      messages: [{
        sender: 'user',
        senderId: req.user._id,
        senderName: req.user.username,
        content: description,
      }],
    });

    // Notify User
    await Notification.create({
      recipient: req.user._id,
      recipientType: 'USER',
      type: 'TICKET_CREATED',
      title: 'Ticket Created',
      message: `Your support ticket #${ticketId} has been successfully created.`,
      relatedTicket: ticket._id,
    });

    // Notify Admin
    await Notification.create({
      recipientType: 'ADMIN',
      type: 'ADMIN_NEW_TICKET',
      title: 'New Support Ticket',
      message: `New ticket #${ticketId} has been raised by ${req.user.username}.\n\nSubject: ${subject}\nPriority: ${priority || 'MEDIUM'}`,
      relatedTicket: ticket._id,
    });

    res.status(201).json({
      success: true,
      message: `Ticket created. Your ticket ID is ${ticketId}`,
      data: { ticket },
    });
  } catch (error) { next(error); }
};

export const getUserTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { tickets } });
  } catch (error) { next(error); }
};

export const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user._id })
      .populate('assignedTo', 'username');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });
    res.json({ success: true, data: { ticket } });
  } catch (error) { next(error); }
};

export const replyToTicket = async (req, res, next) => {
  try {
    const { content } = req.body;
    const isAdmin = !!req.admin;
    const sender = isAdmin ? req.admin : req.user;
    const senderType = isAdmin ? 'admin' : 'user';

    const query = isAdmin ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const ticket = await Ticket.findOne(query);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });

    ticket.messages.push({ sender: senderType, senderId: sender._id, senderName: sender.username, content });
    if (isAdmin && ticket.status === 'OPEN') ticket.status = 'IN_PROGRESS';
    await ticket.save();

    // Notifications
    const preview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    if (isAdmin) {
      await Notification.create({
        recipient: ticket.user,
        recipientType: 'USER',
        type: 'TICKET_REPLY',
        title: 'New Reply',
        message: `Admin replied to your ticket #${ticket.ticketId}.\n\n"${preview}"`,
        relatedTicket: ticket._id,
      });
    } else {
      await Notification.create({
        recipientType: 'ADMIN',
        type: 'USER_TICKET_REPLY',
        title: 'New Ticket Reply',
        message: `${sender.username} replied to ticket #${ticket.ticketId}.\n\n"${preview}"`,
        relatedTicket: ticket._id,
      });
    }

    res.json({ success: true, message: 'Reply added.', data: { ticket } });
  } catch (error) { next(error); }
};

// Admin controllers
export const getAllTickets = async (req, res, next) => {
  try {
    const { status, category, priority, search, page = 1, limit = 100 } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;
    if (priority && priority !== 'All') query.priority = priority;
    
    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('user', 'username email mobile')
      .populate('assignedTo', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Ticket.countDocuments(query);
    res.json({ success: true, data: { tickets, total, page, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status, assignedTo, priority } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });

    let statusChangedTo = null;
    if (status && ticket.status !== status) {
      statusChangedTo = status;
      ticket.status = status;
      if (status === 'RESOLVED') ticket.resolvedAt = new Date();
      if (status === 'CLOSED') ticket.closedAt = new Date();
    }
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (priority) ticket.priority = priority;
    await ticket.save();

    if (statusChangedTo) {
      let msg = `Your ticket #${ticket.ticketId} is now ${statusChangedTo.replace('_', ' ')}.`;
      let type = 'TICKET_STATUS_CHANGED';
      let title = 'Ticket Updated';
      
      if (statusChangedTo === 'IN_PROGRESS') {
        msg = `Your ticket #${ticket.ticketId} is now being reviewed by our support team.`;
      } else if (statusChangedTo === 'RESOLVED') {
        type = 'TICKET_RESOLVED';
        title = 'Ticket Resolved';
        msg = `Your support ticket #${ticket.ticketId} has been marked as resolved.`;
      } else if (statusChangedTo === 'CLOSED') {
        type = 'TICKET_CLOSED';
        title = 'Ticket Closed';
        msg = `Your support ticket #${ticket.ticketId} has been closed.`;
      }

      await Notification.create({
        recipient: ticket.user,
        recipientType: 'USER',
        type,
        title,
        message: msg,
        relatedTicket: ticket._id,
      });
    }

    res.json({ success: true, message: 'Ticket updated.', data: { ticket } });
  } catch (error) { next(error); }
};
