import { 
  Dumbbell, 
  Scale, 
  Brain, 
  Zap, 
  Heart,
  Leaf, 
  Wheat, 
  Milk, 
  Beef,
  Footprints,
  BedDouble,
  Trophy,
  Timer
} from "lucide-react";

export const activityLevels = [
  {
    value: "sedentary",
    label: "Sedentary",
    icon: BedDouble
  },
  {
    value: "light",
    label: "Light Activity",
    icon: Footprints
  },
  {
    value: "moderate",
    label: "Moderate",
    icon: Timer
  },
  {
    value: "very-active",
    label: "Very Active",
    icon: Trophy
  }
];

export const goalTypes = [
  {
    value: "weight-loss",
    label: "Weight Loss",
    icon: Scale
  },
  {
    value: "muscle-gain",
    label: "Muscle Gain",
    icon: Dumbbell
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: Heart
  },
  {
    value: "performance",
    label: "Performance",
    icon: Zap
  }
];

export const dietaryRestrictions = [
  {
    value: "vegan",
    label: "Vegan",
    icon: Leaf
  },
  {
    value: "vegetarian",
    label: "Vegetarian",
    icon: Beef
  },
  {
    value: "gluten-free",
    label: "Gluten Free",
    icon: Wheat
  },
  {
    value: "dairy-free",
    label: "Dairy Free",
    icon: Milk
  },
  {
    value: "keto",
    label: "Keto",
    icon: Brain
  }
]; 