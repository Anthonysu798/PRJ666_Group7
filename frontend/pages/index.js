import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from 'react';
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulTextDemo from "../components/ui/colourful-text-demo";
import ColourfulText from "../components/ui/colourful-text";
import { LampContainer } from "../components/ui/lamp";
import WorldMapDemo from "../components/ui/world-map-demo";
import Image from "next/image";
import { motion } from "motion/react";
import LayoutGridDemo from "../components/ui/layout-grid-demo";
import InfiniteMovingCardsDemo from "../components/ui/infinite-moving-cards-demo";
import ImagesSliderDemo from "../components/ui/images-slider-demo";
import Footer from "../components/ui/footer";

export default function Home() {
  return (
    <div className="min-h-screen relative" style={{ 
      background: 'var(--bg-color, #0A0A0F)',
      transition: 'background-color 0.5s ease'
    }}>
      {/* Navigation */}
      <nav className="bg-[#0A0A0F]/50 backdrop-blur-sm fixed w-full z-10 border-b border-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 
                            bg-clip-text text-transparent hover:from-purple-400 hover:via-violet-500 hover:to-fuchsia-500 
                            transition-all duration-300"
              >
                CoreHealth AI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                            text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 
                            shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Sparkles */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Sparkles Background */}
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Transform Your Fitness Journey with AI
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Personalized workout plans and nutrition guidance powered by artificial intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 
                        hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                        text-white px-8 py-3 rounded-full text-lg font-medium 
                        transition-all duration-200 shadow-lg shadow-purple-500/25 
                        hover:shadow-purple-500/40"
            >
              Get Started Free
            </Link>
            <Link
              href="/about"
              className="bg-white/10 text-white hover:bg-white/20 
                        px-8 py-3 rounded-full text-lg font-medium 
                        transition-all duration-200 backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Features Grid Section */}
      <div className="relative w-full bg-[#0A0A0F]">
        <div className="text-center mb-12 pt-20">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
           <ColourfulText text="Discover Our Features" />
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto px-4">
            Experience the power of AI-driven fitness and nutrition planning
          </p>
        </div>
        <LayoutGridDemo />
      </div>

      {/* Colorful Text Section */}
      <div className="relative h-[80vh] w-full overflow-hidden bg-[#0A0A0F]">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/dietplan.png"
            alt="Diet Plan Background"
            fill
            className="object-cover [mask-image:radial-gradient(circle,transparent,black_80%)]"
            priority
          />
          {/* Gradient overlay to match your theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white mb-6">
            Transform your <ColourfulText text="nutrition" /> <br /> with AI-powered plans
          </h1>
        </div>

        {/* Gradient Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
      </div>

      {/* Lamp Section */}
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-purple-300 to-purple-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Achieve Your <br /> Fitness Goals
        </motion.h1>
      </LampContainer>

      {/* World Map Section */}
      <WorldMapDemo />

      {/* Testimonials Section */}
      <div className="relative w-full bg-[#0A0A0F]">
        {/* Gradient Separator Top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
        
        <InfiniteMovingCardsDemo />
        
        {/* Gradient Separator Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
      </div>

      {/* Image Slider Section - Full Screen */}
      <div className="relative w-full h-screen bg-[#0A0A0F]">
        {/* Gradient Separator Top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
        
        <ImagesSliderDemo />
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}