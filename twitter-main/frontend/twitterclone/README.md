# Twitter Clone Frontend

A modern, responsive Twitter clone built with React, Redux, and Tailwind CSS. This frontend application provides a complete Twitter-like experience with all the essential features.

## 🚀 Features

### Core Twitter Features
- **Tweet Creation**: Create tweets with text and media uploads
- **Timeline**: View tweets in a chronological feed
- **Interactions**: Like, retweet, reply, and bookmark tweets
- **User Profiles**: View and edit user profiles with cover photos
- **Search**: Search for users, hashtags, and tweets
- **Notifications**: Real-time notifications for likes, retweets, follows, and replies
- **Direct Messages**: Chat with other users
- **Bookmarks**: Save and organize favorite tweets
- **Lists**: Create and manage user lists

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Beautiful dark mode interface
- **Smooth Animations**: CSS transitions and hover effects
- **Mobile Navigation**: Bottom navigation bar for mobile devices
- **Sidebar Navigation**: Collapsible sidebar for desktop
- **Real-time Updates**: Live interaction feedback

### Technical Features
- **State Management**: Redux with Redux Toolkit
- **Routing**: React Router with protected routes
- **Authentication**: Login/logout system with route protection
- **Responsive Layout**: Tailwind CSS for responsive design
- **Icon System**: React Icons for consistent iconography
- **Toast Notifications**: User feedback with react-hot-toast

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## 📱 Screenshots

The application includes:
- Modern login screen
- Responsive timeline with tweet interactions
- User profiles with cover photos
- Search and explore functionality
- Notifications center
- Direct messaging interface
- Bookmarks and lists management
- Mobile-optimized navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd twitter-clone/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Body.js         # Main body component
│   ├── CreatePost.js   # Tweet creation form
│   ├── Feed.js         # Main timeline
│   ├── Home.js         # Main layout wrapper
│   ├── LeftSidebar.js  # Left navigation sidebar
│   ├── RightSidebar.js # Right sidebar with trends
│   ├── Tweet.js        # Individual tweet component
│   ├── Profile.js      # User profile page
│   ├── Login.js        # Authentication page
│   ├── Explore.js      # Search and trends
│   ├── Notifications.js # Notifications center
│   ├── Messages.js     # Direct messaging
│   ├── Bookmarks.js    # Saved tweets
│   ├── Lists.js        # User lists
│   ├── MobileNav.js    # Mobile navigation
│   └── ProtectedRoute.js # Route protection
├── redux/              # State management
│   ├── store.js        # Redux store configuration
│   ├── userSlice.js    # User state slice
│   └── tweetSlice.js   # Tweet state slice
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.js              # Main application component
└── index.js            # Application entry point
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Responsive breakpoints for all screen sizes
- **Touch Friendly**: Optimized for touch interactions
- **Mobile Navigation**: Bottom navigation bar for mobile
- **Sidebar**: Collapsible sidebar for desktop

## 🎨 Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'twitter-blue': '#1DA1F2',
        'twitter-dark': '#14171A',
        // Add your custom colors
      }
    }
  }
}
```

### Components
All components are modular and can be easily customized. Each component includes:
- Responsive design
- Accessibility features
- Hover and focus states
- Loading states
- Error handling

## 🚀 Deployment

### Build and Deploy
```bash
npm run build
```

The build folder contains the production-ready application.

### Deployment Options
- **Netlify**: Drag and drop the build folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the build folder to S3
- **Firebase**: Use Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Twitter for the original design inspiration
- React community for excellent documentation
- Tailwind CSS team for the amazing utility-first framework
- All contributors and supporters

---

**Note**: This is a frontend-only implementation. You'll need to connect it to a backend API to make it fully functional. The current version uses mock data for demonstration purposes.
