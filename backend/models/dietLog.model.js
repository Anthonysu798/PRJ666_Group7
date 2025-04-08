import mongoose from 'mongoose';

const dietLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    meals: [{
        name: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number
    }],
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFats: Number,
    notes: String
}, {
    timestamps: true
});

export const DietLog = mongoose.model('DietLog', dietLogSchema); 