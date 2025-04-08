import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        weight: Number
    }],
    notes: String
}, {
    timestamps: true
});

export const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema); 