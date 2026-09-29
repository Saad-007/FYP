import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { executeCode, reviewCode, getSavedSessions } from '../controllers/workspaceController.js';

const router = express.Router();

// Ensure workspace_sessions folder exists
const sessionDir = './workspace_sessions/';
if (!fs.existsSync(sessionDir)){
    fs.mkdirSync(sessionDir);
}

// Configure Multer for Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, sessionDir),
  filename: (req, file, cb) => {
    // Save file with original name to make it easy for Python scripts to read
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/workspace/upload - For Pro ML Datasets
router.post('/upload', upload.single('dataset'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.status(200).json({
    success: true,
    message: 'Dataset uploaded successfully!',
    filePath: req.file.path
  });
});

// Existing routes
router.post('/execute', executeCode);
router.post('/review', reviewCode);
router.get('/sessions', getSavedSessions);

export default router;

