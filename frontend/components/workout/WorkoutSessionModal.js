import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaStop, FaSave, FaTimes } from "react-icons/fa";
import { BiTimer } from "react-icons/bi";
import { BsClock, BsFire } from "react-icons/bs";
import { GiMuscleUp } from "react-icons/gi";
import { Star } from "lucide-react";

const WorkoutSessionModal = ({ workout, onClose, onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    // Start timer automatically when modal opens
    handleStart();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    setIsStopped(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsStopped(true);
  };

  const handleSave = () => {
    if (time <= 0) {
      console.error('Invalid time duration');
      return;
    }

    const sessionData = {
      duration: time
    };
    
    console.log('Saving session data:', sessionData);
    onComplete(sessionData);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const time_parts = formatTime(time);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-gradient-to-b from-[#1E1B29] to-[#2A2739] rounded-2xl w-full max-w-md p-8 border border-purple-900/20 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        {/* Professional Timer Display */}
        <div className="bg-[#1A1725] rounded-xl p-8 mb-8 shadow-inner">
          <div className="flex justify-center items-center gap-2">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-white font-mono bg-[#2A2739] px-4 py-3 rounded-lg shadow-inner">
                {time_parts.hours}
              </div>
              <span className="text-xs text-gray-400 mt-2">HOURS</span>
            </div>
            
            <div className="text-4xl font-bold text-purple-500 mb-6">:</div>
            
            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-white font-mono bg-[#2A2739] px-4 py-3 rounded-lg shadow-inner">
                {time_parts.minutes}
              </div>
              <span className="text-xs text-gray-400 mt-2">MINUTES</span>
            </div>
            
            <div className="text-4xl font-bold text-purple-500 mb-6">:</div>
            
            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-white font-mono bg-[#2A2739] px-4 py-3 rounded-lg shadow-inner">
                {time_parts.seconds}
              </div>
              <span className="text-xs text-gray-400 mt-2">SECONDS</span>
            </div>
          </div>
        </div>

        {/* Control Buttons with Updated Styling */}
        <div className="flex justify-center gap-4">
          {isStopped ? (
            <>
              <button
                onClick={handleStart}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg 
                         flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
              >
                <FaPlay className="w-4 h-4" />
                Continue
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg 
                         flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
              >
                <FaSave className="w-4 h-4" />
                Save
              </button>
            </>
          ) : (
            <>
              {isRunning ? (
                <button
                  onClick={handlePause}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg 
                           flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                >
                  <FaPause className="w-4 h-4" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg 
                           flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                >
                  <FaPlay className="w-4 h-4" />
                  Start
                </button>
              )}
              <button
                onClick={handleStop}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg 
                         flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
              >
                <FaStop className="w-4 h-4" />
                Stop
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkoutSessionModal; 