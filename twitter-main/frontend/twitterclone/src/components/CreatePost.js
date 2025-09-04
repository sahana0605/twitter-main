import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaImage, FaSmile, FaCalendar, FaMapMarkerAlt, FaGlobe, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Api from '../services/api';

const CreatePost = ({ onTweetCreated, placeholder = "What's happening?", isReply = false, originalTweet = null }) => {
  const { user } = useSelector((state) => state.user);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !media) {
      toast.error('Please write something or add media');
      return;
    }

    if (content.length > 280) {
      toast.error('Tweet is too long. Maximum 280 characters.');
      return;
    }

    // quick client-side moderation (mirrors backend)
    const violationWords = ["abuse","hate","kill","terror","racist","violence"];
    const normalized = content.toLowerCase();
    if (violationWords.some(w => normalized.includes(w))) {
      toast.error('Your tweet contains prohibited language.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = { description: content.trim(), id: user?._id };
      const res = await Api.createTweet(payload);
      const saved = res?.tweet;
      const mapped = saved ? {
        _id: saved._id,
        content: saved.description,
        author: {
          _id: saved.userId,
          username: user?.username || 'user',
          name: user?.name || 'User',
          profilePic: user?.profilePic || '',
          verified: !!user?.verified
        },
        createdAt: saved.createdAt || new Date(),
        likes: Array.isArray(saved.like) ? saved.like.length : 0,
        retweets: 0,
        replies: 0,
        isLiked: false,
        isRetweeted: false,
        media: mediaPreview,
        hashtags: extractHashtags(content),
        mentions: extractMentions(content),
        isReply: isReply,
        originalTweet: isReply ? originalTweet?._id : null,
        parentTweet: isReply ? originalTweet : null
      } : null;

      if (onTweetCreated && mapped) {
        onTweetCreated(mapped);
      }

      // Reset form
      setContent('');
      setMedia(null);
      setMediaPreview(null);
      
      toast.success(isReply ? 'Reply posted successfully! 💬' : 'Tweet posted successfully! 🎉');
        } catch (error) {
      console.error('Error creating tweet:', error);
      toast.error(error?.message || `Failed to post ${isReply ? 'reply' : 'tweet'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
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

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size too large. Maximum 5MB.');
        return;
      }

      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast.error('Please select an image or video file.');
        return;
      }

      setMedia(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingChars = 280 - content.length;
  const isOverLimit = remainingChars < 0;

    return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex space-x-3">
        <img
          src={user?.profilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=center'}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full bg-transparent text-white text-xl placeholder-gray-500 resize-none outline-none border-none"
              rows={3}
              maxLength={280}
            />
            
            {/* Media Preview */}
            {mediaPreview && (
              <div className="relative mt-3">
                {mediaPreview.startsWith('data:image/') ? (
                  <img
                    src={mediaPreview}
                    alt="Media preview"
                    className="max-h-96 rounded-xl object-cover"
                  />
                ) : (
                  <video
                    src={mediaPreview}
                    controls
                    className="max-h-96 rounded-xl"
                  />
                )}
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
                    </div>
            )}

            {/* Character Count */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-blue-400">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-blue-500 hover:bg-opacity-20 transition-colors"
                >
                  <FaImage className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-blue-500 hover:bg-opacity-20 transition-colors"
                >
                  <FaSmile className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-blue-500 hover:bg-opacity-20 transition-colors"
                >
                  <FaCalendar className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-blue-500 hover:bg-opacity-20 transition-colors"
                >
                  <FaMapMarkerAlt className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-blue-500 hover:bg-opacity-20 transition-colors"
                >
                  <FaGlobe className="w-5 h-5" />
                </button>
                    </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${remainingChars <= 20 ? 'bg-red-500' : remainingChars <= 50 ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  <span className={`text-sm ${isOverLimit ? 'text-red-500' : remainingChars <= 20 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    {remainingChars}
                  </span>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || (!content.trim() && !media) || isOverLimit}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-2 rounded-full transition-colors"
                >
                  {isSubmitting ? 'Posting...' : (isReply ? 'Reply' : 'Tweet')}
                </button>
                </div>
            </div>
          </form>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;