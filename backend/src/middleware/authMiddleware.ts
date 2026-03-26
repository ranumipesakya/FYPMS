import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import type { Request, Response, NextFunction } from 'express';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      (req as any).user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export const supervisor = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'supervisor') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a supervisor' });
  }
};
