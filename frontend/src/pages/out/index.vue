<template>
  <view class="container">
    <!-- 定位提示 -->
    <view class="location-bar" @click="getLocation">
      <text class="location-icon">📍</text>
      <text class="location-text">{{ locationText }}</text>
      <text class="location-arrow">›</text>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view
        v-for="filter in filters"
        :key="filter.value"
        class="filter-item"
        :class="{ active: activeFilter === filter.value }"
        @click="setFilter(filter.value)"
      >
        <text>{{ filter.label }}</text>
      </view>
    </view>

    <!-- 餐厅列表 -->
    <view class="restaurant-list">
      <view
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        class="restaurant-card"
        @click="goToRestaurant(restaurant.id)"
      >
        <view class="restaurant-header">
          <view class="restaurant-img">
            <text>{{ getRestaurantEmoji(restaurant) }}</text>
          </view>
          <view class="restaurant-info">
            <text class="restaurant-name">{{ restaurant.name }}</text>
            <view class="restaurant-rating">
              <text class="stars">⭐</text>
              <text>{{ restaurant.rating }}</text>
              <text class="dot">·</text>
              <text>{{ restaurant.avgPrice ? `¥${restaurant.avgPrice}/人` : '暂无价格' }}</text>
              <text class="dot">·</text>
              <text>{{ getDistance(restaurant) }}km</text>
            </view>
            <view class="restaurant-tags">
              <text
                v-for="tag in restaurant.cuisineTypes?.slice(0, 2)"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </text>
            </view>
          </view>
        </view>

        <!-- 匹配菜品 -->
        <view v-if="restaurant.matchedDishes?.length" class="restaurant-dishes">
          <view
            v-for="dish in restaurant.matchedDishes"
            :key="dish.id"
            class="dish-item"
          >
            <text class="dish-name">{{ dish.name }}</text>
            <view class="dish-info">
              <text class="dish-cal">{{ dish.calories }} kcal</text>
              <text class="dish-match">匹配度 {{ Math.round(dish.matchScore * 100) }}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="restaurants.length === 0" class="empty-state">
      <text class="empty-icon">🍽️</text>
      <text class="empty-text">附近暂无匹配餐厅</text>
      <text class="empty-hint">试试扩大搜索范围？</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRecommendationStore } from '../../store/recommendation';

const recommendationStore = useRecommendationStore();

const restaurants = ref([]);
const locationText = ref('定位中...');
const userLocation = ref(null);
const activeFilter = ref('match');

const filters = [
  { label: '匹配度', value: 'match' },
  { label: '距离', value: 'distance' },
  { label: '评分', value: 'rating' },
  { label: '价格', value: 'price' },
];

onMounted(async () => {
  await getLocation();
});

async function getLocation() {
  try {
    const res = await new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        success: resolve,
        fail: reject,
      });
    });

    userLocation.value = {
      lat: res.latitude,
      lng: res.longitude,
    };
    locationText.value = '当前位置';

    await loadRestaurants();
  } catch (error) {
    locationText.value = '点击定位';
    loadMockData();
  }
}

async function loadRestaurants() {
  try {
    const data = await recommendationStore.getNearbyRestaurants(
      userLocation.value.lat,
      userLocation.value.lng,
    );
    restaurants.value = data || [];
  } catch (error) {
    console.error('加载餐厅失败', error);
    loadMockData();
  }
}

function loadMockData() {
  restaurants.value = [
    {
      id: '1',
      name: '轻食沙拉·健康餐',
      rating: 4.8,
      avgPrice: 35,
      cuisineTypes: ['轻食', '沙拉'],
      latitude: 31.23,
      longitude: 121.47,
      matchedDishes: [
        { id: '1', name: '鸡胸肉沙拉', calories: 320, matchScore: 0.95 },
        { id: '2', name: '牛肉能量碗', calories: 380, matchScore: 0.88 },
      ],
    },
    {
      id: '2',
      name: '粤式茶餐厅',
      rating: 4.5,
      avgPrice: 45,
      cuisineTypes: ['粤菜', '茶餐厅'],
      latitude: 31.24,
      longitude: 121.48,
      matchedDishes: [
        { id: '3', name: '白切鸡', calories: 280, matchScore: 0.82 },
      ],
    },
  ];
}

function setFilter(value) {
  activeFilter.value = value;
}

function getRestaurantEmoji(restaurant) {
  const types = restaurant.cuisineTypes || [];
  if (types.includes('轻食')) return '🥗';
  if (types.includes('粤菜')) return '🥢';
  if (types.includes('川菜')) return '🌶️';
  return '🍽️';
}

function getDistance(restaurant) {
  if (!userLocation.value) return '0.5';
  const lat1 = userLocation.value.lat;
  const lng1 = userLocation.value.lng;
  const lat2 = restaurant.latitude;
  const lng2 = restaurant.longitude;
  const distance = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111;
  return distance.toFixed(1);
}

function goToRestaurant(id) {
  uni.showToast({
    title: '餐厅详情开发中',
    icon: 'none',
  });
}
</script>

<style scoped>
.container {
  padding-bottom: 20px;
}

.location-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f3f4f6;
}

.location-icon {
  font-size: 16px;
  margin-right: 8px;
}

.location-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.location-arrow {
  font-size: 16px;
  color: #9ca3af;
}

.filter-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f3f4f6;
}

.filter-item {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  color: #6b7280;
  background: #f3f4f6;
}

.filter-item.active {
  color: white;
  background: #ff6b35;
}

.restaurant-list {
  padding: 16px;
}

.restaurant-card {
  background: white;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
}

.restaurant-header {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.restaurant-img {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.restaurant-info {
  flex: 1;
}

.restaurant-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.restaurant-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stars {
  color: #fdcb6e;
}

.dot {
  color: #d1d5db;
}

.restaurant-tags {
  display: flex;
  gap: 6px;
}

.tag {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  background: #f3f4f6;
  color: #6b7280;
}

.restaurant-dishes {
  border-top: 1px solid #f3f4f6;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dish-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #f9fafb;
  border-radius: 8px;
}

.dish-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.dish-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.dish-cal {
  color: #ff6b35;
  font-weight: 600;
}

.dish-match {
  background: #e8f8f0;
  color: #00b894;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  display: block;
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  display: block;
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
}

.empty-hint {
  display: block;
  font-size: 14px;
  color: #9ca3af;
}
</style>