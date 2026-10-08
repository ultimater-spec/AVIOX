import crypto from 'crypto';
import Admin from '../models/Admin.js';
import { generateAdminToken } from '../config/jwt.js';
import { logSecurityEvent, getClientIP } from '../middleware/securityLogger.js';

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = getClientIP(req);

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      await logSecurityEvent({ userEmail: email, ip, action: 'ADMIN_LOGIN_FAILED', severity: 'HIGH', status: 'FAILED', metadata: { reason: 'Admin not found' } });
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (admin.isLocked()) {
      const remaining = Math.ceil((admin.lockedUntil - Date.now()) / 60000);
      await logSecurityEvent({ user: admin._id, userEmail: email, ip, action: 'ADMIN_LOGIN_BLOCKED', severity: 'CRITICAL', status: 'BLOCKED', metadata: { reason: 'Account locked', remainingMinutes: remaining } });
      return res.status(423).json({ success: false, message: `Account locked. Try again in ${remaining} minutes.` });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      await admin.incrementFailedLogins();
      await logSecurityEvent({ user: admin._id, userEmail: email, ip, action: 'ADMIN_LOGIN_FAILED', severity: admin.failedLoginAttempts >= 4 ? 'CRITICAL' : 'HIGH', status: 'FAILED', metadata: { attempts: admin.failedLoginAttempts } });
      return res.status(401).json({ success: false, message: `Invalid credentials. ${5 - admin.failedLoginAttempts} attempts remaining.` });
    }

    if (!admin.isApproved) {
      return res.status(403).json({ success: false, message: 'Admin account pending approval.' });
    }
    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: 'Admin account deactivated.' });
    }

    await admin.resetFailedLogins();
    await logSecurityEvent({ user: admin._id, userEmail: email, ip, action: 'ADMIN_LOGIN_SUCCESS', severity: 'LOW', status: 'SUCCESS' });

    const token = generateAdminToken({ id: admin._id, role: admin.role });
    res.json({ success: true, message: 'Admin login successful.', data: { token, admin: admin.toPublicJSON() } });
  } catch (error) {
    next(error);
  }
};

export const requestAdminRegistration = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email or username already exists.' });
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      role: 'ADMIN',
      isApproved: false,
      registrationStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Registration request submitted. Await approval from a Super Admin.',
      data: { email: admin.email },
    });
  } catch (error) {
    next(error);
  }
};

export const activateAdminAccount = async (req, res, next) => {
  try {
    const { email, approvalCode } = req.body;

    const admin = await Admin.findOne({ email }).select('+approvalCode');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }
    if (admin.approvalCode !== approvalCode) {
      return res.status(400).json({ success: false, message: 'Invalid approval code.' });
    }

    admin.isApproved = true;
    admin.registrationStatus = 'approved';
    admin.approvalCode = undefined;
    await admin.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Account activated. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

export const approveAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });

    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    admin.approvalCode = code;
    admin.approvedBy = req.admin._id;
    await admin.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Approval code generated. Share this code with the admin.',
      data: { approvalCode: code, adminEmail: admin.email },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().populate('approvedBy', 'username email').sort({ createdAt: -1 });
    res.json({ success: true, data: { admins: admins.map(a => a.toPublicJSON()) } });
  } catch (error) {
    next(error);
  }
};

export const deactivateAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    if (admin.role === 'SUPER_ADMIN') return res.status(403).json({ success: false, message: 'Cannot deactivate Super Admin.' });

    admin.isActive = !admin.isActive;
    await admin.save({ validateBeforeSave: false });

    res.json({ success: true, message: `Admin ${admin.isActive ? 'activated' : 'deactivated'}.` });
  } catch (error) {
    next(error);
  }
};
