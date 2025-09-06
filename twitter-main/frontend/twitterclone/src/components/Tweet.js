import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaRetweet, 
  FaComment, 
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaChartBar,
  FaCheck,
  FaReply,
  FaQuoteRight,
  FaFlag,
  FaEye,
  FaTrash
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Tweet = ({ tweet, onAction, onClick, isReply = false, showThread = false }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showOptions, setShowOptions] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Update time every minute for live timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    const parsed = (date instanceof Date) ? date : new Date(date);
    if (Number.isNaN(parsed.getTime())) return '';
    const now = currentTime;
    const diffInSeconds = Math.floor((now - parsed) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (onAction) {
      onAction(tweet._id, 'like');
      toast.success(tweet.isLiked ? 'Tweet unliked' : 'Tweet liked! ❤️');
    }
  };

  const handleRetweet = (e) => {
    e.stopPropagation();
    if (onAction) {
      onAction(tweet._id, 'retweet');
      toast.success(tweet.isRetweeted ? 'Retweet removed' : 'Tweet retweeted! 🔄');
    }
  };

  const handleReply = (e) => {
    e.stopPropagation();
    setShowReplyModal(true);
  };

  const handleQuoteTweet = (e) => {
    e.stopPropagation();
    if (onAction) {
      onAction(tweet._id, 'quote');
      toast.success('Quote tweet created! 💬');
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (onAction) {
      onAction(tweet._id, 'bookmark');
      toast.success(tweet.isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks! 🔖');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${tweet.author.name} on Twitter`,
        text: tweet.content,
        url: window.location.origin + `/tweet/${tweet._id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/tweet/${tweet._id}`);
      toast.success('Link copied to clipboard! 📋');
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    toast.success('Report submitted. Thank you for helping keep Twitter safe! 🛡️');
    setShowOptions(false);
  };

  const handleDeleteTweet = (e) => {
    e.stopPropagation();
    if (onAction) {
      onAction(tweet._id, 'delete');
      toast.success('Tweet deleted successfully! 🗑️');
    }
    setShowOptions(false);
  };

  const handleUsernameClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${tweet.author._id}`);
  };

  const handleViewAnalytics = (e) => {
    e.stopPropagation();
    toast('Analytics feature coming soon! 📊');
  };

  const submitReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Please write a reply');
      return;
    }

    setIsSubmittingReply(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReply = {
        _id: Date.now().toString(),
        content: replyContent.trim(),
        author: {
          _id: user?._id || 'user123',
          username: user?.username || 'sahana',
          name: user?.name || 'Sahana',
          profilePic: user?.profilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center',
          verified: user?.verified || false
        },
        createdAt: new Date(),
        likes: 0,
        retweets: 0,
        replies: 0,
        isLiked: false,
        isRetweeted: false,
        isReply: true,
        originalTweet: tweet._id,
        parentTweet: tweet
      };

      if (onAction) {
        onAction(tweet._id, 'reply', newReply);
      }

      setReplyContent('');
      setShowReplyModal(false);
      toast.success('Reply posted! 💬');
    } catch (error) {
      toast.error('Failed to post reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleTweetClick = () => {
    if (onClick) {
      onClick(tweet);
    } else {
      navigate(`/tweet/${tweet._id}`);
    }
  };

  return (
    <>
      <div 
        className={`border-b border-gray-800 hover:bg-gray-900/50 transition-colors cursor-pointer ${
          isReply ? 'ml-8 border-l border-gray-700' : ''
        }`}
        onClick={handleTweetClick}
      >
        <div className="p-4">
          {/* Reply indicator */}
          {isReply && (
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <FaReply className="w-3 h-3 mr-2" />
              <span>Replying to @{tweet.parentTweet?.author?.username || tweet.author.username}</span>
            </div>
          )}

          <div className="flex space-x-3">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={tweet.author.profilePic}
                alt={tweet.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            {/* Tweet Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center space-x-2 mb-1">
                <button
                  onClick={handleUsernameClick}
                  className="font-bold text-white hover:underline cursor-pointer"
                >
                  {tweet.author.name}
                </button>
                {tweet.author.verified && (
                  <FaCheck className="w-4 h-4 text-blue-500" />
                )}
                <button
                  onClick={handleUsernameClick}
                  className="text-gray-400 hover:underline cursor-pointer"
                >
                  @{tweet.author.username}
                </button>
                <span className="text-gray-400">·</span>
                <span className="text-gray-400">{formatTime(tweet.createdAt)}</span>
                {tweet.isRetweeted && (
                  <>
                    <span className="text-gray-400">·</span>
                    <FaRetweet className="w-3 h-3 text-green-500" />
                    <span className="text-gray-400">Retweeted</span>
                  </>
                )}
              </div>

              {/* Tweet Text */}
              <p className="text-white mb-3 whitespace-pre-wrap">{tweet.content}</p>

              {/* Media */}
              {tweet.media && (
                <div className="mb-3 rounded-2xl overflow-hidden">
                  <img
                    src={tweet.media}
                    alt="Tweet media"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between max-w-md">
                {/* Reply */}
                <button
                  onClick={handleReply}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                    <FaComment className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{tweet.replies}</span>
                </button>

                {/* Retweet */}
                <button
                  onClick={handleRetweet}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors"
                >
                  <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                    <FaRetweet className={`w-4 h-4 ${tweet.isRetweeted ? 'text-green-500' : ''}`} />
                  </div>
                  <span className="text-sm">{tweet.retweets}</span>
                </button>

                {/* Like */}
                <button
                  onClick={handleLike}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                    {tweet.isLiked ? (
                      <FaHeart className="w-4 h-4 text-red-500 animate-pulse" />
                    ) : (
                      <FaHeart className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <span className="text-sm">{tweet.likes}</span>
                </button>

                {/* Views */}
                <button
                  onClick={handleViewAnalytics}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                    <FaEye className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{tweet.views || Math.floor(Math.random() * 1000)}</span>
                </button>

                {/* Bookmark */}
                <button
                  onClick={handleBookmark}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                    {tweet.isBookmarked ? (
                      <FaBookmark className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FaBookmark className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="group flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                    <FaShare className="w-4 h-4" />
                  </div>
                </button>

                {/* More Options */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptions(!showOptions);
                    }}
                    className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                  >
                    <FaEllipsisH className="w-4 h-4" />
                  </button>

                  {showOptions && (
                    <div className="absolute right-0 top-8 bg-black border border-gray-800 rounded-lg shadow-lg z-10 min-w-48">
                      {user?._id === tweet.author._id && (
                        <button
                          onClick={handleDeleteTweet}
                          className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-500/10 flex items-center space-x-3"
                        >
                          <FaTrash className="w-4 h-4" />
                          <span>Delete Tweet</span>
                        </button>
                      )}
                      <button
                        onClick={handleQuoteTweet}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 flex items-center space-x-3"
                      >
                        <FaQuoteRight className="w-4 h-4" />
                        <span>Quote Tweet</span>
                      </button>
                      <button
                        onClick={handleViewAnalytics}
                        className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 flex items-center space-x-3"
                      >
                        <FaChartBar className="w-4 h-4" />
                        <span>View Tweet analytics</span>
                      </button>
                      {user?._id !== tweet.author._id && (
                        <button
                          onClick={handleReport}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 flex items-center space-x-3"
                        >
                          <FaFlag className="w-4 h-4" />
                          <span>Report Tweet</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <button
                onClick={() => setShowReplyModal(false)}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <FaEllipsisH className="w-5 h-5 text-white rotate-90" />
              </button>
              <button
                onClick={submitReply}
                disabled={isSubmittingReply || !replyContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isSubmittingReply ? 'Replying...' : 'Reply'}
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex space-x-3">
                <img
                  src={user?.profilePic || 'https://via.placeholder.com/40x40'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Tweet your reply"
                    className="w-full bg-transparent border-none text-white placeholder-gray-500 resize-none focus:outline-none text-xl"
                    rows={4}
                    maxLength={280}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-400 text-sm">
                      Replying to @{tweet.author.username}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {replyContent.length}/280
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tweet;