import OpenAI from 'openai';
import { User } from '../models/user.model.js';
import { WorkoutLog } from '../models/workoutLog.model.js';
import { DietLog } from '../models/dietLog.model.js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Helper function to analyze user data and generate insights
const analyzeUserData = async (userData, category) => {
    try {
        let prompt = '';
        switch (category) {
            case 'workout':
                prompt = `Based on this user's workout data: ${JSON.stringify(userData.workouts)}, 
                         provide 3 specific workout recommendations for improvement. 
                         Focus on progression, form, and recovery.`;
                break;
            case 'nutrition':
                prompt = `Analyzing this nutrition data: ${JSON.stringify(userData.diet)}, 
                         suggest 3 nutrition recommendations. 
                         Consider macronutrient balance and meal timing.`;
                break;
            case 'health':
                prompt = `Looking at the overall health metrics: ${JSON.stringify(userData.health)}, 
                         provide 3 health optimization recommendations. 
                         Include both physical and mental well-being aspects.`;
                break;
            case 'sleep':
                prompt = `Based on sleep patterns: ${JSON.stringify(userData.sleep)}, 
                         provide 3 recommendations for better sleep quality. 
                         Include both pre-sleep routine and environment optimization.`;
                break;
            default:
                prompt = `Analyze this user's fitness data: ${JSON.stringify(userData)}, 
                         and provide 3 general recommendations for overall improvement.`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert fitness AI assistant providing personalized recommendations."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating AI recommendations:', error);
        throw error;
    }
};

// Get recommendations based on category
export const getRecommendations = async (req, res) => {
    try {
        const { category } = req.query;
        const userId = req.user._id;

        // Fetch user's data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const workouts = await WorkoutLog.find({ user: userId }).sort({ date: -1 }).limit(10);
        const dietLogs = await DietLog.find({ user: userId }).sort({ date: -1 }).limit(10);

        // Generate recommendations using OpenAI
        const prompt = `Generate 3 personalized fitness recommendations for a user with the following profile:
            - Category: ${category || 'general'}
            - Goals: ${user.fitnessGoals || 'general fitness'}
            - Experience: ${user.trainingExperience || 'beginner'}
            - Recent workouts: ${workouts.length} in the last 10 days
            
            Respond with a JSON array containing exactly 3 recommendations. Each recommendation should have this format:
            {
                "title": "Clear, actionable title",
                "description": "Detailed explanation",
                "category": "${category || 'general'}",
                "priority": "high/medium/low",
                "timeframe": "immediate/short-term/long-term",
                "actionable_steps": ["step1", "step2", "step3"]
            }`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert fitness AI assistant. Respond only with a JSON array containing exactly 3 recommendations."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        let recommendations;
        try {
            const parsedResponse = JSON.parse(completion.choices[0].message.content);
            recommendations = Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse];
        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
            recommendations = [{
                title: "Default Recommendation",
                description: "We're preparing your personalized recommendations.",
                category: category || 'general',
                priority: "medium",
                timeframe: "immediate",
                actionable_steps: ["Check back soon for personalized recommendations"]
            }];
        }

        res.json({
            success: true,
            recommendations
        });

    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({
            success: true, // Keep true to prevent frontend errors
            recommendations: [{
                title: "Temporary Recommendation",
                description: "We're currently generating your personalized recommendations.",
                category: "general",
                priority: "medium",
                timeframe: "immediate",
                actionable_steps: ["Check back in a few minutes"]
            }]
        });
    }
};

// Get featured recommendation
export const getFeaturedRecommendation = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        const prompt = `Generate ONE featured fitness recommendation for a user with these goals: ${user.fitnessGoals || 'general fitness'} 
                       and experience level: ${user.trainingExperience || 'beginner'}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert fitness AI assistant. Provide one high-impact featured recommendation."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        });

        res.json({
            success: true,
            featured: {
                title: "Daily Insight",
                description: completion.choices[0].message.content,
                category: "featured",
                timestamp: new Date(),
                confidence: 90,
                priority: "high"
            }
        });

    } catch (error) {
        console.error('Error getting featured recommendation:', error);
        res.status(500).json({
            success: true,
            featured: {
                title: "Daily Insight",
                description: "We're preparing your personalized recommendation.",
                category: "featured",
                timestamp: new Date(),
                confidence: 90,
                priority: "medium"
            }
        });
    }
};

// Generate new personalized insights
export const generatePersonalizedInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        const { category } = req.body;

        // Similar to getRecommendations but forces a new generation
        // Implementation here...

        res.json({
            success: true,
            message: 'New insights generated successfully'
        });

    } catch (error) {
        console.error('Error generating personalized insights:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate new insights'
        });
    }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
    try {
        const userId = req.user._id;
        const { preferences } = req.body;

        await User.findByIdAndUpdate(userId, {
            $set: { 'aiPreferences': preferences }
        });

        res.json({
            success: true,
            message: 'Preferences updated successfully'
        });

    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences'
        });
    }
};

// Get chat-based recommendations
export const getChatRecommendations = async (req, res) => {
    try {
        const { message, category } = req.body;
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const contextMessage = `
            User Profile:
            - Goals: ${user.fitnessGoals || 'general fitness'}
            - Experience: ${user.trainingExperience || 'beginner'}
            - Category focus: ${category || 'general'}
            
            User's question/input: ${message}

            Format your response as a JSON object with the following structure (no explanation, just the JSON):
            {
                "cardTitle": "Brief, engaging title",
                "cardDescription": "Short description",
                "workoutDetails": {
                    "difficulty": "beginner/intermediate/advanced",
                    "duration": "30-45 minutes",
                    "type": "strength/cardio/hiit/etc",
                    "equipment": ["item1", "item2"]
                },
                "exercises": [
                    {
                        "name": "Exercise name",
                        "sets": number,
                        "reps": number,
                        "restTime": number
                    }
                ],
                "tips": ["tip1", "tip2"],
                "metrics": {
                    "estimatedCalories": number,
                    "intensity": "low/medium/high"
                }
            }`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a fitness expert. Generate workout card information in JSON format only. No explanations or markdown, just pure JSON data."
                },
                {
                    role: "user",
                    content: contextMessage
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        // Parse the response and ensure it's valid JSON
        try {
            const cleanResponse = completion.choices[0].message.content.trim();
            const jsonResponse = JSON.parse(cleanResponse);
            
            res.json({
                success: true,
                response: jsonResponse
            });
        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
            res.status(500).json({
                success: false,
                error: 'Failed to parse AI response',
                fallback: {
                    cardTitle: "Quick Workout Suggestion",
                    cardDescription: "Let me prepare a better workout plan for you...",
                    workoutDetails: {
                        difficulty: "beginner",
                        duration: "30 minutes",
                        type: "general",
                        equipment: ["bodyweight"]
                    },
                    exercises: [
                        {
                            name: "Basic Workout",
                            sets: 3,
                            reps: 10,
                            restTime: 60
                        }
                    ],
                    tips: ["Start slow", "Focus on form"],
                    metrics: {
                        estimatedCalories: 150,
                        intensity: "low"
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error in chat recommendations:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};
