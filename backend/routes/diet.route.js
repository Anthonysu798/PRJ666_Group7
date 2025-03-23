import express from 'express';
import { getPresetPlans, getUserPlans, createCustomPlan, setActivePlan, updatePlan } from '../controllers/diet.controllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/preset', protect, getPresetPlans);
router.get('/user-plans', protect, getUserPlans);
router.post('/custom', protect, createCustomPlan);
router.post('/active', protect, setActivePlan);
router.put('/update-plan/:planId', protect, updatePlan);

// Add error handling middleware
router.use((err, req, res, next) => {
    console.error('Diet Route Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error in diet routes',
        error: err.message
    });
});

export default router;