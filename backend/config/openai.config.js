import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateDietPlan = async (userPreferences) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",  // or "gpt-3.5-turbo" depending on your needs
      messages: [{
        role: "system",
        content: "You are a professional nutritionist and diet planner."
      }, {
        role: "user",
        content: `Create a detailed diet plan with the following preferences:
          Goal: ${userPreferences.category}
          Activity Level: ${userPreferences.activityLevel}
          Target Calories: ${userPreferences.targetCalories}
          Dietary Restrictions: ${userPreferences.dietaryPreferences.restrictions.join(', ')}
          Additional Preferences: ${userPreferences.dietaryPreferences.preferences}
          Health Conditions: ${userPreferences.dietaryPreferences.healthConditions}`
      }]
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate diet plan');
  }
}; 