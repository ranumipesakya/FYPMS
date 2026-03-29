import express from 'express';
import mongoose from 'mongoose';
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get conversation history between two users (limited for performance)
router.get('/history/:otherId', protect, async (req: any, res) => {
  const { otherId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history.' });
  }
});

// Get all conversations (contacts the user has messaged with)
router.get('/conversations', protect, async (req: any, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  try {
    const conversations = await ChatMessage.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', userId] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: { $sum: 0 } // Potential for future unread message tracking
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contact'
        }
      },
      {
        $unwind: '$contact'
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastMessageTime: 1,
          contactName: '$contact.name',
          contactRole: '$contact.role',
          contactEmail: '$contact.email'
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.json(conversations);
  } catch (err) {
    console.error('Conversations error:', err);
    res.status(500).json({ message: 'Error fetching conversations.' });
  }
});

// Post a message (if socket fails or for simple REST usage)
router.post('/send', protect, async (req: any, res) => {
  const { receiverId, message, projectId } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = new ChatMessage({
      senderId,
      receiverId,
      message,
      projectId
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message.' });
  }
});

// Delete a message
router.delete('/:messageId', protect, async (req: any, res) => {
  try {
    const message = await ChatMessage.findById(req.params.messageId);
    
    if (!message) {
      res.status(404).json({ message: 'Message not found.' });
      return;
    }

    // Only allow sender to delete their message
    if (message.senderId.toString() !== req.user.id) {
       res.status(403).json({ message: 'Unauthorized. You can only delete your own messages.' });
       return;
    }

    await ChatMessage.findByIdAndDelete(req.params.messageId);
    res.json({ message: 'Message deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message.' });
  }
});

export default router;
