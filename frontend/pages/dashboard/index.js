import { withAuth } from "../../middleware/authMiddleware";
import DashboardLayout from "../../components/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AIFitnessAssistant from "../../components/AIFitnessAssistant";
import dotenv from "dotenv";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
dotenv.config();

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Update the useCountAnimation hook to include delay
const useCountAnimation = (
  targetValue,
  duration = 1000,
  delay = 0,
  startOnMount = true,
) => {
  const [count, setCount] = useState(0);
  const [shouldStart, setShouldStart] = useState(false);

  useEffect(() => {
    if (!startOnMount) return;

    // Add delay before starting the animation
    const delayTimer = setTimeout(() => {
      setShouldStart(true);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [startOnMount, delay]);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(targetValue * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration, shouldStart]);

  return count;
};

// Update the formatTimeDisplay function
const formatTimeDisplay = (timeString) => {
  if (!timeString) return "00:00:00";

  // Convert to string if it's a number
  const strTime = String(timeString);

  // If timeString is already in HH:mm:ss format, return it
  if (strTime.includes(":")) return strTime;

  // If timeString is a number, convert it to HH:mm:ss
  const seconds = parseInt(strTime);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Add this new helper function to convert HH:mm:ss to seconds
const timeToSeconds = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userPlan, setUserPlan] = useState('basic');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef(null);
  const router = useRouter();

  // Add getPlanDetails function from profile.js
  const getPlanDetails = (planName) => {
    const plans = {
      basic: {
        name: "Basic",
        badge: "bg-gradient-to-r from-gray-400/10 to-gray-600/10 text-gray-400 border-gray-400/20",
        features: ["Basic workouts", "Basic meal tracking"]
      },
      standard: {
        name: "Standard",
        badge: "bg-gradient-to-r from-purple-400/10 to-violet-600/10 text-purple-400 border-purple-400/20",
        features: ["Custom workout plans", "AI meal suggestions", "Progress tracking"]
      },
      premium: {
        name: "Premium",
        badge: "bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 text-yellow-400 border-yellow-400/20",
        features: ["Personal trainer consultation", "Advanced analytics", "Priority support"]
      }
    };
    return plans[planName] || plans.basic;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (typeof window === "undefined") return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${apiUrl}/api/profile/getUserProfile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          cache: "no-cache",
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
          // Set user plan from profile data
          setUserPlan(data.user.plan?.toLowerCase() || 'basic');
          localStorage.setItem("user", JSON.stringify(data.user));

          const completionResponse = await fetch(
            `${apiUrl}/api/profile/checkProfileCompletion`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              mode: "cors",
              cache: "no-cache",
            },
          );

          if (completionResponse.ok) {
            const completionData = await completionResponse.json();
            setShowProfileAlert(!completionData.profileComplete);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleCompleteProfile = () => {
    router.push("/dashboard/profile");
  };

  const handleRemindLater = () => {
    setShowProfileAlert(false);
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const UpgradeModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-[#1E1B29] rounded-xl w-full max-w-3xl p-6 border border-purple-900/20 my-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Upgrade Your Plan
        </h3>
        <p className="text-gray-400 mb-6">
          Choose a plan that fits your fitness journey
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Standard Plan */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold text-purple-400">Standard</h4>
                <div className="text-2xl font-bold text-white mt-1">$19.99<span className="text-sm text-gray-400">/month</span></div>
              </div>
              <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm">Popular</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {[
                "Enhanced Workout Plan",
                "Advanced Meal Plans",
                "Real-Time Progress Tracking",
                "AI-Driven Recommendations",
                "Community Support"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-purple-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push('/dashboard/subscription?plan=standard')}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-500 
                       rounded-lg text-white font-medium hover:opacity-90 transition-all"
            >
              Select Standard
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-semibold text-yellow-400">Premium</h4>
                <div className="text-2xl font-bold text-white mt-1">$29.99<span className="text-sm text-gray-400">/month</span></div>
              </div>
              <div className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm">Best Value</div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {[
                "Custom AI Coaching",
                "Comprehensive Diet Plans",
                "Advanced Analytics",
                "Device Integration",
                "Priority Support"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-yellow-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => router.push('/dashboard/subscription?plan=premium')}
              className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 
                       rounded-lg text-white font-medium hover:opacity-90 transition-all"
            >
              Select Premium
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowUpgradeModal(false)}
          className="mt-6 px-4 py-2 text-gray-400 hover:text-white transition-colors mx-auto block"
        >
          Maybe Later
        </button>
      </div>
    </motion.div>
  );

  return (
    <DashboardLayout>
      {showUpgradeModal && <UpgradeModal />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="h-8 w-64 bg-purple-500/10 animate-pulse rounded-lg mb-8"></div>
        ) : (
          <>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-8">
              Welcome back, {user?.name || user?.fullName || "User"}!
            </h1>

            {/* Profile Completion Alert */}
            {showProfileAlert && (
              <div className="mb-8 animate-fade-in-up">
                <div className="bg-[#1E1B29]/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-2xl p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-xl border border-yellow-400/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        Complete Your Profile
                      </h3>
                      <p className="mt-2 text-gray-300 leading-relaxed">
                        Take a moment to complete your profile information. This
                        helps us provide you with a more personalized experience
                        and tailored workout recommendations.
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-gray-400">
                          <svg
                            className="w-5 h-5 mr-2 text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Personalized Workouts
                        </div>
                        <div className="flex items-center text-gray-400">
                          <svg
                            className="w-5 h-5 mr-2 text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Diet Recommendations
                        </div>
                      </div>
                      <div className="mt-6 flex gap-4">
                        <button
                          onClick={handleCompleteProfile}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 
                                                             hover:from-purple-600 hover:to-violet-600 text-white rounded-lg 
                                                             transition-all duration-300 text-sm font-medium"
                        >
                          Complete Profile
                        </button>
                        <button
                          onClick={handleRemindLater}
                          className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors text-sm"
                        >
                          Remind Me Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workout Plans Section */}
              <div className="bg-[#1E1B29]/95 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Workout Plans</h2>
                  <Link
                    href="/dashboard/workout"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push('/dashboard/workout')}
                    className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 
                             hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
                  >
                    Custom Plan
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/workout')}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2
                      ${userPlan === 'basic' 
                        ? 'bg-gradient-to-r from-yellow-600 to-amber-600' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                      } hover:opacity-90 text-white transition-all`}
                  >
                    {userPlan === 'basic' ? 'Upgrade for AI Workouts' : 'Generate AI Plan'}
                  </button>
                </div>
              </div>

              {/* Diet Plans Section */}
              <div className="bg-[#1E1B29]/95 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Nutrition Plans</h2>
                  <Link
                    href="/dashboard/diet"
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <button
                  onClick={() => router.push('/dashboard/diet')}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2
                    ${userPlan === 'basic' 
                      ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:opacity-90' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90'
                    } text-white transition-all`}
                >
                  {userPlan === 'basic' ? 'Upgrade to Access AI Diet Plans' : 'Generate AI Plan'}
                </button>
              </div>

              {/* Subscription Status with Plan Details */}
              <div className="bg-[#1E1B29]/95 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Subscription Status
                </h2>
                <div className="flex flex-col gap-2">
                  <span className={`
                    inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                    ${getPlanDetails(userPlan).badge}
                  `}>
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    {getPlanDetails(userPlan).name} Plan
                  </span>
                  <div className="text-sm text-gray-400 mt-2">
                    {getPlanDetails(userPlan).features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                {(userPlan === 'basic') && (
                  <Link
                    href="/pricing"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 
                             hover:from-purple-600 hover:to-violet-600 text-white rounded-lg transition-all duration-300
                             text-sm font-medium"
                  >
                    Upgrade Now
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Quick Tips */}
              <div className="bg-[#1E1B29]/95 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Quick Tips
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg border border-blue-500/20 
                                  flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm ml-3">
                      Stay hydrated! Aim to drink at least 8 glasses of water daily.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg border border-green-500/20 
                                  flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm ml-3">
                      Get enough sleep! Aim for 7-9 hours of quality sleep each night.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Dashboard);
