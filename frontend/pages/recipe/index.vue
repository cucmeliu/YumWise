<template>
  <view class="container">
    <!-- 菜谱封面 -->
    <view class="recipe-hero">
      <text class="recipe-emoji">🥦</text>
      <view class="recipe-title-overlay">
        <text class="recipe-title">{{ recipe.name }}</text>
      </view>
    </view>

    <!-- 营养信息 -->
    <view class="recipe-meta-row">
      <view class="meta-item">
        <text class="meta-value">{{ recipe.caloriesPerServing || 280 }}</text>
        <text class="meta-label">热量(kcal)</text>
      </view>
      <view class="meta-item">
        <text class="meta-value">{{ recipe.cookingTime || 15 }}</text>
        <text class="meta-label">分钟</text>
      </view>
      <view class="meta-item">
        <text class="meta-value">{{ recipe.servings || 2 }}</text>
        <text class="meta-label">人份</text>
      </view>
    </view>

    <!-- 食材清单 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">食材清单</text>
        <text class="section-action" @click="showPurchaseModal">一键购买 ›</text>
      </view>
      <view class="ingredients-list">
        <view
          v-for="(ingredient, index) in ingredients"
          :key="index"
          class="ingredient-item"
        >
          <view class="ingredient-left">
            <view
              class="ingredient-check"
              :class="{ checked: ingredient.checked }"
              @click="toggleIngredient(index)"
            >
              <text v-if="ingredient.checked">✓</text>
            </view>
            <text class="ingredient-name">{{ ingredient.name }}</text>
          </view>
          <text class="ingredient-amount">{{ ingredient.amount }}</text>
        </view>
      </view>
    </view>

    <!-- 烹饪步骤 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">烹饪步骤</text>
      </view>
      <view class="steps-list">
        <view
          v-for="step in steps"
          :key="step.order"
          class="step-item"
        >
          <view class="step-num">
            <text>{{ step.order }}</text>
          </view>
          <text class="step-text">{{ step.instruction }}</text>
        </view>
      </view>
    </view>

    <!-- 健康小贴士 -->
    <view v-if="recipe.tips" class="tips-section">
      <text class="tips-title">💡 健康小贴士</text>
      <text class="tips-text">{{ recipe.tips }}</text>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions">
      <button class="btn-secondary" @click="generateNew">换一换</button>
      <button class="btn-primary" @click="showPurchaseModal">一键购买食材</button>
    </view>

    <!-- 购买弹窗 -->
    <view v-if="showPurchase" class="modal-overlay" @click="hidePurchaseModal">
      <view class="modal-sheet" @click.stop>
        <text class="modal-title">选择买菜平台</text>
        <view
          v-for="platform in platforms"
          :key="platform.id"
          class="platform-option"
          @click="goToPlatform(platform)"
        >
          <text class="platform-icon">{{ platform.icon }}</text>
          <view class="platform-info">
            <text class="platform-name">{{ platform.name }}</text>
            <text class="platform-desc">{{ platform.ingredientCount }} 种食材</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '../../utils/request';

const recipe = ref({});
const ingredients = ref([]);
const steps = ref([]);
const showPurchase = ref(false);
const platforms = ref([]);

onMounted(async () => {
  await loadRecipe();
  await loadPlatforms();
});

async function loadRecipe() {
  try {
    const res = await request.get('/recipes/popular');
    if (res.data && res.data.length > 0) {
      recipe.value = res.data[0];
      ingredients.value = [
        { name: '西兰花', amount: '200g', checked: false, category: '蔬菜' },
        { name: '虾仁', amount: '150g', checked: false, category: '肉类' },
        { name: '蒜末', amount: '适量', checked: false, category: '调味品', isStaple: true },
        { name: '盐', amount: '少许', checked: false, category: '调味品', isStaple: true },
      ];
      steps.value = [
        { order: 1, instruction: '西兰花切小朵，焯水2分钟，捞出沥干' },
        { order: 2, instruction: '虾仁去虾线，用料酒、盐腌制5分钟' },
        { order: 3, instruction: '热锅冷油，爆香蒜末，下虾仁炒至变色' },
        { order: 4, instruction: '加入西兰花翻炒，调味即可出锅' },
      ];
    }
  } catch (error) {
    console.error('加载菜谱失败', error);
    loadMockRecipe();
  }
}

