import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  const milestones = [
    {
      year: "2021",
      title: "Foundation",
      description: "CoreHealth AI was founded with a vision to revolutionize personal fitness through AI technology."
    },
    {
      year: "2022",
      title: "AI Integration",
      description: "Launched our proprietary AI algorithm for personalized workout and nutrition planning."
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Reached 100,000+ users across 30 countries, with 95% satisfaction rate."
    },
    {
      year: "2024",
      title: "Innovation Award",
      description: "Recognized as the leading AI fitness platform by Tech Innovation Awards."
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
            About <ColourfulText text="CoreHealth AI" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Revolutionizing fitness through artificial intelligence and personalized guidance
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1470&auto=format&fit=crop"
                alt="Our Mission"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <ColourfulText text="Mission" />
              </h2>
              <p className="text-gray-300 mb-6">
                At CoreHealth AI, we believe that everyone deserves access to personalized fitness guidance. 
                Our mission is to democratize personal training through artificial intelligence, making expert-level 
                fitness and nutrition guidance accessible to all.
              </p>
              <p className="text-gray-300">
                We combine cutting-edge AI technology with deep fitness expertise to create truly personalized 
                workout and nutrition plans that adapt to your progress, preferences, and goals.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our <ColourfulText text="Journey" />
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              From inception to innovation, our journey of transforming lives through AI-powered fitness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="text-purple-400 font-bold text-xl mb-2">{milestone.year}</div>
                <h3 className="text-white font-bold text-lg mb-3">{milestone.title}</h3>
                <p className="text-gray-400">{milestone.description}</p>
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
              Join Our Journey
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Be part of the fitness revolution with CoreHealth AI
            </p>
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

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
