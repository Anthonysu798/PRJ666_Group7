import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { enhancePost } from '../controllers/aipost.controller.js';

const router = express.Router();

router.post('/enhance-post', protect, enhancePost);

export default router;
