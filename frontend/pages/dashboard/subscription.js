import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import dotenv from "dotenv";
import CheckoutButton from "../../components/CheckoutButton";
import { useRouter } from "next/navigation";

dotenv.config();

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    const success = query.get('success');
    const canceled = query.get('canceled');

    if (sessionId) {
      console.log("Session ID detected:", sessionId);
      fetch(`${apiUrl}/api/stripe/session-status?sessionId=${sessionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log("Session status response:", data);
          if (data.status === 'paid') {
            // Force refresh user data
            fetchUserProfile();
            
            // Clear any cached user data
            localStorage.removeItem('userData');
            
            // Redirect to success page
            router.push('/dashboard/payment-success?upgrade=' + (data.plan === 'premium' ? 'true' : 'false'));
          }
        })
        .catch(error => {
          console.error('Error verifying session:', error);
        });
    }

    if (canceled) {
      router.push('/dashboard/payment-canceled');
    }
  }, []);

  // Fetch user's current plan - Updated to use the same endpoint as profile.js
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Use the same endpoint as profile.js
      const response = await fetch(`${apiUrl}/api/profile/getUserProfile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        cache: 'no-store', // Force fresh request
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User profile data:", data.user);
        
        // Check both locations where plan might be stored
        // First check subscription.plan, then fall back to the direct plan field
        const userPlan = data.user?.subscription?.plan || data.user?.plan || 'basic';
        console.log("Current user plan detected:", userPlan);
        setCurrentPlan(userPlan);
        
        // Update local storage with fresh data
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Also update the user object in localStorage with both plan locations
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...user,
          plan: userPlan, // Update the direct plan field
          subscription: data.user.subscription || { plan: userPlan, status: 'active' }
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "BASIC",
      price: "FREE",
      planId: "basic",
      features: [
        "Personalized Workout Plan",
        "Basic Diet Plan",
        "Basic Workout Plan",
        "Simple meal plans tailored to user preferences",
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
        "AI Coaching",
        "Priority Support",
      ],
      color: "bg-[#1A1B26]",
      borderColor: "border-indigo-700",
      buttonColor: "bg-indigo-600 hover:bg-indigo-500",
      recommended: false,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-8 px-4 mx-auto max-w-[1400px] lg:py-12 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
            Choose Your Plan
          </h1>
          <p className="mb-5 font-light text-gray-400 sm:text-xl">
            Select the perfect plan to achieve your fitness goals with personalized
            workouts and nutrition guidance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-6 w-full max-w-md ${
                plan.color
              } ${plan.borderColor} rounded-lg border-2 shadow-xl xl:p-8 text-gray-100 transform transition duration-500 hover:scale-105 relative ${
                plan.recommended ? "border-purple-500" : ""
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </span>
                </div>
              )}
              
              {/* Plan Header */}
              <div className="flex-none">
                <h3 className="mb-4 text-2xl font-semibold text-white">{plan.name}</h3>
                <div className="flex justify-center items-baseline my-8">
                  <span className="mr-2 text-5xl font-extrabold text-white">
                    {plan.price === "FREE" ? "FREE" : plan.price.split("/")[0]}
                  </span>
                  {plan.price !== "FREE" && (
                    <span className="text-gray-400">/month</span>
                  )}
                </div>
              </div>

              {/* Active Plan Badge */}
              {currentPlan === plan.planId && (
                <div className="mb-6 flex-none">
                  <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-green-500 font-medium">Active Plan</span>
                  </div>
                </div>
              )}

              {/* Features List */}
              <div className="flex-grow mb-8">
                <ul role="list" className="space-y-4 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <CheckIcon className="flex-shrink-0 w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button - Always at bottom */}
              <div className="flex-none mt-auto">
                <CheckoutButton
                  plan={plan.planId}
                  buttonColor={plan.buttonColor}
                  disabled={
                    (currentPlan === plan.planId) || 
                    (plan.price === "FREE") ||
                    (currentPlan === "premium" && plan.planId !== "premium")
                  }
                  isUpgrade={currentPlan === "standard" && plan.planId === "premium"}
                >
                  {currentPlan === plan.planId
                    ? "Current Plan"
                    : plan.price === "FREE"
                    ? "Get Started"
                    : currentPlan === "standard" && plan.planId === "premium"
                    ? "Upgrade to Premium"
                    : "Select Plan"}
                </CheckoutButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Subscription);
