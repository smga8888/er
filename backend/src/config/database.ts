// Mock database implementation for development
// In production, this would be replaced with a real database like MongoDB or PostgreSQL

export interface User {
  id: string;
  username: string;
  password: string; // hashed
  email: string;
  avatar?: string;
  nickname?: string;
  bio?: string;
  isOnline: boolean;
  isAdmin: boolean;
  isVIP: boolean;
  createdAt: Date;
  lastActive: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string; // for private messages
  groupId?: string; // for group messages
  content: string;
  messageType: 'text' | 'image' | 'video' | 'file' | 'emoji';
  timestamp: Date;
  isDeleted: boolean;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: string[]; // user IDs
  inviteCode?: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface InvitationCode {
  id: string;
  code: string;
  createdBy: string; // admin ID
  createdAt: Date;
  expiresAt?: Date;
  isUsed: boolean;
  usedBy?: string; // user ID
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  details?: string;
}

// In-memory storage
export const db = {
  users: [] as User[],
  messages: [] as Message[],
  groups: [] as Group[],
  invitationCodes: [] as InvitationCode[],
  auditLogs: [] as AuditLog[],
};

// Helper functions for database operations
export const connectDB = () => {
  console.log('Using in-memory database for development');
  
  // Create default admin user for testing
  if (db.users.length === 0) {
    db.users.push({
      id: '1',
      username: 'admin',
      password: '$2a$10$8K1p/a0dURXAm7QiTRqUzuN0/SpuDMaM3V55BvEz9g7IzX0l1Qq3G', // bcrypt hash of 'admin123'
      email: 'admin@example.com',
      isOnline: false,
      isAdmin: true,
      isVIP: true,
      createdAt: new Date(),
      lastActive: new Date(),
    });
    
    // Create default group
    db.groups.push({
      id: '1',
      name: '公共群聊',
      ownerId: '1',
      members: ['1'],
      isPublic: true,
      createdAt: new Date(),
    });
  }
  
  // Log all users for debugging
  console.log('Current users in database:');
  db.users.forEach(user => {
    console.log(`- ID: ${user.id}, Username: ${user.username}, isAdmin: ${user.isAdmin}`);
  });
};
