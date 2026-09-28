import express from 'express';
import { handleSearch } from '../controllers/searchController.js';

const router = express.Router();

// POST /api/search
router.post('/', handleSearch);

export default router;