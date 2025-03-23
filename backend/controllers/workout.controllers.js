import { WorkoutPlan } from '../models/workout.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

// Import the preset workouts from a separate file for better organization
import { strengthWorkouts } from '../data/presets/strengthWorkouts.js';
import { cardioWorkouts } from '../data/presets/cardioWorkouts.js';
import { hiitWorkouts } from '../data/presets/hiitWorkouts.js';
import { flexibilityWorkouts } from '../data/presets/flexibilityWorkouts.js';
import { enduranceWorkouts } from '../data/presets/enduranceWorkouts.js';

// Combine all preset workouts
const presetWorkouts = [
    ...strengthWorkouts,    // ~25 workouts
    ...cardioWorkouts,      // ~20 workouts
    ...hiitWorkouts,        // ~20 workouts
    ...flexibilityWorkouts, // ~15 workouts
    ...enduranceWorkouts    // ~20 workouts
];

export const getPresetWorkouts = async (req, res) => {
    try {
        // Get active workout to properly set state
        const activePlan = await WorkoutPlan.findOne({ 
            userId: req.user.id, 
            isActive: true 
        }).lean();

        // Map preset workouts with active state
        const workoutsWithActiveState = presetWorkouts.map(workout => ({
            ...workout,
            isActive: activePlan ? 
                (workout.name === activePlan.name && workout.category === activePlan.category) : 
                false
        }));

        res.status(200).json({
            success: true,
            plans: workoutsWithActiveState,
            activePlan
        });
    } catch (error) {
        console.error('Error in getPresetWorkouts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching preset workouts',
            error: error.message
        });
    }
};

export const getUserWorkouts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user's custom workouts
        const customPlans = await WorkoutPlan.find({ 
            userId,
            isCustom: true 
        }).lean();

        // Get active workout
        const activePlan = await WorkoutPlan.findOne({ 
            userId, 
            isActive: true 
        }).lean();

        res.status(200).json({
            success: true,
            customPlans,
            activePlan
        });
    } catch (error) {
        console.error('Error in getUserWorkouts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user workouts',
            error: error.message
        });
    }
};

export const createCustomWorkout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        if (!req.user || !req.user.id) {
            throw new Error('User not authenticated');
        }

        // Remove _id if it exists in the request body
        const { _id, ...workoutData } = req.body;

        // Ensure exercises have required fields
        if (!workoutData.exercises || !workoutData.exercises.length) {
            throw new Error('At least one exercise is required');
        }

        // Validate exercise data
        workoutData.exercises = workoutData.exercises.map(exercise => ({
            name: exercise.name || 'Unnamed Exercise',
            sets: exercise.sets || 1,
            reps: exercise.reps || 1,
            duration: exercise.duration,
            restTime: exercise.restTime,
            notes: exercise.notes,
            distance: exercise.distance,
            intensity: exercise.intensity
        }));

        const newWorkoutData = {
            ...workoutData,
            userId: req.user.id,
            isCustom: true,
            isPreset: false,
            isActive: false
        };

        // Create new workout plan
        const newWorkout = new WorkoutPlan(newWorkoutData);
        await newWorkout.save({ session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            plan: newWorkout,
            message: 'Custom workout created successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error in createCustomWorkout:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Error creating workout plan'
        });
    } finally {
        session.endSession();
    }
};

export const updateWorkout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { workoutId } = req.params;
        const updates = req.body;
        const userId = req.user.id;

        const updatedWorkout = await WorkoutPlan.findOneAndUpdate(
            { _id: workoutId, userId },
            { $set: updates },
            { new: true, session, runValidators: true }
        );

        if (!updatedWorkout) {
            throw new Error('Workout not found or unauthorized');
        }

        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Workout updated successfully',
            plan: updatedWorkout
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error in updateWorkout:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating workout',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

export const setActiveWorkout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { planId, isPreset, presetPlan } = req.body;
        const userId = req.user.id;

        // Deactivate all existing workouts
        await WorkoutPlan.updateMany(
            { userId },
            { $set: { isActive: false } },
            { session }
        );

        let activePlan;

        if (isPreset) {
            // Handle preset workout activation
            let existingPlan = await WorkoutPlan.findOne({
                userId,
                name: presetPlan.name,
                category: presetPlan.category
            }).session(session);

            if (!existingPlan) {
                existingPlan = new WorkoutPlan({
                    ...presetPlan,
                    userId,
                    isPreset: true,
                    isActive: true
                });
                await existingPlan.save({ session });
            } else {
                existingPlan.isActive = true;
                await existingPlan.save({ session });
            }
            activePlan = existingPlan;
        } else {
            // Handle custom workout activation
            activePlan = await WorkoutPlan.findOneAndUpdate(
                { _id: planId, userId },
                { $set: { isActive: true } },
                { new: true, session, runValidators: true }
            );
        }

        if (!activePlan) {
            throw new Error('Workout plan not found or unauthorized');
        }

        // Update user's active workout reference
        await User.findByIdAndUpdate(
            userId,
            { 
                activeWorkoutPlan: activePlan._id,
                lastWorkoutUpdate: new Date()
            },
            { session }
        );

        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Workout set as active successfully',
            plan: activePlan
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error in setActiveWorkout:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting active workout',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};
