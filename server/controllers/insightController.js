import Insight from '../models/Insight.js';

export const getInsights = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category && category !== 'All') query.category = category;
    const insights = await Insight.find(query).sort({ isFeatured: -1, publishedAt: -1 }).limit(12);
    res.json({ success: true, data: { insights } });
  } catch (error) { next(error); }
};

export const getAllInsights = async (req, res, next) => {
  try {
    const insights = await Insight.find().populate('postedBy', 'username').sort({ createdAt: -1 });
    res.json({ success: true, data: { insights } });
  } catch (error) { next(error); }
};

export const getInsight = async (req, res, next) => {
  try {
    const insight = await Insight.findById(req.params.id);
    if (!insight) return res.status(404).json({ success: false, message: 'Insight not found.' });
    res.json({ success: true, data: { insight } });
  } catch (error) { next(error); }
};

export const createInsight = async (req, res, next) => {
  try {
    const insight = await Insight.create({ ...req.body, postedBy: req.admin._id });
    res.status(201).json({ success: true, message: 'Insight created.', data: { insight } });
  } catch (error) { next(error); }
};

export const updateInsight = async (req, res, next) => {
  try {
    const insight = await Insight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!insight) return res.status(404).json({ success: false, message: 'Insight not found.' });
    res.json({ success: true, message: 'Insight updated.', data: { insight } });
  } catch (error) { next(error); }
};

export const deleteInsight = async (req, res, next) => {
  try {
    await Insight.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Insight deleted.' });
  } catch (error) { next(error); }
};
