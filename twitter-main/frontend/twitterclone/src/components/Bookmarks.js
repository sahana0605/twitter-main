import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaBookmark, FaSearch, FaFilter } from 'react-icons/fa';
import Tweet from './Tweet';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const { user } = useSelector((state) => state.user);
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchTerm, filterType]);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock bookmarked tweets
      const mockBookmarks = [
        {
          _id: 'bookmark1',
          content: 'Just discovered this amazing React library! The developer experience is incredible. #React #WebDev',
          author: {
            _id: 'user456',
            username: 'reactdev',
            name: 'React Developer',
            profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          likes: 234,
          retweets: 45,
          replies: 12,
          views: 1200,
          isLiked: true,
          isRetweeted: false,
          isBookmarked: true,
          media: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&crop=center'
        },
        {
          _id: 'bookmark2',
          content: 'Building a Twitter clone with React and Node.js has been such a fun learning experience! The real-time features are challenging but rewarding. 🚀',
          author: {
            _id: 'user123',
            username: 'sahana',
            name: 'Sahana',
            profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center',
            verified: false
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
          likes: 89,
          retweets: 23,
          replies: 8,
          views: 567,
          isLiked: false,
          isRetweeted: true,
          isBookmarked: true,
          media: null
        },
        {
          _id: 'bookmark3',
          content: 'The future of web development is here! TypeScript + React + Tailwind CSS = Perfect combination for scalable applications.',
          author: {
            _id: 'user789',
            username: 'webdev_pro',
            name: 'Web Dev Pro',
            profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
          likes: 456,
          retweets: 78,
          replies: 34,
          views: 2100,
          isLiked: true,
          isRetweeted: false,
          isBookmarked: true,
          media: null
        }
      ];

      setBookmarks(mockBookmarks);
    } catch (error) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = [...bookmarks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.author.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    switch (filterType) {
      case 'liked':
        filtered = filtered.filter(bookmark => bookmark.isLiked);
        break;
      case 'retweeted':
        filtered = filtered.filter(bookmark => bookmark.isRetweeted);
        break;
      case 'with-media':
        filtered = filtered.filter(bookmark => bookmark.media);
        break;
      default:
        break;
    }

    setFilteredBookmarks(filtered);
  };

  const handleTweetAction = (tweetId, action, newData) => {
    setBookmarks(prev => prev.map(bookmark => {
      if (bookmark._id === tweetId) {
        switch (action) {
          case 'like':
            return {
              ...bookmark,
              isLiked: !bookmark.isLiked,
              likes: bookmark.isLiked ? bookmark.likes - 1 : bookmark.likes + 1
            };
          case 'retweet':
            return {
              ...bookmark,
              isRetweeted: !bookmark.isRetweeted,
              retweets: bookmark.isRetweeted ? bookmark.retweets - 1 : bookmark.retweets + 1
            };
          case 'bookmark':
            return {
              ...bookmark,
              isBookmarked: !bookmark.isBookmarked
            };
          case 'reply':
            return {
              ...bookmark,
              replies: bookmark.replies + 1
            };
          default:
            return bookmark;
        }
      }
      return bookmark;
    }));
  };

  const removeBookmark = (tweetId) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark._id !== tweetId));
    toast.success('Bookmark removed');
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
    toast.success('All bookmarks cleared');
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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-white">Bookmarks</h1>
          <p className="text-gray-400 text-sm">@{user?.username}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex space-x-3 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search bookmarks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white focus:border-blue-500 focus:outline-none appearance-none pr-8"
            >
              <option value="all">All</option>
              <option value="liked">Liked</option>
              <option value="retweeted">Retweeted</option>
              <option value="with-media">With Media</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{filteredBookmarks.length} bookmarks</span>
          {bookmarks.length > 0 && (
            <button
              onClick={clearAllBookmarks}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark._id} className="relative group">
              <Tweet
                tweet={bookmark}
                onAction={handleTweetAction}
              />
              <button
                onClick={() => removeBookmark(bookmark._id)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-75 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
              >
                <FaBookmark className="w-4 h-4 text-blue-500" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                         <FaBookmark className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm || filterType !== 'all' ? 'No matching bookmarks' : 'Save Tweets for later'}
          </h3>
          <p className="text-gray-400 max-w-sm">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'Don\'t let the good Tweets get away! Bookmark Tweets to easily find them again.'
            }
          </p>
          {(searchTerm || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;



