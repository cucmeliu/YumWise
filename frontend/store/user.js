import { defineStore } from 'pinia';
import request from '../utils/request';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    healthProfile: null,
    token: uni.getStorageSync('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    hasProfile: (state) => !!state.healthProfile,
  },

  actions: {
    async login(code) {
      try {
        const res = await request.post('/users/login', { code });
        this.token = res.data.accessToken;
        this.userInfo = res.data.user;
        uni.setStorageSync('token', res.data.accessToken);
        return res;
      } catch (error) {
        throw error;
      }
    },

    async getUserInfo() {
      try {
        const res = await request.get('/users/profile');
        this.userInfo = res.data;
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async getHealthProfile() {
      try {
        const res = await request.get('/health-profile');
        this.healthProfile = res.data;
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async saveHealthProfile(profileData) {
      try {
        const res = await request.post('/health-profile', profileData);
        this.healthProfile = res.data;
        uni.setStorageSync('hasProfile', true);
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async updateUserInfo(userData) {
      try {
        const res = await request.put('/users/profile', userData);
        this.userInfo = res.data;
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      this.healthProfile = null;
      uni.removeStorageSync('token');
      uni.removeStorageSync('hasProfile');
    },
  },
});