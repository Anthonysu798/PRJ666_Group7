import express from 'express';
import { analyzeForm, handleChat } from '../controllers/analyze-form.controllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, analyzeForm);
router.post('/chat', protect, handleChat);

export default router; 