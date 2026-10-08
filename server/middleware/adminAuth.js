import { verifyAdminToken } from '../config/jwt.js';
import Admin from '../models/Admin.js';

export const adminProtect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin access denied. No token.' });
    }
    const decoded = verifyAdminToken(token);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin not found.' });
    }
    if (!admin.isApproved || !admin.isActive) {
      return res.status(403).json({ success: false, message: 'Admin account not approved or deactivated.' });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin token.' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin?.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
};
