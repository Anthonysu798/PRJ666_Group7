"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import {
  HomeIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  ChartBarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  UsersIcon,
  SparklesIcon,
  AcademicCapIcon,
  BookOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import dotenv from "dotenv";
dotenv.config();

export default function MobileSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const initialPlan = (() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Check both possible locations for plan information
      return user.subscription?.plan || user.plan || 'basic';
    }
    return 'basic';
  })();
  
  const [userPlan, setUserPlan] = useState(initialPlan);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    
    // Always fetch user plan when component mounts or route changes
    if (token) {
      fetchUserPlan();
    }
  }, [router.pathname]);

  const fetchUserPlan = async () => {
    try {
      // Always fetch fresh data from the server
      const response = await fetch(
        `${apiUrl}/api/profile/getUserProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          cache: 'no-store', // Force fresh request
        }
      );
      const data = await response.json();

      if (response.ok) {
        // Check both possible locations for plan information
        const plan = data.user?.subscription?.plan || data.user?.plan || 'basic';
        console.log("Mobile sidebar detected plan:", plan);
        setUserPlan(plan);
        
        // Update localStorage with the latest plan information
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ 
          ...user, 
          plan: plan,
          subscription: data.user.subscription || { plan: plan, status: 'active' }
        }));
      }
    } catch (error) {
      console.error("Error fetching user plan:", error);
      setUserPlan('basic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const menuItems = [
    { name: t('dashboard'), icon: HomeIcon, href: "/dashboard" },
    { name: t('profile'), icon: UserIcon, href: "/dashboard/profile" },
    { name: t('subscription'), icon: CreditCardIcon, href: "/dashboard/subscription" },
    ...(userPlan === "basic" ? [
      { name: t('dietPlan'), icon: ClipboardDocumentListIcon, href: "/dashboard/diet" },
    ] : []),
    { name: t('workoutPlan'), icon: HeartIcon, href: "/dashboard/workout" },
    ...(userPlan !== "basic" ? [
      { name: t('advancedMealPlans'), icon: ClipboardDocumentListIcon, href: "/dashboard/Advanced-meal-plans" },
      { name: t('aiRecommendations'), icon: LightBulbIcon, href: "/dashboard/recommendations" },
      { name: t('community'), icon: UsersIcon, href: "/dashboard/community" },
    ] : []),
    ...(userPlan === "premium" ? [
      { name: t('aiCoaching'), icon: SparklesIcon, href: "/dashboard/ai-coaching" },
    ] : []),
    { name: t('settings'), icon: Cog6ToothIcon, href: "/dashboard/settings" },
  ];

  if (!mounted) {
    return null;
  }

  const isActiveRoute = (path) => router.pathname === path;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative flex flex-col w-64 max-w-xs h-full bg-[#0A0A0F] shadow-xl">
        <div className="flex items-center justify-between h-16 px-4 border-b border-purple-900/20">
          <Link
            href="/dashboard"
            className="text-xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 
                          bg-clip-text text-transparent"
            onClick={onClose}
          >
            CoreHealth AI
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white focus:outline-none"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                                      ${
                                        isActive
                                          ? "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                                          : "text-gray-400 hover:bg-[#13111C] hover:text-purple-400"
                                      }`}
                  onClick={onClose}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-purple-400"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="px-4 py-4">
          <div className="border-t border-purple-900/20 pt-4">
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-[#13111C] hover:text-purple-400 rounded-xl transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-purple-400" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
