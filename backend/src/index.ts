import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import ChatMessage from './models/ChatMessage.js';
import User from './models/User.js';
import { sendChatNotification } from './utils/mailer.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan('dev'));

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log('📁 Serving uploads from:', uploadsDir);

// Serve uploaded files publicly
app.use('/uploads', express.static(uploadsDir));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fypms')
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Socket.io Real-time Logic
io.on('connection', (socket) => {
  console.log('👤 A user connected:', socket.id);

  socket.on('join_chat', (roomId) => {
    socket.join(roomId);
    console.log(`💬 User joined room: ${roomId}`);
  });

  socket.on('join_personal', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User joined personal room: user_${userId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, message, projectId, roomId } = data;
      
      const newMessage = new ChatMessage({
        senderId,
        receiverId,
        message,
        projectId: mongoose.Types.ObjectId.isValid(projectId) ? projectId : undefined
      });
      await newMessage.save();

      const messageWithMeta = {
        ...data,
        _id: newMessage._id,
        createdAt: (newMessage as any).createdAt
      };

      // 1. Emit to the specific chat room
      io.to(roomId).emit('receive_message', messageWithMeta);

      // 2. Emit to the receiver's personal room (for sidebar updates/notifications)
      io.to(`user_${receiverId}`).emit('receive_message_global', messageWithMeta);
      
      // 3. Emit to the sender's personal room (for updating other tabs/devices)
      io.to(`user_${senderId}`).emit('receive_message_global', messageWithMeta);

      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);
      if (receiver && sender) {
        await sendChatNotification(receiver.email, sender.name, message);
      }
    } catch (err) {
      console.error('💬 Socket Error:', err);
    }
  });

  socket.on('delete_message', (data: { messageId: string, roomId: string, receiverId: string }) => {
    // Notify the room to remove the message from the active window
    io.to(data.roomId).emit('message_deleted', data.messageId);
    
    // Notify the receiver's personal room to potentially update sidebar/notifications
    io.to(`user_${data.receiverId}`).emit('message_deleted_global', data.messageId);
    
    console.log(`🗑️ Message deleted: ${data.messageId}`);
  });

  socket.on('disconnect', () => {
    console.log('👋 A user disconnected');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (_req, res) => {
  res.send('FYPMS API is running...');
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
