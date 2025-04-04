import { useState } from "react";
import { X, Sparkles, Activity, Target, Utensils } from "lucide-react";
import { activityLevels, dietaryRestrictions, goalTypes } from "./constants";

const CustomPlanForm = ({ onSubmit, onClose, setCustomPlan }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    calories: 2000,
    protein: 0,
    carbs: 0,
    fats: 0,
    tags: [],
    description: '',
    dietaryRestrictions: [],
    activityLevel: '',
    type: 'custom',
    isCustom: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const parentStateUpdate = {
      name: updatedFormData.name,
      goalType: name === 'category' ? value : formData.category,
      activityLevel: updatedFormData.activityLevel,
      targetCalories: updatedFormData.calories,
      dietaryRestrictions: updatedFormData.dietaryRestrictions
    };
    setCustomPlan(parentStateUpdate);
  };

  const handleDietaryRestrictions = (restriction) => {
    const updatedRestrictions = formData.dietaryRestrictions.includes(restriction)
      ? formData.dietaryRestrictions.filter(r => r !== restriction)
      : [...formData.dietaryRestrictions, restriction];
    
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: updatedRestrictions,
      tags: [...updatedRestrictions]
    }));

    setCustomPlan(prev => ({
      ...prev,
      dietaryRestrictions: updatedRestrictions
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeStep < 3) {
      setActiveStep(prev => prev + 1);
      return;
    }

    const calories = parseInt(formData.calories);
    const protein = Math.round(calories * 0.3 / 4);
    const carbs = Math.round(calories * 0.4 / 4);
    const fats = Math.round(calories * 0.3 / 9);

    const completePlanData = {
      ...formData,
      protein,
      carbs,
      fats,
      description: `Custom plan optimized for ${formData.category} with ${formData.activityLevel} activity level`,
      tags: [
        formData.category,
        formData.activityLevel,
        ...formData.dietaryRestrictions
      ],
      metrics: {
        calories: calories,
        protein: protein,
        carbs: carbs,
        fats: fats
      },
      type: 'custom',
      isCustom: true
    };

    onSubmit(completePlanData);
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
                Daily Calories *
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
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
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1E1B29] rounded-xl p-6 border border-purple-900/20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Create Custom Plan
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Let's design your perfect nutrition plan
          </p>
        </div>
        <button
          type="button"
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
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 
                     rounded-lg text-white font-medium hover:opacity-90 transition-opacity
                     flex items-center gap-2"
          >
            {activeStep === 3 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Create Plan
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

export default CustomPlanForm; 