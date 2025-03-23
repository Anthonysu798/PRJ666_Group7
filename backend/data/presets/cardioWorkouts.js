export const cardioWorkouts = [
    // Beginner Workouts
    {
        name: "Beginner Cardio Foundation",
        category: "cardio",
        difficulty: "beginner",
        duration: 25,
        frequency: 3,
        exercises: [
            {
                name: "Walking Intervals",
                duration: 900,
                intensity: "moderate",
                notes: "Alternate between brisk and normal pace"
            },
            {
                name: "Stationary Bike",
                duration: 600,
                intensity: "low",
                notes: "Keep RPM above 60"
            }
        ],
        equipment: ["treadmill", "stationary bike"],
        tags: ["cardio", "beginner", "endurance"],
        description: "Perfect introduction to cardio training",
        metrics: {
            caloriesBurn: 200,
            intensity: "low",
            muscleGroups: ["legs", "core"]
        }
    },

    {
        name: "High-Intensity Sprint Intervals",
        category: "cardio",
        difficulty: "advanced",
        duration: 30,
        frequency: 3,
        exercises: [
            {
                name: "Sprint Intervals",
                sets: 8,
                duration: 30,
                restTime: 60,
                notes: "Maximum effort sprints"
            },
            // ... more exercises
        ],
        equipment: ["treadmill", "timer"],
        tags: ["cardio", "speed", "fat-burn"],
        description: "Intense sprint workout to improve speed and burn fat",
        metrics: {
            caloriesBurn: 400,
            intensity: "high",
            muscleGroups: ["legs", "core"]
        }
    },

    {
        name: "Mixed Cardio Challenge",
        category: "cardio",
        difficulty: "intermediate",
        duration: 45,
        frequency: 3,
        exercises: [
            {
                name: "Rowing Intervals",
                sets: 6,
                duration: 180,
                restTime: 60,
                notes: "Focus on power and form"
            },
            {
                name: "Jump Rope",
                duration: 300,
                notes: "Mix single and double unders"
            },
            {
                name: "Stair Climber",
                duration: 600,
                intensity: "moderate",
                notes: "Maintain steady pace"
            }
        ],
        equipment: ["rowing machine", "jump rope", "stair climber"],
        tags: ["cardio", "variety", "intermediate"],
        description: "Diverse cardio workout using multiple machines",
        metrics: {
            caloriesBurn: 450,
            intensity: "medium",
            muscleGroups: ["full body"]
        }
    }
]; 