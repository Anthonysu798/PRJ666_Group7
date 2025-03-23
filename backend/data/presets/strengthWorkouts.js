export const strengthWorkouts = [
    // Beginner Workouts
    {
        name: "Full Body Strength Basics",
        category: "strength",
        difficulty: "beginner",
        duration: 45,
        frequency: 3,
        exercises: [
            {
                name: "Barbell Squat",
                sets: 3,
                reps: 10,
                restTime: 90,
                notes: "Focus on form and depth"
            },
            {
                name: "Bench Press",
                sets: 3,
                reps: 10,
                restTime: 90,
                notes: "Keep shoulders retracted"
            },
            {
                name: "Deadlift",
                sets: 3,
                reps: 8,
                restTime: 120,
                notes: "Maintain neutral spine"
            }
        ],
        equipment: ["barbell", "squat rack", "bench"],
        tags: ["strength", "beginner", "compound"],
        description: "Foundation strength training program focusing on the main compound lifts",
        metrics: {
            caloriesBurn: 300,
            intensity: "medium",
            muscleGroups: ["legs", "core", "back", "chest"]
        }
    },
    {
        name: "Beginner Push-Pull",
        category: "strength",
        difficulty: "beginner",
        duration: 40,
        frequency: 3,
        exercises: [
            {
                name: "Dumbbell Bench Press",
                sets: 3,
                reps: 12,
                restTime: 60,
                notes: "Control the weight throughout"
            },
            {
                name: "Bent Over Rows",
                sets: 3,
                reps: 12,
                restTime: 60,
                notes: "Keep back straight"
            },
            {
                name: "Shoulder Press",
                sets: 3,
                reps: 10,
                restTime: 60,
                notes: "Start with lighter weights"
            }
        ],
        equipment: ["dumbbells", "bench"],
        tags: ["strength", "beginner", "push-pull"],
        description: "Basic push-pull workout perfect for beginners",
        metrics: {
            caloriesBurn: 250,
            intensity: "low",
            muscleGroups: ["chest", "back", "shoulders"]
        }
    },

    // Intermediate Workouts
    {
        name: "Upper Body Power",
        category: "strength",
        difficulty: "intermediate",
        duration: 50,
        frequency: 2,
        exercises: [
            {
                name: "Military Press",
                sets: 4,
                reps: 8,
                restTime: 90,
                notes: "Strict form, no leg drive"
            },
            // ... more exercises
        ],
        // ... rest of the workout details
    },
    {
        name: "Hypertrophy Focus",
        category: "strength",
        difficulty: "intermediate",
        duration: 55,
        frequency: 4,
        exercises: [
            {
                name: "Incline Bench Press",
                sets: 4,
                reps: "8-10",
                restTime: 90,
                notes: "Focus on upper chest contraction"
            },
            {
                name: "Weighted Pull-ups",
                sets: 4,
                reps: "6-8",
                restTime: 120,
                notes: "Control the negative"
            },
            {
                name: "Romanian Deadlift",
                sets: 4,
                reps: 10,
                restTime: 90,
                notes: "Feel the hamstring stretch"
            }
        ],
        equipment: ["barbell", "pull-up bar", "weight plates"],
        tags: ["strength", "hypertrophy", "intermediate"],
        description: "Focused on muscle growth with compound movements",
        metrics: {
            caloriesBurn: 400,
            intensity: "high",
            muscleGroups: ["chest", "back", "legs"]
        }
    },

    // Advanced Workouts
    {
        name: "Power Building Elite",
        category: "strength",
        difficulty: "advanced",
        duration: 75,
        frequency: 4,
        exercises: [
            {
                name: "Front Squat",
                sets: 5,
                reps: "5,5,3,3,2",
                restTime: 180,
                notes: "Progressive loading pattern"
            },
            {
                name: "Clean and Press",
                sets: 4,
                reps: 6,
                restTime: 120,
                notes: "Focus on explosive power"
            },
            {
                name: "Weighted Dips",
                sets: 4,
                reps: "8-12",
                restTime: 90,
                notes: "Add weight progressively"
            }
        ],
        equipment: ["barbell", "squat rack", "dip station"],
        tags: ["strength", "power", "advanced"],
        description: "Advanced strength program combining power and hypertrophy",
        metrics: {
            caloriesBurn: 500,
            intensity: "high",
            muscleGroups: ["legs", "shoulders", "chest", "core"]
        }
    }
]; 