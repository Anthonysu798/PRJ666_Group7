import { useState } from "react";
import { X, Sparkles, Activity, Target, Utensils, Brain } from "lucide-react";
import { activityLevels, dietaryRestrictions, goalTypes } from "./constants";

const AIDietPlanForm = ({ onSubmit, onClose, isGenerating }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    activityLevel: '',
    targetCalories: 2000,
    dietaryRestrictions: [],
    preferences: '',
    healthConditions: '',
    type: 'ai-generated',
    isCustom: true
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.category) newErrors.category = 'Goal is required';
        break;
      case 2:
        if (!formData.activityLevel) newErrors.activityLevel = 'Activity level is required';
        if (!formData.targetCalories) newErrors.targetCalories = 'Target calories is required';
        if (formData.targetCalories < 1200 || formData.targetCalories > 5000) {
          newErrors.targetCalories = 'Calories must be between 1200 and 5000';
        }
        break;
      // Step 3 has no required fields
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDietaryRestrictions = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep < 3) {
      if (validateStep(activeStep)) {
        setActiveStep(prev => prev + 1);
      }
      return;
    }

    // Final validation before submission
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    try {
      // Format the data for the AI generation
      const formattedData = {
        ...formData,
        type: 'ai-generated',
        isCustom: true,
        // Add specific formatting for dietary preferences
        dietaryPreferences: {
          restrictions: formData.dietaryRestrictions,
          preferences: formData.preferences,
          healthConditions: formData.healthConditions
        }
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message });
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400">
                Plan Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                         focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="Enter plan name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Select Your Goal *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {goalTypes.map(goal => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'category', value: goal.value } })}
                    className={`p-4 rounded-lg border ${
                      formData.category === goal.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-purple-900/20 hover:border-purple-500/50'
                    } transition-all group`}
                  >
                    <goal.icon 
                      className={`w-6 h-6 mb-2 ${
                        formData.category === goal.value
                          ? 'text-purple-400'
                          : 'text-gray-400 group-hover:text-purple-400'
                      }`}
                    />
                    <div className={`font-medium ${
                      formData.category === goal.value
                        ? 'text-purple-400'
                        : 'text-gray-400 group-hover:text-purple-400'
                    }`}>
                      {goal.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Activity Level *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {activityLevels.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'activityLevel', value: level.value } })}
                    className={`p-4 rounded-lg border ${
                      formData.activityLevel === level.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-purple-900/20 hover:border-purple-500/50'
                    } transition-all group`}
                  >
                    <level.icon 
                      className={`w-6 h-6 mb-2 ${
                        formData.activityLevel === level.value
                          ? 'text-purple-400'
                          : 'text-gray-400 group-hover:text-purple-400'
                      }`}
                    />
                    <div className={`font-medium ${
                      formData.activityLevel === level.value
                        ? 'text-purple-400'
                        : 'text-gray-400 group-hover:text-purple-400'
                    }`}>
                      {level.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Target Daily Calories *
              </label>
              <input
                type="number"
                name="targetCalories"
                value={formData.targetCalories}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                         focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Dietary Restrictions
              </label>
              <div className="grid grid-cols-2 gap-4">
                {dietaryRestrictions.map(restriction => (
                  <button
                    key={restriction.value}
                    type="button"
                    onClick={() => handleDietaryRestrictions(restriction.value)}
                    className={`p-4 rounded-lg border ${
                      formData.dietaryRestrictions.includes(restriction.value)
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-purple-900/20 hover:border-purple-500/50'
                    } transition-all group`}
                  >
                    <restriction.icon 
                      className={`w-6 h-6 mb-2 ${
                        formData.dietaryRestrictions.includes(restriction.value)
                          ? 'text-purple-400'
                          : 'text-gray-400 group-hover:text-purple-400'
                      }`}
                    />
                    <div className={`font-medium ${
                      formData.dietaryRestrictions.includes(restriction.value)
                        ? 'text-purple-400'
                        : 'text-gray-400 group-hover:text-purple-400'
                    }`}>
                      {restriction.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Health Conditions or Allergies
              </label>
              <textarea
                name="healthConditions"
                value={formData.healthConditions}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                         focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="List any health conditions or allergies..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Additional Preferences
              </label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                         focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="Any specific preferences or requirements..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1E1B29] rounded-xl p-6 border border-purple-900/20 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            Generate AI Diet Plan
            <Sparkles className="w-6 h-6 text-purple-400" />
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Let AI create your personalized nutrition plan
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {[
          { number: 1, title: "Basic Info", icon: Target },
          { number: 2, title: "Activity", icon: Activity },
          { number: 3, title: "Diet", icon: Utensils },
        ].map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full 
                ${
                  activeStep >= step.number
                    ? "bg-purple-600 text-white"
                    : "bg-purple-500/10 text-gray-400"
                }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  activeStep >= step.number ? "text-white" : "text-gray-400"
                }`}
              >
                Step {step.number}
              </p>
              <p className="text-xs text-gray-500">{step.title}</p>
            </div>
            {index < 2 && (
              <div
                className={`w-12 h-0.5 mx-4 ${
                  activeStep > step.number
                    ? "bg-purple-600"
                    : "bg-purple-500/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        {/* Error message */}
        {errors.submit && (
          <div className="text-red-400 text-sm mt-2">
            {errors.submit}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 
                     rounded-lg text-white font-medium hover:opacity-90 transition-opacity
                     flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : activeStep === 3 ? (
              <>
                <Brain className="w-4 h-4" />
                Generate Plan
              </>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIDietPlanForm; 