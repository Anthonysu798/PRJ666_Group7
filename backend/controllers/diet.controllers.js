import { DietPlan } from '../models/diet.model.js';
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';

const presetPlans = [
    {
        id: 1,
        name: "Balanced Nutrition",
        category: "balanced",
        calories: 2200,
        protein: 110,
        carbs: 275,
        fats: 73,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3",
        tags: ["Balanced", "Nutritious", "Sustainable"],
        description: "Well-rounded meal plan for overall health"
    },
    {
        id: 2,
        name: "High Protein Build",
        category: "muscle",
        calories: 2800,
        protein: 180,
        carbs: 250,
        fats: 90,
        image: "https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-4.0.3",
        tags: ["High Protein", "Muscle Gain", "Strength"],
        description: "Optimized for muscle growth and recovery"
    },
    {
        id: 3,
        name: "Keto Burn",
        category: "keto",
        calories: 2000,
        protein: 150,
        carbs: 30,
        fats: 150,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3",
        tags: ["Keto", "Fat Loss", "Low Carb"],
        description: "High fat, low carb for maximum fat burning"
    },
    {
        id: 4,
        name: "Plant Power",
        category: "vegan",
        calories: 2200,
        protein: 120,
        carbs: 280,
        fats: 70,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3",
        tags: ["Vegan", "Plant-Based", "Eco-Friendly"],
        description: "100% plant-based nutrition plan"
    },
    {
        id: 5,
        name: "Lean Shred",
        category: "weight-loss",
        calories: 1800,
        protein: 160,
        carbs: 150,
        fats: 60,
        image: "https://images.unsplash.com/photo-1511909525232-61113c912358?ixlib=rb-4.0.3",
        tags: ["Fat Loss", "Lean Muscle", "Cutting"],
        description: "Designed for optimal fat loss while preserving muscle"
    },
    {
        id: 6,
        name: "Mediterranean Wellness",
        category: "health",
        calories: 2100,
        protein: 110,
        carbs: 220,
        fats: 85,
        image: "https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?ixlib=rb-4.0.3",
        tags: ["Heart Health", "Longevity", "Balance"],
        description: "Based on the heart-healthy Mediterranean diet"
    },
    {
        id: 7,
        name: "Performance Plus",
        category: "performance",
        calories: 3000,
        protein: 170,
        carbs: 350,
        fats: 95,
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3",
        tags: ["Athletic", "Endurance", "Energy"],
        description: "Fueling peak athletic performance"
    },
    {
        id: 8,
        name: "Gluten-Free Vitality",
        category: "gluten-free",
        calories: 2200,
        protein: 130,
        carbs: 240,
        fats: 80,
        image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3",
        tags: ["Gluten-Free", "Digestive Health", "Energy"],
        description: "Energizing gluten-free meal plan"
    },
    {
        id: 9,
        name: "Intermittent Fasting",
        category: "weight-loss",
        calories: 1900,
        protein: 140,
        carbs: 180,
        fats: 75,
        image: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?ixlib=rb-4.0.3",
        tags: ["IF", "Fat Loss", "Metabolic Health"],
        description: "Structured eating windows for optimal results"
    }
];

export const getPresetPlans = async (req, res) => {
    try {
        // Get the active plan to properly set isActive state
        const activePlan = await DietPlan.findOne({ 
            userId: req.user.id, 
            isActive: true 
        }).lean();

        // Map preset plans with active state
        const plansWithActiveState = presetPlans.map(plan => ({
            ...plan,
            isActive: false // Default to false
        }));

        res.status(200).json({
            success: true,
            plans: plansWithActiveState,
            activePlan: activePlan
        });
    } catch (error) {
        console.error('Error in getPresetPlans:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching preset plans',
            error: error.message
        });
    }
};

