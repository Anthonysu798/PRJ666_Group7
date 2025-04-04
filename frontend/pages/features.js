import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";

export default function Features() {
  return (
    <div className="min-h-screen relative" style={{ 
      background: 'var(--bg-color, #0A0A0F)',
      transition: 'background-color 0.5s ease'
    }}>
      {/* Navigation - Using the same nav from index.js */}
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
            Our <ColourfulText text="Features" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Discover how CoreHealth AI transforms your fitness journey with cutting-edge technology
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Features Grid Section */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Core Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the power of AI-driven fitness and nutrition planning
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300"
              >
                {/* Feature Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent"></div>
                </div>

                {/* Feature Content */}
                <div className="relative p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-purple-300 to-violet-400 
                               bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-violet-500 
                               transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/5 rounded-full 
                               blur-2xl group-hover:bg-purple-500/10 transition-all duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Everything You Need Section */}
      <div className="pb-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive features designed to transform your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 p-8 hover:border-purple-500/20 transition-all duration-300
                         backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10"
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-purple-300 to-violet-400 
                               bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-violet-500 
                               transition-all duration-300">
                    {category.title}
                  </h3>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full 
                                opacity-50 group-hover:w-16 group-hover:opacity-100 transition-all duration-300"></div>
                </div>

                {/* Features List */}
                <ul className="space-y-4">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-gray-300 group-hover:text-gray-200 
                                           transition-colors duration-200">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-500 
                                     group-hover:bg-purple-400 transition-colors duration-200"></span>
                      <span className="text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/5 rounded-full 
                               blur-2xl group-hover:bg-purple-500/10 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-violet-500/5 rounded-full 
                               blur-2xl group-hover:bg-violet-500/10 transition-all duration-300"></div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium
                        bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 
                        hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                        text-white transition-all duration-200 shadow-lg shadow-purple-500/25 
                        hover:shadow-purple-500/40 hover:scale-105"
            >
              Get Started Free
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const featureCategories = [
  {
    title: "AI-Powered Workouts",
    features: [
      "Personalized training plans",
      "Real-time form correction",
      "Adaptive difficulty scaling",
      "Progress tracking analytics"
    ]
  },
  {
    title: "Nutrition Planning",
    features: [
      "Custom meal recommendations",
      "Dietary restriction handling",
      "Macro tracking",
      "Shopping list generation"
    ]
  },
  {
    title: "Smart Analytics",
    features: [
      "Performance metrics",
      "Progress visualization",
      "Goal tracking",
      "Health insights"
    ]
  }
];

const features = [
  {
    title: "AI-Powered Workouts",
    description: "Experience personalized training that adapts to your progress and goals in real-time.",
    image: "/workoutplan.png",
    benefits: [
      "Smart workout customization",
      "Real-time form correction",
      "Progressive overload optimization",
      "Recovery time recommendations"
    ]
  },
  {
    title: "Nutrition Planning",
    description: "Get tailored meal plans and nutrition guidance based on your dietary preferences and goals.",
    image: "/dietplan.png",
    benefits: [
      "Personalized meal recommendations",
      "Macro and calorie tracking",
      "Shopping list generation",
      "Dietary restriction handling"
    ]
  },
  {
    title: "Progress Analytics",
    description: "Track your fitness journey with advanced analytics and insights powered by AI.",
    image: "/airecommendation.png",
    benefits: [
      "Detailed progress tracking",
      "Performance metrics",
      "Goal achievement analytics",
      "Trend analysis and insights"
    ]
  },
  {
    title: "Community Support",
    description: "Join a global community of fitness enthusiasts and share your journey.",
    image: "/community.png",
    benefits: [
      "Connect with like-minded people",
      "Share achievements and tips",
      "Group challenges and events",
      "Expert guidance and support"
    ]
  }
];
