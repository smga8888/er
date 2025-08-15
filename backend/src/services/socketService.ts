import { Server, Socket } from 'socket.io';
import { db, Message, Group } from '../config/database';
import { verifyToken, getUserById, updateUserOnlineStatus } from './authService';
import { v4 as uuidv4 } from 'uuid';

// Store active user sockets
const userSockets = new Map<string, string>(); // userId -> socketId

export const initializeSocket = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyToken(token);
      (socket as any).userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    
    // Add user to online users
    userSockets.set(userId, socket.id);
    updateUserOnlineStatus(userId, true);
    
    // Notify all clients about online users update
    io.emit('onlineUsers', getOnlineUsers());

    // Join user to public group
    const publicGroup = db.groups.find(group => group.isPublic);
    if (publicGroup) {
      socket.join(publicGroup.id);
    }

    // Handle private message
    socket.on('privateMessage', (data) => {
      const { recipientId, content, messageType } = data;
      
      // Save message to database
      const newMessage: Message = {
        id: uuidv4(),
        senderId: userId,
        receiverId: recipientId,
        content,
        messageType,
        timestamp: new Date(),
        isDeleted: false,
      };
      
      db.messages.push(newMessage);
      
      // Send message to recipient if online
      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('privateMessage', newMessage);
      }
    });

    // Handle group message
    socket.on('groupMessage', (data) => {
      const { groupId, content, messageType } = data;
      
      // Save message to database
      const newMessage: Message = {
        id: uuidv4(),
        senderId: userId,
        groupId,
        content,
        messageType,
        timestamp: new Date(),
        isDeleted: false,
      };
      
      db.messages.push(newMessage);
      
      // Broadcast message to group
      socket.to(groupId).emit('groupMessage', newMessage);
    });

    // Handle file upload notification
    socket.on('fileUpload', (data) => {
      const { recipientId, groupId, fileType, fileUrl } = data;
      
      // Save file message to database
      const newMessage: Message = {
        id: uuidv4(),
        senderId: userId,
        receiverId: recipientId,
        groupId,
        content: fileUrl,
        messageType: fileType as any,
        timestamp: new Date(),
        isDeleted: false,
      };
      
      db.messages.push(newMessage);
      
      // Send to recipient or group
      if (recipientId) {
        const recipientSocketId = userSockets.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('privateMessage', newMessage);
        }
      } else if (groupId) {
        socket.to(groupId).emit('groupMessage', newMessage);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      userSockets.delete(userId);
      updateUserOnlineStatus(userId, false);
      
      // Notify all clients about online users update
      io.emit('onlineUsers', getOnlineUsers());
    });
  });

  // Helper function to get online users
  const getOnlineUsers = () => {
    return db.users
      .filter(user => user.isOnline)
      .map(user => ({
        id: user.id,
        username: user.username,
        isOnline: user.isOnline,
      }));
  };
};