export const getUserPlans = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get the active plan first
        const activePlan = await DietPlan.findOne({ 
            userId, 
            isActive: true 
        }).lean();

        // Get all plans
        const allPlans = await DietPlan.find({ userId }).lean();

        // Map plans with correct active state
        const updatedPlans = allPlans.map(plan => ({
            ...plan,
            isActive: activePlan ? plan._id.toString() === activePlan._id.toString() : false
        }));

        // Separate custom and preset plans
        const customPlans = updatedPlans.filter(plan => plan.isCustom);
        const savedPresetPlans = updatedPlans.filter(plan => plan.isPreset);

        res.json({
            success: true,
            plans: updatedPlans,
            customPlans,
            savedPresetPlans,
            activePlan
        });
    } catch (error) {
        console.error('Error in getUserPlans:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching user plans',
            error: error.message 
        });
    }
};

export const createCustomPlan = async (req, res) => {
    try {
        const { name, category, calories, protein, carbs, fats, tags, description, image } = req.body;
        const userId = req.user.id;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // First, deactivate all existing plans for this user
            await DietPlan.updateMany(
                { userId },
                { $set: { isActive: false } },
                { session }
            );
        
            // Create new plan with the provided image or use default
            const newPlan = new DietPlan({ 
                userId, 
                name, 
                category, 
                calories, 
                protein, 
                carbs, 
                fats, 
                tags, 
                description,
                image: image || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3",
                isCustom: true,
                isActive: true // Set as active by default when created
            });
            
            await newPlan.save({ session });

            // Update user's active plan reference
            await User.findByIdAndUpdate(
                userId,
                { activeDietPlan: newPlan._id },
                { session }
            );

            await session.commitTransaction();
            
            res.status(201).json({ 
                success: true, 
                plan: newPlan,
                message: 'Custom plan created and set as active'
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating plan', error });
    }
};

export const setActivePlan = async (req, res) => {
    try {
        const { planId, isPreset, presetPlan } = req.body;
        const userId = req.user.id;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // First, deactivate ALL plans for this user (both custom and preset)
            await DietPlan.updateMany(
                { userId },
                { $set: { isActive: false } },
                { session }
            );

            let activePlan;

            if (isPreset) {
                // Handle preset plan activation
                let existingPlan = await DietPlan.findOne({
                    userId,
                    name: presetPlan.name,
                    category: presetPlan.category
                }).session(session);

                if (!existingPlan) {
                    existingPlan = new DietPlan({
                        userId,
                        name: presetPlan.name,
                        category: presetPlan.category,
                        calories: presetPlan.calories,
                        protein: presetPlan.protein,
                        carbs: presetPlan.carbs,
                        fats: presetPlan.fats,
                        image: presetPlan.image,
                        tags: presetPlan.tags,
                        description: presetPlan.description,
                        isPreset: true,
                        isActive: true
                    });
                    await existingPlan.save({ session });
                } else {
                    // Update existing preset plan
                    existingPlan.isActive = true;
                    await existingPlan.save({ session });
                }
                activePlan = existingPlan;
            } else {
                // Handle custom plan activation
                activePlan = await DietPlan.findOneAndUpdate(
                    { _id: planId, userId },
                    { $set: { isActive: true } },
                    { 
                        new: true,
                        session,
                        runValidators: true
                    }
                );

                if (!activePlan) {
                    throw new Error('Custom plan not found or unauthorized');
                }
            }

            // Update user's active plan reference
            await User.findByIdAndUpdate(
                userId,
                { 
                    $set: { 
                        activeDietPlan: activePlan._id,
                        lastActivePlanUpdate: new Date()
                    }
                },
                { session }
            );

            await session.commitTransaction();

            // Return the complete active plan data
            res.json({
                success: true,
                message: 'Plan set as active successfully',
                plan: {
                    ...activePlan.toObject(),
                    isActive: true
                }
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error in setActivePlan:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error setting active plan',
            error: error.message 
        });
    }
};

export const updatePlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const updates = req.body;
        const userId = req.user.id;

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Find and update the plan
            const updatedPlan = await DietPlan.findOneAndUpdate(
                { _id: planId, userId },
                { $set: updates },
                { new: true, session, runValidators: true }
            );

            if (!updatedPlan) {
                throw new Error('Plan not found or unauthorized');
            }

            await session.commitTransaction();

            res.json({
                success: true,
                message: 'Plan updated successfully',
                plan: updatedPlan
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error in updatePlan:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating plan',
            error: error.message
        });
    }
};
