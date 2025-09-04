import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaArrowLeft, 
  FaHeart, 
  FaRetweet, 
  FaComment, 
  FaBookmark,
  FaEllipsisH,
  FaChartBar,
  FaCheck,
  FaReply,
  FaShare,
  FaFlag,
  FaEye,
  FaQuoteRight
} from 'react-icons/fa';
import Tweet from './Tweet';
import CreatePost from './CreatePost';
import toast from 'react-hot-toast';

const TweetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [tweet, setTweet] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTweetDetail();
  }, [id]);

  const fetchTweetDetail = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock tweet data
      const mockTweet = {
        _id: id,
        content: 'Just launched our new Twitter clone! 🚀 The development journey has been incredible. Building with React, Node.js, and MongoDB has taught me so much about full-stack development. The real-time features, user authentication, and responsive design make it feel like the real Twitter! #React #NodeJS #MongoDB #WebDev #TwitterClone',
        author: {
          _id: 'user123',
          username: 'sahana',
          name: 'Sahana',
          profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center',
          verified: false
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likes: 234,
        retweets: 45,
        replies: 12,
        views: 1200,
        isLiked: true,
        isRetweeted: false,
        isBookmarked: false,
        media: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&crop=center',
        hashtags: ['#React', '#NodeJS', '#MongoDB', '#WebDev', '#TwitterClone'],
        mentions: []
      };

      const mockReplies = [
        {
          _id: 'reply1',
          content: 'This looks absolutely amazing! The UI is so clean and the functionality is spot on. Great work! 👏',
          author: {
            _id: 'user456',
            username: 'reactdev',
            name: 'React Developer',
            profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          likes: 15,
          retweets: 2,
          replies: 1,
          views: 89,
          isLiked: false,
          isRetweeted: false,
          isBookmarked: false,
          isReply: true,
          originalTweet: id,
          parentTweet: mockTweet
        },
        {
          _id: 'reply2',
          content: 'The attention to detail is incredible! How long did it take you to build this? I\'d love to see the code structure. 💻',
          author: {
            _id: 'user789',
            username: 'webdev_pro',
            name: 'Web Dev Pro',
            profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
          likes: 8,
          retweets: 1,
          replies: 0,
          views: 45,
          isLiked: true,
          isRetweeted: false,
          isBookmarked: false,
          isReply: true,
          originalTweet: id,
          parentTweet: mockTweet
        },
        {
          _id: 'reply3',
          content: 'This is exactly what I needed to see! I\'m learning React right now and this gives me so much inspiration. Can\'t wait to build something like this! 🚀',
          author: {
            _id: 'user101',
            username: 'coder_sarah',
            name: 'Sarah Coder',
            profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center',
            verified: false
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
          likes: 12,
          retweets: 3,
          replies: 2,
          views: 67,
          isLiked: false,
          isRetweeted: false,
          isBookmarked: false,
          isReply: true,
          originalTweet: id,
          parentTweet: mockTweet
        }
      ];

      setTweet(mockTweet);
      setReplies(mockReplies);
    } catch (error) {
      toast.error('Failed to load tweet');
    } finally {
      setLoading(false);
    }
  };

  const handleTweetAction = (tweetId, action, newData) => {
    if (tweetId === tweet._id) {
      setTweet(prev => {
        switch (action) {
          case 'like':
            return {
              ...prev,
              isLiked: !prev.isLiked,
              likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
            };
          case 'retweet':
            return {
              ...prev,
              isRetweeted: !prev.isRetweeted,
              retweets: prev.isRetweeted ? prev.retweets - 1 : prev.retweets + 1
            };
          case 'bookmark':
            return {
              ...prev,
              isBookmarked: !prev.isBookmarked
            };
          case 'reply':
            return {
              ...prev,
              replies: prev.replies + 1
            };
          default:
            return prev;
        }
      });
    } else {
      setReplies(prev => prev.map(reply => {
        if (reply._id === tweetId) {
          switch (action) {
            case 'like':
              return {
                ...reply,
                isLiked: !reply.isLiked,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
              };
            case 'retweet':
              return {
                ...reply,
                isRetweeted: !reply.isRetweeted,
                retweets: reply.isRetweeted ? reply.retweets - 1 : reply.retweets + 1
              };
            case 'bookmark':
              return {
                ...reply,
                isBookmarked: !reply.isBookmarked
              };
            case 'reply':
              return {
                ...reply,
                replies: reply.replies + 1
              };
            default:
              return reply;
          }
        }
        return reply;
      }));
    }
  };

  const handleReply = () => {
    setShowReplyModal(true);
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
        views: 0,
        isLiked: false,
        isRetweeted: false,
        isBookmarked: false,
        isReply: true,
        originalTweet: tweet._id,
        parentTweet: tweet
      };

      setReplies(prev => [newReply, ...prev]);
      setTweet(prev => ({ ...prev, replies: prev.replies + 1 }));
      
      setReplyContent('');
      setShowReplyModal(false);
      toast.success('Reply posted! 💬');
    } catch (error) {
      toast.error('Failed to post reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!tweet) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Tweet not found</h3>
          <p className="text-gray-400">This tweet may have been deleted or doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors mr-4"
          >
            <FaArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Tweet</h1>
          </div>
        </div>
      </div>

      {/* Main Tweet */}
      <div className="border-b border-gray-800">
        <Tweet
          tweet={tweet}
          onAction={handleTweetAction}
          onClick={() => {}} // Prevent navigation since we're already on tweet detail
        />
      </div>

      {/* Reply Section */}
      <div className="border-b border-gray-800">
        <div className="p-4">
          <CreatePost 
            onTweetCreated={(newReply) => {
              setReplies(prev => [newReply, ...prev]);
              setTweet(prev => ({ ...prev, replies: prev.replies + 1 }));
            }}
            placeholder="Tweet your reply"
            isReply={true}
            originalTweet={tweet}
          />
        </div>
      </div>

      {/* Replies */}
      <div className="divide-y divide-gray-800">
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Tweet
              key={reply._id}
              tweet={reply}
              onAction={handleTweetAction}
              isReply={true}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FaReply className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No replies yet</h3>
            <p className="text-gray-400 max-w-sm">
              Be the first to reply to this tweet and start a conversation!
            </p>
          </div>
        )}
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
                <FaArrowLeft className="w-5 h-5 text-white" />
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
    </div>
  );
};

export default TweetDetail;



