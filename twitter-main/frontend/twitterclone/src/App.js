import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Profile from './components/Profile';
import TweetDetail from './components/TweetDetail';
import Explore from './components/Explore';
import Notifications from './components/Notifications';
import Messages from './components/Messages';
import Bookmarks from './components/Bookmarks';
import Lists from './components/Lists';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCheck from './components/AuthCheck';

import { useSelector } from 'react-redux';

function RootRedirect() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const target = user?._id ? `/profile/${user._id}` : '/home';
  return <Navigate to={target} replace />;
}

function App() {
  return (
    <Router>
      <AuthCheck>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* default: send users based on auth */}
            <Route path="/" element={<RootRedirect />} />

            {/* public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* protected app routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/tweet/:id" element={<ProtectedRoute><TweetDetail /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/lists" element={<ProtectedRoute><Lists /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthCheck>
    </Router>
  );
}

export default App;
