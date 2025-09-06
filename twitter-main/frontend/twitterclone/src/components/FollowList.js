import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUser, FaUserCheck, FaUserPlus } from 'react-icons/fa';
import Api from '../services/api';
import toast from 'react-hot-toast';

const FollowList = ({ isOpen, onClose, userId, type = 'followers' }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll fetch all users and filter them
      // In a real app, you'd have specific endpoints for followers/following
      const response = await Api.getPublicTweets(); // This gets all tweets with user details
      
      if (response?.tweets) {
        // Extract unique users from tweets
        const uniqueUsers = response.tweets.reduce((acc, tweet) => {
          if (tweet.userDetails && !acc.find(user => user._id === tweet.userDetails._id)) {
            acc.push(tweet.userDetails);
          }
          return acc;
        }, []);
        
        // Filter out the current user
        const filteredUsers = uniqueUsers.filter(user => user._id !== userId);
        setUsers(filteredUsers.slice(0, 20)); // Limit to 20 users for demo
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/profile/${user._id}`);
    onClose();
  };

  const handleFollow = async (e, user) => {
    e.stopPropagation();
    // In a real app, you'd call the follow API here
    toast.success(`Following @${user.username}! 👥`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-xl font-bold text-white capitalize">
              {type === 'followers' ? 'Followers' : 'Following'}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Try again
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                {type === 'followers' ? (
                  <FaUser className="w-8 h-8 text-gray-400" />
                ) : (
                  <FaUserCheck className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No {type} yet
              </h3>
              <p className="text-gray-400">
                {type === 'followers' 
                  ? 'When people follow you, they will show up here.'
                  : 'When you follow people, they will show up here.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user)}
                  className="p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      <img
                        src={user.profilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white truncate">
                          {user.name || 'User'}
                        </h3>
                        {user.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm truncate">
                        @{user.username || 'user'}
                      </p>
                      {user.bio && (
                        <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    {/* Follow Button */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => handleFollow(e, user)}
                        className="px-4 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-sm"
                      >
                        <FaUserPlus className="w-3 h-3 inline mr-1" />
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
