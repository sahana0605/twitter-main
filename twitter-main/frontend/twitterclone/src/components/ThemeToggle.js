import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState('dark');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.className = 'bg-white text-black';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.className = 'bg-black text-white';
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
    
    const themeNames = {
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    };
    
    toast.success(`${themeNames[newTheme]} theme applied! ${newTheme === 'light' ? '☀️' : newTheme === 'dark' ? '🌙' : '💻'}`);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <FaSun className="w-4 h-4" />;
      case 'dark':
        return <FaMoon className="w-4 h-4" />;
      case 'system':
        return <FaDesktop className="w-4 h-4" />;
      default:
        return <FaMoon className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        title="Theme settings"
      >
        {getThemeIcon()}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-12 bg-black border border-gray-800 rounded-xl shadow-lg z-50 min-w-48 py-2">
            <div className="px-4 py-2 border-b border-gray-800">
              <h3 className="text-sm font-medium text-gray-400">Theme</h3>
            </div>
            
            <div className="py-1">
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                  theme === 'light' 
                    ? 'bg-blue-500/10 text-blue-500' 
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <FaSun className="w-4 h-4" />
                <span>Light</span>
                {theme === 'light' && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
              
              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-500/10 text-blue-500' 
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <FaMoon className="w-4 h-4" />
                <span>Dark</span>
                {theme === 'dark' && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
              
              <button
                onClick={() => handleThemeChange('system')}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                  theme === 'system' 
                    ? 'bg-blue-500/10 text-blue-500' 
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                <FaDesktop className="w-4 h-4" />
                <span>System</span>
                {theme === 'system' && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;

