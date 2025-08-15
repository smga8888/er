"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvitationCode = exports.updateUserOnlineStatus = exports.getUserById = exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const database_1 = require("../config/database");
const config_1 = require("../config/config");
const registerUser = async (username, password, email, inviteCode) => {
    const existingUser = database_1.db.users.find(user => user.username === username);
    if (existingUser) {
        throw new Error('Username already exists');
    }
    const existingEmail = database_1.db.users.find(user => user.email === email);
    if (existingEmail) {
        throw new Error('Email already exists');
    }
    if (inviteCode) {
        const invitation = database_1.db.invitationCodes.find(code => code.code === inviteCode && !code.isUsed);
        if (!invitation) {
            throw new Error('Invalid or expired invitation code');
        }
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, config_1.saltRounds);
    const newUser = {
        id: (0, uuid_1.v4)(),
        username,
        password: hashedPassword,
        email,
        isOnline: false,
        isAdmin: false,
        isVIP: false,
        createdAt: new Date(),
        lastActive: new Date(),
    };
    database_1.db.users.push(newUser);
    if (inviteCode) {
        const invitation = database_1.db.invitationCodes.find(code => code.code === inviteCode);
        if (invitation) {
            invitation.isUsed = true;
            invitation.usedBy = newUser.id;
        }
    }
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async (username, password) => {
    const user = database_1.db.users.find(user => user.username === username);
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    user.lastActive = new Date();
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        isVIP: user.isVIP
    }, config_1.jwtSecret, { expiresIn: '24h' });
    return { user, token };
};
exports.loginUser = loginUser;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.jwtSecret);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyToken = verifyToken;
const getUserById = (userId) => {
    return database_1.db.users.find(user => user.id === userId);
};
exports.getUserById = getUserById;
const updateUserOnlineStatus = (userId, isOnline) => {
    const user = database_1.db.users.find(user => user.id === userId);
    if (user) {
        user.isOnline = isOnline;
        user.lastActive = new Date();
    }
};
exports.updateUserOnlineStatus = updateUserOnlineStatus;
const generateInvitationCode = (adminId) => {
    const admin = database_1.db.users.find(user => user.id === adminId && user.isAdmin);
    if (!admin) {
        throw new Error('Unauthorized');
    }
    const newCode = {
        id: (0, uuid_1.v4)(),
        code: (0, uuid_1.v4)().substring(0, 8).toUpperCase(),
        createdBy: adminId,
        createdAt: new Date(),
        isUsed: false,
    };
    database_1.db.invitationCodes.push(newCode);
    return newCode;
};
exports.generateInvitationCode = generateInvitationCode;
//# sourceMappingURL=authService.js.map