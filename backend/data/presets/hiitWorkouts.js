export const hiitWorkouts = [
    // Beginner HIIT
    {
        name: "HIIT Fundamentals",
        category: "hiit",
        difficulty: "beginner",
        duration: 20,
        frequency: 2,
        exercises: [
            {
                name: "Mountain Climbers",
                sets: 3,
                duration: 30,
                restTime: 30,
                notes: "Keep core engaged, moderate pace"
            },
            {
                name: "Squat Jumps",
                sets: 3,
                duration: 30,
                restTime: 30,
                notes: "Land softly, focus on form"
            },
            {
                name: "Push-ups",
                sets: 3,
                duration: 30,
                restTime: 30,
                notes: "Modified on knees if needed"
            }
        ],
        equipment: ["timer", "mat"],
        tags: ["hiit", "beginner", "bodyweight"],
        description: "Introduction to HIIT with basic bodyweight movements",
        metrics: {
            caloriesBurn: 200,
            intensity: "medium",
            muscleGroups: ["full body"]
        }
    },
    {
        name: "Bodyweight Blast",
        category: "hiit",
        difficulty: "beginner",
        duration: 25,
        frequency: 3,
        exercises: [
            {
                name: "Jump Squats",
                sets: 4,
                duration: 30,
                restTime: 30,
                notes: "Explosive but controlled jumps"
            },
            {
                name: "High Knees",
                sets: 4,
                duration: 30,
                restTime: 30,
                notes: "Drive knees up with arms"
            },
            {
                name: "Plank to Downward Dog",
                sets: 4,
                duration: 30,
                restTime: 30,
                notes: "Flow between positions"
            }
        ],
        equipment: ["timer", "mat"],
        tags: ["hiit", "beginner", "bodyweight"],
        description: "Dynamic bodyweight HIIT for beginners",
        metrics: {
            caloriesBurn: 250,
            intensity: "medium",
            muscleGroups: ["legs", "core", "shoulders"]
        }
    },

    // Intermediate HIIT
    {
        name: "Tabata Full Body Blast",
        category: "hiit",
        difficulty: "intermediate",
        duration: 25,
        frequency: 3,
        exercises: [
            {
                name: "Burpees",
                sets: 8,
                duration: 20,
                restTime: 10,
                notes: "20 seconds work, 10 seconds rest"
            },
            {
                name: "Kettlebell Swings",
                sets: 8,
                duration: 20,
                restTime: 10,
                notes: "Hip hinge movement"
            },
            {
                name: "Box Jumps",
                sets: 8,
                duration: 20,
                restTime: 10,
                notes: "Step down to recover"
            }
        ],
        equipment: ["kettlebell", "plyo box", "timer"],
        tags: ["hiit", "tabata", "explosive"],
        description: "Classic Tabata protocol with full body movements",
        metrics: {
            caloriesBurn: 300,
            intensity: "high",
            muscleGroups: ["legs", "core", "shoulders"]
        }
    },
    {
        name: "Battle Rope Conditioning",
        category: "hiit",
        difficulty: "intermediate",
        duration: 30,
        frequency: 3,
        exercises: [
            {
                name: "Alternating Waves",
                sets: 6,
                duration: 30,
                restTime: 30,
                notes: "Keep shoulders packed"
            },
            {
                name: "Double Slams",
                sets: 6,
                duration: 30,
                restTime: 30,
                notes: "Explosive hip extension"
            },
            {
                name: "Side-to-Side Waves",
                sets: 6,
                duration: 30,
                restTime: 30,
                notes: "Engage core throughout"
            }
        ],
        equipment: ["battle ropes", "timer"],
        tags: ["hiit", "conditioning", "upper body"],
        description: "High-intensity battle rope workout for improved conditioning",
        metrics: {
            caloriesBurn: 350,
            intensity: "high",
            muscleGroups: ["arms", "shoulders", "core"]
        }
    },

    // Advanced HIIT
    {
        name: "CrossFit-Style Metcon",
        category: "hiit",
        difficulty: "advanced",
        duration: 35,
        frequency: 3,
        exercises: [
            {
                name: "Thrusters",
                reps: 15,
                sets: 5,
                restTime: 45,
                notes: "Front squat to overhead press"
            },
            {
                name: "Pull-ups",
                reps: 12,
                sets: 5,
                restTime: 45,
                notes: "Kipping or strict"
            },
            {
                name: "Box Jump Overs",
                reps: 20,
                sets: 5,
                restTime: 45,
                notes: "Jump over box both directions"
            }
        ],
        equipment: ["barbell", "pull-up bar", "plyo box"],
        tags: ["hiit", "crossfit", "strength-endurance"],
        description: "High-intensity metabolic conditioning workout",
        metrics: {
            caloriesBurn: 450,
            intensity: "high",
            muscleGroups: ["full body"]
        }
    },
    {
        name: "Assault Bike Sprint Series",
        category: "hiit",
        difficulty: "advanced",
        duration: 30,
        frequency: 2,
        exercises: [
            {
                name: "30/30 Sprints",
                sets: 10,
                duration: 30,
                restTime: 30,
                notes: "Max calories in 30 seconds"
            },
            {
                name: "Tabata Sprints",
                sets: 8,
                duration: 20,
                restTime: 10,
                notes: "All-out effort"
            },
            {
                name: "Death by Calories",
                duration: 600,
                notes: "Increase calories each minute"
            }
        ],
        equipment: ["assault bike", "timer"],
        tags: ["hiit", "cardio", "metabolic"],
        description: "Intense assault bike intervals for maximum calorie burn",
        metrics: {
            caloriesBurn: 500,
            intensity: "high",
            muscleGroups: ["full body", "legs"]
        }
    }
]; 