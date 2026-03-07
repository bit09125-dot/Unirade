import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const matchService = {
  getSuggestions: async () => {
    try {
      const response = await axios.get(`${API_BASE}/matches/suggestions`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  likeUser: async (likedId) => {
    try {
      const response = await axios.post(
        `${API_BASE}/matches/like`,
        { likedId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  skipUser: async (skippedId) => {
    try {
      const response = await axios.post(
        `${API_BASE}/matches/skip`,
        { skippedId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMatches: async () => {
    try {
      const response = await axios.get(`${API_BASE}/matches/my-matches`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  blockUser: async (blockedId) => {
    try {
      const response = await axios.post(
        `${API_BASE}/matches/block`,
        { blockedId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const messageService = {
  sendMessage: async (matchId, receiverId, content) => {
    try {
      const response = await axios.post(
        `${API_BASE}/messages/send`,
        { matchId, receiverId, content },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMessages: async (matchId, limit = 50) => {
    try {
      const response = await axios.get(
        `${API_BASE}/messages/match/${matchId}?limit=${limit}`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConversations: async () => {
    try {
      const response = await axios.get(`${API_BASE}/messages/conversations`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
