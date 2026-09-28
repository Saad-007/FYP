import express from 'express';
import { getOverviewStats } from '../controllers/overviewController.js';

const router = express.Router();

// GET /api/pro/overview
router.get('/', getOverviewStats);

export default router;
