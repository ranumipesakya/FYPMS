import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Meeting from '../models/Meeting.js';
import Submission, { SubmissionType, SubmissionVersion } from '../models/Submission.js';
import Availability from '../models/Availability.js';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
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
    ).populate('studentId', 'name studentNumber email');

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
    const project = await Project.findOne({ studentId }).populate('supervisorId', 'name email');
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

    const submissions = await Submission.find({ projectId: { $in: projectIds } })
      .populate('userId', 'name studentNumber email')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getStudentSubmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = (req as any).user?._id;
    const project = await Project.findOne({ studentId }).select('_id');
    if (!project) {
      res.json([]);
      return;
    }

    const submissions = await Submission.find({ projectId: project._id, userId: studentId })
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

    const meetingDate = new Date(date);
    const projects = await Project.find({ supervisorId }).select('_id studentId');
    const projectIds = projects.map((project) => project._id);

    const meetingsToCreate = projects.map((project) => ({
      projectId: project._id,
      studentId: project.studentId,
      supervisorId: new mongoose.Types.ObjectId(supervisorId),
      date: meetingDate,
      time: time || '09:00',
      link: link || '',
      agenda: agenda || 'Office hours'
    }));

    if (meetingsToCreate.length > 0) {
      await Meeting.insertMany(meetingsToCreate);
    }

    res.status(201).json({ message: 'Office hours scheduled', count: meetingsToCreate.length });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const reviewSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisorId = (req as any).user?._id;
    const { id } = req.params;
    const { reviewStatus, feedback } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found' });
      return;
    }

    submission.reviewStatus = reviewStatus;
    submission.feedback = feedback || '';
    await submission.save();

    res.json(submission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProjectDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const { githubLink, demoLink, tags } = req.body;

    const project = await Project.findOne({ studentId: userId });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (githubLink !== undefined) project.githubLink = githubLink;
    if (demoLink !== undefined) project.demoLink = demoLink;
    if (tags !== undefined) project.tags = tags;

    await project.save();
    res.json({ message: 'Updated', project });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getArchive = async (req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await Submission.find({ 
      reviewStatus: 'approved', 
      type: { $in: ['research_abstract', 'poster', 'final_report'] } 
    })
    .populate('userId', 'name degree faculty avatar universityBatch')
    .populate('projectId', 'title tags description githubLink demoLink')
    .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const setAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisorId = (req as any).user?._id;
    const { availability } = req.body;

    await Availability.deleteMany({ supervisorId });
    const created = await Availability.insertMany(
      availability.map((a: any) => ({ ...a, supervisorId }))
    );

    res.json(created);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSupervisorAvailabilityMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisorId = (req as any).user?._id;
    const availability = await Availability.find({ supervisorId });
    res.json(availability);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSupervisorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const availability = await Availability.find({ supervisorId: id, isAvailable: true });
    res.json(availability);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { supervisorId, date } = req.query;
    const meetingDate = new Date(date as string);
    const dayName = meetingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const rules = await Availability.find({ supervisorId, day: dayName, isAvailable: true });
    const bookedMeetings = await Meeting.find({ supervisorId, date: meetingDate });
    const bookedTimes = new Set(bookedMeetings.map(m => m.time));

    const slots: string[] = [];
    rules.forEach(rule => {
      const [startH, startM] = rule.startTime.split(':').map(Number);
      const [endH, endM] = rule.endTime.split(':').map(Number);
      
      let current = new Date(1970, 0, 1, startH, startM);
      const end = new Date(1970, 0, 1, endH, endM);

      while (current < end) {
        const timeStr = current.toTimeString().substring(0, 5);
        if (!bookedTimes.has(timeStr)) slots.push(timeStr);
        current.setMinutes(current.getMinutes() + (rule.slotDuration || 30));
      }
    });

    res.json(slots);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const bookMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = (req as any).user?._id;
    const { supervisorId, date, time, agenda } = req.body;

    const project = await Project.findOne({ studentId, supervisorId });
    if (!project) {
      res.status(403).json({ message: 'No project found with this supervisor' });
      return;
    }

    const meeting = await Meeting.create({
      projectId: project._id,
      studentId,
      supervisorId,
      date: new Date(date),
      time,
      agenda: agenda || 'Student Requested Meeting'
    });

    res.status(201).json(meeting);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
