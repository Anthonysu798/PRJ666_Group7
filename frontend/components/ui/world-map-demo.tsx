"use client";
import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";

export default function WorldMapDemo() {
  return (
    <div className="py-40 bg-[#0A0A0F] w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl text-white">
          Global{" "}
          <span className="text-purple-400">
            {"Community".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto py-4">
          Join millions of users worldwide transforming their fitness journey with CoreHealth AI. 
          Our AI-powered platform connects fitness enthusiasts across the globe, sharing success stories and workout achievements.
        </p>
      </div>
      <WorldMap
        lineColor="#A855F7" // Purple color to match your theme
        dots={[
          {
            start: { lat: 40.7128, lng: -74.0060 }, // New York
            end: { lat: 51.5074, lng: -0.1278 }, // London
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
          },
          {
            start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            end: { lat: -33.8688, lng: 151.2093 }, // Sydney
          },
          {
            start: { lat: 40.7128, lng: -74.0060 }, // New York
            end: { lat: -23.5505, lng: -46.6333 }, // São Paulo
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.2090 }, // New Delhi
          },
          {
            start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            end: { lat: 22.3193, lng: 114.1694 }, // Hong Kong
          },
        ]}
      />
    </div>
  );
} 