import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect } from 'react';
import { LayoutGrid } from "@/components/ui/layout-grid";


export default function Home() {
  const router = useRouter();

  // Add cards data
  const cards = [
    {
      id: 1,
      content: "Start Your Fitness Journey",
      className: "md:col-span-2",
      thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3"
    },
    {
      id: 2,
      content: "Personalized Workouts",
      className: "col-span-1",
      thumbnail: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-4.0.3"
    },
    {
      id: 3,
      content: "Track Your Progress",
      className: "col-span-1",
      thumbnail: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3"
    }
  ];

  useEffect(() => {
    // Add CSS variable for background color
    document.documentElement.style.setProperty('--bg-color', '#0A0A0F');
  }, []);

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
      <LayoutGrid cards={cards} />
    </div>
  );
}