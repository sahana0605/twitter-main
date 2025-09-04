import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';
import Feed from './Feed';

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/home':
        return 'Home';
      case '/explore':
        return 'Explore';
      case '/notifications':
        return 'Notifications';
      case '/messages':
        return 'Messages';
      case '/bookmarks':
        return 'Bookmarks';
      case '/lists':
        return 'Lists';
      default:
        if (location.pathname.startsWith('/profile/')) {
          return 'Profile';
        }
        if (location.pathname.startsWith('/tweet/')) {
          return 'Tweet';
        }
        return 'Home';
    }
  };

  const renderMainContent = () => {
    if (location.pathname === '/' || location.pathname === '/home') {
      return <Feed />;
    }
    return <Outlet />;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Navigation */}
      <MobileNav />
      
      <div className="flex">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-1/4 xl:w-1/3">
          <LeftSidebar />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-black z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <LeftSidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen border-x border-gray-800">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <h1 className="text-xl font-bold">{getPageTitle()}</h1>
              
              <div className="w-6"></div> {/* Spacer for centering */}
            </div>
          </div>

          {/* Page Content */}
          <div className="pb-20">
            {renderMainContent()}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block xl:w-1/3">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;