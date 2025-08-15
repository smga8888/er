"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_1 = require("../services/authService");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
const verifyUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const decoded = (0, authService_1.verifyToken)(token);
        const user = (0, authService_1.getUserById)(decoded.userId);
        if (!user) {
            res.status(403).json({ error: 'User access required' });
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
router.get('/history/:userId', verifyUser, (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;
        const messages = database_1.db.messages.filter(message => !message.isDeleted &&
            ((message.senderId === currentUserId && message.receiverId === otherUserId) ||
                (message.senderId === otherUserId && message.receiverId === currentUserId))).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        return res.json({ messages });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/group-history/:groupId', verifyUser, (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = database_1.db.groups.find(g => g.id === groupId);
        if (!group || !group.members.includes(req.user.id)) {
            return res.status(403).json({ error: 'Not a member of this group' });
        }
        const messages = database_1.db.messages.filter(message => !message.isDeleted &&
            message.groupId === groupId).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        return res.json({ messages });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/search', verifyUser, (req, res) => {
    try {
        const { query, userId, groupId, messageType, startDate, endDate } = req.query;
        let filteredMessages = database_1.db.messages.filter(message => !message.isDeleted);
        if (query) {
            filteredMessages = filteredMessages.filter(message => message.content.toLowerCase().includes(query.toLowerCase()));
        }
        if (userId) {
            filteredMessages = filteredMessages.filter(message => (message.senderId === req.user.id && message.receiverId === userId) ||
                (message.senderId === userId && message.receiverId === req.user.id));
        }
        if (groupId) {
            filteredMessages = filteredMessages.filter(message => message.groupId === groupId);
        }
        if (messageType) {
            filteredMessages = filteredMessages.filter(message => message.messageType === messageType);
        }
        if (startDate) {
            const start = new Date(startDate);
            filteredMessages = filteredMessages.filter(message => message.timestamp >= start);
        }
        if (endDate) {
            const end = new Date(endDate);
            filteredMessages = filteredMessages.filter(message => message.timestamp <= end);
        }
        filteredMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        res.json({ messages: filteredMessages });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=messageRoutes.js.map