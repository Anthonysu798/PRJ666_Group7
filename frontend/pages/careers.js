import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import Image from "next/image";

export default function Careers() {
  const positions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Join our core team developing cutting-edge AI algorithms for fitness and nutrition personalization.",
      requirements: [
        "5+ years experience in ML/AI",
        "Strong Python and TensorFlow/PyTorch",
        "Experience with fitness/health tech",
        "MSc/PhD in Computer Science or related"
      ]
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote / London",
      type: "Full-time",
      description: "Build and maintain our web platform using Next.js, React, and Node.js.",
      requirements: [
        "3+ years full stack experience",
        "Expertise in React and Node.js",
        "Experience with AWS/Cloud",
        "Strong TypeScript skills"
      ]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / Berlin",
      type: "Full-time",
      description: "Create intuitive and beautiful interfaces for our AI-powered fitness platform.",
      requirements: [
        "4+ years UI/UX experience",
        "Strong portfolio of digital products",
        "Experience with Figma",
        "Health/fitness industry knowledge"
      ]
    }
  ];

  const benefits = [
    {
      title: "Remote-First Culture",
      description: "Work from anywhere in the world with flexible hours",
      icon: "🌍"
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive healthcare and fitness benefits",
      icon: "💪"
    },
    {
      title: "Learning Budget",
      description: "Annual budget for courses and conferences",
      icon: "📚"
    },
    {
      title: "Stock Options",
      description: "Be an owner in our growing company",
      icon: "📈"
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
            Join Our <ColourfulText text="Mission" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Help us revolutionize the future of fitness with AI technology
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Open Positions */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Open <ColourfulText text="Positions" />
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join our team of passionate individuals working to transform the fitness industry
            </p>
          </div>

          <div className="grid gap-8">
            {positions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="text-purple-400 text-sm">{position.department}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-purple-400 text-sm">{position.location}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-purple-400 text-sm">{position.type}</span>
                    </div>
                    <p className="text-gray-300 mb-4">{position.description}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {position.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-300 flex items-center">
                          <span className="text-purple-400 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/apply/${position.title.toLowerCase().replace(/ /g, '-')}`}
                    className="inline-flex items-center px-6 py-2 rounded-full text-sm font-medium
                              bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 
                              hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                              text-white transition-all duration-200 shadow-lg shadow-purple-500/25 
                              hover:shadow-purple-500/40"
                  >
                    Apply Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Join <ColourfulText text="CoreHealth AI" />
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We offer competitive benefits and a culture that promotes growth and innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
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
              Ready to Make an Impact?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join us in revolutionizing the fitness industry with AI technology
            </p>
            <Link
              href="/positions"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-medium
                        bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 
                        hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                        text-white transition-all duration-200 shadow-lg shadow-purple-500/25 
                        hover:shadow-purple-500/40 hover:scale-105"
            >
              View All Positions
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
