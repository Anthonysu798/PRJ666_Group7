import { motion } from "framer-motion";
import { Clock, Flame, Dumbbell, Calendar } from "lucide-react";

const WorkoutDetailsModal = ({ workout, onClose, onStartSession }) => {
  if (!workout) return null;

  const handleStartSession = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onStartSession();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        className="bg-[#1E1B29] rounded-xl w-full max-w-3xl p-6 border border-purple-900/20 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Duration", value: workout?.duration || 0, icon: Clock },
            { label: "Calories", value: workout?.calories || 0, icon: Flame },
            { label: "Exercises", value: workout?.exercises?.length || 0, icon: Dumbbell },
            { 
              label: "Schedule", 
              value: Array.isArray(workout?.schedule) ? workout.schedule.join(", ") : "Flexible", 
              icon: Calendar 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-[#13111C] p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">{stat.label}</span>
              </div>
              <div className="text-white font-semibold mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Workout Description */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">Description</h3>
          <p className="text-gray-400">{workout.description || "No description available."}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleStartSession}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 
                     text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Session
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkoutDetailsModal; 