import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import Image from "next/image";

export default function Press() {
  const pressReleases = [
    {
      title: "CoreHealth AI Raises $10M Series A to Revolutionize Fitness Technology",
      date: "March 15, 2025",
      source: "TechCrunch",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Leading AI fitness platform secures funding to expand its personalized training technology.",
      link: "#"
    },
    {
      title: "CoreHealth AI Named Top 10 AI Fitness Startups to Watch",
      date: "February 1, 2025",
      source: "Forbes",
      image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2070&auto=format&fit=crop",
      excerpt: "Innovative startup recognized for its breakthrough approach to personalized fitness.",
      link: "#"
    },
    {
      title: "The Future of Fitness: How CoreHealth AI is Transforming Personal Training",
      date: "December 15, 2024",
      source: "Wired",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      excerpt: "An in-depth look at how AI is revolutionizing the fitness industry.",
      link: "#"
    }
  ];

  const mediaKit = {
    brandAssets: [
      {
        title: "Logo Package",
        description: "Official CoreHealth AI logos in various formats",
        downloadLink: "#"
      },
      {
        title: "Brand Guidelines",
        description: "Official colors, typography, and usage guidelines",
        downloadLink: "#"
      },
      {
        title: "Product Images",
        description: "High-resolution product screenshots and mockups",
        downloadLink: "#"
      }
    ]
  };

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
            Press & <ColourfulText text="Media" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Latest news, press releases, and media resources
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Press Releases Section */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pressReleases.map((press, index) => (
              <motion.div
                key={press.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={press.image}
                    alt={press.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-purple-400 text-sm">{press.date}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-purple-400 text-sm">{press.source}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{press.title}</h3>
                  <p className="text-gray-300 mb-4">{press.excerpt}</p>
                  <Link
                    href={press.link}
                    className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Read Full Article
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Kit Section */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Media <ColourfulText text="Resources" />
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Download official brand assets and media materials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mediaKit.brandAssets.map((asset, index) => (
              <motion.div
                key={asset.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-3">{asset.title}</h3>
                <p className="text-gray-300 mb-4">{asset.description}</p>
                <Link
                  href={asset.downloadLink}
                  className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Download
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
