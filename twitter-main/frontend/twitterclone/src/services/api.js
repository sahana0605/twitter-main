const API_BASE_URL = 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to make API calls
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.makeRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.makeRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.makeRequest('/user/logout', {
      method: 'GET',
    });
  }

  async getMe() {
    return this.makeRequest('/user/me', {
      method: 'GET',
    });
  }

  async updateProfile(profileData) {
    return this.makeRequest('/user/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile(userId) {
    return this.makeRequest(`/user/profile/${userId}`, {
      method: 'GET',
    });
  }

  async getOtherUsers(userId) {
    return this.makeRequest(`/user/otheruser/${userId}`, {
      method: 'GET',
    });
  }

  async followUser(userId) {
    return this.makeRequest(`/user/follow/${userId}`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId) {
    return this.makeRequest(`/user/unfollow/${userId}`, {
      method: 'POST',
    });
  }

  async bookmarkTweet(tweetId) {
    return this.makeRequest(`/user/bookmark/${tweetId}`, {
      method: 'PUT',
    });
  }

  // Tweet methods (you can add these later)
  async createTweet(tweetData) {
    return this.makeRequest('/tweet/create', {
      method: 'POST',
      body: JSON.stringify(tweetData),
    });
  }

  async getTweets() {
    return this.makeRequest('/tweet/tweets', {
      method: 'GET',
    });
  }

  async likeTweet(tweetId) {
    return this.makeRequest(`/tweet/like/${tweetId}`, {
      method: 'PUT',
    });
  }

  async retweet(tweetId) {
    return this.makeRequest(`/tweet/retweet/${tweetId}`, {
      method: 'PUT',
    });
  }

  async replyToTweet(tweetId, replyData) {
    return this.makeRequest(`/tweet/reply/${tweetId}`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  }
}

export default new ApiService();

