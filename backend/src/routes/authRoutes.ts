import express from 'express';
import { login, register, getSupervisors } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/supervisors', getSupervisors);

export default router;
