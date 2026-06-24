<template>
  <view class="container">
    <!-- 进度条 -->
    <view class="progress-bar">
      <view class="progress-fill" :style="{ width: progressWidth }"></view>
    </view>

    <!-- 标题 -->
    <view class="setup-header">
      <text class="setup-title">{{ currentTitle }}</text>
      <text class="setup-subtitle">{{ currentSubtitle }}</text>
    </view>

    <!-- 步骤1: 选择健康目标 -->
    <view v-if="step === 1" class="goal-grid">
      <view
        v-for="goal in healthGoals"
        :key="goal.value"
        class="goal-card"
        :class="{ selected: selectedGoal === goal.value }"
        @click="selectGoal(goal.value)"
      >
        <text class="goal-emoji">{{ goal.emoji }}</text>
        <text class="goal-name">{{ goal.name }}</text>
        <text class="goal-desc">{{ goal.desc }}</text>
      </view>
    </view>

    <!-- 步骤2: 选择饮食禁忌 -->
    <view v-if="step === 2" class="restriction-section">
      <view class="restriction-tags">
        <view
          v-for="tag in restrictions"
          :key="tag"
          class="restriction-tag"
          :class="{ selected: selectedRestrictions.includes(tag) }"
          @click="toggleRestriction(tag)"
        >
          <text>{{ tag }}</text>
        </view>
      </view>
    </view>

    <!-- 步骤3: 输入身体数据 -->
    <view v-if="step === 3" class="body-data-section">
      <view class="input-group">
        <text class="input-label">身高 (cm)</text>
        <input
          v-model="bodyData.height"
          type="number"
          placeholder="请输入身高"
          class="input-field"
        />
      </view>
      <view class="input-group">
        <text class="input-label">体重 (kg)</text>
        <input
          v-model="bodyData.weight"
          type="number"
          placeholder="请输入体重"
          class="input-field"
        />
      </view>
      <view class="input-group">
        <text class="input-label">年龄</text>
        <input
          v-model="bodyData.age"
          type="number"
          placeholder="请输入年龄"
          class="input-field"
        />
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-actions">
      <button v-if="step > 1" class="btn-secondary" @click="prevStep">
        上一步
      </button>
      <button class="btn-primary" @click="nextStep">
        {{ step === 3 ? '完成，去看看推荐' : '下一步' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();

const step = ref(1);
const selectedGoal = ref('weight_loss');
const selectedRestrictions = ref(['不吃辣']);
const bodyData = ref({
  height: '',
  weight: '',
  age: '',
});

const healthGoals = [
  { value: 'weight_loss', name: '减肥减脂', emoji: '🔥', desc: '控制热量 · 高蛋白' },
  { value: 'pregnancy', name: '备孕调理', emoji: '🤱', desc: '叶酸 · 铁 · 优质蛋白' },
  { value: 'muscle_gain', name: '增肌塑形', emoji: '💪', desc: '高蛋白 · 低碳水' },
  { value: 'sugar_control', name: '控糖管理', emoji: '🩺', desc: '低GI · 稳血糖' },
];

const restrictions = [
  '不吃辣',
  '海鲜过敏',
  '乳糖不耐',
  '不吃香菜',
  '素食主义',
  '麸质过敏',
];

const progressWidth = computed(() => {
  return `${(step.value / 3) * 100}%`;
});

const currentTitle = computed(() => {
  const titles = [
    '你的健康目标是什么？',
    '饮食禁忌（可多选）',
    '填写身体数据',
  ];
  return titles[step.value - 1];
});

const currentSubtitle = computed(() => {
  const subtitles = [
    '选择最符合你当前状态的目标，我们会据此为你推荐最适合的饮食方案',
    '选择你的饮食禁忌，我们会避开这些食材',
    '填写身体数据，我们可以为你计算每日推荐热量',
  ];
  return subtitles[step.value - 1];
});

function selectGoal(goal) {
  selectedGoal.value = goal;
}

function toggleRestriction(tag) {
  const index = selectedRestrictions.value.indexOf(tag);
  if (index > -1) {
    selectedRestrictions.value.splice(index, 1);
  } else {
    selectedRestrictions.value.push(tag);
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value--;
  }
}

async function nextStep() {
  if (step.value < 3) {
    step.value++;
  } else {
    await saveProfile();
  }
}

async function saveProfile() {
  try {
    uni.showLoading({ title: '保存中' });

    const profileData = {
      healthGoal: selectedGoal.value,
      restrictions: selectedRestrictions.value,
      height: Number(bodyData.value.height) || null,
      weight: Number(bodyData.value.weight) || null,
      age: Number(bodyData.value.age) || null,
    };

    await userStore.saveHealthProfile(profileData);

    uni.hideLoading();
    uni.switchTab({
      url: '/pages/index/index',
    });
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: '保存失败',
      icon: 'none',
    });
  }
}
</script>

<style scoped>
.container {
  padding: 24px 20px;
  padding-bottom: 120px;
}

.progress-bar {
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  margin-bottom: 24px;
}

.progress-fill {
  height: 100%;
  background: #ff6b35;
  border-radius: 2px;
  transition: width 0.3s;
}

.setup-header {
  margin-bottom: 32px;
}

.setup-title {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.setup-subtitle {
  display: block;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.goal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.goal-card {
  background: #f9fafb;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  transition: all 0.2s;
}

.goal-card.selected {
  border-color: #ff6b35;
  background: #fff0e8;
}

.goal-emoji {
  display: block;
  font-size: 32px;
  margin-bottom: 8px;
}

.goal-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.goal-desc {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.restriction-section {
  margin-bottom: 24px;
}

.restriction-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.restriction-tag {
  padding: 10px 18px;
  border-radius: 20px;
  border: 1.5px solid #e5e7eb;
  background: white;
  font-size: 14px;
  color: #4b5563;
  transition: all 0.2s;
}

.restriction-tag.selected {
  border-color: #ff6b35;
  background: #fff0e8;
  color: #ff6b35;
  font-weight: 500;
}

.body-data-section {
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  background: white;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background: white;
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: white;
  border: none;
  border-radius: 24px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}

.btn-secondary {
  flex: 1;
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 24px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}
</style>