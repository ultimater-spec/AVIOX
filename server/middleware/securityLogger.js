import SecurityLog from '../models/SecurityLog.js';

export const logSecurityEvent = async ({
  user = null,
  userModel = 'Admin',
  userEmail = '',
  ip,
  action,
  severity = 'MEDIUM',
  status,
  metadata = {},
}) => {
  try {
    await SecurityLog.create({
      user,
      userModel,
      userEmail,
      ip: ip || 'unknown',
      action,
      severity,
      status,
      metadata,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Failed to write security log:', err.message);
  }
};

export const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};
