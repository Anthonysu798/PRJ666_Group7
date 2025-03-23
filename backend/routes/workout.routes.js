import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    getPresetWorkouts, 
    getUserWorkouts, 
    createCustomWorkout, 
    updateWorkout,
    setActiveWorkout
} from '../controllers/workout.controllers.js';

const router = express.Router();

// Protected routes - Apply protect middleware to all routes
router.use(protect);

// Workout routes
router.get('/preset', getPresetWorkouts);
router.get('/user-workouts', getUserWorkouts);
router.post('/custom', createCustomWorkout);
router.put('/update/:workoutId', updateWorkout);
router.post('/active', setActiveWorkout);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Workout Route Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error in workout routes',
        error: err.message
    });
});

export default router;
