"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_1 = require("../services/authService");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, inviteCode } = req.body;
        const user = await (0, authService_1.registerUser)(username, password, email, inviteCode);
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({ user: userWithoutPassword });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await (0, authService_1.loginUser)(username, password);
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map