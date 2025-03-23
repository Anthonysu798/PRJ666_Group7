import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  X, Plus, Minus, ArrowUp, ArrowDown, Clock, 
  Dumbbell, Target, Activity, ChevronRight,
  Flame, Star, Calendar, Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const CustomWorkoutForm = ({ onClose, onSubmit, initialValues = null }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialValues || {
    name: "",
    category: "strength",
    difficulty: "intermediate",
    duration: 45,
    calories: 300,
    equipment: [""],
    exercises: [
      { name: "", sets: 3, reps: 12, duration: 0, rest: 60, notes: "" }
    ],
    tags: [""],
    description: "",
    image: "",
    schedule: [],
    targetMuscles: []
  });

  const steps = [
    { number: 1, title: "Basic Info", description: "Name and category" },
    { number: 2, title: "Target Areas", description: "Muscles and difficulty" },
    { number: 3, title: "Exercises", description: "Add your exercises" },
    { number: 4, title: "Schedule", description: "Plan your week" },
    { number: 5, title: "Review", description: "Finalize your plan" }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData(prev => ({ ...prev, exercises: newExercises }));
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "", sets: 3, reps: 12, duration: 0, rest: 60, notes: "" }
      ]
    }));
  };

  const removeExercise = (index) => {
    if (formData.exercises.length > 1) {
      setFormData(prev => ({
        ...prev,
        exercises: prev.exercises.filter((_, i) => i !== index)
      }));
    }
  };

  const moveExercise = (index, direction) => {
    const newExercises = [...formData.exercises];
    if (direction === 'up' && index > 0) {
      [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
    } else if (direction === 'down' && index < newExercises.length - 1) {
      [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    }
    setFormData(prev => ({ ...prev, exercises: newExercises }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Workout Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg 
                           text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="e.g., Full Body Power"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'strength', label: 'Strength', icon: Dumbbell },
                    { id: 'cardio', label: 'Cardio', icon: Activity },
                    { id: 'hiit', label: 'HIIT', icon: Flame },
                    { id: 'flexibility', label: 'Flexibility', icon: Users }
                  ].map(category => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                      className={`p-4 rounded-xl border ${
                        formData.category === category.id
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : 'border-purple-900/20 hover:border-purple-500/30 text-gray-400'
                      } transition-all flex flex-col items-center gap-2`}
                    >
                      <category.icon className="w-6 h-6" />
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <motion.div {...fadeIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Target Muscle Groups
              </label>
              <div className="grid grid-cols-3 gap-4">
                {muscleGroups.map(muscle => (
                  <button
                    key={muscle.id}
                    type="button"
                    onClick={() => {
                      const newMuscles = formData.targetMuscles.includes(muscle.id)
                        ? formData.targetMuscles.filter(m => m !== muscle.id)
                        : [...formData.targetMuscles, muscle.id];
                      setFormData(prev => ({ ...prev, targetMuscles: newMuscles }));
                    }}
                    className={cn(
                      "p-4 rounded-xl border transition-all flex items-center gap-3",
                      formData.targetMuscles.includes(muscle.id)
                        ? "border-purple-500 bg-purple-500/10 text-purple-400"
                        : "border-purple-900/20 hover:border-purple-500/30 text-gray-400"
                    )}
                  >
                    <span className="text-2xl">{muscle.icon}</span>
                    <span>{muscle.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
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

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Target Calories
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg 
                         text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                min="0"
                required
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Exercises</h3>
              <button
                type="button"
                onClick={addExercise}
                className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg 
                         hover:bg-purple-500/20 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {formData.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-[#13111C] rounded-lg p-4 border border-purple-900/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => moveExercise(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-lg transition-colors ${
                          index === 0 
                            ? 'text-gray-600' 
                            : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExercise(index, 'down')}
                        disabled={index === formData.exercises.length - 1}
                        className={`p-1 rounded-lg transition-colors ${
                          index === formData.exercises.length - 1
                            ? 'text-gray-600'
                            : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400'
                        }`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 bg-[#1E1B29] border border-purple-900/20 
                                 rounded-lg text-white focus:border-purple-500 
                                 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="Exercise name"
                        required
                      />
                      
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Sets</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-[#1E1B29] border border-purple-900/20 
                                     rounded-lg text-white text-sm"
                            min="1"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Reps</label>
                          <input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-[#1E1B29] border border-purple-900/20 
                                     rounded-lg text-white text-sm"
                            min="0"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Duration (s)
                          </label>
                          <input
                            type="number"
                            value={exercise.duration}
                            onChange={(e) => handleExerciseChange(index, 'duration', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-[#1E1B29] border border-purple-900/20 
                                     rounded-lg text-white text-sm"
                            min="0"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">
                            Rest (s)
                          </label>
                          <input
                            type="number"
                            value={exercise.rest}
                            onChange={(e) => handleExerciseChange(index, 'rest', parseInt(e.target.value))}
                            className="w-full px-3 py-2 bg-[#1E1B29] border border-purple-900/20 
                                     rounded-lg text-white text-sm"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      <textarea
                        value={exercise.notes}
                        onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                        className="w-full px-4 py-2 bg-[#1E1B29] border border-purple-900/20 
                                 rounded-lg text-white text-sm focus:border-purple-500 
                                 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="Notes (optional)"
                        rows="2"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                      disabled={formData.exercises.length === 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Weekly Schedule
              </label>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const newSchedule = formData.schedule.includes(day)
                        ? formData.schedule.filter(d => d !== day)
                        : [...formData.schedule, day];
                      setFormData(prev => ({ ...prev, schedule: newSchedule }));
                    }}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      formData.schedule.includes(day)
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-[#13111C] text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <motion.div {...fadeIn} className="space-y-6">
            <div className="bg-[#13111C] rounded-xl p-6 border border-purple-900/20">
              <h3 className="text-xl font-semibold text-white mb-4">Workout Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-purple-900/10">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white font-medium">{formData.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-purple-900/10">
                  <span className="text-gray-400">Category</span>
                  <span className="text-purple-400 capitalize">{formData.category}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-purple-900/10">
                  <span className="text-gray-400">Target Areas</span>
                  <div className="flex gap-2">
                    {formData.targetMuscles.map(muscle => (
                      <span key={muscle} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm">
                        {muscleGroups.find(m => m.id === muscle)?.label}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-purple-900/10">
                  <span className="text-gray-400">Exercises</span>
                  <span className="text-white">{formData.exercises.length}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Schedule</span>
                  <div className="flex gap-1">
                    {formData.schedule.map(day => (
                      <span key={day} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    const totalDuration = formData.exercises.reduce((acc, exercise) => 
      acc + (exercise.duration + exercise.rest) * exercise.sets, 0
    );
    
    onSubmit({
      ...formData,
      id: `custom-${Date.now()}`,
      duration: Math.round(totalDuration / 60),
      isCustom: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1E1B29] rounded-xl w-full max-w-4xl overflow-hidden border border-purple-900/20"
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-900/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Create Custom Workout
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mt-8">
            {steps.map((s, i) => (
              <div
                key={s.number}
                className={`flex items-center ${i !== steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s.number ? 'bg-purple-500 text-white' : 'bg-[#13111C] text-gray-400'
                  }`}>
                    {s.number}
                  </div>
                  <div className="text-sm mt-2">
                    <div className={step >= s.number ? 'text-white' : 'text-gray-400'}>
                      {s.title}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {s.description}
                    </div>
                  </div>
                </div>
                {i !== steps.length - 1 && (
                  <div className={`h-px flex-1 mx-4 mt-4 ${
                    step > s.number ? 'bg-purple-500' : 'bg-purple-900/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-900/20 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              step === 1
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white'
            }`}
            disabled={step === 1}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                     rounded-xl text-white font-medium hover:opacity-90 transition-opacity
                     flex items-center gap-2"
          >
            {step === steps.length ? 'Create Workout' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomWorkoutForm; 