import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaLink, FaEdit, FaHeart, FaRetweet, FaComment, FaShare, FaBookmark, FaBell } from 'react-icons/fa';
import Tweet from './Tweet';
import CreatePost from './CreatePost';
import EditProfile from './EditProfile';
import toast from 'react-hot-toast';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [profileUser, setProfileUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState('tweets');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    const ownProfile = user?.username === username;
    setIsOwnProfile(ownProfile);

    setProfileUser({
      _id: ownProfile ? user?._id : 'user123',
      name: ownProfile ? user?.name : 'Sahana',
      username: username || 'sahana',
      bio: 'Building amazing things with React and Node.js. Passionate about web development and creating user-friendly applications.',
      profilePic: ownProfile ? user?.profilePic : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=center',
      coverPic: 'https://via.placeholder.com/800x300/6C757D/FFFFFF?text=Cover+Image',
      location: 'San Francisco, CA',
      website: 'https://example.com',
      joinedDate: 'March 2023',
      following: 1234,
      followers: 5678,
      tweetCount: 4 // Mock initial tweet count
    });

    loadUserContent(activeTab, username);
  }, [username, user, activeTab]);

  const loadUserContent = (tab, username) => {
    const mockTweets = [
      {
        _id: '1',
        content: 'Just launched our new Twitter clone! 🚀 What do you think? #React #MERN #TwitterClone',
        author: {
          _id: 'user123',
          username: username || 'sahana',
          name: 'Sahana',
          profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        likes: 42,
        retweets: 12,
        replies: 8,
        isLiked: false,
        isRetweeted: false,
        media: null
      },
      {
        _id: '2',
        content: 'Building amazing things with React and Node.js. The developer experience is incredible! 💻✨',
        author: {
          _id: 'user123',
          username: username || 'sahana',
          name: 'Sahana',
          profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likes: 128,
        retweets: 34,
        replies: 15,
        isLiked: true,
        isRetweeted: false,
        media: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&crop=center'
      }
    ];

    const mockReplies = [
      {
        _id: 'reply1',
        content: 'This looks amazing! Great work on the UI 👏',
        author: {
          _id: 'user123',
          username: username || 'sahana',
          name: 'Sahana',
          profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        likes: 15,
        retweets: 2,
        replies: 1,
        isLiked: false,
        isRetweeted: false,
        media: null,
        isReply: true,
        originalTweet: 'Just launched our new Twitter clone! 🚀'
      }
    ];

    const mockMedia = [
      {
        _id: 'media1',
        content: 'Check out this amazing sunset! 🌅 #Photography #Nature',
        author: {
          _id: 'user123',
          username: username || 'sahana',
          name: 'Sahana',
          profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        likes: 89,
        retweets: 12,
        replies: 5,
        isLiked: false,
        isRetweeted: false,
        media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center'
      }
    ];

    const mockLikes = [
      {
        _id: 'like1',
        content: 'Amazing work on this project! The attention to detail is incredible 👌',
        author: {
          _id: 'user456',
          username: 'developer_pro',
          name: 'Developer Pro',
          profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center'
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        likes: 234,
        retweets: 45,
        replies: 23,
        isLiked: true,
        isRetweeted: false,
        media: null
      }
    ];

    switch (tab) {
      case 'tweets':
        setTweets(mockTweets);
        break;
      case 'replies':
        setTweets(mockReplies);
        break;
      case 'media':
        setTweets(mockMedia);
        break;
      case 'likes':
        setTweets(mockLikes);
        break;
      default:
        setTweets(mockTweets);
    }
  };

  const handleNewTweet = (newTweet) => {
    console.log('Profile received new tweet:', newTweet);
    
    // Add new tweet to the top of the tweets list
    setTweets(prevTweets => [newTweet, ...prevTweets]);

    // Update tweet count
    if (profileUser) {
      setProfileUser(prev => ({
        ...prev,
        tweetCount: (prev.tweetCount || 0) + 1
      }));
    }
    
    toast.success('Tweet added to your profile! 🎉');
    console.log('New tweet added to profile:', newTweet);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    loadUserContent(tab, username);
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success(`You're now following @${username}! 👥`);
    } else {
      toast.success(`You unfollowed @${username}`);
    }
  };

  const handleNotifications = () => {
    setIsNotificationsOn(!isNotificationsOn);
    toast.success(
      isNotificationsOn 
        ? 'Notifications turned off for this user' 
        : 'Notifications turned on for this user! 🔔'
    );
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

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
            <h1 className="text-xl font-bold text-white">{profileUser?.name}</h1>
            <p className="text-gray-400 text-sm">{profileUser?.tweetCount} Tweets</p>
          </div>
                    </div>
                </div>

      {/* Cover Photo */}
      <div className="relative h-48 bg-gray-800">
        <img
          src={profileUser?.coverPic}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="relative px-4 pb-4">
        {/* Profile Picture */}
        <div className="relative -mt-20 mb-4">
          <img
            src={profileUser?.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-black object-cover"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mb-4">
          {!isOwnProfile && (
            <>
              <button
                onClick={handleNotifications}
                className={`p-2 rounded-full transition-colors ${
                  isNotificationsOn 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isNotificationsOn ? <FaBell className="w-5 h-5" /> : <FaBell className="w-5 h-5 text-gray-400" />}
              </button>
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </>
          )}
          {isOwnProfile && (
            <button
              onClick={handleEditProfile}
              className="px-6 py-2 rounded-full font-medium border border-gray-600 text-white hover:bg-gray-800 transition-colors"
            >
              Edit profile
            </button>
          )}
                </div>

        {/* User Info */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">{profileUser?.name}</h2>
          <p className="text-gray-400 mb-3">@{profileUser?.username}</p>
          <p className="text-white mb-3">{profileUser?.bio}</p>
          
          <div className="flex items-center space-x-4 text-gray-400 text-sm mb-3">
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt className="w-4 h-4" />
              <span>{profileUser?.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaLink className="w-4 h-4" />
              <a href={profileUser?.website} className="text-blue-400 hover:underline">
                {profileUser?.website?.replace('https://', '')}
              </a>
            </div>
            <div className="flex items-center space-x-1">
              <FaCalendar className="w-4 h-4" />
              <span>Joined {profileUser?.joinedDate}</span>
                </div>
                </div>

          <div className="flex space-x-5 text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-white">{profileUser?.following}</span>
              <span className="text-gray-400">Following</span>
                </div>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-white">{profileUser?.followers}</span>
              <span className="text-gray-400">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex">
          {[
            { id: 'tweets', label: 'Tweets' },
            { id: 'replies', label: 'Replies' },
            { id: 'media', label: 'Media' },
            { id: 'likes', label: 'Likes' }
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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen">
        {/* Create Post (only for own profile) */}
        {isOwnProfile && (
          <div className="border-b border-gray-800">
            <CreatePost onTweetCreated={handleNewTweet} />
          </div>
        )}

        {/* Tweets/Content */}
        {tweets.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {tweets.map((tweet) => (
              <Tweet
                key={tweet._id}
                tweet={tweet}
                onAction={handleTweetAction}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FaComment className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'tweets' && 'No tweets yet'}
              {activeTab === 'replies' && 'No replies yet'}
              {activeTab === 'media' && 'No media yet'}
              {activeTab === 'likes' && 'No likes yet'}
            </h3>
            <p className="text-gray-400">
              {activeTab === 'tweets' && 'When you post tweets, they will show up here.'}
              {activeTab === 'replies' && 'When you reply to tweets, they will show up here.'}
              {activeTab === 'media' && 'When you post photos or videos, they will show up here.'}
              {activeTab === 'likes' && 'When you like tweets, they will show up here.'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfile 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </div>
  );
};

export default Profile;