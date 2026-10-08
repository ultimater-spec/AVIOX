import mongoose from 'mongoose';

const aiKnowledgeSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true },
    keywords: [{ type: String, lowercase: true, trim: true }],
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['About', 'Programs', 'Sessions', 'Booking', 'Career', 'Internships', 'Jobs', 'FAQs', 'Contact', 'Platform', 'Policies'],
      required: true,
    },
    actionButtons: [
      {
        label: { type: String },
        action: { type: String },
        url: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

aiKnowledgeSchema.index({ keywords: 1 });
aiKnowledgeSchema.index({ category: 1 });

const AIKnowledge = mongoose.model('AIKnowledge', aiKnowledgeSchema);
export default AIKnowledge;
