import express from 'express';
import { body } from 'express-validator';
import {
    createReport,
    getAllReports,
    getReportById,
    updateReportStatus,
    deleteReport,
    getMyReports,
    getNearbyReports
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const reportValidation = [
    body('description').trim().notEmpty().withMessage('Description is required')
];

// Public/User routes
router.post(
    '/',
    protect,
    upload.fields([
        { name: 'media_0', maxCount: 1 },
        { name: 'media_1', maxCount: 1 },
        { name: 'media_2', maxCount: 1 },
        { name: 'media_3', maxCount: 1 },
        { name: 'media_4', maxCount: 1 },
        { name: 'voice', maxCount: 1 },
        { name: 'face_capture', maxCount: 1 }
    ]),
    reportValidation,
    createReport
);

router.get('/my-reports', protect, getMyReports);
router.get('/nearby', protect, getNearbyReports);
router.get('/:id', protect, getReportById);

// Admin routes
router.get('/', protect, authorize('admin'), getAllReports);
router.put('/:id/status', protect, authorize('admin'), updateReportStatus);
router.delete('/:id', protect, authorize('admin'), deleteReport);

export default router;
