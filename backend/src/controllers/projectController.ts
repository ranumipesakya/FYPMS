import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Meeting from '../models/Meeting.js';
import Submission, { SubmissionType, SubmissionVersion } from '../models/Submission.js';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("AUTH USER:", (req as any).user);

    const { title, description, supervisorId, supervisorEmail, studentNumber } = req.body;
    const studentId = (req as any).user?._id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized user' });
      return;
    }

    if (!title || !description || !(supervisorId || supervisorEmail) || !studentNumber) {
      res.status(400).json({ message: 'Please fill all required fields' });
      return;
    }

    const existingProject = await Project.findOne({ studentId });
    if (existingProject) {
      res.status(400).json({ message: 'You already have a project submitted' });
      return;
    }

    await User.findByIdAndUpdate(studentId, { studentNumber });

    const supervisorLookup = supervisorId ? { _id: supervisorId } : { email: supervisorEmail };
    const supervisor = await User.findOne({ ...supervisorLookup, role: 'supervisor' });

    console.log("Supervisor searched by:", supervisorLookup);
    console.log("Supervisor found:", supervisor);

    if (!supervisor) {
      res.status(400).json({ message: 'Supervisor not found' });
      return;
    }

    const project = await Project.create({
      title,
      description,
      studentId,
      supervisorId: supervisor._id,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error: any) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(400).json({ message: error.message || 'Failed to create project' });
  }
};

export const getAssignedProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisorId = (req as any).user._id;
    const projects = await Project.find({ supervisorId }).populate('studentId', 'name studentNumber email');
    res.json(projects);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProjectStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, feedback } = req.body;
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true }
    );

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getStudentProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = (req as any).user._id;
    const project = await Project.findOne({ studentId }).populate('supervisorId', 'name');
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const { projectId, type, version } = req.body;
    const file = (req as any).file as Express.Multer.File | undefined;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized user' });
      return;
    }

    if (!projectId || !type || !file) {
      res.status(400).json({ message: 'projectId, type and file are required' });
      return;
    }

    if (!Object.values(SubmissionType).includes(type)) {
      res.status(400).json({ message: 'Invalid submission type' });
      return;
    }

    if (version && !Object.values(SubmissionVersion).includes(version)) {
      res.status(400).json({ message: 'Invalid submission version' });
      return;
    }

    const ownedProject = await Project.findOne({ _id: projectId, studentId: userId });
    if (!ownedProject) {
      res.status(403).json({ message: 'You can only upload for your own project' });
      return;
    }

    const submission = await Submission.create({
      projectId,
      userId,
      type,
      version: version || SubmissionVersion.V1,
      fileUrl: `/uploads/${file.filename}`,
      originalFilename: file.originalname
    });

    res.status(201).json({
      message: 'Submission uploaded successfully',
      submission
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSupervisorSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisorId = (req as any).user?._id;

    if (!supervisorId) {
      res.status(401).json({ message: 'Unauthorized user' });
      return;
    }

    const projects = await Project.find({ supervisorId }).select('_id');
    const projectIds = projects.map((project) => project._id);

    if (projectIds.length === 0) {
      res.json([]);
      return;
    }

    const submissions = await Submission.find({ projectId: { $in: projectIds } })
      .populate('userId', 'name studentNumber email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const openOfficeHoursForAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisorId = (req as any).user?._id;
    const { date, time, link, agenda } = req.body;

    if (!supervisorId) {
      res.status(401).json({ message: 'Unauthorized user' });
      return;
    }

    if (!date) {
      res.status(400).json({ message: 'date is required' });
      return;
    }

    const meetingDate = new Date(date);
    if (Number.isNaN(meetingDate.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    const slotTime = time || '09:00';
    const slotLink = link || '';
    const slotAgenda = agenda || 'Office hours';

    const projects = await Project.find({ supervisorId }).select('_id studentId');
    if (projects.length === 0) {
      res.status(404).json({ message: 'No assigned students found' });
      return;
    }

    const projectIds = projects.map((project) => project._id);
    const existingMeetings = await Meeting.find({
      projectId: { $in: projectIds },
      date: meetingDate,
      time: slotTime
    }).select('projectId');

    const existingProjectIds = new Set(existingMeetings.map((meeting) => meeting.projectId.toString()));

    const meetingsToCreate = projects
      .filter((project) => !existingProjectIds.has(project._id.toString()))
      .map((project) => ({
        projectId: project._id,
        studentId: project.studentId,
        supervisorId: new mongoose.Types.ObjectId(supervisorId),
        date: meetingDate,
        time: slotTime,
        link: slotLink,
        agenda: slotAgenda
      }));

    if (meetingsToCreate.length > 0) {
      await Meeting.insertMany(meetingsToCreate);
    }

    res.status(201).json({
      message: 'Office hours scheduling completed',
      created: meetingsToCreate.length,
      skipped: projects.length - meetingsToCreate.length,
      totalStudents: projects.length
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
