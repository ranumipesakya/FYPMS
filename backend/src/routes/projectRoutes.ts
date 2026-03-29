import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  createProject, 
  getAssignedProjects, 
  updateProjectStatus, 
  getStudentProject,
  uploadSubmission,
  getSupervisorSubmissions,
  getStudentSubmissions,
  openOfficeHoursForAll,
  reviewSubmission,
  updateProjectDetails,
  getArchive,
  setAvailability,
  getSupervisorAvailability,
  getSupervisorAvailabilityMe,
  getAvailableSlots,
  bookMeeting
} from '../controllers/projectController.js';
import { protect, supervisor } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({ storage });

router.post('/', protect, createProject);
router.get('/assigned', protect, supervisor, getAssignedProjects);
router.get('/student', protect, getStudentProject);
router.put('/student/details', protect, updateProjectDetails);
router.put('/:id/status', protect, supervisor, updateProjectStatus);
router.post('/submissions/upload', protect, upload.single('file'), uploadSubmission);
router.get('/submissions/supervisor', protect, supervisor, getSupervisorSubmissions);
router.get('/submissions/student', protect, getStudentSubmissions);
router.put('/submissions/:id/review', protect, supervisor, reviewSubmission);
router.get('/archive', getArchive);
router.post('/availability', protect, supervisor, setAvailability);
router.get('/availability/me', protect, supervisor, getSupervisorAvailabilityMe);
router.get('/availability/slots', protect, getAvailableSlots);
router.get('/availability/:id', protect, getSupervisorAvailability);
router.post('/meetings/book', protect, bookMeeting);
router.post('/office-hours/open', protect, supervisor, openOfficeHoursForAll);

export default router;
