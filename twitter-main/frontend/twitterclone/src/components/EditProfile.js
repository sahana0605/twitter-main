import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTimes, FaCamera, FaGlobe, FaMapMarkerAlt, FaCalendar, FaUser, FaAt } from 'react-icons/fa';
import { updateUserProfile, clearError } from '../redux/userSlice';
import toast from 'react-hot-toast';

const EditProfile = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    profilePic: '',
    coverPic: ''
  });
  
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState('');

  // Handle error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        profilePic: user.profilePic || '',
        coverPic: user.coverPic || ''
      });
      setProfileImagePreview(user.profilePic || '');
      setCoverImagePreview(user.coverPic || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'profile') {
          setProfileImagePreview(e.target.result);
          setFormData(prev => ({ ...prev, profilePic: e.target.result }));
        } else {
          setCoverImagePreview(e.target.result);
          setFormData(prev => ({ ...prev, coverPic: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }
    if (formData.bio.length > 160) {
      toast.error('Bio must be 160 characters or less');
      return false;
    }
    if (formData.website && !formData.website.startsWith('http')) {
      toast.error('Website must start with http:// or https://');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(updateUserProfile(formData)).unwrap();
      toast.success(result.message || 'Profile updated successfully! ✨');
      onClose();
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-xl font-bold text-white">Edit profile</h2>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Cover Image */}
          <div className="relative">
            <div className="h-32 bg-gray-800 rounded-lg overflow-hidden">
              {coverImagePreview ? (
                <img
                  src={coverImagePreview}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <FaCamera className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            <label className="absolute bottom-2 left-2 p-2 bg-black bg-opacity-75 rounded-full cursor-pointer hover:bg-opacity-90 transition-colors">
              <FaCamera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'cover')}
                className="hidden"
              />
            </label>
          </div>

          {/* Profile Image */}
          <div className="relative -mt-16 ml-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-black">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <FaUser className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-black bg-opacity-75 rounded-full cursor-pointer hover:bg-opacity-90 transition-colors">
              <FaCamera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'profile')}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={50}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Name"
                />
                <span className="absolute right-3 top-3 text-xs text-gray-500">
                  {formData.name.length}/50
                </span>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <div className="relative">
                <FaAt className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  maxLength={15}
                  className="w-full bg-transparent border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Username"
                />
                <span className="absolute right-3 top-3 text-xs text-gray-500">
                  {formData.username.length}/15
                </span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bio
              </label>
              <div className="relative">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={160}
                  rows={3}
                  className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Tell us about yourself"
                />
                <span className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {formData.bio.length}/160
                </span>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Location
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={30}
                  className="w-full bg-transparent border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Location"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Website
              </label>
              <div className="relative">
                <FaGlobe className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;