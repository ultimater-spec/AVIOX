import jwt from 'jsonwebtoken';

export const generateUserToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const generateAdminToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ADMIN_SECRET, {
    expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '24h',
  });
};

export const verifyUserToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyAdminToken = (token) => {
  return jwt.verify(token, process.env.JWT_ADMIN_SECRET);
};
