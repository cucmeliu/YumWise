<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <view class="user-avatar">
          <text>{{ userInfo?.nickname?.charAt(0) || '美' }}</text>
        </view>
        <view class="user-text">
          <text class="user-name">{{ userInfo?.nickname || '美食家' }}</text>
          <text class="user-desc">已坚持健康饮食 {{ daysCount }} 天</text>
        </view>
      </view>
      <button class="edit-btn" @click="editProfile">编辑</button>
    </view>

    <!-- 健康画像 -->
    <view class="health-card">
      <view class="card-header">
        <text class="card-title">健康画像</text>
        <text class="card-action" @click="editHealthProfile">修改 ›</text>
      </view>
      <view class="health-content">
        <view class="health-item">
          <text class="health-label">健康目标</text>
          <text class="health-value">{{ healthGoalText }}</text>
        </view>
        <view class="health-item">
          <text class="health-label">BMI</text>
          <text class="health-value">{{ healthProfile?.bmi || '--' }}</text>
        </view>
        <view class="health-item">
          <text class="health-label">每日推荐热量</text>
          <text class="health-value">{{ healthProfile?.dailyCalories || '--' }} kcal</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goTo('/pages/calendar/index')">
        <text class="menu-icon">📅</text>
        <text class="menu-text">饮食记录</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goTo('/pages/recipe/index')">
        <text class="menu-icon">❤️</text>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showPlatforms">
        <text class="menu-icon">🛒</text>
        <text class="menu-text">买菜平台</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="showSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 关于 -->
    <view class="about-section">
      <text class="about-text">真享吃 v1.0.0</text>
      <text class="about-text">你的每一口，都为你量身定制</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();

const userInfo = ref(null);
const healthProfile = ref(null);
const daysCount = ref(7);

const healthGoalText = computed(() => {
  const goals = {
    weight_loss: '减肥减脂',
    pregnancy: '备孕调理',
    muscle_gain: '增肌塑形',
    sugar_control: '控糖管理',
    allergy: '过敏管理',
    custom: '自定义',
  };
  return goals[healthProfile.value?.healthGoal] || '未设置';
});

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    const [user, profile] = await Promise.all([
      userStore.getUserInfo(),
      userStore.getHealthProfile(),
    ]);
    userInfo.value = user;
    healthProfile.value = profile;
  } catch (error) {
    console.error('加载数据失败', error);
    userInfo.value = { nickname: '美食家' };
    healthProfile.value = {
      healthGoal: 'weight_loss',
      bmi: 22.5,
      dailyCalories: 1800,
    };
  }
}

function editProfile() {
  uni.showToast({
    title: '编辑功能开发中',
    icon: 'none',
  });
}

function editHealthProfile() {
  uni.navigateTo({
    url: '/pages/setup/index',
  });
}

function goTo(url) {
  if (url.includes('calendar')) {
    uni.switchTab({ url });
  } else {
    uni.navigateTo({ url });
  }
}

function showPlatforms() {
  uni.showActionSheet({
    itemList: ['多多买菜', '叮咚买菜', '美团买菜'],
    success: (res) => {
      uni.showToast({
        title: `已选择${['多多买菜', '叮咚买菜', '美团买菜'][res.tapIndex]}`,
        icon: 'none',
      });
    },
  });
}

function showSettings() {
  uni.showActionSheet({
    itemList: ['通知设置', '隐私政策', '用户协议', '关于我们'],
    success: (res) => {
      const items = ['通知设置', '隐私政策', '用户协议', '关于我们'];
      uni.showToast({
        title: items[res.tapIndex],
        icon: 'none',
      });
    },
  });
}
</script>

<style scoped>
.container {
  padding: 16px;
  padding-bottom: 20px;
}

.user-card {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  font-weight: 700;
}

.user-text {
  color: white;
}

.user-name {
  display: block;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.user-desc {
  display: block;
  font-size: 12px;
  opacity: 0.9;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 13px;
}

.health-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.card-action {
  font-size: 13px;
  color: #ff6b35;
}

.health-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.health-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.health-item:last-child {
  border-bottom: none;
}

.health-label {
  font-size: 14px;
  color: #6b7280;
}

.health-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.menu-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: #374151;
}

.menu-arrow {
  font-size: 16px;
  color: #d1d5db;
}

.about-section {
  text-align: center;
  padding: 20px;
}

.about-text {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}
</style>