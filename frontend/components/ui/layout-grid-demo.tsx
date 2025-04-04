"use client";
import React from "react";
import { LayoutGrid } from "@/components/ui/layout-grid";
import ColourfulText from "@/components/ui/colourful-text";

const FeatureOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        AI-Powered <ColourfulText text="Nutrition" /> Plans
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Get personalized meal plans and nutrition guidance tailored to your goals, preferences, and dietary needs.
      </p>
    </div>
  );
};

const FeatureTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Smart <ColourfulText text="Workout" /> Plans
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        AI-driven workout routines that adapt to your progress and fitness level, ensuring optimal results.
      </p>
    </div>
  );
};

const FeatureThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Global <ColourfulText text="Community" />
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Connect with fitness enthusiasts worldwide, share progress, and stay motivated together.
      </p>
    </div>
  );
};

const FeatureFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        AI <ColourfulText text="Recommendations" />
      </p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Get smart suggestions and insights based on your performance and goals.
      </p>
    </div>
  );
};

const cards = [
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

export default function LayoutGridDemo() {
  return (
    <div className="h-full w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
} 