"use client";
import React from "react";
import { LayoutGrid, Card } from "@/components/ui/layout-grid";

// Feature components
const FeatureOne: React.FC = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      AI-Powered Nutrition
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Get personalized meal plans and nutrition guidance tailored to your goals and preferences.
    </p>
  </div>
);

const FeatureTwo: React.FC = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      Smart Workouts
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      AI-driven workout plans that adapt to your progress and fitness level.
    </p>
  </div>
);

const FeatureThree: React.FC = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      Global Community
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Connect with fitness enthusiasts worldwide and share your journey.
    </p>
  </div>
);

const FeatureFour: React.FC = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">
      Smart Analytics
    </p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Track your progress with advanced AI analytics and personalized insights.
    </p>
  </div>
);

// Define the cards array with proper typing
const cards: Card[] = [
  {
    id: 1,
    content: <FeatureOne />,
    className: "md:col-span-2",
    thumbnail: "/dietplan.png"
  },
  {
    id: 2,
    content: <FeatureTwo />,
    className: "col-span-1",
    thumbnail: "/workoutplan.png"
  },
  {
    id: 3,
    content: <FeatureThree />,
    className: "col-span-1",
    thumbnail: "/community.png"
  },
  {
    id: 4,
    content: <FeatureFour />,
    className: "md:col-span-2",
    thumbnail: "/airecommendation.png"
  }
];

const FeaturesGrid: React.FC = () => {
  return (
    <div className="min-h-screen py-20 w-full bg-[#0A0A0F]">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Features
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto px-4">
          Experience the future of fitness with our AI-powered platform
        </p>
      </div>
      <LayoutGrid cards={cards} />
    </div>
  );
};

export default FeaturesGrid; 