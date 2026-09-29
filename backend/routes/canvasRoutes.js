import express from 'express';
import { handleCanvasFeedback } from '../controllers/canvasController.js';

const router = express.Router();

// POST /api/canvas/feedback
router.post('/feedback', handleCanvasFeedback);

export default router;