import Opportunity from '../models/Opportunity.js';

export const getOpportunities = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    if (category && category !== 'All') query.category = category;
    const opportunities = await Opportunity.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, data: { opportunities } });
  } catch (error) { next(error); }
};

export const getAllOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find().populate('postedBy', 'username').sort({ createdAt: -1 });
    res.json({ success: true, data: { opportunities } });
  } catch (error) { next(error); }
};

export const createOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.create({ ...req.body, postedBy: req.admin._id });
    res.status(201).json({ success: true, message: 'Opportunity created.', data: { opportunity } });
  } catch (error) { next(error); }
};

export const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    res.json({ success: true, message: 'Opportunity updated.', data: { opportunity } });
  } catch (error) { next(error); }
};

export const deleteOpportunity = async (req, res, next) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Opportunity deleted.' });
  } catch (error) { next(error); }
};
