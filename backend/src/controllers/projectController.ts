import type { Request, Response } from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, supervisorEmail } = req.body;
    const studentId = (req as any).user._id;

    // Resolve supervisor by email
    const supervisor = await User.findOne({ email: supervisorEmail });

    const project = await Project.create({
      title,
      description,
      studentId,
      supervisorId: supervisor?._id,
      status: 'pending'
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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
