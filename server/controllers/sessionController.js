import Session from '../models/Session.js';

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ isActive: true, status: { $in: ['upcoming', 'live'] } }).sort({ date: 1 });
    res.json({ success: true, data: { sessions } });
  } catch (error) { next(error); }
};

export const getAllSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json({ success: true, data: { sessions } });
  } catch (error) { next(error); }
};

export const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, data: { session } });
  } catch (error) { next(error); }
};

export const createSession = async (req, res, next) => {
  try {
    const session = await Session.create({ ...req.body, totalSlots: req.body.availableSlots });
    res.status(201).json({ success: true, message: 'Session created.', data: { session } });
  } catch (error) { next(error); }
};

export const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, message: 'Session updated.', data: { session } });
  } catch (error) { next(error); }
};

export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, message: 'Session deleted.' });
  } catch (error) { next(error); }
};
