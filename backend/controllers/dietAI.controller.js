import { DietPlan } from '../models/diet.model.js';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateAIDietPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, category, activityLevel, targetCalories, dietaryRestrictions = [], preferences = '', healthConditions = '' } = req.body;

    // Validate required fields
    if (!name || !category || !activityLevel || !targetCalories) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate calorie range
    if (targetCalories < 1200 || targetCalories > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Target calories must be between 1200 and 5000'
      });
    }

    const prompt = `Create a detailed diet plan with the following requirements:
      - Name: ${name}
      - Goal: ${category}
      - Activity Level: ${activityLevel}
      - Target Calories: ${targetCalories}
      - Dietary Restrictions: ${dietaryRestrictions.join(', ')}
      - Preferences: ${preferences}
      - Health Conditions: ${healthConditions}

      Respond with a JSON object containing these exact fields:
      {
        "description": "brief plan description",
        "protein": number in grams,
        "carbs": number in grams,
        "fats": number in grams,
        "keyFoods": ["array", "of", "recommended", "foods"],
        "mealTiming": "meal timing recommendations"
      }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a professional nutritionist and diet planning expert. Respond only with valid JSON objects."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7
    });

    // Parse the AI response
    const aiResponse = JSON.parse(completion.choices[0].message.content);

    // Validate AI response
    if (!aiResponse.protein || !aiResponse.carbs || !aiResponse.fats) {
      throw new Error('Invalid AI response: Missing macronutrient data');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new diet plan
      const newPlan = new DietPlan({
        userId: userId,
        name,
        category,
        type: 'ai-generated',
        description: aiResponse.description,
        calories: targetCalories,
        protein: aiResponse.protein,
        carbs: aiResponse.carbs,
        fats: aiResponse.fats,
        keyFoods: aiResponse.keyFoods,
        mealTiming: aiResponse.mealTiming,
        dietaryRestrictions,
        activityLevel,
        tags: [
          category,
          activityLevel,
          'AI Generated',
          ...dietaryRestrictions
        ],
        isCustom: true,
        metrics: {
          calories: targetCalories,
          protein: aiResponse.protein,
          carbs: aiResponse.carbs,
          fats: aiResponse.fats
        }
      });

      await newPlan.save({ session });
      await session.commitTransaction();

      res.status(201).json({
        success: true,
        plan: newPlan
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Error generating AI diet plan:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI diet plan'
    });
  }
}; 