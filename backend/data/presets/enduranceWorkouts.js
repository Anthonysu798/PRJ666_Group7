export const enduranceWorkouts = [
    {
        name: "Long Distance Runner",
        category: "endurance",
        difficulty: "intermediate",
        duration: 60,
        frequency: 2,
        exercises: [
            {
                name: "Steady State Run",
                duration: 3600,
                distance: "10km",
                notes: "Maintain consistent pace"
            },
            {
                name: "Cool Down Walk",
                duration: 600,
                notes: "Gradual heart rate reduction"
            }
        ],
        equipment: ["running shoes"],
        tags: ["running", "cardio", "endurance"],
        description: "Long-distance running workout to build aerobic endurance",
        metrics: {
            caloriesBurn: 600,
            intensity: "medium",
            muscleGroups: ["legs", "core"]
        }
    },
    {
        name: "Endurance Builder",
        category: "endurance",
        difficulty: "beginner",
        duration: 45,
        frequency: 3,
        exercises: [
            {
                name: "Power Walking",
                duration: 1800,
                notes: "Brisk pace with arm movement"
            },
            {
                name: "Cycling",
                duration: 900,
                intensity: "low",
                notes: "Steady state, moderate resistance"
            }
        ],
        equipment: ["treadmill", "stationary bike"],
        tags: ["endurance", "beginner", "cardio"],
        description: "Build basic endurance with low-impact exercises",
        metrics: {
            caloriesBurn: 300,
            intensity: "low",
            muscleGroups: ["legs", "core"]
        }
    },
    {
        name: "Triathlon Prep",
        category: "endurance",
        difficulty: "advanced",
        duration: 90,
        frequency: 2,
        exercises: [
            {
                name: "Swim",
                duration: 1800,
                distance: "1000m",
                notes: "Mix of freestyle and breast stroke"
            },
            {
                name: "Bike",
                duration: 2700,
                distance: "15km",
                notes: "Maintain steady cadence"
            },
            {
                name: "Run",
                duration: 1800,
                distance: "5km",
                notes: "Keep consistent pace"
            }
        ],
        equipment: ["swimming pool", "bike", "running shoes"],
        tags: ["triathlon", "endurance", "advanced"],
        description: "Complete triathlon training session",
        metrics: {
            caloriesBurn: 800,
            intensity: "high",
            muscleGroups: ["full body"]
        }
    }
]; 