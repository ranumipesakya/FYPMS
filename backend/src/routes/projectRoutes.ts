import express from 'express';
import { 
  createProject, 
  getAssignedProjects, 
  updateProjectStatus, 
  getStudentProject 
} from '../controllers/projectController.js';
import { protect, supervisor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/assigned', protect, supervisor, getAssignedProjects);
router.get('/student', protect, getStudentProject);
router.put('/:id/status', protect, supervisor, updateProjectStatus);

export default router;
