import express from 'express';
import { getAchievements, unlockAchievement } from '../controllers/achievementsController.js';

const router = express.Router();

// GET /api/pro/achievements
router.get('/', getAchievements);

// POST /api/pro/achievements/unlock
router.post('/unlock/:achievementId', unlockAchievement);

export default router;
