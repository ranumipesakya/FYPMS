import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedRole = role || 'student';

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long' });
      return;
    }

    if (normalizedRole !== 'student') {
      res.status(403).json({ message: 'Supervisor/Admin accounts are initialized by system. Please login.' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    if (!email.endsWith('@students.nsbm.ac.lk')) {
      res.status(400).json({ message: 'Students must use @students.nsbm.ac.lk email' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
      });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSupervisors = async (req: Request, res: Response): Promise<void> => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('name email');
    res.json(supervisors);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('name email role _id');
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      // Email cannot be changed
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.birthday = req.body.birthday || user.birthday;
      user.nicOrPassport = req.body.nicOrPassport || user.nicOrPassport;
      user.gender = req.body.gender || user.gender;
      user.universityBatch = req.body.universityBatch || user.universityBatch;
      user.degree = req.body.degree || user.degree;
      user.faculty = req.body.faculty || user.faculty;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        birthday: updatedUser.birthday,
        nicOrPassport: updatedUser.nicOrPassport,
        gender: updatedUser.gender,
        universityBatch: updatedUser.universityBatch,
        degree: updatedUser.degree,
        faculty: updatedUser.faculty,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const uploadAvatar = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (user) {
      // Relative URL for serving via static middleware
      const avatarUrl = `/uploads/${req.file.filename}`;
      user.avatar = avatarUrl;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
