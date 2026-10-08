import User from '../models/User.js';
import SecurityLog from '../models/SecurityLog.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { $or: [{ username: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.json({ success: true, data: { users, total, page, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: { user } });
  } catch (error) { next(error); }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.` });
  } catch (error) { next(error); }
};

export const getSecurityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, severity } = req.query;
    const query = severity ? { severity } : {};
    const logs = await SecurityLog.find(query).sort({ timestamp: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await SecurityLog.countDocuments(query);
    res.json({ success: true, data: { logs, total } });
  } catch (error) { next(error); }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [users, sessions, tickets, opportunities] = await Promise.all([
      User.countDocuments(),
      (await import('../models/Session.js')).default.countDocuments(),
      (await import('../models/Ticket.js')).default.countDocuments(),
      (await import('../models/Opportunity.js')).default.countDocuments({ isActive: true }),
    ]);
    const openTickets = await (await import('../models/Ticket.js')).default.countDocuments({ status: 'OPEN' });
    res.json({ success: true, data: { stats: { users, sessions, tickets, openTickets, opportunities } } });
  } catch (error) { next(error); }
};
