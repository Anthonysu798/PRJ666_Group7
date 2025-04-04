import { useState, useEffect } from 'react';
import DashboardLayout from "../../components/DashboardLayout";
import { withAuth } from "../../middleware/authMiddleware";
import Image from 'next/image';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Filter,
  Award,
  TrendingUp,
  Users,
  Plus,
  Image as ImageIcon,
  Dumbbell,
  Salad,
  Trophy,
  Flame,
  Clock,
  ThumbsUp,
  Wand2,
  Sparkles,
  Hash,
  X
} from "lucide-react";

function Community() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [aiProcessingType, setAiProcessingType] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Categories for posts with icons and colors
  const categories = [
    { id: 'all', label: 'All Posts', icon: MessageSquare, color: 'purple' },
    { id: 'progress', label: 'Progress', icon: Trophy, color: 'green' },
    { id: 'nutrition', label: 'Nutrition', icon: Salad, color: 'orange' },
    { id: 'workout', label: 'Workouts', icon: Dumbbell, color: 'red' },
    { id: 'motivation', label: 'Motivation', icon: Flame, color: 'yellow' },
    { id: 'tips', label: 'Tips & Tricks', icon: Award, color: 'blue' }
  ];

  // Sorting options
  const sortOptions = [
    { id: 'recent', label: 'Most Recent', icon: Clock },
    { id: 'popular', label: 'Most Popular', icon: ThumbsUp },
    { id: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  useEffect(() => {
    fetchPosts();
  }, [filter, sortBy]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category: filter !== 'all' ? filter : '',
        sortBy: sortBy
      }).toString();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/community/posts?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('content', newPost);
      formData.append('category', selectedCategory);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/community/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setNewPost('');
        setSelectedImage(null);
        setSelectedCategory('general');
        setShowCreatePost(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchPosts(); // Refresh posts to update likes
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const enhancePostWithAI = async (type) => {
    setIsAIProcessing(true);
    setAiProcessingType(type);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aipost/enhance-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newPost,
          type: type,
          category: selectedCategory
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enhance post');
      }

      const data = await response.json();
      
      if (data.success) {
        if (type === 'format') {
          setNewPost(data.enhancedContent);
          setShowSuggestions(false);
        } else if (type === 'suggestions') {
          setAISuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } else if (type === 'hashtags') {
          const hashtags = data.hashtags || [];
          setNewPost(prev => prev + '\n\n' + hashtags.join(' '));
          setShowSuggestions(false);
        }
      }
    } catch (error) {
      console.error('Error enhancing post:', error);
      // Add user feedback here if needed
    } finally {
      setIsAIProcessing(false);
      setAiProcessingType(null);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: commentText })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }

      // Clear the comment text
      setCommentText('');
      
      // Refresh posts to show new comment
      fetchPosts();
      
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const enhanceCommentWithAI = async (postId, type) => {
    if (!commentText.trim()) return;
    
    setIsAIProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/aipost/enhance-post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: commentText,
          type,
          category: posts.find(p => p._id === postId)?.category || 'general'
        })
      });

      if (!response.ok) throw new Error('Failed to enhance comment');

      const data = await response.json();
      
      if (data.success) {
        if (type === 'format') {
          setCommentText(data.enhancedContent);
        } else if (type === 'suggestions') {
          setAISuggestions(data.suggestions || []);
        }
      }
    } catch (error) {
      console.error('Error enhancing comment:', error);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const getCategoryStyle = (color) => {
    const styles = {
      purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:shadow-purple-500/30',
      green: 'bg-green-500/10 text-green-400 border border-green-500/20 hover:shadow-green-500/30',
      orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:shadow-orange-500/30',
      red: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:shadow-red-500/30',
      yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:shadow-yellow-500/30',
      blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:shadow-blue-500/30'
    };
    return styles[color] || styles.purple;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold">Community</h1>
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-medium
                     bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                     hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]
                     transition-all duration-300"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Categories */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700/50 
                        scrollbar-track-transparent">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm transition-all duration-500
                  ${filter === category.id 
                    ? `${getCategoryStyle(category.color)}` 
                    : 'hover:bg-white/5 text-gray-400 border border-transparent'}`}
              >
                <category.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${filter === category.id ? 'animate-pulse' : ''}`} />
                <span className="font-medium whitespace-nowrap">{category.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <div className="flex gap-2 sm:gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm transition-all duration-300
                    ${sortBy === option.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl w-full max-w-xl mx-auto p-6 sm:p-8
                          border border-white/10 shadow-[0_0_50px_-25px_rgba(0,0,0,0.3)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-white">Create Post</h3>
                <button onClick={() => setShowCreatePost(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Category Selection */}
              <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2">
                {categories.filter(c => c.id !== 'all').map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm transition-all duration-300
                      ${selectedCategory === category.id ? getCategoryStyle(category.color) : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    <category.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Post Content */}
              <div className="space-y-4 sm:space-y-6">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your fitness journey..."
                  className="w-full bg-white/5 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-white placeholder-gray-500 
                           min-h-[120px] sm:min-h-[150px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                           border border-white/10"
                />

                {/* AI Enhancement Tools */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => enhancePostWithAI('format')}
                    disabled={!newPost.trim() || isAIProcessing}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm
                              transition-all duration-300 disabled:opacity-50 
                              disabled:cursor-not-allowed relative
                              ${isAIProcessing && aiProcessingType === 'format' 
                                ? 'bg-violet-500/20 text-violet-300' 
                                : 'bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20'}`}
                  >
                    {isAIProcessing && aiProcessingType === 'format' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                        Formatting...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Format
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => enhancePostWithAI('suggestions')}
                    disabled={!newPost.trim() || isAIProcessing}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm
                              transition-all duration-300 disabled:opacity-50 
                              disabled:cursor-not-allowed relative
                              ${isAIProcessing && aiProcessingType === 'suggestions' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'}`}
                  >
                    {isAIProcessing && aiProcessingType === 'suggestions' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        Generating Ideas...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Ideas
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => enhancePostWithAI('hashtags')}
                    disabled={!newPost.trim() || isAIProcessing}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm
                              transition-all duration-300 disabled:opacity-50 
                              disabled:cursor-not-allowed relative
                              ${isAIProcessing && aiProcessingType === 'hashtags' 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'}`}
                  >
                    {isAIProcessing && aiProcessingType === 'hashtags' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                        Adding Tags...
                      </>
                    ) : (
                      <>
                        <Hash className="w-4 h-4" />
                        Add Hashtags
                      </>
                    )}
                  </button>
                </div>

                {/* AI Suggestions Dropdown */}
                {showSuggestions && aiSuggestions.length > 0 && (
                  <div className="mt-4 p-4 sm:p-5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center justify-between sticky top-0 bg-black/20 backdrop-blur-sm p-2 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        AI Suggestions
                      </span>
                      <button 
                        onClick={() => setShowSuggestions(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </h4>
                    <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700/50 
                                    scrollbar-track-transparent pr-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setNewPost(suggestion);
                            setShowSuggestions(false);
                          }}
                          className="p-3 sm:p-4 rounded-xl bg-white/5 text-sm text-gray-300
                                   hover:bg-white/10 cursor-pointer transition-all duration-300
                                   border border-white/10 hover:border-blue-500/20
                                   hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl cursor-pointer text-sm
                                 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 
                                 transition-all duration-300 border border-white/10">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-gray-400">
                      Selected: {selectedImage.name}
                    </span>
                  )}
                </div>

                {/* Create Button */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-medium text-gray-400 
                             hover:text-white transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim() || isAIProcessing}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                             bg-gradient-to-r from-purple-600 to-indigo-600
                             hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-white border border-white/10"
                  >
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid gap-6 sm:gap-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/30" />
                <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 max-w-md mx-auto 
                             border border-white/10 shadow-[0_0_50px_-25px_rgba(0,0,0,0.3)]">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-3">No posts yet</h3>
                <p className="text-gray-400 text-lg">Be the first to share your journey!</p>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} 
                   className="group bg-white/5 backdrop-blur-2xl rounded-3xl p-8 
                            border border-white/10 transition-all duration-500
                            hover:shadow-lg hover:shadow-purple-500/30
                            hover:border-purple-500/20">
                {/* Post Header */}
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden
                                  border-2 border-white/10 group-hover:border-purple-500/30
                                  transition-colors duration-500">
                      <Image
                        src={post.author.profileImage || post.author.googleImage || "/avatar-placeholder.png"}
                        alt={post.author.fullName || post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full 
                                  border-2 border-black/80" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white mb-1">
                      {post.author.fullName || post.author.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(categories.find(c => c.id === post.category)?.color)}`}>
                        {categories.find(c => c.id === post.category)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-6">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
                    {post.content}
                  </p>
                  
                  {post.image && (
                    <div className="relative h-[500px] rounded-2xl overflow-hidden
                                  ring-1 ring-white/10 transition-all duration-500
                                  group-hover:ring-purple-500/20">
                      <Image
                        src={post.image}
                        alt="Post image"
                        fill
                        className="object-cover transition-transform duration-700
                                 group-hover:scale-105"
                        priority={true}
                      />
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 transition-colors duration-300
                      ${post.hasLiked 
                        ? 'text-red-500' 
                        : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart 
                      className={`w-6 h-6 transition-transform duration-300 
                        ${post.hasLiked ? 'fill-current scale-110' : 'hover:scale-110'}`} 
                    />
                    <span className="font-medium">{post.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => setActiveCommentPost(activeCommentPost === post._id ? null : post._id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span className="font-medium">{post.comments?.length || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300">
                    <Share2 className="w-6 h-6" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>

                {/* Comment Section */}
                {activeCommentPost === post._id && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    {/* AI Enhancement Tools */}
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => enhanceCommentWithAI(post._id, 'format')}
                        disabled={!commentText.trim() || isAIProcessing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                                 bg-violet-500/10 text-violet-400 border border-violet-500/20
                                 hover:bg-violet-500/20 transition-all duration-300
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]"
                      >
                        <Wand2 className="w-4 h-4" />
                        Format
                      </button>
                      <button
                        onClick={() => enhanceCommentWithAI(post._id, 'suggestions')}
                        disabled={!commentText.trim() || isAIProcessing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                                 bg-blue-500/10 text-blue-400 border border-blue-500/20
                                 hover:bg-blue-500/20 transition-all duration-300
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]"
                      >
                        <Sparkles className="w-4 h-4" />
                        Ideas
                      </button>
                    </div>

                    {/* Comment Input */}
                    <div className="flex gap-4 mb-6">
                      <div className="relative w-10 h-10">
                        <Image
                          src={post.author?.profileImage || post.author?.googleImage || "/avatar-placeholder.png"}
                          alt="Your avatar"
                          fill
                          className="rounded-xl object-cover ring-2 ring-white/10"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full bg-white/5 rounded-xl px-5 py-3 text-white
                                   placeholder-gray-500 focus:outline-none focus:ring-2
                                   focus:ring-purple-500/20 border border-white/10"
                        />
                      </div>
                      <button
                        onClick={() => handleComment(post._id, commentText)}
                        disabled={!commentText.trim() || isAIProcessing}
                        className="px-6 py-3 rounded-xl font-medium transition-all duration-300
                                 bg-gradient-to-r from-purple-600 to-indigo-600
                                 hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 text-white border border-white/10"
                      >
                        Comment
                      </button>
                    </div>

                    {/* AI Processing Indicator */}
                    {isAIProcessing && (
                      <div className="mb-6 flex items-center gap-3 text-sm text-purple-400 
                                    bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent 
                                      rounded-full animate-spin" />
                        Enhancing your comment...
                      </div>
                    )}

                    {/* AI Suggestions */}
                    {showSuggestions && aiSuggestions && aiSuggestions.length > 0 && (
                      <div className="mb-6 p-5 bg-white/5 rounded-xl border border-white/10">
                        <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          AI Suggestions
                        </h4>
                        <div className="space-y-2">
                          {aiSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              onClick={() => setCommentText(suggestion)}
                              className="p-3 rounded-xl bg-white/5 text-sm text-gray-300
                                       hover:bg-white/10 cursor-pointer transition-all duration-300
                                       border border-white/10 hover:border-purple-500/20
                                       hover:shadow-[0_0_20px_-5px_rgba(147,51,234,0.2)]"
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment, index) => (
                          <div key={comment._id || index} className="flex gap-4 group">
                            <div className="relative w-8 h-8">
                              <Image
                                src={comment.user?.profileImage || comment.user?.googleImage || "/avatar-placeholder.png"}
                                alt={comment.user?.name || "Anonymous"}
                                fill
                                className="rounded-lg object-cover ring-2 ring-white/10
                                         group-hover:ring-purple-500/20 transition-colors duration-300"
                              />
                            </div>
                            <div className="flex-1 bg-white/5 rounded-xl p-4 
                                          border border-white/10 group-hover:border-purple-500/20
                                          transition-all duration-300">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-white">
                                  {comment.user?.fullName || comment.user?.name || "Anonymous"}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-gray-400 text-sm">No comments yet. Start the conversation!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(Community);
