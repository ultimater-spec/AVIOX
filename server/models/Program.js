import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    icon: { type: String, default: '' },
    category: { type: String, default: 'Technology' },
    duration: { type: String, default: '' },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    skills: [{ type: String }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Program = mongoose.model('Program', programSchema);
export default Program;
