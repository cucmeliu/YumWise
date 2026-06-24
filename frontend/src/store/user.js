import { reactive } from 'vue';
import request from '../utils/request';

const state = reactive({
  userInfo: null,
  healthProfile: null,
  token: uni.getStorageSync('token') || '',
});

export function useUserStore() {
  const isLoggedIn = () => !!state.token;
  const hasProfile = () => !!state.healthProfile;

  const login = async (code) => {
    try {
      const res = await request.post('/users/login', { code });
      state.token = res.data.accessToken;
      state.userInfo = res.data.user;
      uni.setStorageSync('token', res.data.accessToken);
      return res;
    } catch (error) {
      throw error;
    }
  };

  const mockLogin = async () => {
    try {
      // #ifdef H5
      const mockCode = 'mock_code_' + Date.now();
      const res = await request.post('/users/login', { code: mockCode });
      state.token = res.data.accessToken;
      state.userInfo = res.data.user;
      uni.setStorageSync('token', res.data.accessToken);
      return res;
      // #endif

      // #ifdef MP-WEIXIN
      return new Promise((resolve, reject) => {
        uni.login({
          success: async (loginRes) => {
            try {
              console.log('微信登录成功:', loginRes);
              // 如果获取到 code，使用真实登录；否则使用模拟登录
              const code = loginRes.code || 'mock_code_' + Date.now();
              const res = await request.post('/users/login', { code });
              state.token = res.data.accessToken;
              state.userInfo = res.data.user;
              uni.setStorageSync('token', res.data.accessToken);
              resolve(res);
            } catch (error) {
              console.error('登录请求失败:', error);
              reject(error);
            }
          },
          fail: async (error) => {
            console.error('微信登录失败，使用模拟登录:', error);
            // 登录失败时使用模拟登录
            try {
              const mockCode = 'mock_code_' + Date.now();
              const res = await request.post('/users/login', { code: mockCode });
              state.token = res.data.accessToken;
              state.userInfo = res.data.user;
              uni.setStorageSync('token', res.data.accessToken);
              resolve(res);
            } catch (mockError) {
              reject(mockError);
            }
          },
        });
      });
      // #endif
    } catch (error) {
      throw error;
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await request.get('/users/profile');
      state.userInfo = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const getHealthProfile = async () => {
    try {
      const res = await request.get('/health-profile');
      state.healthProfile = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const saveHealthProfile = async (profileData) => {
    try {
      const res = await request.post('/health-profile', profileData);
      state.healthProfile = res.data;
      uni.setStorageSync('hasProfile', true);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const updateUserInfo = async (userData) => {
    try {
      const res = await request.put('/users/profile', userData);
      state.userInfo = res.data;
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    state.token = '';
    state.userInfo = null;
    state.healthProfile = null;
    uni.removeStorageSync('token');
    uni.removeStorageSync('hasProfile');
  };

  return {
    state,
    isLoggedIn,
    hasProfile,
    login,
    mockLogin,
    getUserInfo,
    getHealthProfile,
    saveHealthProfile,
    updateUserInfo,
    logout,
  };
}
