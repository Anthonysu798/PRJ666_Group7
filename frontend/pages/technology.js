import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import Image from "next/image";

export default function Technology() {
  const technologies = [
    {
      title: "Machine Learning Core",
      description: "Advanced algorithms that learn and adapt to your unique fitness journey",
      features: [
        "Personalized workout recommendations",
        "Adaptive difficulty scaling",
        "Progress pattern recognition",
        "Real-time form analysis"
      ],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1470&auto=format&fit=crop",
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    {
      title: "Natural Language Processing",
      description: "Understand and respond to your fitness goals with human-like comprehension",
      features: [
        "Goal interpretation",
        "Contextual recommendations",
        "Personalized feedback",
        "Smart communication"
      ],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
      gradient: "from-purple-500 via-violet-500 to-fuchsia-500"
    },
    {
      title: "Computer Vision",
      description: "Real-time analysis and feedback for perfect form and technique",
      features: [
        "Form correction",
        "Movement tracking",
        "Rep counting",
        "Performance analysis"
      ],
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1632&auto=format&fit=crop",
      gradient: "from-fuchsia-500 via-rose-500 to-orange-500"
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
      <div className="relative min-h-[80vh] flex items-center justify-center px-4">
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
            Powered by Advanced <ColourfulText text="AI Technology" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Experience the future of fitness with our cutting-edge artificial intelligence
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Technology Showcase */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="mb-20 last:mb-0"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className={`order-2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                  <h2 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${tech.gradient} bg-clip-text text-transparent mb-4`}>
                    {tech.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    {tech.description}
                  </p>
                  <ul className="space-y-4">
                    {tech.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tech.gradient}`}></span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`order-1 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
                    <Image
                      src={tech.image}
                      alt={tech.title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${tech.gradient} opacity-20`}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-[#0A0A0F] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              Experience the Power of AI
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are transforming their fitness journey with our AI-powered platform
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
