import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number },
    duration: { type: Number }, // in minutes
    restTime: { type: Number }, // in seconds
    notes: String
});

const workoutPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['strength', 'cardio', 'hiit', 'flexibility', 'endurance']
    },
    difficulty: { 
        type: String, 
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    duration: { type: Number, required: true },
    frequency: { type: Number, required: true },
    exercises: [{
        name: { type: String, required: true },
        sets: { type: Number },
        reps: { type: mongoose.Schema.Types.Mixed }, // Allow string or number
        duration: { type: Number },
        restTime: { type: Number },
        notes: String,
        distance: String,
        intensity: String
    }],
    equipment: [String],
    tags: [String],
    description: String,
    image: { type: String, default: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48" },
    isActive: { type: Boolean, default: false },
    isPreset: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false },
    lastActiveUpdate: { type: Date },
    metrics: {
        caloriesBurn: { type: Number, required: true },
        intensity: { 
            type: String, 
            required: true,
            enum: ['low', 'medium', 'high']
        },
        muscleGroups: [String]
    },
    schedule: [{
        day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
        timeOfDay: { type: String, enum: ['morning', 'afternoon', 'evening'] }
    }]
}, { 
    timestamps: true 
});

// Add compound indexes for better query performance
workoutPlanSchema.index({ userId: 1, isActive: 1 });
workoutPlanSchema.index({ userId: 1, category: 1 });
workoutPlanSchema.index({ userId: 1, difficulty: 1 });
workoutPlanSchema.index({ userId: 1, 'schedule.day': 1 });
workoutPlanSchema.index({ userId: 1, lastActiveUpdate: -1 });

// Add validation middleware
workoutPlanSchema.pre('save', function(next) {
    // Ensure at least one exercise
    if (!this.exercises || this.exercises.length === 0) {
        next(new Error('Workout plan must have at least one exercise'));
        return;
    }

    // Validate schedule conflicts
    if (this.schedule) {
        const scheduleMap = new Map();
        for (const slot of this.schedule) {
            const key = `${slot.day}-${slot.timeOfDay}`;
            if (scheduleMap.has(key)) {
                next(new Error('Schedule contains conflicting time slots'));
                return;
            }
            scheduleMap.set(key, true);
        }
    }

    next();
});

export const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema); 