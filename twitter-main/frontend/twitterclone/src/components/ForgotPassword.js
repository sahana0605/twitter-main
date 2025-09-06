import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - in real app, this would send a password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <FaTwitter className="w-12 h-12 text-blue-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>
          <p className="text-gray-400 mb-6">
            We've sent a password reset link to <span className="text-white">{email}</span>
          </p>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <FaEnvelope className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300 text-sm">
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-colors"
            >
              Resend email
            </button>
            <Link
              to="/login"
              className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-full transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <FaTwitter className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="text-gray-400 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-full transition-colors"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-4">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
          
          <div className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">Need help?</h3>
          <p className="text-xs text-gray-400">
            If you're having trouble accessing your account, you can also{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">contact support</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;




















