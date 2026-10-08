import express from 'express';
import { chat, getKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/aiController.js';
import { adminProtect, requireRole } from '../middleware/adminAuth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
router.post('/chat', aiLimiter, chat);
router.get('/knowledge', adminProtect, getKnowledge);
router.post('/knowledge', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), createKnowledge);
router.put('/knowledge/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), updateKnowledge);
router.delete('/knowledge/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), deleteKnowledge);
export default router;
