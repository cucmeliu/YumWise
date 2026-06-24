const BASE_URL = 'http://localhost:3000/api/v1';

class Request {
  constructor() {
    this.baseURL = BASE_URL;
  }

  request(options) {
    return new Promise((resolve, reject) => {
      const token = uni.getStorageSync('token');

      uni.request({
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          ...options.header,
        },
        success: (res) => {
          console.log('API Response:', res.statusCode, res.data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            uni.removeStorageSync('token');
            uni.redirectTo({
              url: '/pages/setup/index',
            });
            reject(new Error('未授权'));
          } else {
            console.error('API Error:', res.statusCode, res.data);
            reject(new Error(res.data.message || `请求失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '网络错误',
            icon: 'none',
          });
          reject(err);
        },
      });
    });
  }

  get(url, data) {
    return this.request({ url, method: 'GET', data });
  }

  post(url, data) {
    return this.request({ url, method: 'POST', data });
  }

  put(url, data) {
    return this.request({ url, method: 'PUT', data });
  }

  delete(url, data) {
    return this.request({ url, method: 'DELETE', data });
  }
}

export default new Request();