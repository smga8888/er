import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on file type
    let destination = 'uploads/';
    
    if (file.mimetype.startsWith('image/')) {
      destination += 'images/';
    } else if (file.mimetype.startsWith('video/')) {
      destination += 'videos/';
    } else {
      destination += 'files/';
    }
    
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uuidv4() + '-' + uniqueSuffix + ext);
  }
});

// File filter to validate file types
const fileFilter = (req: any, file: any, cb: any) => {
  // Accept images, videos, and other files
  if (file.mimetype.startsWith('image/') || 
      file.mimetype.startsWith('video/') || 
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Create multer instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

export default upload;
