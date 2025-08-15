import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db, User, InvitationCode } from '../config/database';
import { saltRounds, jwtSecret } from '../config/config';

// User registration
export const registerUser = async (username: string, password: string, email: string, inviteCode?: string) => {
  // Check if username already exists
  const existingUser = db.users.find(user => user.username === username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Check if email already exists
  const existingEmail = db.users.find(user => user.email === email);
  if (existingEmail) {
    throw new Error('Email already exists');
  }

  // Validate invitation code if required
  if (inviteCode) {
    const invitation = db.invitationCodes.find(code => code.code === inviteCode && !code.isUsed);
    if (!invitation) {
      throw new Error('Invalid or expired invitation code');
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser: User = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    email,
    isOnline: false,
    isAdmin: false,
    isVIP: false,
    createdAt: new Date(),
    lastActive: new Date(),
  };

  db.users.push(newUser);

  // Mark invitation code as used if provided
  if (inviteCode) {
    const invitation = db.invitationCodes.find(code => code.code === inviteCode);
    if (invitation) {
      invitation.isUsed = true;
      invitation.usedBy = newUser.id;
    }
  }

  return newUser;
};

// User login
export const loginUser = async (username: string, password: string) => {
  // Find user by username
  const user = db.users.find(user => user.username === username);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Update last active time
  user.lastActive = new Date();

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      username: user.username, 
      isAdmin: user.isAdmin,
      isVIP: user.isVIP
    }, 
    jwtSecret, 
    { expiresIn: '24h' }
  );

  return { user, token };
};

// Verify JWT token
export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded as { userId: string; username: string; isAdmin: boolean; isVIP: boolean };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Get user by ID
export const getUserById = (userId: string) => {
  return db.users.find(user => user.id === userId);
};

// Update user online status
export const updateUserOnlineStatus = (userId: string, isOnline: boolean) => {
  const user = db.users.find(user => user.id === userId);
  if (user) {
    user.isOnline = isOnline;
    user.lastActive = new Date();
  }
};

// Generate invitation code (admin only)
export const generateInvitationCode = (adminId: string) => {
  const admin = db.users.find(user => user.id === adminId && user.isAdmin);
  if (!admin) {
    throw new Error('Unauthorized');
  }

  const newCode: InvitationCode = {
    id: uuidv4(),
    code: uuidv4().substring(0, 8).toUpperCase(),
    createdBy: adminId,
    createdAt: new Date(),
    isUsed: false,
  };

  db.invitationCodes.push(newCode);

  return newCode;
};
