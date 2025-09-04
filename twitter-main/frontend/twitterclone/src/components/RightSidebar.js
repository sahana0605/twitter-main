import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEllipsisH, FaHashtag, FaTimes, FaFire, FaTrendingUp, FaNewspaper, FaFutbol, FaFilm, FaSync } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RightSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [showNews, setShowNews] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingTopics();
    
    // Simulate real-time updates every 2 minutes
    const interval = setInterval(() => {
      updateTrendingTopics();
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchTrendingTopics = async () => {
    setIsRefreshing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTrends = [
        { id: 1, topic: '#React', tweets: '125K', category: 'Technology', isTrending: true },
        { id: 2, topic: '#JavaScript', tweets: '89K', category: 'Programming', isTrending: false },
        { id: 3, topic: '#WebDev', tweets: '67K', category: 'Technology', isTrending: true },
        { id: 4, topic: '#Coding', tweets: '45K', category: 'Programming', isTrending: false },
        { id: 5, topic: '#AI', tweets: '234K', category: 'Technology', isTrending: true },
        { id: 6, topic: '#MachineLearning', tweets: '156K', category: 'Technology', isTrending: false },
        { id: 7, topic: '#NodeJS', tweets: '78K', category: 'Programming', isTrending: true },
        { id: 8, topic: '#MongoDB', tweets: '56K', category: 'Database', isTrending: false },
        { id: 9, topic: '#MumbaiRains', tweets: '89K', category: 'Weather', isTrending: true },
        { id: 10, topic: '#Cricket', tweets: '234K', category: 'Sports', isTrending: true }
      ];
      
      setTrendingTopics(mockTrends);
    } catch (error) {
      toast.error('Failed to load trending topics');
    } finally {
      setIsRefreshing(false);
    }
  };

  const updateTrendingTopics = () => {
    setTrendingTopics(prev => 
      prev.map(trend => ({
        ...trend,
        tweets: trend.isTrending 
          ? `${Math.floor(Math.random() * 50 + 50)}K`
          : trend.tweets
      }))
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
        toast.success('User unfollowed');
      } else {
        newSet.add(userId);
        toast.success('User followed! 👥');
      }
      return newSet;
    });
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleTrendClick = (trend) => {
    navigate(`/explore?q=${encodeURIComponent(trend)}`);
  };

  const handleRefreshTrends = () => {
    fetchTrendingTopics();
    toast.success('Trending topics refreshed! 🔄');
  };

  const trends = [
    { id: 1, topic: '#React', tweets: '125K', category: 'Technology' },
    { id: 2, topic: '#JavaScript', tweets: '89K', category: 'Programming' },
    { id: 3, topic: '#WebDev', tweets: '67K', category: 'Technology' },
    { id: 4, topic: '#Coding', tweets: '45K', category: 'Programming' },
    { id: 5, topic: '#AI', tweets: '234K', category: 'Technology' }
  ];

  const trendingNews = [
    {
      id: 1,
      title: "Pawan Kalyan's 'OG' Shatters U.S. Pre-Sale Records in Blazing Speed",
      time: "6 hours ago",
      category: "Entertainment",
      posts: "64.3K posts",
      image: "https://images.unsplash.com/photo-1489599835387-4c8b0a0b0b0b?w=60&h=60&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Modi and Ishiba Forge $68 Billion India-Japan Economic Security Pact",
      time: "4 hours ago",
      category: "News",
      posts: "12.2K posts",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Modi and Ishiba's Bullet Train Ride Accelerates India-Japan Ties",
      time: "3 hours ago",
      category: "News",
      posts: "20.8K posts",
      image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=60&h=60&fit=crop&crop=center"
    }
  ];

  const suggestedUsers = [
    {
      id: 'user1',
      username: 's_r_khandelwal',
      name: 'Mumbai Nowcast',
      profilePic: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=40&h=40&fit=crop&crop=center',
      verified: true,
      bio: 'Leading #MumbaiRains page since 2020 | Real Estate | Also posts about topics of my interests, social & economic impacts, etc'
    },
    {
      id: 'user2',
      username: 'hardikpandya7',
      name: 'hardik pandya',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center',
      verified: true,
      bio: 'Indian cricketer | All-rounder | Mumbai Indians | Gujarat Titans'
    },
    {
      id: 'user3',
      username: 'RMC_Mumbai',
      name: 'Regional Meteorological Centre',
      profilePic: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=40&h=40&fit=crop&crop=center',
      verified: false,
      bio: 'Official weather updates for Mumbai and surrounding regions'
    }
  ];

  return (
    <div className="w-80 p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700"
            />
          </div>
        </form>
      </div>

      {/* Trending Topics */}
      <div className="bg-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Trending</h2>
          <button
            onClick={handleRefreshTrends}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FaSync className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="space-y-3">
          {trendingTopics.slice(0, 5).map((trend) => (
            <div
              key={trend.id}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors"
              onClick={() => handleTrendClick(trend.topic)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaHashtag className="w-4 h-4 text-gray-400" />
                  <span className="text-white font-medium">{trend.topic}</span>
                  {trend.isTrending && (
                    <FaFire className="w-3 h-3 text-orange-500" />
                  )}
                </div>
                <FaEllipsisH className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-400 text-sm ml-6">{trend.tweets} posts</p>
              <p className="text-gray-500 text-xs ml-6">{trend.category}</p>
            </div>
          ))}
        </div>
        
        <button className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium mt-3">
          Show more
        </button>
      </div>

      {/* Today's News */}
      {showNews && (
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Today's News</h2>
            <button
              onClick={() => setShowNews(false)}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="w-4 h-4 text-gray-400" />
            </button>
                  </div>
          
          <div className="space-y-3">
            {trendingNews.map((news) => (
              <div key={news.id} className="flex space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                    {news.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{news.time}</span>
                    <span>·</span>
                    <span>{news.category}</span>
                    <span>·</span>
                    <span>{news.posts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Who to follow */}
      <div className="bg-gray-800 rounded-2xl p-4">
        <h2 className="text-xl font-bold text-white mb-4">Who to follow</h2>
        
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleUserClick(user.username)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="text-white font-medium truncate">{user.name}</span>
                  {user.verified && (
                    <FaHashtag className="w-3 h-3 text-blue-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-gray-400 text-sm truncate">@{user.username}</p>
                <p className="text-gray-300 text-xs truncate">{user.bio}</p>
              </div>
              <button
                onClick={() => handleFollow(user.id)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  followedUsers.has(user.id)
                    ? 'bg-gray-600 text-white hover:bg-gray-500'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {followedUsers.has(user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
        
        <button className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium mt-3">
          Show more
        </button>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-400 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Accessibility</a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">Ads info</a>
          <a href="#" className="hover:underline">More</a>
          <span>© 2024 Twitter Clone</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;