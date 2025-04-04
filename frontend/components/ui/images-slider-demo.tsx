"use client";
import { motion } from "motion/react";
import React from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import ColourfulText from "@/components/ui/colourful-text";
import Link from "next/link";

export default function ImagesSliderDemo() {
  const images = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579126038374-6064e9370f0f?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2940&auto=format&fit=crop",
  ];
  
  return (
    <ImagesSlider className="h-screen" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center px-4"
      >
        <motion.p className="font-bold text-4xl md:text-6xl lg:text-7xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Transform Your Body with <br /> <ColourfulText text="CoreHealth AI" />
        </motion.p>
        <p className="text-gray-300 text-lg md:text-xl mb-8 mt-4 text-center max-w-3xl">
          Join thousands of users achieving their fitness goals with AI-powered personalized workouts and nutrition plans
        </p>
        <Link
          href="/signup"
          className="px-8 py-4 backdrop-blur-sm border bg-purple-500/10 border-purple-500/20 
                    text-white mx-auto text-center rounded-full relative mt-6 
                    hover:bg-purple-500/20 transition-all duration-300 text-lg font-medium"
        >
          <span>Start Your Journey →</span>
          <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-purple-500 to-transparent" />
        </Link>
      </motion.div>
    </ImagesSlider>
  );
} 