import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Filter, 
  Plus, 
  ChevronRight, 
  Leaf, 
  Beef, 
  Fish,
  Apple,
  Scale,
  Brain,
  X,
  Edit3,
  Check,
  Heart,
  ArrowUpRight
} from "lucide-react";
import CustomPlanForm from "@/components/diet/CustomPlanForm";
import PlanDetailsModal from "@/components/diet/PlanDetailsModal";
import { useRouter } from "next/router";
import dotenv from "dotenv";
import { PLAN_FEATURES } from "../../utils/planUtils";
import { CUSTOM_DIET_IMAGES } from "@/utils/dietImages";
import Toast from "@/components/ui/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
dotenv.config();

// Add this line to define apiUrl
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function Diet() {
  const [activeTab, setActiveTab] = useState("preset");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [presetPlans, setPresetPlans] = useState([]);
  const [customPlans, setCustomPlans] = useState([]);
  const [userPlan, setUserPlan] = useState('basic'); // Default to basic
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();
  const [activePlanId, setActivePlanId] = useState(null);

  // Add these state variables
  const [customPlan, setCustomPlan] = useState({
    name: '',
    goalType: '',
    activityLevel: '',
    targetCalories: 2000,
    dietaryRestrictions: []
  });

  const filterButtons = [
    { id: "all", label: "All Plans", icon: Scale },
    { id: "muscle", label: "Muscle Gain", icon: Beef },
    { id: "weight-loss", label: "Weight Loss", icon: ChevronRight },
    { id: "keto", label: "Keto", icon: Brain },
    { id: "vegan", label: "Vegan", icon: Leaf },
    { id: "performance", label: "Performance", icon: Sparkles },
    { id: "health", label: "Wellness", icon: Heart },
    { id: "gluten-free", label: "Gluten Free", icon: Apple }
  ];

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/profile/getUserProfile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUserPlan(data.user.plan || 'basic');
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
      }
    };

    fetchUserPlan();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch preset plans
        const presetResponse = await fetch(`${apiUrl}/api/diet/preset`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Fetch user plans (including custom plans)
        const userPlansResponse = await fetch(`${apiUrl}/api/diet/user-plans`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!presetResponse.ok || !userPlansResponse.ok) {
          throw new Error('Failed to fetch plans');
        }

        const presetData = await presetResponse.json();
        const userPlansData = await userPlansResponse.json();

        // Get the active plan
        const activePlan = userPlansData.activePlan;

        // Set preset plans with proper active state
        const updatedPresetPlans = presetData.plans.map(plan => ({
          ...plan,
          isActive: activePlan ? 
            (plan.name === activePlan.name && plan.category === activePlan.category) : 
            false
        }));

        // Set custom plans with proper active state
        const updatedCustomPlans = userPlansData.customPlans?.map(plan => ({
          ...plan,
          isActive: activePlan ? plan._id === activePlan._id : false
        })) || [];

        setPresetPlans(updatedPresetPlans);
        setCustomPlans(updatedCustomPlans);

        // Only set current plan if there is an active plan
        if (activePlan) {
          setActivePlanId(activePlan._id);
          setCurrentPlan(activePlan);
        } else {
          setActivePlanId(null);
          setCurrentPlan(null);
        }

      } catch (error) {
        console.error("Error fetching plans:", error);
        setError(error.message || "Failed to load diet plans");
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchPlans();
    }
  }, [apiUrl]);

  const getRandomImage = (usedImages) => {
    const availableImages = CUSTOM_DIET_IMAGES.filter(img => !usedImages.includes(img));
    if (availableImages.length === 0) return CUSTOM_DIET_IMAGES[0];
    return availableImages[Math.floor(Math.random() * availableImages.length)];
  };

  const handleCustomPlanSubmit = async (planData) => {
    try {
      setIsLoading(true);
      setError(null);

      const usedImages = customPlans.map(plan => plan.image);
      const randomImage = getRandomImage(usedImages);

      // Add the random image to the plan data
      const finalPlanData = {
        ...planData,
        image: randomImage,
        isCustom: true // Make sure to set this flag
      };

      const response = await fetch(`${apiUrl}/api/diet/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(finalPlanData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create custom plan: ${response.status}`);
      }

      const data = await response.json();
      
      // Update both custom plans list and set as current plan
      const newPlan = data.plan;
      setCustomPlans(prev => [...prev, newPlan]);
      setCurrentPlan(newPlan);
      setActivePlanId(newPlan._id);

      // Switch to custom plans tab
      setActiveTab("custom");
      
      setShowCustomForm(false);
      setToastMessage("Custom plan created successfully!");
      setShowToast(true);

    } catch (error) {
      console.error("Error creating custom plan:", error);
      setError(error.message || "Failed to create custom plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSetActivePlan = async (plan) => {
    try {
      const isPreset = !plan._id; // Preset plans don't have MongoDB _id

      const response = await fetch(`${apiUrl}/api/diet/active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          planId: plan._id,
          isPreset: isPreset,
          presetPlan: isPreset ? plan : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set active plan');
      }

      const data = await response.json();
      const savedPlan = data.plan;

      // Update local state with the saved plan from the response
      setActivePlanId(savedPlan._id);
      setCurrentPlan(savedPlan);
      
      // Update both preset and custom plans lists
      if (plan.isCustom) {
        setCustomPlans(prev => prev.map(p => ({
          ...p,
          isActive: p._id === savedPlan._id,
          // Update the plan data if it's the one that was modified
          ...(p._id === savedPlan._id ? savedPlan : {})
        })));
      } else {
        setPresetPlans(prev => prev.map(p => ({
          ...p,
          isActive: savedPlan.name === p.name && savedPlan.category === p.category,
          _id: savedPlan.name === p.name && savedPlan.category === p.category ? savedPlan._id : p._id,
          // Update the plan data if it's the one that was modified
          ...(p.name === savedPlan.name && p.category === savedPlan.category ? savedPlan : {})
        })));
      }

      setToastMessage("Plan updated successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating plan:", error);
      setError(error.message || "Failed to update plan");
    }
  };

  // Combine preset and custom plans
  const allPlans = [...presetPlans, ...customPlans];

  // Filter plans based on selected filter
  const filteredPlans = allPlans.filter(plan => 
    selectedFilter === "all" ? true : plan.category === selectedFilter
  );

  const handleGeneratePlan = () => {
    if (userPlan === 'basic') {
      setShowUpgradeModal(true);
      return;
    }
    // Existing generate plan logic
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
              {PLAN_FEATURES.standard.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-purple-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                router.push('/dashboard/subscription?plan=standard');
              }}
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
              {PLAN_FEATURES.premium.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <Check className="w-4 h-4 text-yellow-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                router.push('/dashboard/subscription?plan=premium');
              }}
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

  const PlanCard = ({ plan }) => {
    const isCurrentPlan = currentPlan && (
        plan._id === currentPlan._id || 
        (plan.name === currentPlan.name && plan.category === currentPlan.category)
    );

    return (
        <button 
            onClick={() => handleViewPlan(plan)}
            className={`w-full px-4 py-3 rounded-lg font-medium
                       flex items-center justify-center gap-2 transition-all duration-200
                       ${isCurrentPlan
                         ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                         : 'bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white'
                       }`}
        >
            {isCurrentPlan ? (
                <>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Current Plan
                </>
            ) : (
                <>
                    View Plan
                    <ChevronRight className="w-4 h-4" />
                </>
            )}
        </button>
    );
  };

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="space-y-6 p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Nutrition Plans
              </h1>
              <p className="text-gray-400 mt-2">
                Customize your meal plans to achieve your fitness goals
              </p>
            </div>
            
            <button
              onClick={handleGeneratePlan}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2
                ${userPlan === 'basic' 
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:opacity-90' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90'
                } text-white transition-all`}
            >
              {userPlan === 'basic' ? (
                <>
                  Upgrade to Access AI Diet Plans
                  <ArrowUpRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Generate AI Plan
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-purple-900/20">
            <button
              onClick={() => setActiveTab("preset")}
              className={`px-4 py-2 font-medium transition-all duration-200 ${
                activeTab === "preset"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              Preset Plans
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2 font-medium transition-all duration-200 ${
                activeTab === "custom"
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-purple-400"
              }`}
            >
              Custom Plan
            </button>
          </div>

          {activeTab === "custom" ? (
            <div className="space-y-6">
                <button
                    onClick={() => setShowCustomForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1E1B29] border border-purple-900/20 
                             rounded-xl text-gray-400 font-medium hover:text-purple-400 hover:border-purple-500/30 
                             transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    Create New Custom Plan
                </button>

                {/* Display Custom Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {customPlans.map((plan) => (
                        <motion.div
                            key={plan._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-[#1E1B29] rounded-xl overflow-hidden border border-purple-900/20 flex flex-col"
                        >
                            <div className="relative h-48">
                                <img
                                    src={plan.image}
                                    alt={plan.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B29] to-transparent" />
                                <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/20 
                                             rounded-full text-xs text-purple-400 font-medium">
                                    Custom Plan
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-semibold text-white">
                                    {plan.name}
                                </h3>
                                
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {plan.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <p className="text-gray-400 text-sm mt-4">
                                    {plan.description}
                                </p>
                                
                                <div className="grid grid-cols-3 gap-4 py-4 mt-auto mb-4 border-t border-purple-900/20">
                                    <div className="text-center">
                                        <div className="text-gray-400 text-sm">Calories</div>
                                        <div className="text-white font-semibold">{plan.calories}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-400 text-sm">Protein</div>
                                        <div className="text-white font-semibold">{plan.protein}g</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-400 text-sm">Carbs</div>
                                        <div className="text-white font-semibold">{plan.carbs}g</div>
                                    </div>
                                </div>
                                
                                <PlanCard plan={plan} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
          ) : (
            <>
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-3">
                {filterButtons.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 
                        ${
                          selectedFilter === filter.id
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                            : "bg-[#1E1B29] text-gray-400 hover:bg-purple-600/10 hover:text-purple-400"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {/* Diet Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-[#1E1B29] rounded-xl overflow-hidden border border-purple-900/20 flex flex-col"
                  >
                    {plan.isCustom && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/20 
                                   rounded-full text-xs text-purple-400 font-medium z-10">
                        Custom Plan
                      </div>
                    )}
                    <div className="relative h-48">
                      <img
                        src={plan.image}
                        alt={plan.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B29] to-transparent" />
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-white">
                        {plan.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {plan.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-gray-400 text-sm mt-4">
                        {plan.description}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 py-4 mt-auto mb-4 border-t border-purple-900/20">
                        <div className="text-center">
                          <div className="text-gray-400 text-sm">Calories</div>
                          <div className="text-white font-semibold">{plan.calories}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 text-sm">Protein</div>
                          <div className="text-white font-semibold">{plan.protein}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-400 text-sm">Carbs</div>
                          <div className="text-white font-semibold">{plan.carbs}g</div>
                        </div>
                      </div>
                      
                      <PlanCard plan={plan} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        <AnimatePresence>
          {selectedPlan && (
            <PlanDetailsModal
              plan={selectedPlan}
              onClose={() => setSelectedPlan(null)}
              onSetCurrent={handleSetActivePlan}
              isCurrentPlan={selectedPlan._id === currentPlan?._id || 
                            (selectedPlan.name === currentPlan?.name && 
                             selectedPlan.category === currentPlan?.category)}
            />
          )}
          {showUpgradeModal && <UpgradeModal />}
          {showToast && (
            <Toast
              message={toastMessage}
              onClose={() => setShowToast(false)}
            />
          )}
        </AnimatePresence>

        {/* Add Error notification */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 
                        text-red-400 px-4 py-3 rounded-lg shadow-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 p-1 hover:bg-red-500/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </DashboardLayout>
    </ErrorBoundary>
  );
}

export default withAuth(Diet);
