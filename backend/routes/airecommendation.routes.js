import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    getChatRecommendations,
    getFeaturedRecommendation 
} from '../controllers/airecommendations.controllers.js';

const router = express.Router();

// Chat-based recommendations
router.post('/recommendations/chat', protect, getChatRecommendations);
router.get('/recommendations/featured', protect, getFeaturedRecommendation);

export default router;