import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaTwitter, 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaEnvelope, 
  FaBookmark, 
  FaList, 
  FaUser, 
  FaEllipsisH,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import { logoutUser } from '../redux/userSlice';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

const LeftSidebar = ({ onClose }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/explore', icon: FaSearch, label: 'Explore' },
    { path: '/notifications', icon: FaBell, label: 'Notifications' },
    { path: '/messages', icon: FaEnvelope, label: 'Messages' },
    { path: '/bookmarks', icon: FaBookmark, label: 'Bookmarks' },
    { path: '/lists', icon: FaList, label: 'Lists' },
    { path: `/profile/${user?._id}`, icon: FaUser, label: 'Profile' },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const handleNavClick = (path) => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-4">
        <Link to="/" onClick={handleNavClick} className="inline-block">
          <FaTwitter className="w-8 h-8 text-blue-400" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/profile' && location.pathname.startsWith('/profile/'));
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-full text-xl font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="hidden xl:block">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-gray-800">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <img
              src={user?.profilePic || 'https://via.placeholder.com/40x40/1DA1F2/FFFFFF?text=U'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="hidden xl:block flex-1 text-left">
              <div className="font-semibold text-white">{user?.name || 'User'}</div>
              <div className="text-gray-400">@{user?.username || 'username'}</div>
            </div>
            <FaEllipsisH className="hidden xl:block text-gray-400" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-700 rounded-2xl shadow-lg z-50">
              <div className="p-2">
                <Link
                  to={`/profile/${user?._id}`}
                  onClick={() => {
                    setShowUserMenu(false);
                    handleNavClick(`/profile/${user?._id}`);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-xl hover:bg-gray-800 text-white transition-colors"
                >
                  <div className="font-semibold">{user?.name || 'User'}</div>
                  <div className="text-gray-400">@{user?.username || 'username'}</div>
                </Link>
                
                <div className="border-t border-gray-700 my-2"></div>
                
                <div className="px-4 py-2">
                  <ThemeToggle />
                </div>
                
                <div className="border-t border-gray-700 my-2"></div>
                
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 rounded-xl hover:bg-gray-800 text-red-400 transition-colors flex items-center space-x-3 disabled:opacity-50"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>{loading ? 'Logging out...' : 'Log out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close Button for Mobile */}
      {onClose && (
        <div className="p-4 lg:hidden">
          <button
            onClick={onClose}
            className="w-full p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center space-x-2"
          >
            <FaTimes className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;