"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = void 0;
const database_1 = require("../config/database");
const authService_1 = require("./authService");
const uuid_1 = require("uuid");
const userSockets = new Map();
const initializeSocket = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = (0, authService_1.verifyToken)(token);
            socket.userId = decoded.userId;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        userSockets.set(userId, socket.id);
        (0, authService_1.updateUserOnlineStatus)(userId, true);
        io.emit('onlineUsers', getOnlineUsers());
        const publicGroup = database_1.db.groups.find(group => group.isPublic);
        if (publicGroup) {
            socket.join(publicGroup.id);
        }
        socket.on('privateMessage', (data) => {
            const { recipientId, content, messageType } = data;
            const newMessage = {
                id: (0, uuid_1.v4)(),
                senderId: userId,
                receiverId: recipientId,
                content,
                messageType,
                timestamp: new Date(),
                isDeleted: false,
            };
            database_1.db.messages.push(newMessage);
            const recipientSocketId = userSockets.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('privateMessage', newMessage);
            }
        });
        socket.on('groupMessage', (data) => {
            const { groupId, content, messageType } = data;
            const newMessage = {
                id: (0, uuid_1.v4)(),
                senderId: userId,
                groupId,
                content,
                messageType,
                timestamp: new Date(),
                isDeleted: false,
            };
            database_1.db.messages.push(newMessage);
            socket.to(groupId).emit('groupMessage', newMessage);
        });
        socket.on('fileUpload', (data) => {
            const { recipientId, groupId, fileType, fileUrl } = data;
            const newMessage = {
                id: (0, uuid_1.v4)(),
                senderId: userId,
                receiverId: recipientId,
                groupId,
                content: fileUrl,
                messageType: fileType,
                timestamp: new Date(),
                isDeleted: false,
            };
            database_1.db.messages.push(newMessage);
            if (recipientId) {
                const recipientSocketId = userSockets.get(recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('privateMessage', newMessage);
                }
            }
            else if (groupId) {
                socket.to(groupId).emit('groupMessage', newMessage);
            }
        });
        socket.on('disconnect', () => {
            userSockets.delete(userId);
            (0, authService_1.updateUserOnlineStatus)(userId, false);
            io.emit('onlineUsers', getOnlineUsers());
        });
    });
    const getOnlineUsers = () => {
        return database_1.db.users
            .filter(user => user.isOnline)
            .map(user => ({
            id: user.id,
            username: user.username,
            isOnline: user.isOnline,
        }));
    };
};
exports.initializeSocket = initializeSocket;
//# sourceMappingURL=socketService.js.map