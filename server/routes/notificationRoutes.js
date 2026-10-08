import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminProtect } from '../middleware/adminAuth.js';
import {
  getUserNotifications,
  getAdminNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

// User routes
router.get('/my', protect, getUserNotifications);
router.patch('/my/:id/read', protect, markAsRead);
router.post('/my/read-all', protect, markAllAsRead);

// Admin routes
router.get('/admin', adminProtect, (req, res, next) => { req.admin = req.admin; next(); }, getAdminNotifications);
router.patch('/admin/:id/read', adminProtect, (req, res, next) => { req.admin = req.admin; next(); }, markAsRead);
router.post('/admin/read-all', adminProtect, (req, res, next) => { req.admin = req.admin; next(); }, markAllAsRead);

export default router;
