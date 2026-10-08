import express from 'express';
import {
  adminLogin,
  requestAdminRegistration,
  activateAdminAccount,
  approveAdmin,
  getAllAdmins,
  deactivateAdmin,
} from '../controllers/adminAuthController.js';
import { adminProtect, requireRole } from '../middleware/adminAuth.js';
import { adminAuthLimiter } from '../middleware/rateLimiter.js';
import {
  getAllUsers, getUserById, toggleUserStatus,
  getSecurityLogs, getDashboardStats,
} from '../controllers/adminController.js';

const router = express.Router();

// Auth
router.post('/auth/login', adminAuthLimiter, adminLogin);
router.post('/auth/register-request', requestAdminRegistration);
router.post('/auth/activate', activateAdminAccount);

// Admin management (Super Admin only)
router.get('/list', adminProtect, requireRole('SUPER_ADMIN'), getAllAdmins);
router.post('/approve/:adminId', adminProtect, requireRole('SUPER_ADMIN'), approveAdmin);
router.patch('/toggle/:adminId', adminProtect, requireRole('SUPER_ADMIN'), deactivateAdmin);

// User management
router.get('/users', adminProtect, getAllUsers);
router.get('/users/:id', adminProtect, getUserById);
router.patch('/users/:id/toggle', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), toggleUserStatus);

// Dashboard + logs
router.get('/dashboard/stats', adminProtect, getDashboardStats);
router.get('/security-logs', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), getSecurityLogs);

export default router;
