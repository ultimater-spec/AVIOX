import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN'],
      default: 'ADMIN',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvalCode: {
      type: String,
      select: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    registrationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.isLocked = function () {
  return this.lockedUntil && this.lockedUntil > Date.now();
};

adminSchema.methods.incrementFailedLogins = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  }
  await this.model('Admin').updateOne(
    { _id: this._id },
    { $set: { failedLoginAttempts: this.failedLoginAttempts, lockedUntil: this.lockedUntil } }
  );
};

adminSchema.methods.resetFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.lockedUntil = undefined;
  this.lastLogin = new Date();
  await this.model('Admin').updateOne(
    { _id: this._id },
    { $set: { failedLoginAttempts: this.failedLoginAttempts, lockedUntil: this.lockedUntil, lastLogin: this.lastLogin } }
  );
};

adminSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.approvalCode;
  return obj;
};

adminSchema.index({ email: 1 });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
