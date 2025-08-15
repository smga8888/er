import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken, getUserById } from '../services/authService';
import { db, User, Message, Group } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Middleware to verify admin access
const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    const user = getUserById(decoded.userId);
    
    if (!user || !user.isAdmin) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

// Get all users (admin only)
router.get('/users', verifyAdmin, (req, res) => {
  try {
    // Return users without passwords
    const users = db.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID (admin only)
router.get('/users/:id', verifyAdmin, (req, res) => {
  try {
    const user = db.users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update user (admin only)
router.put('/users/:id', verifyAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent updating password through this endpoint
    const { password, ...allowedUpdates } = updates;
    
    // Update user
    db.users[userIndex] = { ...db.users[userIndex], ...allowedUpdates };
    
    const { password: _, ...updatedUser } = db.users[userIndex];
    return res.json({ user: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', verifyAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    
    // Remove user
    db.users = db.users.filter(u => u.id !== userId);
    
    // Remove user's messages
    db.messages = db.messages.filter(m => m.senderId !== userId);
    
    // Remove user from groups
    db.groups.forEach(group => {
      group.members = group.members.filter(memberId => memberId !== userId);
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages (admin only)
router.get('/messages', verifyAdmin, (req, res) => {
  try {
    res.json({ messages: db.messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete message (admin only)
router.delete('/messages/:id', verifyAdmin, (req, res) => {
  try {
    const messageId = req.params.id;
    
    const messageIndex = db.messages.findIndex(m => m.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Mark message as deleted
    db.messages[messageIndex].isDeleted = true;
    
    return res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create group (admin only)
router.post('/groups', verifyAdmin, (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    const newGroup: Group = {
      id: uuidv4(),
      name,
      description,
      ownerId: (req as any).user.id,
      members: [(req as any).user.id],
      isPublic: isPublic || false,
      createdAt: new Date(),
    };
    
    db.groups.push(newGroup);
    
    return res.status(201).json({ group: newGroup });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Generate invitation code (admin only)
router.post('/invitations', verifyAdmin, (req, res) => {
  try {
    const { code } = req.body;
    
    // In a real implementation, we would generate a unique code
    // For now, we'll just create a simple one
    const newInvitation = {
      id: uuidv4(),
      code: code || uuidv4().substring(0, 8).toUpperCase(),
      createdBy: (req as any).user.id,
      createdAt: new Date(),
      isUsed: false,
    };
    
    db.invitationCodes.push(newInvitation);
    
    return res.status(201).json({ invitation: newInvitation });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
