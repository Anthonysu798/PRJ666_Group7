import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import Image from "next/image";

export default function Help() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How does CoreHealth AI create personalized workouts?",
          answer: "Our AI analyzes your fitness level, goals, and preferences to create custom workouts that adapt as you progress. The system learns from your performance and adjusts recommendations in real-time."
        },
        {
          question: "What equipment do I need?",
          answer: "CoreHealth AI adapts to your available equipment. You can specify what you have access to, and our AI will create workouts accordingly, whether you're at home or in a fully equipped gym."
        }
      ]
    },
    {
      category: "Account & Subscription",
      questions: [
        {
          question: "How do I change my subscription plan?",
          answer: "You can modify your subscription anytime from your account settings. Changes will take effect at the start of your next billing cycle."
        },
        {
          question: "Can I pause my membership?",
          answer: "Yes, you can pause your membership for up to 3 months from your account settings. Your progress and data will be saved."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "How can I access my workout history?",
          answer: "Your complete workout history is available in your dashboard under the 'History' tab. You can view detailed statistics and progress over time."
        },
        {
          question: "Is my data secure?",
          answer: "We use industry-standard encryption and security measures to protect your data. Your information is never shared without your explicit consent."
        }
      ]
    }
  ];

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: "💬",
      link: "#",
      availability: "24/7 Support"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: "📧",
      link: "mailto:support@corehealthai.com",
      availability: "Response within 24h"
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: "👥",
      link: "/community",
      availability: "Active Community"
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
            How Can We <ColourfulText text="Help?" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-6 py-4 rounded-full bg-white/5 border border-purple-500/20 
                       text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-400 hover:text-purple-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Support Channels */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{channel.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{channel.title}</h3>
                <p className="text-gray-300 mb-4">{channel.description}</p>
                <span className="text-sm text-purple-400">{channel.availability}</span>
                <Link
                  href={channel.link}
                  className="mt-4 inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Get Support
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Frequently Asked <ColourfulText text="Questions" />
            </h2>
          </div>

          <div className="space-y-12">
            {faqs.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                         border border-purple-500/10 overflow-hidden"
              >
                <div className="p-6 border-b border-purple-500/10">
                  <h3 className="text-2xl font-bold text-white">{category.category}</h3>
                </div>
                <div className="p-6 space-y-6">
                  {category.questions.map((faq, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-lg font-medium text-white">{faq.question}</h4>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
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
