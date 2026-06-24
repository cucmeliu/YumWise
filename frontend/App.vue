<script>
export default {
  onLaunch: function () {
    console.log('App Launch');
    this.checkLogin();
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
  methods: {
    async checkLogin() {
      const token = uni.getStorageSync('token');
      if (!token) {
        const hasProfile = uni.getStorageSync('hasProfile');
        if (!hasProfile) {
          uni.redirectTo({
            url: '/pages/setup/index',
          });
        }
      }
    },
  },
};
</script>

<style>
/* 全局样式 */
page {
  background-color: #fffaf5;
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 颜色变量 */
:root {
  --primary-color: #ff6b35;
  --primary-light: #fff0e8;
  --primary-dark: #e55a28;
  --teal-color: #2ec4b6;
  --teal-light: #e8faf8;
  --success-color: #00b894;
  --success-light: #e8f8f0;
  --warning-color: #fdcb6e;
  --danger-color: #ff6b6b;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-placeholder: #9ca3af;
  --border-color: #e5e7eb;
  --bg-color: #fffaf5;
}

/* 通用类 */
.text-primary {
  color: var(--primary-color);
}

.text-teal {
  color: var(--teal-color);
}

.bg-primary {
  background-color: var(--primary-color);
}

.bg-teal {
  background-color: var(--teal-color);
}

/* 按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, #ff8c42 100%);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}

.btn-teal {
  background: linear-gradient(135deg, var(--teal-color) 0%, #3dd9cb 100%);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
}

/* 标签样式 */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.tag-primary {
  background: var(--primary-light);
  color: var(--primary-color);
}

.tag-teal {
  background: var(--teal-light);
  color: var(--teal-color);
}

.tag-success {
  background: var(--success-light);
  color: var(--success-color);
}
</style>