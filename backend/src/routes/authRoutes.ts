import express from 'express';
import { login, register, getSupervisors, getUsers, getProfile, updateProfile, uploadAvatar } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../utils/uploadSettings.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/supervisors', getSupervisors);
router.get('/users', getUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
