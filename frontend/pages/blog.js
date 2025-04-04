import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import Image from "next/image";

export default function Blog() {
  const blogPosts = [
    {
      title: "One Year of CoreHealth AI: Transforming Fitness Through AI",
      date: "April 3, 2025",
      author: "Founder",
      category: "Company News",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1470&auto=format&fit=crop",
      excerpt: "Reflecting on our journey from inception to helping thousands achieve their fitness goals.",
      readTime: "7 min read"
    },
    {
      title: "Introducing Advanced AI Training Features",
      date: "March 15, 2025",
      author: "Tech Team",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1470&auto=format&fit=crop",
      excerpt: "Our latest AI algorithms now adapt to user progress in real-time, delivering even more personalized workouts.",
      readTime: "8 min read"
    },
    {
      title: "The Birth of CoreHealth AI: Our Foundation Story",
      date: "August 28, 2024",
      author: "Founder",
      category: "Company News",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop",
      excerpt: "How a vision to democratize personalized fitness training became CoreHealth AI.",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen relative" style={{ 
      background: 'var(--bg-color, #0A0A0F)',
      transition: 'background-color 0.5s ease'
    }}>
      {/* Navigation - Using existing nav structure */}
      <nav className="bg-[#0A0A0F]/50 backdrop-blur-sm fixed w-full z-10 border-b border-purple-900/20">
        {/* Reference to existing nav structure */}
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
            Our <ColourfulText text="Journey" /> Blog
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Follow our story as we transform the future of fitness with AI
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Blog Posts Timeline */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline Line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                
                {/* Timeline Dot */}
                <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-violet-500"></div>

                {/* Content Card */}
                <div className="ml-8 p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                              border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="relative h-64 rounded-xl overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/80 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-purple-400 text-sm">{post.date}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-purple-400 text-sm">{post.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-3">{post.title}</h2>
                      <p className="text-gray-300 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-purple-400">{post.category}</span>
                        <Link
                          href={`/blog/${post.title.toLowerCase().replace(/ /g, '-')}`}
                          className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          Read More
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
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
