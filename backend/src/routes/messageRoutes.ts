import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken, getUserById } from '../services/authService';
import { db, Message } from '../config/database';

const router = Router();

// Middleware to verify user access
const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    const user = getUserById(decoded.userId);
    
    if (!user) {
      res.status(403).json({ error: 'User access required' });
      return;
    }
    
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

// Get chat history with another user
router.get('/history/:userId', verifyUser, (req, res) => {
  try {
    const currentUserId = (req as any).user.id;
    const otherUserId = req.params.userId;
    
    // Find private messages between these two users
    const messages = db.messages.filter(message => 
      !message.isDeleted &&
      ((message.senderId === currentUserId && message.receiverId === otherUserId) ||
       (message.senderId === otherUserId && message.receiverId === currentUserId))
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    return res.json({ messages });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get group chat history
router.get('/group-history/:groupId', verifyUser, (req, res) => {
  try {
    const groupId = req.params.groupId;
    
    // Check if user is member of the group
    const group = db.groups.find(g => g.id === groupId);
    if (!group || !group.members.includes((req as any).user.id)) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }
    
    // Find group messages
    const messages = db.messages.filter(message => 
      !message.isDeleted &&
      message.groupId === groupId
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    return res.json({ messages });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Search messages
router.get('/search', verifyUser, (req, res) => {
  try {
    const { query, userId, groupId, messageType, startDate, endDate } = req.query;
    
    let filteredMessages = db.messages.filter(message => !message.isDeleted);
    
    // Filter by query text
    if (query) {
      filteredMessages = filteredMessages.filter(message => 
        message.content.toLowerCase().includes((query as string).toLowerCase())
      );
    }
    
    // Filter by user (for private chat search)
    if (userId) {
      filteredMessages = filteredMessages.filter(message => 
        (message.senderId === (req as any).user.id && message.receiverId === userId) ||
        (message.senderId === userId && message.receiverId === (req as any).user.id)
      );
    }
    
    // Filter by group
    if (groupId) {
      filteredMessages = filteredMessages.filter(message => message.groupId === groupId);
    }
    
    // Filter by message type
    if (messageType) {
      filteredMessages = filteredMessages.filter(message => message.messageType === messageType);
    }
    
    // Filter by date range
    if (startDate) {
      const start = new Date(startDate as string);
      filteredMessages = filteredMessages.filter(message => message.timestamp >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate as string);
      filteredMessages = filteredMessages.filter(message => message.timestamp <= end);
    }
    
    // Sort by timestamp (newest first)
    filteredMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    res.json({ messages: filteredMessages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
