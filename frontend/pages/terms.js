import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";

export default function Terms() {
  const termsContent = [
    {
      title: "Terms of Use",
      content: [
        {
          subtitle: "Acceptance of Terms",
          details: "By accessing or using CoreHealth AI, you agree to be bound by these terms of service and all applicable laws and regulations."
        },
        {
          subtitle: "Age Restrictions",
          details: "You must be at least 18 years old to use CoreHealth AI. Users between 13-17 may only use the service with parental consent and supervision."
        }
      ]
    },
    {
      title: "User Accounts",
      content: [
        {
          subtitle: "Account Responsibility",
          details: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
        },
        {
          subtitle: "Account Termination",
          details: "We reserve the right to suspend or terminate accounts that violate our terms of service or engage in unauthorized activities."
        }
      ]
    },
    {
      title: "Service Usage",
      content: [
        {
          subtitle: "Acceptable Use",
          details: "You agree to use CoreHealth AI for personal fitness purposes only. Any commercial use or unauthorized access is strictly prohibited."
        },
        {
          subtitle: "AI Recommendations",
          details: "While our AI strives to provide personalized recommendations, users should exercise judgment and consult healthcare professionals when needed."
        }
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Ownership Rights",
          details: "All content, features, and functionality of CoreHealth AI are owned by us and protected by international copyright and trademark laws."
        },
        {
          subtitle: "User Content",
          details: "By sharing content on our platform, you grant us a non-exclusive license to use, modify, and display that content for service-related purposes."
        }
      ]
    },
    {
      title: "Liability",
      content: [
        {
          subtitle: "Disclaimer",
          details: "CoreHealth AI is provided 'as is' without warranties of any kind. We are not liable for any injuries or damages resulting from the use of our service."
        },
        {
          subtitle: "Limitation of Liability",
          details: "Our liability is limited to the amount paid for the service in the past 12 months, where permitted by law."
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
            Terms of <ColourfulText text="Service" />
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Please read these terms carefully before using CoreHealth AI
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Terms Content */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {termsContent.map((section, index) => (
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
              Questions About Our Terms?
            </h2>
            <p className="text-gray-300 mb-8">
              Contact our Legal Team at legal@corehealthai.com
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
