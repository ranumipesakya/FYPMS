import type { Request, Response } from 'express';
import Submission, { SubmissionReviewStatus } from '../models/Submission.js';
import Project from '../models/Project.js';

export const createSubmission = async (req: any, res: Response): Promise<void> => {
    try {
        const { projectId, type, version } = req.body;
        
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const project = await Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        const submission = await Submission.create({
            projectId,
            userId: req.user._id,
            type,
            version,
            fileUrl: `/uploads/${req.file.filename}`,
            originalFilename: req.file.originalname,
            reviewStatus: SubmissionReviewStatus.PENDING
        });

        res.status(201).json(submission);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getSubmissionsByProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const submissions = await Submission.find({ projectId: req.params.projectId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSubmissionStatus = async (req: any, res: Response): Promise<void> => {
    try {
        const { status, grade, feedback } = req.body;
        const submission = await Submission.findById(req.params.submissionId);

        if (!submission) {
            res.status(404).json({ message: 'Submission not found' });
            return;
        }

        // Only supervisors can grade
        if (req.user.role !== 'supervisor' && req.user.role !== 'admin') {
            res.status(403).json({ message: 'Not authorized to grade submissions' });
            return;
        }

        submission.reviewStatus = status || submission.reviewStatus;
        submission.grade = grade !== undefined ? grade : submission.grade;
        submission.feedback = feedback || submission.feedback;

        const updatedSubmission = await submission.save();
        res.json(updatedSubmission);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getMySubmissions = async (req: any, res: Response): Promise<void> => {
    try {
        const submissions = await Submission.find({ userId: req.user._id })
            .populate('projectId', 'title')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
