"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ColourfulText from "@/components/ui/colourful-text";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "AI Technology", href: "/technology" },
    { name: "Success Stories", href: "/success-stories" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Press", href: "/press" },
  ],
  resources: [
    { name: "Community", href: "/community" },
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0A0A0F] py-20">
      {/* Gradient Separator Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 
                        bg-clip-text text-transparent hover:from-purple-400 hover:via-violet-500 hover:to-fuchsia-500 
                        transition-all duration-300"
            >
              CoreHealth AI
            </Link>
            <p className="text-gray-400 text-sm mt-4 max-w-xs">
              Transform your fitness journey with AI-powered personalized workouts and nutrition plans.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Social Links */}
              <Link href="https://twitter.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                Twitter
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                LinkedIn
              </Link>
              <Link href="https://github.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                GitHub
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-purple-500/20">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} CoreHealth AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 