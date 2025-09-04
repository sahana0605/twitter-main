import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaEnvelope, 
  FaBookmark, 
  FaList, 
  FaUser 
} from 'react-icons/fa';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/explore', icon: FaSearch, label: 'Explore' },
    { path: '/notifications', icon: FaBell, label: 'Notifications' },
    { path: '/messages', icon: FaEnvelope, label: 'Messages' },
    { path: '/bookmarks', icon: FaBookmark, label: 'Bookmarks' },
    { path: '/lists', icon: FaList, label: 'Lists' },
    { path: `/profile/${user?.username}`, icon: FaUser, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === '/profile' && location.pathname.startsWith('/profile/'));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;















