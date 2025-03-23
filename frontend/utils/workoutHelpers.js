export const getWorkoutMetrics = (plan) => {
  const defaultMetrics = {
    caloriesBurn: 0,
    intensity: "medium",
    muscleGroups: ["full body"]
  };

  return {
    ...defaultMetrics,
    ...(plan?.metrics || {})
  };
}; 