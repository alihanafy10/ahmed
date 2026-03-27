import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// All routes are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
