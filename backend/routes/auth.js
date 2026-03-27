import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('nationalId').matches(/^\d{14}$/).withMessage('National ID must be 14 digits'),
    body('phone').matches(/^(010|011|012|015)\d{8}$/).withMessage('Invalid Egyptian phone number'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('birthDate').isISO8601().withMessage('Invalid birth date'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('governorate').trim().notEmpty().withMessage('Governorate is required')
];

const loginValidation = [
    body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
