import express from 'express';
import { chatWithAI, enhancePost } from '../controllers/ai.controllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, chatWithAI);
router.post('/aipost/enhance-post', protect, enhancePost);

export default router; 