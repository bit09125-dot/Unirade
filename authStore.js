import create from "zustand";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  register: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/verify-email`, { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      set({
        token: response.data.token,
        user: response.data,
        isAuthenticated: true,
      });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("token");
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const response = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data });
      return response.data;
    } catch (error) {
      set({ isAuthenticated: false, token: null });
      localStorage.removeItem("token");
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}));
