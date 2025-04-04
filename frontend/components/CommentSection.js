import { useState } from 'react';
import Image from 'next/image';
import { Wand2, Sparkles } from 'lucide-react';

export default function CommentSection({ post, onComment, isActive }) {
  const [commentText, setCommentText] = useState('');
  const [commentMessage, setCommentMessage] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      setCommentMessage('Comment cannot be empty');
      return;
    }

    try {
      const response = await onComment(post._id, commentText);
      
      // Check response type
      if (response.headers?.get('content-type')?.includes('text/html')) {
        throw new Error('Invalid server response');
      }

      setCommentText('');
      setCommentMessage('Comment added successfully! 🎉');
      setAISuggestions([]);
      
      setTimeout(() => {
        setCommentMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setCommentMessage(error.message || 'Failed to add comment. Please try again.');
    }
  };

  const enhanceCommentWithAI = async (type) => {
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
          category: post.category
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
      setCommentMessage('Failed to enhance comment. Please try again.');
    } finally {
      setIsAIProcessing(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className="mt-4 border-t border-gray-800 pt-4">
      <div className="space-y-4">
        {/* AI Enhancement Tools */}
        <div className="flex gap-2">
          <button
            onClick={() => enhanceCommentWithAI('format')}
            disabled={!commentText.trim() || isAIProcessing}
            className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 text-violet-400 
                     hover:bg-violet-500/20 rounded-lg text-sm transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand2 className="w-4 h-4" />
            Enhance
          </button>
          <button
            onClick={() => enhanceCommentWithAI('suggestions')}
            disabled={!commentText.trim() || isAIProcessing}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 
                     hover:bg-blue-500/20 rounded-lg text-sm transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            Get Ideas
          </button>
        </div>

        {/* Comment Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-white
                     border border-gray-700 focus:border-purple-500 
                     focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || isAIProcessing}
            className="px-4 py-2 bg-purple-600 rounded-lg text-white font-medium
                     hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comment
          </button>
        </div>

        {/* AI Processing Indicator */}
        {isAIProcessing && (
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            Enhancing your comment...
          </div>
        )}

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Suggestions
            </h4>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => setCommentText(suggestion)}
                  className="p-2 rounded-lg bg-gray-800/50 text-sm text-gray-300
                           hover:bg-gray-800 cursor-pointer transition-colors
                           border border-gray-700 hover:border-purple-500/20"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success/Error Message */}
        {commentMessage && (
          <div className="text-sm text-green-500 bg-green-500/10 px-3 py-2 rounded-lg">
            {commentMessage}
          </div>
        )}
      </div>

      {/* Comments List */}
      {post.comments && Array.isArray(post.comments) && post.comments.length > 0 && (
        <div className="space-y-3 mt-4">
          {post.comments.map((comment, index) => (
            <div key={comment._id || index} className="flex gap-3 items-start">
              <div className="relative w-8 h-8">
                <Image
                  src={comment.user?.profileImage || comment.user?.googleImage || "/avatar-placeholder.png"}
                  alt={comment.user?.name || "Anonymous"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/avatar-placeholder.png";
                  }}
                />
              </div>
              <div className="flex-1 bg-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">
                    {comment.user?.fullName || comment.user?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 