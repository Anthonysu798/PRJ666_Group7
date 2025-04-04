"use client";
import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import ColourfulText from "@/components/ui/colourful-text";

const testimonials = [
  {
    quote: "CoreHealth AI has transformed my fitness journey. The personalized workout plans are incredible!",
    name: "Sarah Johnson",
    title: "Lost 30lbs in 6 months"
  },
  {
    quote: "The AI-powered nutrition advice is like having a personal nutritionist 24/7.",
    name: "Michael Chen",
    title: "Fitness Enthusiast"
  },
  {
    quote: "The community support and AI recommendations keep me motivated. It's like having a personal trainer and nutritionist available 24/7.",
    name: "Emma Rodriguez",
    title: "Fitness enthusiast",
  },
  {
    quote: "I've tried many fitness apps, but CoreHealth AI's personalization is unmatched. The AI truly understands my fitness goals and adjusts accordingly.",
    name: "David Kim",
    title: "Marathon runner",
  },
  {
    quote: "The progress tracking and AI insights have helped me break through plateaus I never thought possible. This platform is revolutionary!",
    name: "Lisa Thompson",
    title: "Achieved fitness goals in 4 months",
  },
];

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] flex flex-col antialiased bg-[#0A0A0F] items-center justify-center relative overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          What Our <ColourfulText text="Users" /> Say
        </h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto px-4">
          Join thousands of satisfied users transforming their lives with CoreHealth AI
        </p>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
} 