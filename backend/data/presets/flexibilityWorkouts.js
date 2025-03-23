export const flexibilityWorkouts = [
    {
        name: "Yoga Flow Basics",
        category: "flexibility",
        difficulty: "beginner",
        duration: 30,
        frequency: 3,
        exercises: [
            {
                name: "Sun Salutation A",
                sets: 3,
                duration: 300,
                notes: "Flow through poses mindfully"
            },
            {
                name: "Downward Dog",
                duration: 60,
                sets: 4,
                notes: "Focus on hamstring stretch"
            },
            {
                name: "Warrior Sequence",
                sets: 2,
                duration: 180,
                notes: "Hold each pose for 30 seconds"
            }
        ],
        equipment: ["yoga mat"],
        tags: ["yoga", "stretching", "mobility"],
        description: "Basic yoga flow sequence focusing on flexibility and mindfulness",
        metrics: {
            caloriesBurn: 150,
            intensity: "low",
            muscleGroups: ["full body", "core"]
        }
    },
    {
        name: "Dynamic Stretching Routine",
        category: "flexibility",
        difficulty: "intermediate",
        duration: 40,
        frequency: 4,
        exercises: [
            {
                name: "Dynamic Leg Swings",
                sets: 3,
                duration: 60,
                notes: "Forward and lateral swings"
            },
            {
                name: "Arm Circles",
                sets: 3,
                duration: 45,
                notes: "Both directions, increasing size"
            },
            {
                name: "Hip Circles",
                sets: 3,
                duration: 45,
                notes: "Controlled rotations"
            }
        ],
        equipment: ["yoga mat", "resistance band"],
        tags: ["mobility", "dynamic", "intermediate"],
        description: "Dynamic stretching to improve range of motion",
        metrics: {
            caloriesBurn: 200,
            intensity: "medium",
            muscleGroups: ["full body", "hips", "shoulders"]
        }
    },
    {
        name: "Advanced Flexibility Flow",
        category: "flexibility",
        difficulty: "advanced",
        duration: 50,
        frequency: 3,
        exercises: [
            {
                name: "Advanced Sun Salutation",
                sets: 4,
                duration: 300,
                notes: "Full expression of poses"
            },
            {
                name: "Split Practice",
                duration: 600,
                notes: "Front splits both sides"
            },
            {
                name: "Backbend Flow",
                duration: 300,
                notes: "Progressive backbend sequence"
            }
        ],
        equipment: ["yoga mat", "blocks", "strap"],
        tags: ["flexibility", "advanced", "yoga"],
        description: "Advanced flexibility routine for experienced practitioners",
        metrics: {
            caloriesBurn: 250,
            intensity: "medium",
            muscleGroups: ["full body", "spine", "hips"]
        }
    }
]; 