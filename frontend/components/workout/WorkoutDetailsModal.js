import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock, Flame, Dumbbell, Star, ChevronRight, Edit2, Check } from "lucide-react";

const WorkoutDetailsModal = ({ workout, onClose, onSchedule, onSetCurrent, isCurrentPlan }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(workout);
  const [isSaving, setIsSaving] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (editedPlan._id) {
        const response = await fetch(`${apiUrl}/api/workout/update/${editedPlan._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: editedPlan.name,
            difficulty: editedPlan.difficulty,
            duration: editedPlan.duration,
            frequency: editedPlan.frequency,
            exercises: editedPlan.exercises,
            description: editedPlan.description,
            metrics: editedPlan.metrics
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update workout');
        }

        const data = await response.json();
        
        setEditedPlan(data.plan);
        
        if (isCurrentPlan) {
          onSetCurrent(data.plan);
        }

        workout = data.plan;
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setEditedPlan(workout);
  }, [workout]);

  // Helper function to check if this plan is currently active
  const isPlanActive = () => {
    if (!workout || !isCurrentPlan) return false;
    
    if (!workout._id) {
      return isCurrentPlan.name === workout.name && 
             isCurrentPlan.category === workout.category;
    }
    
    return workout._id === isCurrentPlan._id;
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
        <div className="relative h-64">
          <img
            src={workout.image}
            alt={workout.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B29] to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm 
                       rounded-full text-sm font-medium flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < { beginner: 1, intermediate: 2, advanced: 3 }[workout.difficulty]
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {workout.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Duration", value: `${workout.duration} min`, icon: Clock },
              { label: "Calories", value: workout.calories, icon: Flame },
              { label: "Exercises", value: workout.exercises, icon: Dumbbell },
              { label: "Schedule", value: workout.schedule.join(", "), icon: Calendar }
            ].map((stat, index) => (
              <div key={index} className="bg-[#13111C] p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <stat.icon className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <p className="text-white font-semibold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Equipment Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Equipment Needed</h3>
            <div className="flex flex-wrap gap-2">
              {workout.equipment.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#13111C] text-gray-400 rounded-lg text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Schedule Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Weekly Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                <div
                  key={day}
                  className={`p-2 rounded-lg text-center ${
                    workout.schedule.includes(day)
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : "bg-[#13111C] text-gray-600"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-purple-900/20">
            <button
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                       rounded-lg text-white font-medium hover:opacity-90 transition-opacity
                       flex items-center justify-center gap-2"
            >
              Start Workout
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onSchedule(new Date(), workout); // Schedule for today
                onClose();
              }}
              className="px-4 py-3 bg-purple-500/10 text-purple-400 rounded-lg font-medium
                       hover:bg-purple-500/20 transition-colors"
            >
              Add to Schedule
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WorkoutDetailsModal; 