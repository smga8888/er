"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_1 = require("../services/authService");
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const decoded = (0, authService_1.verifyToken)(token);
        const user = (0, authService_1.getUserById)(decoded.userId);
        if (!user || !user.isAdmin) {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
};
router.get('/users', verifyAdmin, (req, res) => {
    try {
        const users = database_1.db.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/users/:id', verifyAdmin, (req, res) => {
    try {
        const user = database_1.db.users.find(u => u.id === req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password, ...userWithoutPassword } = user;
        return res.json({ user: userWithoutPassword });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.put('/users/:id', verifyAdmin, (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const userIndex = database_1.db.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { password, ...allowedUpdates } = updates;
        database_1.db.users[userIndex] = { ...database_1.db.users[userIndex], ...allowedUpdates };
        const { password: _, ...updatedUser } = database_1.db.users[userIndex];
        return res.json({ user: updatedUser });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.delete('/users/:id', verifyAdmin, (req, res) => {
    try {
        const userId = req.params.id;
        database_1.db.users = database_1.db.users.filter(u => u.id !== userId);
        database_1.db.messages = database_1.db.messages.filter(m => m.senderId !== userId);
        database_1.db.groups.forEach(group => {
            group.members = group.members.filter(memberId => memberId !== userId);
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/messages', verifyAdmin, (req, res) => {
    try {
        res.json({ messages: database_1.db.messages });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/messages/:id', verifyAdmin, (req, res) => {
    try {
        const messageId = req.params.id;
        const messageIndex = database_1.db.messages.findIndex(m => m.id === messageId);
        if (messageIndex === -1) {
            return res.status(404).json({ error: 'Message not found' });
        }
        database_1.db.messages[messageIndex].isDeleted = true;
        return res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/groups', verifyAdmin, (req, res) => {
    try {
        const { name, description, isPublic } = req.body;
        const newGroup = {
            id: (0, uuid_1.v4)(),
            name,
            description,
            ownerId: req.user.id,
            members: [req.user.id],
            isPublic: isPublic || false,
            createdAt: new Date(),
        };
        database_1.db.groups.push(newGroup);
        return res.status(201).json({ group: newGroup });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/invitations', verifyAdmin, (req, res) => {
    try {
        const { code } = req.body;
        const newInvitation = {
            id: (0, uuid_1.v4)(),
            code: code || (0, uuid_1.v4)().substring(0, 8).toUpperCase(),
            createdBy: req.user.id,
            createdAt: new Date(),
            isUsed: false,
        };
        database_1.db.invitationCodes.push(newInvitation);
        return res.status(201).json({ invitation: newInvitation });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map