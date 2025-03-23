import { motion } from "framer-motion";
import { X, Calendar, Clock, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { useState } from "react";

const ScheduleModal = ({ 
  onClose, 
  workouts, 
  scheduledWorkouts, 
  onScheduleWorkout, 
  onRemoveWorkout 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWorkoutPicker, setShowWorkoutPicker] = useState(false);
  const [selectedDateForPicker, setSelectedDateForPicker] = useState(null);

  // Get week dates starting from Monday
  const getWeekDates = (date) => {
    const week = [];
    const start = new Date(date);
    // Adjust to Monday (1) if currently on Sunday (0)
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedDate);

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDayClick = (date) => {
    setSelectedDateForPicker(date);
    setShowWorkoutPicker(true);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1E1B29] rounded-xl w-full max-w-6xl overflow-hidden border border-purple-900/20"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Weekly Schedule
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors text-gray-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white font-medium min-w-[200px] text-center">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors text-gray-400"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date) => {
              const dateStr = date.toDateString();
              const todayClass = isToday(date) ? 'border-purple-500/30 bg-purple-500/5' : 'border-purple-900/20 bg-[#13111C]';
              const pastClass = isPast(date) ? 'opacity-50' : '';
              
              return (
                <div
                  key={dateStr}
                  className={`min-h-[200px] p-3 rounded-lg border ${todayClass} ${pastClass}`}
                >
                  <div className="text-sm font-medium mb-2">
                    <span className={isToday(date) ? 'text-purple-400' : 'text-gray-400'}>
                      {formatDate(date)}
                    </span>
                  </div>
                  
                  {/* Scheduled Workouts */}
                  <div className="space-y-2">
                    {scheduledWorkouts[dateStr]?.map((workout) => (
                      <div
                        key={workout.id}
                        className="p-2 bg-[#1E1B29] rounded-lg border border-purple-900/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">{workout.name}</span>
                          <button
                            onClick={() => onRemoveWorkout(date, workout.id)}
                            className="p-1 hover:bg-red-500/10 rounded text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {workout.duration} min
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Workout Button */}
                  {!isPast(date) && (
                    <button
                      onClick={() => handleDayClick(date)}
                      className="mt-2 w-full px-2 py-1.5 text-sm text-purple-400 hover:bg-purple-500/10 
                               rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Workout
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Workout Picker Modal */}
          {showWorkoutPicker && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-[#1E1B29] p-6 rounded-xl w-96 border border-purple-900/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Select Workout for {formatDate(selectedDateForPicker)}
                  </h3>
                  <button
                    onClick={() => setShowWorkoutPicker(false)}
                    className="p-1 hover:bg-purple-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {workouts.map(workout => (
                    <button
                      key={workout.id}
                      onClick={() => {
                        onScheduleWorkout(selectedDateForPicker, workout);
                        setShowWorkoutPicker(false);
                      }}
                      className="w-full p-3 text-left bg-[#13111C] hover:bg-purple-500/10 
                               rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-white group-hover:text-purple-400 transition-colors">
                          {workout.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-400">
                            {workout.duration} min
                          </span>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleModal; 