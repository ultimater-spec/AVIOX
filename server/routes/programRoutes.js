import express from 'express';
import { getPrograms, getAllPrograms, createProgram, updateProgram, deleteProgram } from '../controllers/programController.js';
import { adminProtect, requireRole } from '../middleware/adminAuth.js';

const router = express.Router();
router.get('/', getPrograms);
router.get('/all', adminProtect, getAllPrograms);
router.post('/', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), createProgram);
router.put('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), updateProgram);
router.delete('/:id', adminProtect, requireRole('SUPER_ADMIN', 'ADMIN'), deleteProgram);
export default router;
