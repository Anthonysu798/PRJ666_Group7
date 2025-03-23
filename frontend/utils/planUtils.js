export const PLAN_FEATURES = {
  basic: {
    name: "Basic",
    price: "Free",
    features: [
      "Basic workout tracking",
      "Simple meal planning",
      "Basic progress metrics",
      "Limited exercise library"
    ],
    aiDietPlans: false,
    customWorkouts: false,
    progressTracking: true,
    maxMealPlans: 1,
    maxWorkoutPlans: 1
  },
  standard: {
    name: "Standard",
    price: "$19.99/month",
    features: [
      "Enhanced Workout Plan",
      "Advanced Meal Plans",
      "Real-Time Progress Tracking",
      "AI-Driven Recommendations",
      "Community Support",
      "Access to online support groups",
      "Detailed tracking and insights"
    ],
    aiDietPlans: true,
    customWorkouts: true,
    progressTracking: true,
    maxMealPlans: 3,
    maxWorkoutPlans: 3
  },
  premium: {
    name: "Premium",
    price: "$29.99/month",
    features: [
      "Custom AI Coaching",
      "Comprehensive Diet Plans",
      "Advanced Analytics",
      "Device Integration",
      "Priority Support",
      "Specialized Programs",
      "One-on-one coaching recommendations"
    ],
    aiDietPlans: true,
    customWorkouts: true,
    progressTracking: true,
    maxMealPlans: 'unlimited',
    maxWorkoutPlans: 'unlimited'
  }
};

export const hasAccess = (userPlan, feature) => {
  const plan = userPlan?.toLowerCase() || 'basic';
  return PLAN_FEATURES[plan][feature] || false;
};

export const getPlanLimits = (userPlan) => {
  const plan = userPlan?.toLowerCase() || 'basic';
  return PLAN_FEATURES[plan];
}; 