import express from 'express';
import { 
    createSubmission, 
    getSubmissionsByProject, 
    updateSubmissionStatus, 
    getMySubmissions 
} from '../controllers/submissionController.js';
import { protect, supervisor } from '../middleware/authMiddleware.js';
import { upload } from '../utils/uploadSettings.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), createSubmission);
router.get('/my', protect, getMySubmissions);
router.get('/project/:projectId', protect, getSubmissionsByProject);
router.put('/:submissionId/grade', protect, supervisor, updateSubmissionStatus);

export default router;
