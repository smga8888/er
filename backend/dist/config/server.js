"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database");
const socketService_1 = require("../services/socketService");
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const messageRoutes_1 = __importDefault(require("../routes/messageRoutes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, database_1.connectDB)();
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
(0, socketService_1.initializeSocket)(io);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map