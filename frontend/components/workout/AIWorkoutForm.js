import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

const AIWorkoutForm = ({ onSubmit, onClose, isGenerating }) => {
  const [formData, setFormData] = useState({
    fitnessGoal: '',
    experienceLevel: '',
    timePerWorkout: '',
    daysPerWeek: '',
    equipment: '',
    injuries: '',
    preferences: ''
  });

  // Map fitness goals to valid backend categories
  const categoryMapping = {
    'Muscle Gain': 'strength',
    'Weight Loss': 'cardio',
    'Strength': 'strength',
    'Endurance': 'endurance',
    'General Fitness': 'strength',
    'HIIT Training': 'hiit',
    'Flexibility': 'flexibility'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mappedFormData = {
      ...formData,
      // Map the fitness goal to a valid category
      fitnessGoal: categoryMapping[formData.fitnessGoal] || 'strength',
      // Add AI-specific fields
      type: 'ai-generated',
      tags: ['AI Powered', 'Smart Plan', 'Personalized'],
      isCustom: true
    };
    onSubmit(mappedFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-[#1E1B29] rounded-xl w-full max-w-2xl p-6 border border-purple-900/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Generate AI Workout Plan
            <Sparkles className="w-5 h-5 text-purple-400" />
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Fitness Goal</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                required
                className="w-full bg-[#2A2635] text-white rounded-lg border border-purple-500/30 p-2.5"
              >
                <option value="">Select Goal</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Strength">Strength</option>
                <option value="Endurance">Endurance</option>
                <option value="HIIT Training">HIIT Training</option>
                <option value="Flexibility">Flexibility</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                className="w-full bg-[#2A2635] text-white rounded-lg border border-purple-500/30 p-2.5"
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Time per Workout (minutes)</label>
              <input
                type="number"
                name="timePerWorkout"
                value={formData.timePerWorkout}
                onChange={handleChange}
                required
                min="15"
                max="180"
                className="w-full bg-[#2A2635] text-white rounded-lg border border-purple-500/30 p-2.5"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Days per Week</label>
              <input
                type="number"
                name="daysPerWeek"
                value={formData.daysPerWeek}
                onChange={handleChange}
                required
                min="1"
                max="7"
                className="w-full bg-[#2A2635] text-white rounded-lg border border-purple-500/30 p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Available Equipment</label>
            <textarea
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="List your available equipment..."
              className="w-full bg-[#2A2635] text-white rounded-lg border border-purple-500/30 p-2.5"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Injuries or Limitations</label>
            <textarea
              name="injuries"
              value={formData.injuries}
              onChange={handleChange}
              placeholder="List any injuries or limitations..."
              className="w-full bg-[#2A2635] text-white rounded-lg border border-purple-500/30 p-2.5"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Additional Preferences</label>
            <textarea
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              placeholder="Any specific preferences or requirements..."
              className="w-full bg-[#2A2635] text-white rounded-lg border border-purple-500/30 p-2.5"
              rows="2"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
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
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium 
                       flex items-center gap-2 hover:bg-purple-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AIWorkoutForm; 