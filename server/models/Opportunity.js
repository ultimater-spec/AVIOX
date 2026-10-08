import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, default: '' },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Internship', 'Job', 'Workshop', 'Industry Program', 'Career Opportunity'],
      required: true,
    },
    location: { type: String, default: 'Remote' },
    deadline: { type: Date },
    applyLink: { type: String, default: '' },
    stipend: { type: String, default: '' },
    duration: { type: String, default: '' },
    skills: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

opportunitySchema.index({ category: 1, isActive: 1 });
opportunitySchema.index({ deadline: 1 });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
