export interface User {
    id: string;
    username: string;
    password: string;
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
    receiverId?: string;
    groupId?: string;
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
    members: string[];
    inviteCode?: string;
    isPublic: boolean;
    createdAt: Date;
}
export interface InvitationCode {
    id: string;
    code: string;
    createdBy: string;
    createdAt: Date;
    expiresAt?: Date;
    isUsed: boolean;
    usedBy?: string;
}
export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    resource: string;
    timestamp: Date;
    details?: string;
}
export declare const db: {
    users: User[];
    messages: Message[];
    groups: Group[];
    invitationCodes: InvitationCode[];
    auditLogs: AuditLog[];
};
export declare const connectDB: () => void;
//# sourceMappingURL=database.d.ts.map