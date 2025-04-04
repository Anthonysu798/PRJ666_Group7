"use client";
import React from "react";
import ColourfulText from "@/components/ui/colourful-text";
import { motion } from "motion/react";
import Image from "next/image";

export default function ColourfulTextDemo() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0A0A0F]">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/dietplan.png"
          alt="Diet Plan Background"
          fill
          className="object-cover [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
          priority
        />
      </motion.div>
      <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
        Transform your <ColourfulText text="nutrition" /> <br /> with AI-powered plans
      </h1>
    </div>
  );
} 