function loadMockRecipe() {
  recipe.value = {
    name: '蒜蓉西兰花炒虾仁',
    caloriesPerServing: 280,
    cookingTime: 15,
    servings: 2,
    tips: '这道菜富含优质蛋白和维生素C，低脂低卡，非常适合减脂期食用。',
  };
  ingredients.value = [
    { name: '西兰花', amount: '200g', checked: false, category: '蔬菜' },
    { name: '虾仁', amount: '150g', checked: false, category: '肉类' },
    { name: '蒜末', amount: '适量', checked: false, category: '调味品', isStaple: true },
    { name: '盐', amount: '少许', checked: false, category: '调味品', isStaple: true },
  ];
  steps.value = [
    { order: 1, instruction: '西兰花切小朵，焯水2分钟，捞出沥干' },
    { order: 2, instruction: '虾仁去虾线，用料酒、盐腌制5分钟' },
    { order: 3, instruction: '热锅冷油，爆香蒜末，下虾仁炒至变色' },
    { order: 4, instruction: '加入西兰花翻炒，调味即可出锅' },
  ];
}

async function loadPlatforms() {
  try {
    const res = await request.get('/grocery/platforms');
    platforms.value = res.data || [];
  } catch (error) {
    platforms.value = [
      { id: 'pdd', name: '多多买菜', icon: '🛒', ingredientCount: 4 },
      { id: 'dingdong', name: '叮咚买菜', icon: '🥬', ingredientCount: 4 },
      { id: 'meituan', name: '美团买菜', icon: '🛍️', ingredientCount: 4 },
    ];
  }
}

function toggleIngredient(index) {
  ingredients.value[index].checked = !ingredients.value[index].checked;
}

function showPurchaseModal() {
  showPurchase.value = true;
}

function hidePurchaseModal() {
  showPurchase.value = false;
}

async function goToPlatform(platform) {
  const selectedIngredients = ingredients.value.filter((i) => !i.isStaple);
  const keywords = selectedIngredients.map((i) => i.name);

  try {
    const res = await request.post('/grocery/batch-purchase-urls', {
      ingredients: selectedIngredients,
    });

    const platformData = res.data?.find((p) => p.platform === platform.name);
    if (platformData?.miniprogramUrl) {
      uni.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(platformData.miniprogramUrl)}`,
        fail: () => {
          uni.setClipboardData({
            data: keywords.join(' '),
            success: () => {
              uni.showToast({
                title: '食材清单已复制',
                icon: 'success',
              });
            },
          });
        },
      });
    } else {
      uni.setClipboardData({
        data: keywords.join(' '),
        success: () => {
          uni.showToast({
            title: '食材清单已复制',
            icon: 'success',
          });
        },
      });
    }
  } catch (error) {
    uni.setClipboardData({
      data: keywords.join(' '),
      success: () => {
        uni.showToast({
          title: '食材清单已复制',
          icon: 'success',
        });
      },
    });
  }

  hidePurchaseModal();
}

async function generateNew() {
  uni.showLoading({ title: '生成中' });
  await loadRecipe();
  uni.hideLoading();
}
</script>

<style scoped>
.container {
  padding-bottom: 100px;
}

.recipe-hero {
  height: 240px;
  background: linear-gradient(135deg, #2ec4b6 0%, #3dd9cb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.recipe-emoji {
  font-size: 80px;
}

.recipe-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
  color: white;
}

.recipe-title {
  display: block;
  font-size: 20px;
  font-weight: 700;
}

.recipe-meta-row {
  display: flex;
  padding: 14px 16px;
  background: white;
  border-bottom: 1px solid #f3f4f6;
}

.meta-item {
  flex: 1;
  text-align: center;
}

.meta-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #ff6b35;
}

.meta-label {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
}

.section {
  padding: 16px;
  background: white;
  margin-top: 12px;
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

.section-action {
  font-size: 13px;
  color: #ff6b35;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
}

.ingredient-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ingredient-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.ingredient-check.checked {
  background: #2ec4b6;
  border-color: #2ec4b6;
  color: white;
}

.ingredient-name {
  font-size: 14px;
  color: #374151;
}

.ingredient-amount {
  font-size: 13px;
  color: #6b7280;
}

.steps-list {
  display: flex;
  flex-direction: column;
}

.step-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff0e8;
  color: #ff6b35;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  padding-top: 4px;
}

.tips-section {
  padding: 16px;
  background: #e8faf8;
  margin-top: 12px;
}

.tips-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2ec4b6;
  margin-bottom: 8px;
}

.tips-text {
  display: block;
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
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
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
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
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 24px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 999;
}

.modal-sheet {
  background: white;
  border-radius: 20px 20px 0 0;
  width: 100%;
  padding: 20px;
  padding-bottom: 40px;
}

.modal-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
}

.platform-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  margin-bottom: 10px;
}

.platform-icon {
  font-size: 32px;
}

.platform-info {
  flex: 1;
}

.platform-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
}

.platform-desc {
  display: block;
  font-size: 12px;
  color: #6b7280;
}
</style>