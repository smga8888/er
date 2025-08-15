"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let destination = 'uploads/';
        if (file.mimetype.startsWith('image/')) {
            destination += 'images/';
        }
        else if (file.mimetype.startsWith('video/')) {
            destination += 'videos/';
        }
        else {
            destination += 'files/';
        }
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + (0, uuid_1.v4)() + '-' + uniqueSuffix + ext);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/') ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'text/plain') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type'), false);
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});
exports.default = upload;
//# sourceMappingURL=multerConfig.js.map