"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saltRounds = exports.jwtSecret = exports.PORT = void 0;
exports.PORT = process.env.PORT || 3000;
exports.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
exports.saltRounds = 10;
//# sourceMappingURL=config.js.map