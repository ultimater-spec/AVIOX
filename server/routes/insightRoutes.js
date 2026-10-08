import express from 'express';
import { getInsights, getAllInsights, getInsight, createInsight, updateInsight, deleteInsight } from '../controllers/insightController.js';
import { adminProtect, requireRole } from '../middleware/adminAuth.js';

const router = express.Router();
router.get('/', getInsights);
router.get('/all', adminProtect, getAllInsights);
router.get('/:id', getInsight);
router.post('/', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), createInsight);
router.put('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), updateInsight);
router.delete('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), deleteInsight);
export default router;
