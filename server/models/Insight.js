import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Technology', 'Career', 'AI', 'Industry', 'Education', 'Skills', 'Internship'],
      required: true,
    },
    description: { type: String, required: true },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    author: { type: String, default: 'AVIOX Team' },
    readTime: { type: String, default: '5 min read' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

insightSchema.index({ isPublished: 1, publishedAt: -1 });
insightSchema.index({ category: 1 });

const Insight = mongoose.model('Insight', insightSchema);
export default Insight;
