import express from 'express';
import { createTicket, getUserTickets, getTicket, replyToTicket, getAllTickets, updateTicketStatus } from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';
import { adminProtect, requireRole } from '../middleware/adminAuth.js';

const router = express.Router();

// User routes
router.post('/', protect, createTicket);
router.get('/my', protect, getUserTickets);
router.get('/my/:id', protect, getTicket);
router.post('/:id/reply', protect, replyToTicket);

// Admin routes
router.get('/admin/all', adminProtect, getAllTickets);
router.post('/admin/:id/reply', adminProtect, (req, res, next) => { req.admin = req.admin; next(); }, replyToTicket);
router.patch('/admin/:id/status', adminProtect, updateTicketStatus);

export default router;
