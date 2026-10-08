import Program from '../models/Program.js';

export const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: { programs } });
  } catch (error) { next(error); }
};

export const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find().sort({ order: 1 });
    res.json({ success: true, data: { programs } });
  } catch (error) { next(error); }
};

export const createProgram = async (req, res, next) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({ success: true, message: 'Program created.', data: { program } });
  } catch (error) { next(error); }
};

export const updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' });
    res.json({ success: true, message: 'Program updated.', data: { program } });
  } catch (error) { next(error); }
};

export const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found.' });
    res.json({ success: true, message: 'Program deleted.' });
  } catch (error) { next(error); }
};
