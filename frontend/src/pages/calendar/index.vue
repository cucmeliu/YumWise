<template>
  <view class="container">
    <!-- 月份选择 -->
    <view class="calendar-header">
      <text class="month-text">{{ currentMonth }}</text>
      <view class="month-actions">
        <text class="month-btn" @click="prevMonth">‹</text>
        <text class="month-btn" @click="nextMonth">›</text>
      </view>
    </view>

    <!-- 日历 -->
    <view class="calendar-grid">
      <view
        v-for="day in weekDays"
        :key="day"
        class="day-label"
      >
        <text>{{ day }}</text>
      </view>
      <view
        v-for="(day, index) in calendarDays"
        :key="index"
        class="calendar-day"
        :class="{
          empty: !day.date,
          today: day.isToday,
          'has-record': day.hasRecord,
        }"
        @click="selectDay(day)"
      >
        <text v-if="day.date">{{ day.date }}</text>
      </view>
    </view>

    <!-- 当日记录 -->
    <view class="records-section">
      <view class="section-header">
        <text class="section-title">{{ selectedDateText }} 的饮食记录</text>
      </view>

      <view v-if="records.length > 0" class="records-list">
        <view
          v-for="record in records"
          :key="record.id"
          class="record-item"
        >
          <view class="record-icon">
            <text>{{ record.eatType === 'dine_out' ? '🏪' : '🥗' }}</text>
          </view>
          <view class="record-info">
            <text class="record-name">{{ record.mealName || '未命名' }}</text>
            <view class="record-meta">
              <text class="record-type">{{ getMealTypeText(record.mealType) }}</text>
              <text class="record-cal">{{ record.calories }} kcal</text>
            </view>
          </view>
          <view class="record-rating" :class="record.rating">
            <text>{{ getRatingEmoji(record.rating) }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <text class="empty-icon">🍽️</text>
        <text class="empty-text">还没有饮食记录</text>
        <button class="add-btn" @click="addRecord">记录第一餐</button>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalRecords }}</text>
        <text class="stat-label">本周记录</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.avgCalories }}</text>
        <text class="stat-label">日均热量</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.satisfaction }}%</text>
        <text class="stat-label">满意度</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import request from '../../utils/request';

const currentYear = ref(new Date().getFullYear());
const currentMonthNum = ref(new Date().getMonth() + 1);
const selectedDate = ref(new Date());
const calendarData = ref({});
const records = ref([]);
const stats = ref({
  totalRecords: 0,
  avgCalories: 0,
  satisfaction: 0,
});

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const currentMonth = computed(() => {
  return `${currentYear.value}年${currentMonthNum.value}月`;
});

const selectedDateText = computed(() => {
  const d = selectedDate.value;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
});

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonthNum.value;
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const days = [];

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: null });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month - 1, i);
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({
      date: i,
      fullDate: date,
      isToday: isToday(date),
      hasRecord: calendarData.value[dateKey] > 0,
    });
  }

  return days;
});

onMounted(async () => {
  await loadCalendarData();
  await loadRecords();
  await loadStats();
});

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

async function loadCalendarData() {
  try {
    const res = await request.get('/meal-records/calendar', {
      year: currentYear.value,
      month: currentMonthNum.value,
    });
    calendarData.value = res.data || {};
  } catch (error) {
    console.error('加载日历数据失败', error);
  }
}

async function loadRecords() {
  try {
    const dateStr = selectedDate.value.toISOString().split('T')[0];
    const res = await request.get('/meal-records', {
      startDate: dateStr,
      endDate: dateStr,
    });
    records.value = res.data || [];
  } catch (error) {
    console.error('加载记录失败', error);
    records.value = [];
  }
}

async function loadStats() {
  try {
    const res = await request.get('/meal-records/statistics', { days: 7 });
    stats.value = {
      totalRecords: res.data?.totalRecords || 0,
      avgCalories: res.data?.avgCaloriesPerDay || 0,
      satisfaction: res.data?.ratingCount
        ? Math.round(
            (res.data.ratingCount.good /
              (res.data.ratingCount.good +
                res.data.ratingCount.neutral +
                res.data.ratingCount.bad)) *
              100
          )
        : 0,
    };
  } catch (error) {
    console.error('加载统计失败', error);
  }
}

function prevMonth() {
  if (currentMonthNum.value === 1) {
    currentMonthNum.value = 12;
    currentYear.value--;
  } else {
    currentMonthNum.value--;
  }
  loadCalendarData();
}

function nextMonth() {
  if (currentMonthNum.value === 12) {
    currentMonthNum.value = 1;
    currentYear.value++;
  } else {
    currentMonthNum.value++;
  }
  loadCalendarData();
}

function selectDay(day) {
  if (day.fullDate) {
    selectedDate.value = day.fullDate;
    loadRecords();
  }
}

function getMealTypeText(type) {
  const types = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐',
  };
  return types[type] || '未知';
}

function getRatingEmoji(rating) {
  const emojis = {
    good: '👍',
    neutral: '😐',
    bad: '👎',
  };
  return emojis[rating] || '';
}

function addRecord() {
  uni.showToast({
    title: '记录功能开发中',
    icon: 'none',
  });
}
</script>

<style scoped>
.container {
  padding-bottom: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
}

.month-text {
  font-size: 18px;
  font-weight: 700;
}

.month-actions {
  display: flex;
  gap: 16px;
}

.month-btn {
  font-size: 20px;
  color: #6b7280;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 0 16px 16px;
  background: white;
}

.day-label {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  padding: 8px 0;
  font-weight: 500;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  color: #374151;
  position: relative;
}

.calendar-day.today {
  background: #ff6b35;
  color: white;
  font-weight: 700;
}

.calendar-day.has-record::after {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2ec4b6;
  position: absolute;
  bottom: 4px;
}

.calendar-day.empty {
  pointer-events: none;
}

.records-section {
  margin-top: 12px;
  background: white;
  padding: 16px;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.record-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.record-info {
  flex: 1;
}

.record-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.record-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.record-cal {
  color: #ff6b35;
  font-weight: 600;
}

.record-rating {
  font-size: 20px;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  display: block;
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.add-btn {
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
}

.stats-card {
  margin-top: 12px;
  background: white;
  padding: 16px;
  display: flex;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #ff6b35;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}
</style>