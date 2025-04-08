import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/sparkles";
import ColourfulText from "../components/ui/colourful-text";
import Footer from "../components/ui/footer";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function Pricing() {
  const plans = [
    {
      name: "BASIC",
      price: "FREE",
      planId: "basic",
      features: [
        "Personalized Workout Plan",
        "Basic Diet Plan",
        "Basic Workout Plan",
        "No AI Features",
      ],
      color: "bg-[#13111C]",
      borderColor: "border-gray-700",
      buttonColor: "bg-gray-700 hover:bg-gray-600",
      recommended: false,
    },
    {
      name: "STANDARD",
      price: "$19.99/month",
      planId: "standard",
      features: [
        "All Basic Plan Features",
        "AI Workout Plan",
        "AI Meal Plans",
        "AI-Driven Recommendations",
        "Community Support",
      ],
      color: "bg-[#170F23]",
      borderColor: "border-purple-700",
      buttonColor: "bg-purple-600 hover:bg-purple-500",
      recommended: true,
    },
    {
      name: "PREMIUM",
      price: "$29.99/month",
      planId: "premium",
      features: [
        "All Standard Plan Features",
        "Custom AI Coaching",
        "Comprehensive Diet Plans",
        "Priority Support",
        "Specialized Programs",
      ],
      color: "bg-[#1A1B26]",
      borderColor: "border-indigo-700",
      buttonColor: "bg-indigo-600 hover:bg-indigo-500",
      recommended: false,
    },
  ];

  const faqs = [
    {
      question: "What's included in the free plan?",
      answer: "The Basic (free) plan includes personalized workout plans, basic diet recommendations, progress tracking, and weekly feedback. It's perfect for those just starting their fitness journey."
    },
    {
      question: "Can I switch between plans?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll immediately get access to new features. If you downgrade, you'll continue to have access to your current plan until the end of your billing period."
    },
    {
      question: "How does the AI personalization work?",
      answer: "Our AI analyzes your fitness goals, current fitness level, dietary preferences, and workout history to create personalized plans. The more you use the platform, the better it becomes at tailoring recommendations to your needs."
    },
    {
      question: "Is there a long-term contract?",
      answer: "No, all our paid plans are month-to-month subscriptions. You can cancel at any time without any long-term commitment or cancellation fees."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods including PayPal, Apple Pay, and Google Pay."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime through your account settings. Once cancelled, you'll continue to have access until the end of your current billing period."
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
            Simple, <ColourfulText text="Transparent" /> Pricing
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Choose the perfect plan to achieve your fitness goals with personalized workouts and nutrition guidance
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4 mx-auto max-w-[1400px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col p-6 w-full max-w-md ${plan.color} 
                         backdrop-blur-sm border-2 ${plan.borderColor} rounded-2xl shadow-xl xl:p-8 
                         transform transition-all duration-500 hover:scale-105 relative
                         ${plan.recommended ? "border-purple-500" : ""}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-violet-600 
                                 text-white px-4 py-1 rounded-full text-sm font-semibold 
                                 shadow-lg shadow-purple-500/25">
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="mb-4 text-2xl font-semibold bg-gradient-to-r from-purple-300 to-violet-400 
                             bg-clip-text text-transparent">
                  {plan.name}
                </h3>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">
                    {plan.price === "FREE" ? "FREE" : plan.price.split("/")[0]}
                  </span>
                  {plan.price !== "FREE" && (
                    <span className="text-gray-400 ml-2">/month</span>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="flex-grow mb-8">
                <ul role="list" className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <CheckIcon className="flex-shrink-0 w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <Link
                href={plan.price === "FREE" ? "/signup" : "/login"}
                className={`w-full px-4 py-3 text-center rounded-xl text-white font-medium
                           transition-all duration-200 ${plan.buttonColor}
                           ${plan.recommended ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500' : ''}`}
              >
                {plan.price === "FREE" ? "Get Started" : "Choose Plan"}
              </Link>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#13111C]/50 backdrop-blur-sm border border-purple-500/10 
                         rounded-xl p-6 hover:border-purple-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-400">
                  {faq.answer}
                </p>
                
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 
                              bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6">
              Still have questions? We're here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium
                        bg-white/10 text-white hover:bg-white/20 
                        transition-all duration-200 backdrop-blur-sm"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
