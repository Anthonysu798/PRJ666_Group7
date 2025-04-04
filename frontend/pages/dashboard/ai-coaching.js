import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Upload, Bot, User, Loader, Copy, Check, Bookmark, BookmarkCheck, Send, Sparkles, MessageSquarePlus, Dumbbell, CircuitBoard } from 'lucide-react';
import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const AICoaching = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [savedMessages, setSavedMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [inputMessage, setInputMessage] = useState('');

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
        message: "Welcome to CoreHealth Form Analysis AI! I'm your advanced form analysis assistant. Upload a photo of your exercise form, and I'll provide detailed feedback on your technique.",
        timestamp: new Date()
      }]);
    }
    // Load saved messages from localStorage
    const saved = localStorage.getItem('savedFormAnalysis');
    if (saved) {
      setSavedMessages(JSON.parse(saved));
    }
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0] || event;
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      
      // Add user's upload to chat history
      setChatHistory(prev => [...prev, {
        type: 'user',
        message: 'Image uploaded for analysis',
        timestamp: new Date(),
        image: URL.createObjectURL(file)
      }]);

      await analyzeExerciseForm(file);
    }
  };

  const analyzeExerciseForm = async (file) => {
    setIsAnalyzing(true);
    try {
      const base64Image = await convertToBase64(file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: data.data.feedback,
        timestamp: new Date(),
        analysis: data.data
      }]);

      setAnalysis(data.data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setChatHistory(prev => [...prev, {
        type: 'system',
        message: "Error analyzing image. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Add clipboard paste handler
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    
    if (!items) return;

    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        handleImageUpload(file);
        break;
      }
    }
  }, []);

  // Add effect to add and remove paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(e);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const handleSaveMessage = (message, index) => {
    const newSavedMessages = [...savedMessages, message];
    setSavedMessages(newSavedMessages);
    localStorage.setItem('savedFormAnalysis', JSON.stringify(newSavedMessages));
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
    if (!inputMessage.trim() || isAnalyzing) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    }]);

    setIsAnalyzing(true);
    setInputMessage('');

    try {
      // Find the last image and analysis in chat history
      const lastImageContext = chatHistory.findLast(chat => chat.image);
      const lastAnalysis = chatHistory.findLast(chat => chat.analysis);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze-form/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: inputMessage,
          context: chatHistory.slice(-10).map(chat => ({
            type: chat.type,
            message: chat.message,
            analysis: chat.analysis
          })),
          lastImage: lastImageContext?.image,
          lastAnalysis: lastAnalysis?.analysis
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: data.response,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, {
        type: 'system',
        message: "Sorry, I couldn't process your message. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CircuitBoard className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                AI Form Analysis
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400">Vision AI Enabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col space-y-6">
          {/* Chat Container */}
          <div className="flex-1 min-h-[600px] rounded-2xl bg-[#13111C]/50 backdrop-blur-sm border border-purple-900/20 p-6">
            <div 
              ref={chatContainerRef}
              className="h-full overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-purple-900/20"
            >
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2 group`}
                >
                  {chat.type !== 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                  
                  <div className="relative max-w-[80%]">
                    <div className={`rounded-2xl px-4 py-3 ${
                      chat.type === 'user'
                        ? 'bg-purple-500/20 text-purple-100'
                        : chat.type === 'system'
                        ? 'bg-red-500/20 text-red-200'
                        : 'bg-[#170F23] text-gray-100'
                    }`}>
                      {chat.image && (
                        <img
                          src={chat.image}
                          alt="Exercise form"
                          className="max-w-full rounded-lg mb-2"
                        />
                      )}
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {chat.message}
                      </p>

                      {chat.analysis && (
                        <div className="mt-4 space-y-4 border-t border-purple-500/20 pt-4">
                          {chat.analysis.suggestions.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium text-purple-300 mb-2">
                                Suggestions for Improvement:
                              </h3>
                              <ul className="space-y-2">
                                {chat.analysis.suggestions.map((suggestion, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Dumbbell className="w-4 h-4 text-purple-400 mt-1" />
                                    <span className="text-sm text-gray-300">{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {chat.analysis.safetyIssues?.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium text-red-400 mb-2">
                                Safety Concerns:
                              </h3>
                              <ul className="space-y-2">
                                {chat.analysis.safetyIssues.map((issue, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-sm text-red-300">{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Confidence Score:</span>
                            <span className="text-purple-400 font-medium">
                              {(chat.analysis.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>
                          {new Date(chat.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
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
                          title="Save Analysis"
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
              
              {isAnalyzing && (
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

          {/* Bottom Controls */}
          <div className="flex gap-4">
            {/* Upload Button */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`
                relative flex items-center gap-2 px-4 py-3 rounded-xl
                border border-purple-900/20 bg-[#13111C]/50 backdrop-blur-sm
                hover:bg-purple-500/10 transition-all cursor-pointer
                ${isDragging ? 'border-purple-500 bg-purple-500/10' : ''}
              `}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400">Upload Form Image</span>
            </div>

            {/* Message Input */}
            <div className="flex-1">
              <form onSubmit={sendMessage} className="relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about form improvements or technique details..."
                  className="w-full bg-[#13111C]/50 backdrop-blur-sm border border-purple-900/20 rounded-xl 
                           pl-4 pr-12 py-3 text-gray-100 placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-purple-500/20 
                           text-purple-400 hover:bg-purple-500/30 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(AICoaching);
