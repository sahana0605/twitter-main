import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import Tweet from './Tweet';
import Api from '../services/api';
import { 
  FaArrowUp, 
  FaSpinner,
  FaExclamationCircle,
  FaFire,
  FaSync,
  FaBell
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState('forYou');
  const [newTweetsCount, setNewTweetsCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const feedRef = useRef(null);
  const pullStartY = useRef(0);
  const pullStartScrollTop = useRef(0);

  // Fetch tweets from backend
  useEffect(() => {
    fetchTweets();
  }, []);

  // Pull to refresh functionality
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const handleTouchStart = (e) => {
      if (feed.scrollTop === 0) {
        pullStartY.current = e.touches[0].clientY;
        pullStartScrollTop.current = feed.scrollTop;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const diff = currentY - pullStartY.current;
      
      if (diff > 0 && feed.scrollTop === 0) {
        e.preventDefault();
        const pullDistance = Math.min(diff * 0.5, 100);
        setPullDistance(pullDistance);
      }
    };

    const handleTouchEnd = () => {
      if (isPulling && pullDistance > 50) {
        handleRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
    };

    const handleMouseDown = (e) => {
      if (feed.scrollTop === 0) {
        pullStartY.current = e.clientY;
        pullStartScrollTop.current = feed.scrollTop;
        setIsPulling(true);
      }
    };

    const handleMouseMove = (e) => {
      if (!isPulling) return;
      
      const currentY = e.clientY;
      const diff = currentY - pullStartY.current;
      
      if (diff > 0 && feed.scrollTop === 0) {
        const pullDistance = Math.min(diff * 0.5, 100);
        setPullDistance(pullDistance);
      }
    };

    const handleMouseUp = () => {
      if (isPulling && pullDistance > 50) {
        handleRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
    };

    feed.addEventListener('touchstart', handleTouchStart, { passive: false });
    feed.addEventListener('touchmove', handleTouchMove, { passive: false });
    feed.addEventListener('touchend', handleTouchEnd);
    feed.addEventListener('mousedown', handleMouseDown);
    feed.addEventListener('mousemove', handleMouseMove);
    feed.addEventListener('mouseup', handleMouseUp);

    return () => {
      feed.removeEventListener('touchstart', handleTouchStart);
      feed.removeEventListener('touchmove', handleTouchMove);
      feed.removeEventListener('touchend', handleTouchEnd);
      feed.removeEventListener('mousedown', handleMouseDown);
      feed.removeEventListener('mousemove', handleMouseMove);
      feed.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPulling, pullDistance]);

  const fetchTweets = async (tab = activeTab, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      let response;
      
      if (tab === 'following') {
        // Fetch tweets from users you follow (requires authentication)
        if (!user?._id) {
          setError('Please login to see following tweets');
          setTweets([]);
          return;
        }
        response = await Api.getFollowingTweets(user._id);
      } else {
        // Fetch all public tweets (no authentication required)
        response = await Api.getPublicTweets();
      }
      
      if (response?.tweets) {
        // Map backend tweet format to frontend format
        const mappedTweets = response.tweets.map(tweet => ({
          _id: tweet._id,
          content: tweet.description,
          author: {
            _id: tweet.userId,
            username: tweet.userDetails?.username || 'user',
            name: tweet.userDetails?.name || 'User',
            profilePic: tweet.userDetails?.profilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center',
            verified: !!tweet.userDetails?.verified
          },
          createdAt: tweet.createdAt,
          likes: Array.isArray(tweet.like) ? tweet.like.length : 0,
          retweets: 0, // Backend doesn't have retweets yet
          replies: 0,  // Backend doesn't have replies yet
          isLiked: Array.isArray(tweet.like) && user?._id ? tweet.like.includes(user._id) : false,
          isRetweeted: false,
          media: null,
          hashtags: extractHashtags(tweet.description),
          mentions: extractMentions(tweet.description)
        }));
        
        setTweets(mappedTweets);
      setLastRefresh(Date.now());
      
      if (isRefresh) {
        setNewTweetsCount(0);
        toast.success('Feed refreshed! 🎉');
        }
      } else {
        setTweets([]);
      }
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError('Failed to load tweets');
      setTweets([]);
      toast.error('Failed to load tweets');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w]+/g;
    return text.match(hashtagRegex) || [];
  };

  const extractMentions = (text) => {
    const mentionRegex = /@[\w]+/g;
    return text.match(mentionRegex) || [];
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    fetchTweets(activeTab, true);
  };

  const handleTweetAction = (tweetId, action) => {
    setTweets(prevTweets => 
      prevTweets.map(tweet => {
        if (tweet._id === tweetId) {
          switch (action) {
            case 'like':
              return {
                ...tweet,
                isLiked: !tweet.isLiked,
                likes: tweet.isLiked ? tweet.likes - 1 : tweet.likes + 1
              };
            case 'retweet':
              return {
                ...tweet,
                isRetweeted: !tweet.isRetweeted,
                retweets: tweet.isRetweeted ? tweet.retweets - 1 : tweet.retweets + 1
              };
            case 'reply':
              return {
                ...tweet,
                replies: tweet.replies + 1
              };
            case 'bookmark':
              return {
                ...tweet,
                isBookmarked: !tweet.isBookmarked
              };
            default:
              return tweet;
          }
        }
        return tweet;
      })
    );
  };

  const handleTweetClick = (tweetId) => {
    navigate(`/tweet/${tweetId}`);
  };

  const handleNewTweet = (newTweet) => {
    console.log('Feed received new tweet:', newTweet);
    
    // Add new tweet to the top of the feed
    setTweets(prevTweets => {
      const updatedTweets = [newTweet, ...prevTweets];
      console.log('Updated feed tweets:', updatedTweets);
      return updatedTweets;
    });
    
    // Show success message
    toast.success('Tweet added to your feed! 🎉');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setNewTweetsCount(0);
    fetchTweets(tab); // Fetch content for the selected tab
  };

  if (loading && tweets.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error && tweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FaExclamationCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => fetchTweets()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" ref={feedRef}>
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div 
          className="flex justify-center items-center py-4 bg-gray-900 transition-all duration-200"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <FaSync className={`w-5 h-5 text-blue-400 mr-2 transition-transform duration-200 ${
            pullDistance > 50 ? 'animate-spin' : ''
          }`} />
          <span className="text-blue-400">
            {pullDistance > 50 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {/* New Tweets Banner */}
      {newTweetsCount > 0 && (
        <div className="sticky top-0 z-20 bg-blue-500 text-white px-4 py-3 text-center cursor-pointer hover:bg-blue-600 transition-colors" onClick={handleRefresh}>
          <div className="flex items-center justify-center space-x-2">
            <FaBell className="w-4 h-4" />
            <span>Show {newTweetsCount} new tweet{newTweetsCount > 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Twitter-style Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800">
        <div className="flex">
          {[
            { id: 'forYou', label: 'For you' },
            { id: 'following', label: 'Following' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
              }`}
            >
              <span className="text-lg">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      {isRefreshing && (
        <div className="flex justify-center items-center py-4 bg-gray-900">
          <FaSync className="w-5 h-5 text-blue-400 animate-spin mr-2" />
          <span className="text-blue-400">Refreshing...</span>
        </div>
      )}

      {/* Create Post */}
      <CreatePost onTweetCreated={handleNewTweet} />
      
      {/* Tweets */}
      <div className="divide-y divide-gray-800">
        {tweets.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No tweets yet. Be the first to tweet!</p>
          </div>
        ) : (
          tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            onAction={handleTweetAction}
            onClick={handleTweetClick}
          />
          ))
        )}
      </div>

      {/* Load More */}
      {tweets.length > 0 && (
        <div className="py-8 text-center">
          <button
            onClick={() => fetchTweets()}
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            {loading ? (
              <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
            ) : null}
            Load more tweets
          </button>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 lg:right-8 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Feed;