import mongoose from 'mongoose';

const workoutSessionSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    workoutId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'WorkoutPlan', 
        required: false
    },
    duration: { 
        type: Number,
        required: true,
        min: 1
    },
    completed: { 
        type: Boolean, 
        default: true 
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
workoutSessionSchema.index({ userId: 1, workoutId: 1 });
workoutSessionSchema.index({ userId: 1, startTime: -1 });

// Add method to check if session maintains streak
workoutSessionSchema.methods.isStreakMaintained = function(lastWorkoutDate) {
    if (!lastWorkoutDate) return true;
    
    const sessionDate = this.startTime.toDateString();
    const lastDate = new Date(lastWorkoutDate).toDateString();
    const yesterday = new Date(this.startTime);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return sessionDate !== lastDate && 
           (sessionDate === new Date().toDateString() || 
            lastDate === yesterday.toDateString());
};

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);
export default WorkoutSession; 