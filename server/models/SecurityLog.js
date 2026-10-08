import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'userModel',
    },
    userModel: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'Admin',
    },
    userEmail: { type: String, default: '' },
    ip: { type: String, required: true },
    action: { type: String, required: true },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'BLOCKED', 'SUSPICIOUS'],
      required: true,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

securityLogSchema.index({ timestamp: -1 });
securityLogSchema.index({ ip: 1, timestamp: -1 });
securityLogSchema.index({ severity: 1 });

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);
export default SecurityLog;
