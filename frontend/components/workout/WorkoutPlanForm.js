import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus, ChevronRight, Star } from "lucide-react";

const WorkoutPlanForm = ({ onSubmit, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    category: "strength",
    difficulty: "beginner",
    duration: 30,
    frequency: 3,
    exercises: [{ name: "", sets: 3, reps: 10, duration: 0, notes: "" }],
    equipment: [],
    tags: [],
    description: "",
    metrics: {
      caloriesBurn: 200,
      intensity: "medium",
      muscleGroups: []
    }
  });

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: "", sets: 3, reps: 10, duration: 0, notes: "" }]
    }));
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Basic Information</h2>
            
            {/* Workout Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#2A2739] border border-purple-900/20 rounded-lg px-4 py-2.5 
                         text-white focus:outline-none focus:border-purple-500/50"
                placeholder="e.g., Full Body Power"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['strength', 'cardio', 'hiit', 'flexibility', 'endurance'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                    className={`p-3 rounded-xl border ${
                      formData.category === cat
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-purple-900/20 hover:border-purple-500/30 text-gray-400'
                    } transition-all capitalize`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                    className={`p-4 rounded-xl border ${
                      formData.difficulty === level
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-purple-900/20 hover:border-purple-500/30 text-gray-400'
                    } transition-all`}
                  >
                    <div className="flex justify-center mb-2">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < { beginner: 1, intermediate: 2, advanced: 3 }[level]
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="capitalize">{level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Workout Details</h2>
            
            {/* Duration and Frequency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full bg-[#2A2739] border border-purple-900/20 rounded-lg px-4 py-2.5 
                           text-white focus:outline-none focus:border-purple-500/50"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Weekly Frequency
                </label>
                <input
                  type="number"
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: parseInt(e.target.value) }))}
                  className="w-full bg-[#2A2739] border border-purple-900/20 rounded-lg px-4 py-2.5 
                           text-white focus:outline-none focus:border-purple-500/50"
                  min="1"
                  max="7"
                />
              </div>
            </div>

            {/* Exercises */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Exercises
              </label>
              <div className="space-y-4">
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="p-4 bg-[#2A2739] rounded-lg border border-purple-900/20">
                    <div className="flex justify-between items-start mb-4">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, exercises: newExercises }));
                        }}
                        placeholder="Exercise name"
                        className="bg-transparent border-b border-purple-900/20 px-2 py-1 text-white 
                                 focus:outline-none focus:border-purple-500/50"
                      />
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[index].sets = parseInt(e.target.value);
                          setFormData(prev => ({ ...prev, exercises: newExercises }));
                        }}
                        placeholder="Sets"
                        className="bg-[#1E1B29] border border-purple-900/20 rounded px-3 py-1.5 
                                 text-white focus:outline-none focus:border-purple-500/50"
                      />
                      <input
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[index].reps = parseInt(e.target.value);
                          setFormData(prev => ({ ...prev, exercises: newExercises }));
                        }}
                        placeholder="Reps"
                        className="bg-[#1E1B29] border border-purple-900/20 rounded px-3 py-1.5 
                                 text-white focus:outline-none focus:border-purple-500/50"
                      />
                      <input
                        type="number"
                        value={exercise.duration}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[index].duration = parseInt(e.target.value);
                          setFormData(prev => ({ ...prev, exercises: newExercises }));
                        }}
                        placeholder="Duration (s)"
                        className="bg-[#1E1B29] border border-purple-900/20 rounded px-3 py-1.5 
                                 text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExercise}
                  className="w-full py-2 border-2 border-dashed border-purple-900/20 rounded-lg 
                           text-purple-400 hover:border-purple-500/30 transition-colors flex items-center 
                           justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Additional Information</h2>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-[#2A2739] border border-purple-900/20 rounded-lg px-4 py-2.5 
                         text-white focus:outline-none focus:border-purple-500/50"
                rows="3"
                placeholder="Describe your workout plan..."
              />
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Required Equipment
              </label>
              <input
                type="text"
                value={formData.equipment.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  equipment: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }))}
                className="w-full bg-[#2A2739] border border-purple-900/20 rounded-lg px-4 py-2.5 
                         text-white focus:outline-none focus:border-purple-500/50"
                placeholder="e.g., dumbbells, yoga mat, resistance bands"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
                className="w-full bg-[#2A2739] border border-purple-900/20 rounded-lg px-4 py-2.5 
                         text-white focus:outline-none focus:border-purple-500/50"
                placeholder="e.g., strength, cardio, beginner"
              />
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Estimated Calories Burn
              </label>
              <input
                type="number"
                value={formData.metrics.caloriesBurn}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metrics: { ...prev.metrics, caloriesBurn: parseInt(e.target.value) }
                }))}
                className="w-full bg-[#2A2739] border border-purple-900/20 rounded-lg px-4 py-2.5 
                         text-white focus:outline-none focus:border-purple-500/50"
                min="0"
              />
            </div>
          </div>
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSubmit({
        ...formData,
        _id: Date.now().toString(),
        isCustom: true
      });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-[#1E1B29] rounded-xl w-full max-w-2xl border border-purple-900/20 my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-900/20">
          <div>
            <h3 className="text-xl font-bold text-white">Create Custom Workout</h3>
            <p className="text-sm text-gray-400">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-purple-900/20">
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
              {step === 3 ? 'Create Workout' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default WorkoutPlanForm; 