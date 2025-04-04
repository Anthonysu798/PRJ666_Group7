import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";

export default function Privacy() {
  const privacyContent = [
    {
      title: "Data Collection",
      content: [
        {
          subtitle: "Information We Collect",
          details: "We collect information that you provide directly to us, including your name, email address, and fitness goals. We do not collect or store any payment information directly."
        },
        {
          subtitle: "Usage Data",
          details: "We collect data about your interactions with our platform, including workout completion rates and preferences, to improve our AI recommendations."
        }
      ]
    },
    {
      title: "Data Usage",
      content: [
        {
          subtitle: "How We Use Your Data",
          details: "Your data is used to personalize your workout experience and improve our AI algorithms. We never sell your personal information to third parties."
        },
        {
          subtitle: "AI Training",
          details: "Our AI models are trained on anonymized, aggregated data to improve workout recommendations while maintaining user privacy."
        }
      ]
    },
    {
      title: "Data Protection",
      content: [
        {
          subtitle: "Security Measures",
          details: "We employ industry-standard encryption and security protocols to protect your personal information from unauthorized access or disclosure."
        },
        {
          subtitle: "Data Storage",
          details: "Your data is stored on secure servers with regular backups and strict access controls."
        }
      ]
    },
    {
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Control",
          details: "You have the right to access, modify, or delete your personal data at any time through your account settings."
        },
        {
          subtitle: "Data Portability",
          details: "You can request a copy of your data in a structured, commonly used format."
        }
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
      <div className="relative min-h-[40vh] flex items-center justify-center px-4">
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
            Privacy <ColourfulText text="Policy" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Your privacy is our top priority. Learn how we protect and handle your data.
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Privacy Content */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {privacyContent.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-bold text-white">
                  {section.title}
                </h2>
                <div className="space-y-8">
                  {section.content.map((item, i) => (
                    <div key={i} className="rounded-2xl bg-gradient-to-b from-purple-500/5 to-transparent 
                                        border border-purple-500/10 p-6 space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Have Questions About Your Privacy?
            </h2>
            <p className="text-gray-300 mb-8">
              Contact our Data Protection Officer at privacy@corehealthai.com
            </p>
            <Link
              href="/help"
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium
                      bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 
                      hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500
                      text-white transition-all duration-200 shadow-lg shadow-purple-500/25 
                      hover:shadow-purple-500/40"
            >
              Contact Support
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
