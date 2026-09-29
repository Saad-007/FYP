import express from 'express';
import { getLearningPath, updateCourseProgress, startCourse } from '../controllers/learningPathController.js';

const router = express.Router();

// GET /api/pro/learning-path
router.get('/', getLearningPath);

// POST /api/pro/learning-path/start/:courseId
router.post('/start/:courseId', startCourse);

// PUT /api/pro/learning-path/progress/:courseId
router.put('/progress/:courseId', updateCourseProgress);

export default router;
