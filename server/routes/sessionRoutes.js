import express from 'express';
import { getSessions, getAllSessions, getSession, createSession, updateSession, deleteSession } from '../controllers/sessionController.js';
import { adminProtect, requireRole } from '../middleware/adminAuth.js';

const router = express.Router();
router.get('/', getSessions);
router.get('/all', adminProtect, getAllSessions);
router.get('/:id', getSession);
router.post('/', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), createSession);
router.put('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), updateSession);
router.delete('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), deleteSession);
export default router;
