import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dumbbell, 
  Filter, 
  Plus, 
  ChevronRight, 
  Heart,
  Zap,
  Timer,
  Flame,
  Scale,
  X,
  Edit3,
  Check,
  ArrowUpRight,
  Sparkles,
  Clock,
  Star
} from "lucide-react";
import WorkoutPlanForm from "@/components/workout/WorkoutPlanForm";
import WorkoutDetailsModal from "@/components/workout/WorkoutDetailsModal";
import Toast from "@/components/ui/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { WORKOUT_IMAGES, getRandomWorkoutImage } from "@/utils/workoutImages";
import { getWorkoutMetrics } from "@/utils/workoutHelpers";
import { MUSCLE_GROUPS, INTENSITY_LEVELS } from '@/utils/workoutConstants';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function Workout() {
  const [activeTab, setActiveTab] = useState("preset");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [presetPlans, setPresetPlans] = useState([]);
  const [customPlans, setCustomPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activePlanId, setActivePlanId] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userPlan, setUserPlan] = useState('basic');

  const filterButtons = [
    { id: "all", label: "All Workouts", icon: Scale },
    { id: "strength", label: "Strength", icon: Dumbbell },
    { id: "cardio", label: "Cardio", icon: Zap },
    { id: "hiit", label: "HIIT", icon: Timer },
    { id: "endurance", label: "Endurance", icon: Heart },
    { id: "flexibility", label: "Flexibility", icon: Flame }
  ];

  const difficultyButtons = [
    { id: "all", label: "All Levels", icon: Scale },
    { id: "beginner", label: "Beginner", icon: Heart, color: "text-green-400" },
    { id: "intermediate", label: "Intermediate", icon: Flame, color: "text-yellow-400" },
    { id: "advanced", label: "Advanced", icon: Zap, color: "text-red-400" }
  ];

  useEffect(() => {
    const fetchWorkouts = async () => {
      let token;
      try {
        setIsLoading(true);
        setError(null);

        token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Helper function to handle response
        const handleResponse = async (response, errorMessage) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (errorData.message) {
              throw new Error(errorData.message);
            }
            throw new Error(errorMessage);
          }
          return response.json();
        };

        // Fetch all data in parallel with proper error handling
        const [presetResponse, customResponse] = await Promise.all([
          fetch(`${apiUrl}/api/workout/preset`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${apiUrl}/api/workout/user-workouts`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);

        // Process responses
        const [presetData, customData] = await Promise.all([
          handleResponse(presetResponse, 'Failed to fetch preset workouts'),
          handleResponse(customResponse, 'Failed to fetch custom workouts')
        ]);

        // Process preset plans with proper null checks
        const updatedPresetPlans = (presetData.plans || []).map(plan => ({
          ...plan,
          image: plan.image || getRandomWorkoutImage(plan.category),
          isActive: presetData.activePlan ? 
            (plan.name === presetData.activePlan.name && plan.category === presetData.activePlan.category) : 
            false
        }));

        // Process custom plans with proper null checks
        const updatedCustomPlans = (customData.customPlans || []).map(plan => ({
          ...plan,
          isCustom: true,
          image: plan.image || getRandomWorkoutImage(plan.category),
          isActive: customData.activePlan ? plan._id === customData.activePlan._id : false
        }));

        // Update states
        setPresetPlans(updatedPresetPlans);
        setCustomPlans(updatedCustomPlans);

        if (customData.activePlan) {
          setActivePlanId(customData.activePlan._id);
          setCurrentPlan(customData.activePlan);
        } else if (presetData.activePlan) {
          setActivePlanId(presetData.activePlan._id);
          setCurrentPlan(presetData.activePlan);
        }

      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError(error.message || "Failed to load workout plans");
        setCustomPlans([]); // Reset custom plans on error
        setPresetPlans([]); // Reset preset plans on error
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem("token")) {
      fetchWorkouts();
    }
  }, []);

  const handleSetActiveWorkout = async (plan) => {
    try {
      const isPreset = !plan._id;

      const response = await fetch(`${apiUrl}/api/workout/active`, {
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
        throw new Error('Failed to set active workout');
      }

      const data = await response.json();
      const savedPlan = data.plan;

      // Update local state
      setActivePlanId(savedPlan._id);
      setCurrentPlan(savedPlan);
      
      // Update both preset and custom plans lists
      if (plan.isCustom) {
        setCustomPlans(prev => prev.map(p => ({
          ...p,
          isActive: p._id === savedPlan._id,
          ...(p._id === savedPlan._id ? savedPlan : {})
        })));
      } else {
        setPresetPlans(prev => prev.map(p => ({
          ...p,
          isActive: savedPlan.name === p.name && savedPlan.category === p.category,
          _id: savedPlan.name === p.name && savedPlan.category === p.category ? savedPlan._id : p._id,
          ...(p.name === savedPlan.name && p.category === savedPlan.category ? savedPlan : {})
        })));
      }

      setToastMessage("Workout plan updated successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error updating workout:", error);
      setError(error.message || "Failed to update workout");
    }
  };

  const handleCreateCustomPlan = async (plan) => {
    try {
      // Remove _id from the plan data
      const { _id, ...planData } = plan;

      const response = await fetch(`${apiUrl}/api/workout/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create custom workout');
      }

      const data = await response.json();
      const newPlan = {
        ...data.plan,
        isCustom: true,
        isActive: false
      };

      setCustomPlans(prevPlans => [...prevPlans, newPlan]);
      setToastMessage("Custom workout plan created successfully!");
      setShowToast(true);
      setActiveTab("custom");
      setShowCustomForm(false);
    } catch (error) {
      console.error("Error creating custom workout:", error);
      setToastMessage(error.message || "Failed to create custom workout plan");
      setShowToast(true);
    }
  };

  const getCategoryStyle = (category) => {
    const styles = {
      strength: 'bg-blue-500/20 text-blue-300',
      cardio: 'bg-green-500/20 text-green-300',
      hiit: 'bg-red-500/20 text-red-300',
      flexibility: 'bg-yellow-500/20 text-yellow-300',
      endurance: 'bg-indigo-500/20 text-indigo-300'
    };
    return styles[category] || 'bg-purple-500/20 text-purple-300';
  };

  const getDifficultyStyle = (difficulty) => {
    const styles = {
      beginner: 'bg-green-500/20 text-green-300',
      intermediate: 'bg-yellow-500/20 text-yellow-300',
      advanced: 'bg-red-500/20 text-red-300'
    };
    return styles[difficulty] || 'bg-purple-500/20 text-purple-300';
  };

  const handleGenerateWorkout = () => {
    if (userPlan === 'basic') {
      setShowUpgradeModal(true);
      return;
    }
    // Existing generate workout logic
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
          Get access to AI-powered workout plans tailored to your fitness goals
        </p>
        {/* Add your upgrade options here */}
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </motion.div>
  );

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Workout Plans
              </h1>
              <p className="text-gray-400 mt-2">
                Customize your training to achieve your fitness goals
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCustomForm(true)}
                className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 
                         hover:bg-purple-500/20 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Custom Plan
              </button>
              <button
                onClick={handleGenerateWorkout}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2
                  ${userPlan === 'basic' 
                    ? 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:opacity-90' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90'
                  } text-white transition-all`}
              >
                {userPlan === 'basic' ? (
                  <>
                    Upgrade for AI Workouts
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
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("preset")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "preset"
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-gray-400 hover:bg-purple-500/5"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Preset
              </div>
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "custom"
                  ? "bg-purple-500/10 text-purple-400"
                  : "text-gray-400 hover:bg-purple-500/5"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" />
                Custom
              </div>
            </button>
          </div>

          {/* Filter Section */}
          <div className="space-y-3 mb-6">
            {/* Category Filters */}
            <div>
              <h3 className="text-gray-400 text-xs font-medium mb-2">Categories</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {filterButtons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => setSelectedFilter(button.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm 
                             font-medium whitespace-nowrap transition-colors ${
                               selectedFilter === button.id
                                 ? "bg-purple-500/10 text-purple-400"
                                 : "text-gray-400 hover:bg-purple-500/5"
                             }`}
                  >
                    <button.icon className="w-3.5 h-3.5" />
                    {button.id === "all" ? "All" : button.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filters */}
            <div>
              <h3 className="text-gray-400 text-xs font-medium mb-2">Difficulty</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {difficultyButtons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => setSelectedDifficulty(button.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm 
                             font-medium whitespace-nowrap transition-colors ${
                               selectedDifficulty === button.id
                                 ? "bg-purple-500/10 text-purple-400"
                                 : "text-gray-400 hover:bg-purple-500/5"
                             }`}
                  >
                    <button.icon className={`w-3.5 h-3.5 ${button.color || ''}`} />
                    {button.id === "all" ? "All" : button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(activeTab === "preset" ? presetPlans : customPlans)
                .filter(
                  (plan) =>
                    (selectedFilter === "all" || plan.category === selectedFilter) &&
                    (selectedDifficulty === "all" || plan.difficulty === selectedDifficulty)
                )
                .map((plan) => (
                  <motion.div
                    key={plan._id || plan.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`bg-[#1E1B29] rounded-xl overflow-hidden border 
                               ${plan.isActive 
                                 ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                                 : 'border-purple-900/20'}`}
                  >
                    {/* Card Header */}
                    <div className="relative h-48">
                      <img
                        src={plan.image || getRandomWorkoutImage(plan.category)}
                        alt={plan.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B29] to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between">
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${getCategoryStyle(plan.category)}`}>
                            {plan.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                        ${getDifficultyStyle(plan.difficulty)}`}>
                            {plan.difficulty}
                          </span>
                        </div>
                        {plan.isActive && (
                          <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-300 
                                       text-xs font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white truncate">{plan.name}</h3>
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 
                                   hover:bg-purple-500/20 transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {plan.duration || 0}m
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Flame className="w-3.5 h-3.5 text-purple-400" />
                          {getWorkoutMetrics(plan).caloriesBurn}cal
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {plan.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-purple-500/10 text-purple-400 
                                     rounded text-xs font-medium capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => plan.isActive ? setSelectedPlan(plan) : handleSetActiveWorkout(plan)}
                        className={`w-full py-2 rounded-lg font-medium transition-colors ${
                          plan.isActive
                            ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
                        }`}
                      >
                        {plan.isActive ? 'View Details' : 'Start Workout'}
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}

          {/* Modals */}
          <AnimatePresence>
            {showCustomForm && (
              <WorkoutPlanForm
                onClose={() => setShowCustomForm(false)}
                onSubmit={handleCreateCustomPlan}
              />
            )}
            {selectedPlan && (
              <WorkoutDetailsModal
                workout={selectedPlan}
                onClose={() => setSelectedPlan(null)}
                onSetCurrent={handleSetActiveWorkout}
                isCurrentPlan={selectedPlan._id === activePlanId}
              />
            )}
            {showUpgradeModal && <UpgradeModal />}
          </AnimatePresence>

          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <Toast
                message={toastMessage}
                onClose={() => setShowToast(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
}

export default withAuth(Workout);
