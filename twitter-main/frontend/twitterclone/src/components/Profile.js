import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaLink, FaEdit, FaHeart, FaRetweet, FaComment, FaShare, FaBookmark, FaBell } from 'react-icons/fa';
import Tweet from './Tweet';
import CreatePost from './CreatePost';
import EditProfile from './EditProfile';
import FollowList from './FollowList';
import Api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [profileUser, setProfileUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState('tweets');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFollowListOpen, setIsFollowListOpen] = useState(false);
  const [followListType, setFollowListType] = useState('followers');

  useEffect(() => {
    const init = async () => {
      // Check if we have a valid ID
      if (!id || id === 'undefined' || id === 'null') {
        console.error('Invalid user ID:', id);
        toast.error('Invalid user ID');
        return;
      }

      const ownProfile = user?._id === id;
      setIsOwnProfile(ownProfile);

      try {
        let res;
        // Try authenticated endpoint first if user exists, fallback to public endpoint
        if (user) {
          try {
            res = await Api.getProfile(id);
          } catch (authError) {
            console.log('Auth endpoint failed, trying public endpoint:', authError);
            res = await Api.getPublicProfile(id);
          }
        } else {
          res = await Api.getPublicProfile(id);
        }
        
        const u = res?.user || {};
        const followersIds = Array.isArray(u.followers) ? u.followers : [];
        const followingIds = Array.isArray(u.following) ? u.following : [];
        setProfileUser({
          _id: u._id,
          name: u.name || 'User',
          username: u.username || 'user',
          bio: u.bio || '',
          profilePic: u.profilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=center',
          coverPic: u.coverPic || 'https://via.placeholder.com/800x300/6C757D/FFFFFF?text=Cover+Image',
          location: u.location || '',
          website: u.website || '',
          joinedDate: new Date(u.createdAt || Date.now()).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          following: followingIds.length,
          followers: followersIds.length,
          followingIds,
          followersIds,
          tweetCount: 0
        });
        // initialize follow toggle if viewing other user's profile
        setIsFollowing(followersIds.includes(user?._id));
      } catch (e) {
        console.error('Profile load error:', e);
        toast.error('Failed to load profile');
      }

      await loadUserContent(activeTab);
    };
    if (id) init();
  }, [id, user, activeTab]);

  const loadUserContent = async (tab) => {
    // Check if we have a valid ID
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid user ID for loading content:', id);
      return;
    }

    try {
      let response;
      
      if (tab === 'tweets') {
        // Fetch user's own tweets - try authenticated endpoint first, fallback to public
        if (user) {
          try {
            response = await Api.getAllTweets(id);
          } catch (authError) {
            console.log('Auth tweets endpoint failed, trying public endpoint:', authError);
            response = await Api.getPublicUserTweets(id);
          }
        } else {
          response = await Api.getPublicUserTweets(id);
        }
      } else {
        // For replies, media, and likes, we'll use mock data for now
        // as the backend doesn't have these endpoints yet
        const mockReplies = [];
        const mockMedia = [];
        const mockLikes = [];
        
        switch (tab) {
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
            setTweets([]);
        }
        return;
      }
      
      if (response?.tweets) {
        // Filter tweets to only show the current user's tweets
        const userTweets = response.tweets.filter(tweet => String(tweet.userId) === String(id));
        
        // Map backend tweet format to frontend format
        const mappedTweets = userTweets.map(tweet => ({
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
          isLiked: Array.isArray(tweet.like) ? tweet.like.includes(user?._id) : false,
          isRetweeted: false,
          media: null,
          hashtags: extractHashtags(tweet.description),
          mentions: extractMentions(tweet.description)
        }));
        
        setTweets(mappedTweets);
        
        // Update tweet count
        if (profileUser) {
          setProfileUser(prev => ({
            ...prev,
            tweetCount: mappedTweets.length
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user content:', error);
      toast.error('Failed to load tweets');
      setTweets([]);
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
    loadUserContent(tab);
  };

  const handleTweetAction = (tweetId, action) => {
    if (action === 'delete') {
      setTweets(prevTweets => {
        const filteredTweets = prevTweets.filter(tweet => tweet._id !== tweetId);
        // Update tweet count
        if (profileUser) {
          setProfileUser(prev => ({
            ...prev,
            tweetCount: filteredTweets.length
          }));
        }
        return filteredTweets;
      });
      return;
    }
    
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

  const handleFollow = async () => {
    if (!user || !profileUser?._id) {
      toast.error('Please login to follow users');
      return;
    }
    try {
      // optimistic update
      setIsFollowing((prev) => !prev);
      setProfileUser((prev) => {
        if (!prev) return prev;
        const delta = isFollowing ? -1 : 1;
        return { ...prev, followers: Math.max(0, (prev.followers || 0) + delta) };
      });

      if (!isFollowing) {
        await Api.followUser(profileUser._id);
        toast.success(`You're now following @${profileUser?.username}! 👥`);
      } else {
        await Api.unfollowUser(profileUser._id);
        toast.success(`You unfollowed @${profileUser?.username}`);
      }
    } catch (err) {
      // revert on error
      setIsFollowing((prev) => !prev);
      setProfileUser((prev) => {
        if (!prev) return prev;
        const delta = !isFollowing ? -1 : 1;
        return { ...prev, followers: Math.max(0, (prev.followers || 0) + delta) };
      });
      console.error('Follow action failed', err);
      toast.error('Failed to update follow status');
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

  const handleOpenFollowList = (type) => {
    setFollowListType(type);
    setIsFollowListOpen(true);
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
            <button
              onClick={() => handleOpenFollowList('following')}
              className="flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span className="font-bold text-white">{profileUser?.following}</span>
              <span className="text-gray-400">Following</span>
            </button>
            <button
              onClick={() => handleOpenFollowList('followers')}
              className="flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span className="font-bold text-white">{profileUser?.followers}</span>
              <span className="text-gray-400">Followers</span>
            </button>
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

      {/* Follow List Modal */}
      <FollowList
        isOpen={isFollowListOpen}
        onClose={() => setIsFollowListOpen(false)}
        userId={id}
        type={followListType}
      />
    </div>
  );
};

export default Profile;