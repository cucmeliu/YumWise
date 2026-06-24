<template>
  <view class="container">
    <!-- 问候语 -->
    <view class="greeting">
      <text class="hello">{{ greetingText }}</text>
      <text class="name">{{ userName }}，今天吃点什么？</text>
    </view>

    <!-- 双入口卡片 -->
    <view class="dual-entry">
      <view class="entry-card out" @click="goToOut">
        <view class="entry-content">
          <text class="entry-icon">🏪</text>
          <text class="entry-title">外面吃</text>
          <text class="entry-desc">附近 3km · {{ nearbyCount }} 家匹配</text>
        </view>
        <text class="entry-arrow">→</text>
      </view>

      <view class="entry-card cook" @click="goToRecipe">
        <view class="entry-content">
          <text class="entry-icon">🥗</text>
          <text class="entry-title">自己做</text>
          <text class="entry-desc">AI 推荐 · 15 分钟搞定</text>
        </view>
        <text class="entry-arrow">→</text>
      </view>
    </view>

    <!-- 今日推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日为你推荐</text>
        <text class="section-more" @click="refreshRecommendations">换一换 ›</text>
      </view>

      <view
        v-for="item in recommendations"
        :key="item.id"
        class="rec-card"
        @click="goToDetail(item)"
      >
        <view class="rec-card-img" :style="{ background: getCardBg(item.type) }">
          <text class="rec-emoji">{{ getEmoji(item) }}</text>
          <view class="match-badge">
            <text>{{ item.matchScore ? `匹配度 ${Math.round(item.matchScore * 100)}%` : 'AI 推荐' }}</text>
          </view>
        </view>
        <view class="rec-card-body">
          <text class="rec-card-title">{{ item.name }}</text>
          <view class="rec-card-meta">
            <text class="calories">{{ item.calories || item.caloriesPerServing }} kcal</text>
            <text class="dot">·</text>
            <text>{{ item.type === 'dish' ? `蛋白质 ${item.protein}g` : `${item.cookingTime} 分钟` }}</text>
            <text class="tag" :class="item.type === 'dish' ? 'tag-primary' : 'tag-teal'">
              {{ item.tags ? item.tags[0] : '健康' }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 场景快捷入口 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">场景快捷入口</text>
      </view>
      <scroll-view class="shortcuts" scroll-x>
        <view class="shortcut-item tag-primary" @click="goToScene('weight_loss')">
          🔥 减脂午餐
        </view>
        <view class="shortcut-item tag-teal" @click="goToScene('pregnancy')">
          🤱 备孕晚餐
        </view>
        <view class="shortcut-item" @click="goToScene('muscle_gain')">
          💪 增肌加餐
        </view>
        <view class="shortcut-item" @click="goToScene('sugar_control')">
          🩺 控糖早餐
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../store/user';
import { useRecommendationStore } from '../../store/recommendation';

const userStore = useUserStore();
const recommendationStore = useRecommendationStore();

const recommendations = ref([]);
const nearbyCount = ref(0);

const greetingText = computed(() => {
  const hour = new Date().getHours();
  if (hour < 9) return '早餐时间到啦 🍳';
  if (hour < 14) return '午饭时间到啦 🍱';
  if (hour < 18) return '下午茶时间 ☕';
  return '晚饭时间到啦 🍜';
});

const userName = computed(() => {
  return userStore.userInfo?.nickname || '美食家';
});

onMounted(async () => {
  await loadData();
});

async function loadData() {
  try {
    const [recs] = await Promise.all([
      recommendationStore.getHomeRecommendations(),
    ]);
    recommendations.value = recs || [];
    nearbyCount.value = 12;
  } catch (error) {
    console.error('加载数据失败', error);
  }
}

async function refreshRecommendations() {
  uni.showLoading({ title: '加载中' });
  await loadData();
  uni.hideLoading();
}

function getCardBg(type) {
  return type === 'dish'
    ? 'linear-gradient(135deg, #FFE0CC, #FFD4B8)'
    : 'linear-gradient(135deg, #D4F5E9, #C8F0E0)';
}

function getEmoji(item) {
  if (item.type === 'dish') {
    return '🍜';
  }
  return '🥦';
}

function goToOut() {
  uni.navigateTo({
    url: '/pages/out/index',
  });
}

function goToRecipe() {
  uni.navigateTo({
    url: '/pages/recipe/index',
  });
}

function goToDetail(item) {
  if (item.type === 'dish') {
    uni.navigateTo({
      url: `/pages/out/index?id=${item.id}`,
    });
  } else {
    uni.navigateTo({
      url: `/pages/recipe/index?id=${item.id}`,
    });
  }
}

function goToScene(scene) {
  uni.navigateTo({
    url: `/pages/recipe/index?scene=${scene}`,
  });
}
</script>

<style scoped>
.container {
  padding-bottom: 20px;
}

.greeting {
  padding: 16px;
}

.hello {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.name {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.dual-entry {
  display: flex;
  gap: 12px;
  padding: 0 16px 16px;
}

.entry-card {
  flex: 1;
  border-radius: 20px;
  padding: 20px 16px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.entry-card.out {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: white;
}

.entry-card.cook {
  background: linear-gradient(135deg, #2ec4b6 0%, #3dd9cb 100%);
  color: white;
}

.entry-icon {
  font-size: 36px;
}

.entry-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  margin-top: 12px;
}

.entry-desc {
  display: block;
  font-size: 12px;
  opacity: 0.85;
  margin-top: 4px;
}

.entry-arrow {
  font-size: 28px;
  opacity: 0.5;
  align-self: flex-end;
}

.section {
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.section-more {
  font-size: 13px;
  color: #9ca3af;
}

.rec-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  margin-bottom: 12px;
}

.rec-card-img {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.rec-emoji {
  font-size: 48px;
}

.match-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
}

.rec-card-body {
  padding: 12px 14px;
}

.rec-card-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

.rec-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.calories {
  color: #ff6b35;
  font-weight: 600;
}

.dot {
  color: #d1d5db;
}

.tag {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
}

.tag-primary {
  background: #fff0e8;
  color: #ff6b35;
}

.tag-teal {
  background: #e8faf8;
  color: #2ec4b6;
}

.shortcuts {
  display: flex;
  gap: 10px;
  white-space: nowrap;
}

.shortcut-item {
  flex-shrink: 0;
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 13px;
  background: #f3f4f6;
  color: #6b7280;
}

.shortcut-item.tag-primary {
  background: #fff0e8;
  color: #ff6b35;
}

.shortcut-item.tag-teal {
  background: #e8faf8;
  color: #2ec4b6;
}
</style>