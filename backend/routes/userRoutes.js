import express from 'express';
import { createUser, addProfileToUser, getAllUsers, getUserById, getUserProfiles, updateUser, deleteUser } from '../controller/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/signup', createUser);
router.post('/profile', protect, addProfileToUser);
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, getUserById);
router.get('/:id/profiles', protect, getUserProfiles);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
