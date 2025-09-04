import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHeart, 
  FaRetweet, 
  FaComment, 
  FaUser, 
  FaBell, 
  FaCheck, 
  FaTimes,
  FaUserFriends,
  FaBookmark,
  FaEye,
  FaEllipsisH,
  FaCog
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    
    // Simulate real-time notifications every 30 seconds
    const interval = setInterval(() => {
      simulateNewNotification();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const simulateNewNotification = () => {
    const notificationTypes = ['like', 'retweet', 'follow', 'reply', 'mention'];
    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    const newNotification = {
      id: Date.now(),
      type: randomType,
      user: {
        name: 'Random User',
        username: 'randomuser',
        profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center'
      },
      content: getNotificationContent(randomType),
      tweetContent: 'Just launched our new Twitter clone! 🚀',
      time: 'now',
      isRead: false,
      tweetId: 'tweet123'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    toast.success('New notification! 🔔');
  };

  const getNotificationContent = (type) => {
    switch (type) {
      case 'like':
        return 'liked your tweet';
      case 'retweet':
        return 'retweeted your tweet';
      case 'follow':
        return 'followed you';
      case 'reply':
        return 'replied to your tweet';
      case 'mention':
        return 'mentioned you in a tweet';
      case 'bookmark':
        return 'bookmarked your tweet';
      default:
        return 'interacted with your tweet';
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications = [
        {
          id: 1,
          type: 'like',
          user: {
            name: 'React Developer',
            username: 'reactdev',
            profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          content: 'liked your tweet',
          tweetContent: 'Just built my first React app! The developer experience is incredible 💻✨',
          time: '2m ago',
          isRead: false,
          tweetId: 'tweet1'
        },
        {
          id: 2,
          type: 'retweet',
          user: {
            name: 'Web Dev Pro',
            username: 'webdev_pro',
            profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          content: 'retweeted your tweet',
          tweetContent: 'Building amazing things with React and Node.js. The real-time features are challenging but rewarding. 🚀',
          time: '5m ago',
          isRead: false,
          tweetId: 'tweet2'
        },
        {
          id: 3,
          type: 'follow',
          user: {
            name: 'Sarah Coder',
            username: 'coder_sarah',
            profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center',
            verified: false
          },
          content: 'followed you',
          tweetContent: null,
          time: '10m ago',
          isRead: true,
          tweetId: null
        },
        {
          id: 4,
          type: 'reply',
          user: {
            name: 'Tech Enthusiast',
            username: 'techenthusiast',
            profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=center',
            verified: false
          },
          content: 'replied to your tweet',
          tweetContent: 'This looks amazing! Great work on the UI 👏',
          time: '15m ago',
          isRead: true,
          tweetId: 'tweet3'
        },
        {
          id: 5,
          type: 'mention',
          user: {
            name: 'Developer Community',
            username: 'devcommunity',
            profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=center',
            verified: true
          },
          content: 'mentioned you in a tweet',
          tweetContent: 'Check out this amazing Twitter clone by @sahana! The attention to detail is incredible 🚀',
          time: '1h ago',
          isRead: true,
          tweetId: 'tweet4'
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    toast.success('All notifications marked as read! ✅');
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.tweetId) {
      navigate(`/tweet/${notification.tweetId}`);
    } else if (notification.type === 'follow') {
      navigate(`/profile/${notification.user.username}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="w-4 h-4 text-red-500" />;
      case 'retweet':
        return <FaRetweet className="w-4 h-4 text-green-500" />;
      case 'follow':
        return <FaUserFriends className="w-4 h-4 text-blue-500" />;
      case 'reply':
        return <FaComment className="w-4 h-4 text-blue-500" />;
      case 'mention':
        return <FaUser className="w-4 h-4 text-purple-500" />;
      case 'bookmark':
        return <FaBookmark className="w-4 h-4 text-blue-500" />;
      default:
        return <FaBell className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mentions') return notification.type === 'mention';
    if (activeTab === 'follows') return notification.type === 'follow';
    if (activeTab === 'likes') return notification.type === 'like';
    if (activeTab === 'retweets') return notification.type === 'retweet';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-400">{unreadCount} new</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
              title="Mark all as read"
            >
              <FaCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
              title="Notification settings"
            >
              <FaCog className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          {[
            { id: 'all', label: 'All' },
            { id: 'mentions', label: 'Mentions' },
            { id: 'follows', label: 'Follows' },
            { id: 'likes', label: 'Likes' },
            { id: 'retweets', label: 'Retweets' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-white border-blue-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-900/50 transition-colors cursor-pointer ${
                !notification.isRead ? 'bg-blue-500/5' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex space-x-3">
                {/* Notification Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={notification.user.profilePic}
                    alt={notification.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white hover:underline">
                          {notification.user.name}
                        </span>
                        {notification.user.verified && (
                          <FaCheck className="w-3 h-3 text-blue-500" />
                        )}
                        <span className="text-gray-400">@{notification.user.username}</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-400">{notification.time}</span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-white mb-2">
                        <span className="text-gray-400">{notification.content}</span>
                      </p>

                      {notification.tweetContent && (
                        <div className="bg-gray-800 rounded-lg p-3 mt-2">
                          <p className="text-gray-300 text-sm">{notification.tweetContent}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FaTimes className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FaBell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {activeTab === 'all' ? 'All caught up!' : `No ${activeTab} notifications`}
          </h3>
          <p className="text-gray-400 max-w-sm">
            {activeTab === 'all' 
              ? 'You\'re all caught up! Check back later for new notifications.'
              : `You don't have any ${activeTab} notifications yet.`
            }
          </p>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Notification settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Push notifications</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Email notifications</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">SMS notifications</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
