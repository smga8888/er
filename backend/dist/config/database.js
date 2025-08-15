"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
exports.db = {
    users: [],
    messages: [],
    groups: [],
    invitationCodes: [],
    auditLogs: [],
};
const connectDB = () => {
    console.log('Using in-memory database for development');
    if (exports.db.users.length === 0) {
        exports.db.users.push({
            id: '1',
            username: 'admin',
            password: '$2a$10$8K1p/a0dURXAm7QiTRqUzuN0/SpuDMaM3V55BvEz9g7IzX0l1Qq3G',
            email: 'admin@example.com',
            isOnline: false,
            isAdmin: true,
            isVIP: true,
            createdAt: new Date(),
            lastActive: new Date(),
        });
        exports.db.groups.push({
            id: '1',
            name: '公共群聊',
            ownerId: '1',
            members: ['1'],
            isPublic: true,
            createdAt: new Date(),
        });
    }
    console.log('Current users in database:');
    exports.db.users.forEach(user => {
        console.log(`- ID: ${user.id}, Username: ${user.username}, isAdmin: ${user.isAdmin}`);
    });
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map