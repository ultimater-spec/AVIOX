import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    availableSlots: { type: Number, required: true, min: 0 },
    totalSlots: { type: Number, required: true },
    instructor: { type: String, required: true },
    instructorTitle: { type: String, default: '' },
    category: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

sessionSchema.index({ date: 1, status: 1 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
