import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import WorldMapDemo from "../components/ui/world-map-demo";
import Link from "next/link";
import Image from "next/image";

export default function Community() {
  const communityHighlights = [
    {
      title: "Global Community",
      count: "100,000+",
      description: "Active members worldwide",
      icon: "🌍"
    },
    {
      title: "Workout Sessions",
      count: "1M+",
      description: "AI-powered workouts completed",
      icon: "💪"
    },
    {
      title: "Success Stories",
      count: "50,000+",
      description: "Transformation journeys shared",
      icon: "⭐"
    }
  ];

  const communityFeatures = [
    {
      title: "Community Challenges",
      description: "Join monthly fitness challenges and compete with members worldwide",
      icon: "🏆",
      features: [
        "Global leaderboards",
        "Monthly prizes",
        "Team competitions",
        "Progress tracking"
      ]
    },
    {
      title: "Group Training",
      description: "Connect with like-minded individuals in AI-powered group sessions",
      icon: "👥",
      features: [
        "Virtual group workouts",
        "Real-time interaction",
        "Shared achievements",
        "Community support"
      ]
    },
    {
      title: "Knowledge Sharing",
      description: "Learn and share fitness insights with our global community",
      icon: "💡",
      features: [
        "Expert discussions",
        "Success stories",
        "Workout tips",
        "Nutrition advice"
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
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 
                            bg-clip-text text-transparent hover:from-purple-400 hover:via-violet-500 hover:to-fuchsia-500 
                            transition-all duration-300">
                CoreHealth AI
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                            text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 
                            shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
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
            Join Our Global <ColourfulText text="Community" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Connect with fitness enthusiasts worldwide and share your journey
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium
                      bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 
                      hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                      text-white transition-all duration-200 shadow-lg shadow-purple-500/25 
                      hover:shadow-purple-500/40 hover:scale-105"
          >
            Join Now
          </Link>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Community Stats */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {communityHighlights.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.count}</div>
                <h3 className="text-xl font-bold text-white mb-2">{stat.title}</h3>
                <p className="text-gray-300">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* World Map Section */}
      <WorldMapDemo />

      {/* Community Features Section - Replacing Featured Members */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Community <ColourfulText text="Features" />
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience the power of AI-driven fitness in a supportive global community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {communityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300 p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
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
              Join Our Community
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
