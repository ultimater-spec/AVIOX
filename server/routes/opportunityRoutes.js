import express from 'express';
import { getOpportunities, getAllOpportunities, createOpportunity, updateOpportunity, deleteOpportunity } from '../controllers/opportunityController.js';
import { adminProtect, requireRole } from '../middleware/adminAuth.js';

const router = express.Router();
router.get('/', getOpportunities);
router.get('/all', adminProtect, getAllOpportunities);
router.post('/', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), createOpportunity);
router.put('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), updateOpportunity);
router.delete('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), deleteOpportunity);
export default router;
