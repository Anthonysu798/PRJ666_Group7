import { useState, useEffect, useRef } from 'react';
import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";
import { 
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  Brain,
  RefreshCw,
  Copy,
  Check,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  MessageSquarePlus,
  Dumbbell,
  Salad,
  Heart,
  Moon,
  Trophy,
  Calendar,
  Clock,
  Trash2,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import axios from 'axios';

function Recommendations() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedMessages, setSavedMessages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const chatContainerRef = useRef(null);

  const categories = [
    { id: 'all', label: 'All', icon: Brain },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Salad },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'sleep', label: 'Sleep', icon: Moon }
  ];

  const premiumSuggestions = {
    workout: [
      "Create a detailed 12-week muscle building program",
      "Design a HIIT workout with equipment I have at home",
      "Analyze my current workout split and suggest improvements",
      "Create a recovery plan for muscle soreness"
    ],
    nutrition: [
      "Create a personalized meal plan for muscle gain",
      "Design a cutting diet with macro calculations",
      "Suggest pre and post workout meals",
      "Plan a meal prep schedule for the week"
    ],
    health: [
      "Create a holistic wellness plan",
      "Design a stress management routine",
      "Suggest supplements for my fitness goals",
      "Create a morning routine for optimal health"
    ],
    sleep: [
      "Design an evening routine for better sleep",
      "Suggest natural sleep optimization techniques",
      "Create a recovery schedule for intense training",
      "Plan optimal sleep timing around workouts"
    ]
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Add initial greeting message
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([{
        type: 'ai',
        message: "Welcome to CoreHealth Premium AI! I'm your advanced fitness assistant with access to personalized planning, detailed analytics, and expert recommendations. How can I help optimize your fitness journey today?",
        timestamp: new Date()
      }]);
    }
    // Load saved messages from localStorage
    const saved = localStorage.getItem('savedMessages');
    if (saved) {
      setSavedMessages(JSON.parse(saved));
    }
  }, []);

  const handleSaveMessage = (message, index) => {
    const newSavedMessages = [...savedMessages, message];
    setSavedMessages(newSavedMessages);
    localStorage.setItem('savedMessages', JSON.stringify(newSavedMessages));
  };

  const handleExportChat = () => {
    const chatText = chatHistory
      .map(chat => `${chat.type.toUpperCase()} (${new Date(chat.timestamp).toLocaleString()}):
${chat.message}
`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corehealth-chat-export.txt';
    a.click();
  };

  const handleShareChat = async () => {
    try {
      await navigator.share({
        title: 'CoreHealth AI Chat',
        text: 'Check out my fitness conversation with CoreHealth AI!',
        url: window.location.href
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const generateDetailedPlan = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(
        `${apiUrl}/api/recommendations/chat`,
        { 
          message: `Generate a detailed ${activeCategory} plan`,
          category: activeCategory,
          isPlan: true 
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: response.data.response.message,
        timestamp: new Date(),
        isPlan: true
      }]);
    } catch (error) {
      console.error('Error generating plan:', error);
      setChatHistory(prev => [...prev, {
        type: 'system',
        message: "I'm having trouble generating the plan. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newMessage = {
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newMessage]);

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await axios.post(`${apiUrl}/api/recommendations/chat`, {
        message: userMessage,
        category: activeCategory
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Handle the structured response
      const aiResponseData = response.data.response;
      const formattedMessage = `🎯 ${aiResponseData.cardTitle}\n\n${aiResponseData.cardDescription}\n\n` +
        `💪 Workout Details:\n` +
        `• Difficulty: ${aiResponseData.workoutDetails.difficulty}\n` +
        `• Duration: ${aiResponseData.workoutDetails.duration}\n` +
        `• Type: ${aiResponseData.workoutDetails.type}\n` +
        `• Equipment: ${aiResponseData.workoutDetails.equipment.join(', ')}\n\n` +
        `📝 Exercises:\n${aiResponseData.exercises.map(ex => 
          `• ${ex.name}: ${ex.sets} sets × ${ex.reps} reps (${ex.restTime}s rest)`
        ).join('\n')}\n\n` +
        `💡 Tips:\n${aiResponseData.tips.map(tip => `• ${tip}`).join('\n')}\n\n` +
        `📊 Metrics:\n` +
        `• Estimated Calories: ${aiResponseData.metrics.estimatedCalories}\n` +
        `• Intensity: ${aiResponseData.metrics.intensity}`;

      const aiResponse = {
        type: 'ai',
        message: formattedMessage,
        timestamp: new Date(),
        structured: true,
        rawData: aiResponseData
      };

      setChatHistory(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        type: 'system',
        message: "I'm having trouble processing your request. Please try again.",
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-10rem)]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header with Premium Badge */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Premium AI Assistant
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-yellow-400">Premium Features Enabled</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportChat}
                className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
                title="Export Chat"
              >
                <Download className="w-5 h-5" />
              </button>
              <button 
                onClick={handleShareChat}
                className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
                title="Share Chat"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all"
                title="Refresh Chat"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-900/20">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap
                  ${activeCategory === category.id 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'}`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Premium Suggestions */}
          <div className="mb-6 flex flex-wrap gap-2">
            {premiumSuggestions[activeCategory === 'all' ? 'workout' : activeCategory]?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="px-4 py-2 rounded-xl bg-[#170F23] text-purple-300 hover:bg-purple-500/20 
                         transition-all text-sm border border-purple-900/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Container with Enhanced Features */}
          <div className="flex-1 overflow-hidden rounded-2xl bg-[#13111C]/50 backdrop-blur-sm border border-purple-900/20">
            <div 
              ref={chatContainerRef}
              className="h-full overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-900/20"
            >
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}
                >
                  {chat.type !== 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                  <div className="group relative">
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        chat.type === 'user'
                          ? 'bg-purple-500/20 text-purple-100'
                          : chat.type === 'system'
                          ? 'bg-red-500/20 text-red-200'
                          : chat.isPlan
                          ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-gray-100'
                          : 'bg-[#170F23] text-gray-100'
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {chat.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-60">
                        <span>
                          {new Date(chat.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {chat.isPlan && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Premium Plan
                          </span>
                        )}
                      </div>
                    </div>
                    {chat.type === 'ai' && (
                      <div className="absolute -right-20 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => copyToClipboard(chat.message, index)}
                          className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                          title="Copy to Clipboard"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSaveMessage(chat.message, index)}
                          className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                          title="Save Message"
                        >
                          {savedMessages.includes(chat.message) ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  {chat.type === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-start space-x-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="bg-[#170F23] rounded-2xl px-4 py-3">
                    <Loader className="w-5 h-5 animate-spin text-purple-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Message Input */}
          <div className="mt-4">
            <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask for personalized plans, detailed analysis, or any fitness advice..."
                  className="w-full bg-[#13111C]/50 backdrop-blur-sm border border-purple-900/20 rounded-2xl 
                           pl-4 pr-12 py-4 text-gray-100 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Recommendations);
