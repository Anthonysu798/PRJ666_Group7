import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import Image from "next/image";

export default function SuccessStories() {
  const stories = [
    {
      name: "Sarah Johnson",
      title: "Lost 30 lbs in 6 months",
      story: "CoreHealth AI transformed my approach to fitness. The personalized workouts and nutrition plans made all the difference.",
      achievement: "Achieved her goal weight and completed her first marathon",
      image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1974&auto=format&fit=crop",
      stats: [
        { label: "Weight Lost", value: "30 lbs" },
        { label: "Months", value: "6" },
        { label: "Workouts", value: "120+" }
      ]
    },
    {
      name: "Michael Chen",
      title: "Gained 15 lbs of muscle",
      story: "The AI-powered workout plans helped me break through plateaus I'd been stuck at for years. The progress tracking kept me motivated.",
      achievement: "Competed in his first bodybuilding competition",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop",
      stats: [
        { label: "Muscle Gained", value: "15 lbs" },
        { label: "Months", value: "8" },
        { label: "Strength Increase", value: "40%" }
      ]
    },
    {
      name: "Emily Rodriguez",
      title: "Recovered from injury",
      story: "After my knee injury, CoreHealth AI's adaptive workouts helped me rebuild strength safely. The progress was incredible.",
      achievement: "Returned to competitive sports",
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop",
      stats: [
        { label: "Recovery Time", value: "4 months" },
        { label: "Mobility", value: "100%" },
        { label: "Pain Level", value: "0" }
      ]
    }
  ];

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

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center px-4">
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

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Real <ColourfulText text="Success" /> Stories
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Discover how our AI-powered platform has transformed lives
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Success Stories Grid */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative h-[400px] rounded-2xl overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2">{story.name}</h3>
                    <p className="text-purple-400 font-semibold mb-4">{story.title}</p>
                    <p className="text-gray-300 mb-6">{story.story}</p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {story.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-purple-400 font-medium">
                      Achievement: {story.achievement}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-[#0A0A0F] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              Start Your Success Story Today
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their lives with CoreHealth AI
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium
                        bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 
                        hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                        text-white transition-all duration-200 shadow-lg shadow-purple-500/25 
                        hover:shadow-purple-500/40 hover:scale-105"
            >
              Begin Your Journey
              <svg 
                className="ml-2 -mr-1 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
