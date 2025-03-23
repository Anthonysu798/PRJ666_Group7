import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Edit2, Check, ChevronRight } from "lucide-react";

const PlanDetailsModal = ({ plan, onClose, onSetCurrent, isCurrentPlan }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(plan);
  const [isSaving, setIsSaving] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Only attempt to save if the plan has an _id (is saved in database)
      if (editedPlan._id) {
        const response = await fetch(`${apiUrl}/api/diet/update-plan/${editedPlan._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: editedPlan.name,
            calories: editedPlan.calories,
            protein: editedPlan.protein,
            carbs: editedPlan.carbs,
            fats: editedPlan.fats,
            description: editedPlan.description
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update plan');
        }

        const data = await response.json();
        
        // Update both the modal state and parent component state
        setEditedPlan(data.plan);
        
        // If this is the current active plan, update it in the parent component
        if (isCurrentPlan) {
          onSetCurrent(data.plan);
        }

        // Update the plan in the modal
        plan = data.plan;
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving plan:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  // Update editedPlan when plan prop changes
  useEffect(() => {
    setEditedPlan(plan);
  }, [plan]);

  // Helper function to check if this plan is currently active
  const isPlanActive = () => {
    if (!plan || !isCurrentPlan) return false;
    
    // For preset plans that haven't been saved yet
    if (!plan._id) {
      // Compare name and category instead of the whole plan
      return isCurrentPlan.name === plan.name && 
             isCurrentPlan.category === plan.category;
    }
    
    // For saved plans (both preset and custom)
    return plan._id === isCurrentPlan._id;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1E1B29] rounded-xl w-full max-w-2xl overflow-hidden border border-purple-900/20"
      >
        {/* Header */}
        <div className="relative h-48">
          <img
            src={plan.image}
            alt={plan.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B29] to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPlan.name}
                  onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
                  className="text-2xl font-semibold bg-transparent text-white border-b border-purple-500 focus:outline-none"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {plan.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 
                             rounded-lg font-medium hover:bg-emerald-500/20 transition-colors
                             flex items-center justify-center gap-2"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditedPlan(plan);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-red-500/10 text-red-400 
                             rounded-lg font-medium hover:bg-red-500/20 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Calories", value: editedPlan.calories },
              { label: "Protein", value: `${editedPlan.protein}g` },
              { label: "Carbs", value: `${editedPlan.carbs}g` },
              { label: "Fats", value: `${editedPlan.fats}g` },
            ].map((macro) => (
              <div key={macro.label} className="bg-[#13111C] p-4 rounded-lg text-center">
                <div className="text-gray-400 text-sm">{macro.label}</div>
                {isEditing ? (
                  <input
                    type="number"
                    value={macro.value.toString().replace('g', '')}
                    onChange={(e) => 
                      setEditedPlan({ 
                        ...editedPlan, 
                        [macro.label.toLowerCase()]: parseInt(e.target.value) 
                      })
                    }
                    className="w-full text-center bg-transparent text-white font-semibold focus:outline-none"
                  />
                ) : (
                  <div className="text-white font-semibold">{macro.value}</div>
                )}
              </div>
            ))}
          </div>

          {/* Description */}
          {isEditing ? (
            <textarea
              value={editedPlan.description}
              onChange={(e) => setEditedPlan({ ...editedPlan, description: e.target.value })}
              className="w-full bg-[#13111C] text-white rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-purple-500"
              rows={3}
            />
          ) : (
            <p className="text-gray-400">{plan.description}</p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 
                           rounded-lg font-medium hover:bg-emerald-500/20 transition-colors
                           flex items-center justify-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditedPlan(plan);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-red-500/10 text-red-400 
                           rounded-lg font-medium hover:bg-red-500/20 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {!isPlanActive() && (
                  <button
                    onClick={() => onSetCurrent(plan)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 
                             text-white rounded-lg font-medium hover:opacity-90 transition-opacity
                             flex items-center justify-center gap-2"
                  >
                    Set as Current Plan
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {isPlanActive() && (
                  <div className="flex-1 px-4 py-2 bg-emerald-500/10 text-emerald-400 
                               rounded-lg font-medium text-center border border-emerald-500/20
                               flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Current Active Plan
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlanDetailsModal; 