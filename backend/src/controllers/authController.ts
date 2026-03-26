import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters long' });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Role-specific email validation
    if (role === 'student' && !email.endsWith('@students.nsbm.ac.lk')) {
      res.status(400).json({ message: 'Students must use @students.nsbm.ac.lk email' });
      return;
    }
    if (role === 'supervisor' && !email.endsWith('@lecturer.nsbm.ac.lk')) {
      res.status(400).json({ message: 'Supervisors must use @lecturer.nsbm.ac.lk email' });
      return;
    }
    if (role === 'admin' && !email.endsWith('@nsbm.ac.lk')) {
      res.status(400).json({ message: 'Admin must use @nsbm.ac.lk email' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role
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
