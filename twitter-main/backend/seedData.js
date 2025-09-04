import mongoose from 'mongoose';
import { User } from './models/userSchema.js';
import { Tweet } from './models/tweetSchema.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const sampleUsers = [
  {
    name: 'Elon Musk',
    username: 'elonmusk',
    email: 'elon@tesla.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=center',
    verified: true
  },
  {
    name: 'Bill Gates',
    username: 'billgates',
    email: 'bill@gatesfoundation.org',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center',
    verified: true
  },
  {
    name: 'Sundar Pichai',
    username: 'sundarpichai',
    email: 'sundar@google.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=center',
    verified: true
  },
  {
    name: 'Satya Nadella',
    username: 'satyanadella',
    email: 'satya@microsoft.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=center',
    verified: true
  },
  {
    name: 'Tim Cook',
    username: 'tim_cook',
    email: 'tim@apple.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=center',
    verified: true
  },
  {
    name: 'Mark Zuckerberg',
    username: 'zuck',
    email: 'mark@meta.com',
    password: 'password123',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=center',
    verified: true
  }
];

const sampleTweets = [
  {
    description: "Just launched our new AI model! The future of technology is here. #AI #Innovation #Tech",
    userId: null, // Will be set dynamically
    userDetails: null // Will be set dynamically
  },
  {
    description: "Working on some exciting new features for our platform. Can't wait to share them with you all! 🚀 #Development #Innovation",
    userId: null,
    userDetails: null
  },
  {
    description: "Beautiful sunset tonight! Nature never fails to amaze me. 🌅 #Nature #Photography #Sunset",
    userId: null,
    userDetails: null
  },
  {
    description: "Learning new technologies is always exciting. What are you learning this week? 🤔 #Learning #Tech #Programming",
    userId: null,
    userDetails: null
  },
  {
    description: "The power of collaboration in tech is incredible. Working with amazing teams to build the future! 💻✨ #Teamwork #Tech",
    userId: null,
    userDetails: null
  },
  {
    description: "Just finished reading an amazing book on machine learning. The insights are mind-blowing! 📚 #ML #AI #Learning",
    userId: null,
    userDetails: null
  },
  {
    description: "Coffee and code - the perfect combination for a productive day! ☕️ #DeveloperLife #Coffee #Coding",
    userId: null,
    userDetails: null
  },
  {
    description: "Excited to announce our new product launch next week! Stay tuned for something amazing! 🎉 #ProductLaunch #Innovation",
    userId: null,
    userDetails: null
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/twitter_clone');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tweet.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create sample tweets
    for (let i = 0; i < sampleTweets.length; i++) {
      const tweetData = sampleTweets[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const tweet = new Tweet({
        description: tweetData.description,
        userId: randomUser._id,
        userDetails: {
          name: randomUser.name,
          username: randomUser.username,
          profilePic: randomUser.profilePic,
          verified: randomUser.verified
        }
      });
      
      await tweet.save();
      console.log(`Created tweet by ${randomUser.name}: ${tweetData.description.substring(0, 50)}...`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
