import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

const CreateWorkoutForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "strength",
    duration: 30,
    difficulty: "intermediate",
    calories: 300,
    equipment: [""],
    schedule: [],
    exercises: 1,
    tags: [""],
    image: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: `custom-${Date.now()}`,
      rating: 5.0,
      reviews: 0
    });
  };

  const addField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="bg-[#1E1B29] rounded-xl p-6 border border-purple-900/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Create New Workout
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                       focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              placeholder="e.g., Full Body Power"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                         focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="hiit">HIIT</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-4 py-3 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                         focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Equipment Needed
          </label>
          {formData.equipment.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateField('equipment', index, e.target.value)}
                className="flex-1 px-4 py-2 bg-[#13111C] border border-purple-900/20 rounded-lg text-white 
                         focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                placeholder="e.g., Dumbbells"
              />
              <button
                type="button"
                onClick={() => removeField('equipment', index)}
                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField('equipment')}
            className="mt-2 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </button>
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Schedule
          </label>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => {
                  const isSelected = formData.schedule.includes(day);
                  setFormData(prev => ({
                    ...prev,
                    schedule: isSelected
                      ? prev.schedule.filter(d => d !== day)
                      : [...prev.schedule, day]
                  }));
                }}
                className={`p-2 rounded-lg text-center transition-colors ${
                  formData.schedule.includes(day)
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "bg-[#13111C] text-gray-600 hover:text-gray-400"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                   rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
        >
          Create Workout
        </button>
      </form>
    </div>
  );
};

export default CreateWorkoutForm; 