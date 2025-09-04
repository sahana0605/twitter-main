import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaTimes, 
  FaFilter, 
  FaChartLine, 
  FaHashtag, 
  FaUser, 
  FaCalendar,
  FaMapMarkerAlt,
  FaHeart,
  FaRetweet,
  FaEye
} from 'react-icons/fa';
import Tweet from './Tweet';
import toast from 'react-hot-toast';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    engagement: 'all',
    location: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('top');

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchWithDebounce();
    } else {
      setSearchResults([]);
      setSuggestions([]);
    }
  }, [searchQuery, filters]);

  const fetchTrendingTopics = async () => {
    const mockTrending = [
      { id: 1, topic: '#React', tweets: '125K', category: 'Technology' },
      { id: 2, topic: '#WebDev', tweets: '89K', category: 'Technology' },
      { id: 3, topic: '#JavaScript', tweets: '67K', category: 'Technology' },
      { id: 4, topic: '#Coding', tweets: '45K', category: 'Technology' },
      { id: 5, topic: '#Programming', tweets: '34K', category: 'Technology' },
      { id: 6, topic: '#TechNews', tweets: '23K', category: 'News' },
      { id: 7, topic: '#Innovation', tweets: '18K', category: 'Business' },
      { id: 8, topic: '#Startup', tweets: '15K', category: 'Business' },
      { id: 9, topic: '#AI', tweets: '12K', category: 'Technology' },
      { id: 10, topic: '#MachineLearning', tweets: '9K', category: 'Technology' }
    ];
    setTrendingTopics(mockTrending);
  };

  const searchWithDebounce = (() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        performSearch();
      }, 500);
    };
  })();

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock search results
      const mockResults = [
        {
          _id: 'search1',
          content: `Just discovered ${searchQuery}! This is amazing for web development. The possibilities are endless! 🚀`,
          author: {
            _id: 'user1',
            username: 'webdev_pro',
            name: 'Web Dev Pro',
            profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          likes: 234,
          retweets: 45,
          replies: 12,
          views: 1200,
          isLiked: false,
          isRetweeted: false,
          isBookmarked: false
        },
        {
          _id: 'search2',
          content: `Learning ${searchQuery} has been a game-changer for my projects. Highly recommend! 💻`,
          author: {
            _id: 'user2',
            username: 'coder_sarah',
            name: 'Sarah Coder',
            profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center',
            verified: false
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          likes: 89,
          retweets: 23,
          replies: 8,
          views: 567,
          isLiked: true,
          isRetweeted: false,
          isBookmarked: false
        }
      ];

      setSearchResults(mockResults);
      setSuggestions([
        { type: 'hashtag', text: `#${searchQuery}` },
        { type: 'user', text: `@${searchQuery}` },
        { type: 'phrase', text: `"${searchQuery}"` }
      ]);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };

  const handleTrendingClick = (topic) => {
    setSearchQuery(topic);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
  };

  const handleTweetAction = (tweetId, action) => {
    setSearchResults(prev => prev.map(tweet => {
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
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
        <div className="p-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search Twitter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-3 p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaFilter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
            </button>
            
            {searchQuery && (
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('top')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeTab === 'top' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  Top
                </button>
                <button
                  onClick={() => setActiveTab('latest')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeTab === 'latest' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setActiveTab('people')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeTab === 'people' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  People
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="tweets">Tweets</option>
                <option value="users">Users</option>
                <option value="hashtags">Hashtags</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Any time</option>
                <option value="day">Past day</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
                <option value="year">Past year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Engagement</label>
              <select
                value={filters.engagement}
                onChange={(e) => handleFilterChange('engagement', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="high">High engagement</option>
                <option value="medium">Medium engagement</option>
                <option value="low">Low engagement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Anywhere</option>
                <option value="near">Near you</option>
                <option value="verified">Verified accounts</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : searchQuery ? (
            <>
              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Search suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition-colors"
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {searchResults.map((tweet) => (
                    <Tweet
                      key={tweet._id}
                      tweet={tweet}
                      onAction={handleTweetAction}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FaSearch className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400 max-w-sm">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-4">
              <h2 className="text-xl font-bold text-white mb-4">Trending</h2>
              <div className="space-y-4">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTrendingClick(topic.topic)}
                    className="w-full text-left p-3 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                                                 <div className="flex items-center space-x-2">
                           <FaChartLine className="w-4 h-4 text-blue-500" />
                           <span className="text-white font-medium">{topic.topic}</span>
                         </div>
                        <p className="text-gray-400 text-sm mt-1">{topic.tweets} Tweets</p>
                      </div>
                      <span className="text-gray-500 text-sm">{topic.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-gray-800 p-4 hidden lg:block">
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">Search tips</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-2">
                <FaHashtag className="w-4 h-4 text-blue-500 mt-0.5" />
                <span>Use hashtags to find specific topics</span>
              </div>
              <div className="flex items-start space-x-2">
                <FaUser className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Search for users with @username</span>
              </div>
              <div className="flex items-start space-x-2">
                <FaCalendar className="w-4 h-4 text-purple-500 mt-0.5" />
                <span>Filter by date to find recent content</span>
              </div>
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-0.5" />
                <span>Search for location-based content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
