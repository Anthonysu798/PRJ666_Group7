import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: Number,
    carbs: Number,
    fats: Number,
    image: { type: String, default: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3" },
    tags: [String],
    description: String,
    isActive: { type: Boolean, default: false },
    isPreset: { type: Boolean, default: false },
    isCustom: { type: Boolean, default: false },
    lastActiveUpdate: { type: Date },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add compound index for userId and isActive
dietPlanSchema.index({ userId: 1, isActive: 1 });
// Add compound index for userId, name, and category
dietPlanSchema.index({ userId: 1, name: 1, category: 1 });
// Add compound index for userId and isCustom
dietPlanSchema.index({ userId: 1, isCustom: 1 });
// Add compound index for userId and lastActiveUpdate
dietPlanSchema.index({ userId: 1, lastActiveUpdate: -1 });

export const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
