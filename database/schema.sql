-- ============================================
-- 真享吃数据库设计
-- 数据库: MySQL 8.0+
-- 字符集: utf8mb4
-- ============================================

CREATE DATABASE IF NOT EXISTS yumwise 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE yumwise;

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY COMMENT '用户ID (UUID)',
    wx_openid VARCHAR(100) UNIQUE COMMENT '微信OpenID',
    phone VARCHAR(20) COMMENT '手机号',
    nickname VARCHAR(100) COMMENT '昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别: 0-未知 1-男 2-女',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_wx_openid (wx_openid),
    INDEX idx_phone (phone)
) ENGINE=InnoDB COMMENT='用户表';

-- ============================================
-- 2. 健康画像表
-- ============================================
CREATE TABLE health_profiles (
    id VARCHAR(36) PRIMARY KEY COMMENT '画像ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    health_goal ENUM('weight_loss', 'pregnancy', 'muscle_gain', 'sugar_control', 'allergy', 'custom') NOT NULL COMMENT '健康目标',
    height DECIMAL(5,2) COMMENT '身高(cm)',
    weight DECIMAL(5,2) COMMENT '体重(kg)',
    bmi DECIMAL(4,2) COMMENT 'BMI指数',
    age INT COMMENT '年龄',
    daily_calories INT COMMENT '每日推荐热量(kcal)',
    target_weight DECIMAL(5,2) COMMENT '目标体重(kg)',
    restrictions JSON COMMENT '饮食禁忌(数组): ["不吃辣","海鲜过敏"]',
    preferences JSON COMMENT '饮食偏好(数组): ["清淡","粤菜"]',
    allergy_ingredients JSON COMMENT '过敏食材列表',
    medical_conditions JSON COMMENT '医疗状况(如糖尿病、高血压等)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_health_goal (health_goal)
) ENGINE=InnoDB COMMENT='健康画像表';

-- ============================================
-- 3. 餐厅表
-- ============================================
CREATE TABLE restaurants (
    id VARCHAR(36) PRIMARY KEY COMMENT '餐厅ID',
    name VARCHAR(200) NOT NULL COMMENT '餐厅名称',
    brand_name VARCHAR(200) COMMENT '品牌名称',
    logo_url VARCHAR(500) COMMENT 'Logo URL',
    cover_url VARCHAR(500) COMMENT '封面图URL',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区/县',
    address VARCHAR(500) COMMENT '详细地址',
    latitude DECIMAL(10,7) COMMENT '纬度',
    longitude DECIMAL(10,7) COMMENT '经度',
    phone VARCHAR(50) COMMENT '联系电话',
    rating DECIMAL(2,1) DEFAULT 0 COMMENT '评分(0-5)',
    review_count INT DEFAULT 0 COMMENT '评价数',
    avg_price INT COMMENT '人均价格(分)',
    cuisine_types JSON COMMENT '菜系标签: ["川菜","粤菜"]',
    features JSON COMMENT '特色标签: ["低卡","有机"]',
    business_hours VARCHAR(200) COMMENT '营业时间',
    meituan_id VARCHAR(100) COMMENT '美团店铺ID',
    eleme_id VARCHAR(100) COMMENT '饿了么店铺ID',
    gaode_poi_id VARCHAR(100) COMMENT '高德POI ID',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-关闭 1-营业中 2-休息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_location (latitude, longitude),
    INDEX idx_city (city),
    INDEX idx_rating (rating),
    INDEX idx_meituan_id (meituan_id)
) ENGINE=InnoDB COMMENT='餐厅表';

-- ============================================
-- 4. 菜品表
-- ============================================
CREATE TABLE dishes (
    id VARCHAR(36) PRIMARY KEY COMMENT '菜品ID',
    restaurant_id VARCHAR(36) NOT NULL COMMENT '餐厅ID',
    name VARCHAR(200) NOT NULL COMMENT '菜品名称',
    image_url VARCHAR(500) COMMENT '菜品图片URL',
    price INT COMMENT '价格(分)',
    original_price INT COMMENT '原价(分)',
    description TEXT COMMENT '描述',
    calories INT COMMENT '热量(kcal)',
    protein DECIMAL(6,2) COMMENT '蛋白质(g)',
    carbs DECIMAL(6,2) COMMENT '碳水化合物(g)',
    fat DECIMAL(6,2) COMMENT '脂肪(g)',
    fiber DECIMAL(6,2) COMMENT '膳食纤维(g)',
    sodium DECIMAL(6,2) COMMENT '钠(mg)',
    serving_size VARCHAR(50) COMMENT '份量描述',
    tags JSON COMMENT '标签: ["低卡","高蛋白","无麸质"]',
    ingredients JSON COMMENT '主要食材列表',
    is_spicy TINYINT DEFAULT 0 COMMENT '是否辣: 0-否 1-是',
    is_vegetarian TINYINT DEFAULT 0 COMMENT '是否素食: 0-否 1-是',
    match_score DECIMAL(3,2) DEFAULT 0 COMMENT '综合匹配分数(0-1)',
    sales_count INT DEFAULT 0 COMMENT '销量',
    review_count INT DEFAULT 0 COMMENT '评价数',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架 1-上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    INDEX idx_restaurant_id (restaurant_id),
    INDEX idx_calories (calories),
    INDEX idx_match_score (match_score)
) ENGINE=InnoDB COMMENT='菜品表';

-- ============================================
-- 5. 菜谱表
-- ============================================
CREATE TABLE recipes (
    id VARCHAR(36) PRIMARY KEY COMMENT '菜谱ID',
    name VARCHAR(200) NOT NULL COMMENT '菜谱名称',
    type ENUM('ai_generated', 'curated', 'user_created') DEFAULT 'curated' COMMENT '类型: AI生成/精选/用户创建',
    cover_url VARCHAR(500) COMMENT '封面图URL',
    description TEXT COMMENT '描述',
    health_goals JSON COMMENT '适用健康目标: ["weight_loss","pregnancy"]',
    cuisine_type VARCHAR(50) COMMENT '菜系',
    difficulty TINYINT DEFAULT 1 COMMENT '难度: 1-简单 2-中等 3-困难',
    servings INT DEFAULT 2 COMMENT '份量(人份)',
    cooking_time INT COMMENT '烹饪时长(分钟)',
    calories_per_serving INT COMMENT '每份热量(kcal)',
    protein DECIMAL(6,2) COMMENT '蛋白质(g)',
    carbs DECIMAL(6,2) COMMENT '碳水化合物(g)',
    fat DECIMAL(6,2) COMMENT '脂肪(g)',
    tags JSON COMMENT '标签: ["快手菜","低脂"]',
    tips TEXT COMMENT '健康小贴士',
    nutritionist_reviewed TINYINT DEFAULT 0 COMMENT '营养师审核: 0-未审核 1-已审核',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    favorite_count INT DEFAULT 0 COMMENT '收藏数',
    creator_id VARCHAR(36) COMMENT '创建者ID(用户创建时)',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-下架 1-上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_type (type),
    INDEX idx_cooking_time (cooking_time),
    INDEX idx_health_goals (health_goals(100)),
    INDEX idx_favorite_count (favorite_count)
) ENGINE=InnoDB COMMENT='菜谱表';

-- ============================================
-- 6. 菜谱食材表
-- ============================================
CREATE TABLE recipe_ingredients (
    id VARCHAR(36) PRIMARY KEY COMMENT '食材ID',
    recipe_id VARCHAR(36) NOT NULL COMMENT '菜谱ID',
    name VARCHAR(100) NOT NULL COMMENT '食材名称',
    amount VARCHAR(50) COMMENT '用量: "200g", "1个"',
    amount_grams INT COMMENT '用量(克,标准化)',
    category VARCHAR(50) COMMENT '分类: 蔬菜/肉类/调味品/主食',
    is_optional TINYINT DEFAULT 0 COMMENT '是否可选',
    is_staple TINYINT DEFAULT 0 COMMENT '是否常备食材(盐、油等)',
    purchasable TINYINT DEFAULT 1 COMMENT '是否可购买',
    purchase_url VARCHAR(500) COMMENT '购买链接',
    estimated_price INT COMMENT '预估价格(分)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    INDEX idx_category (category)
) ENGINE=InnoDB COMMENT='菜谱食材表';

-- ============================================
-- 7. 菜谱步骤表
-- ============================================
CREATE TABLE recipe_steps (
    id VARCHAR(36) PRIMARY KEY COMMENT '步骤ID',
    recipe_id VARCHAR(36) NOT NULL COMMENT '菜谱ID',
    step_order INT NOT NULL COMMENT '步骤序号',
    instruction TEXT NOT NULL COMMENT '步骤说明',
    image_url VARCHAR(500) COMMENT '步骤图片URL',
    video_url VARCHAR(500) COMMENT '步骤视频URL',
    duration INT COMMENT '该步骤时长(秒)',
    tips VARCHAR(500) COMMENT '步骤小贴士',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_id (recipe_id),
    UNIQUE KEY uk_recipe_order (recipe_id, step_order)
) ENGINE=InnoDB COMMENT='菜谱步骤表';

-- ============================================
-- 8. 饮食记录表
-- ============================================
CREATE TABLE meal_records (
    id VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL COMMENT '餐次类型',
    eat_type ENUM('dine_out', 'cook_home') NOT NULL COMMENT '就餐类型: 外面吃/自己做',
    dish_id VARCHAR(36) COMMENT '菜品ID(外面吃时)',
    recipe_id VARCHAR(36) COMMENT '菜谱ID(自己做时)',
    restaurant_id VARCHAR(36) COMMENT '餐厅ID(外面吃时)',
    meal_name VARCHAR(200) COMMENT '餐食名称',
    meal_image VARCHAR(500) COMMENT '餐食图片',
    calories INT COMMENT '实际热量(kcal)',
    rating ENUM('good', 'neutral', 'bad') COMMENT '评价: 满意/一般/不满意',
    tags JSON COMMENT '评价标签: ["太咸","量太少"]',
    notes TEXT COMMENT '备注',
    eaten_at TIMESTAMP COMMENT '就餐时间',
    latitude DECIMAL(10,7) COMMENT '就餐地点纬度',
    longitude DECIMAL(10,7) COMMENT '就餐地点经度',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE SET NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_eaten_at (eaten_at),
    INDEX idx_meal_type (meal_type)
) ENGINE=InnoDB COMMENT='饮食记录表';

-- ============================================
-- 9. 用户收藏表
-- ============================================
CREATE TABLE user_favorites (
    id VARCHAR(36) PRIMARY KEY COMMENT '收藏ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    target_type ENUM('recipe', 'restaurant', 'dish') NOT NULL COMMENT '收藏类型',
    target_id VARCHAR(36) NOT NULL COMMENT '目标ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id),
    UNIQUE KEY uk_user_target (user_id, target_type, target_id)
) ENGINE=InnoDB COMMENT='用户收藏表';

-- ============================================
-- 10. 食材分类表(用于购买跳转)
-- ============================================
CREATE TABLE ingredient_categories (
    id VARCHAR(36) PRIMARY KEY COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    parent_id VARCHAR(36) COMMENT '父分类ID',
    icon VARCHAR(50) COMMENT '图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB COMMENT='食材分类表';

-- ============================================
-- 11. 买菜平台配置表
-- ============================================
CREATE TABLE grocery_platforms (
    id VARCHAR(36) PRIMARY KEY COMMENT '平台ID',
    name VARCHAR(50) NOT NULL COMMENT '平台名称',
    code VARCHAR(20) UNIQUE NOT NULL COMMENT '平台代码: pdd/dingdong/meituan',
    icon VARCHAR(500) COMMENT '平台图标',
    scheme_url VARCHAR(500) COMMENT 'URL Scheme模板',
    miniprogram_url VARCHAR(500) COMMENT '小程序跳转URL模板',
    is_active TINYINT DEFAULT 1 COMMENT '是否启用',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB COMMENT='买菜平台配置表';

-- ============================================
-- 12. 推荐历史表(用于优化推荐算法)
-- ============================================
CREATE TABLE recommendation_history (
    id VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    recommendation_type ENUM('home', 'restaurant', 'recipe') NOT NULL COMMENT '推荐类型',
    target_type ENUM('dish', 'recipe', 'restaurant') COMMENT '目标类型',
    target_id VARCHAR(36) COMMENT '目标ID',
    match_score DECIMAL(3,2) COMMENT '匹配分数',
    position INT COMMENT '展示位置',
    is_clicked TINYINT DEFAULT 0 COMMENT '是否点击',
    is_favorited TINYINT DEFAULT 0 COMMENT '是否收藏',
    is_purchased TINYINT DEFAULT 0 COMMENT '是否购买',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '推荐时间',
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='推荐历史表';

-- ============================================
-- 13. 用户反馈表
-- ============================================
CREATE TABLE user_feedbacks (
    id VARCHAR(36) PRIMARY KEY COMMENT '反馈ID',
    user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
    feedback_type ENUM('recipe_quality', 'recommendation', 'bug', 'suggestion') NOT NULL COMMENT '反馈类型',
    target_id VARCHAR(36) COMMENT '目标ID(菜谱/菜品等)',
    content TEXT NOT NULL COMMENT '反馈内容',
    images JSON COMMENT '图片列表',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-待处理 1-已处理',
    reply TEXT COMMENT '回复内容',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_feedback_type (feedback_type)
) ENGINE=InnoDB COMMENT='用户反馈表';

-- ============================================
-- 插入初始数据
-- ============================================

-- 插入买菜平台配置
INSERT INTO grocery_platforms (id, name, code, icon, scheme_url, miniprogram_url, sort_order) VALUES
('gp-001', '多多买菜', 'pdd', '🛒', 'pinduoduo://', 'https://wxapp.pinduoduo.com/duo_duo_mai_cai/search?keyword={keyword}', 1),
('gp-002', '叮咚买菜', 'dingdong', '🥬', 'dingdong://search?keyword={keyword}', NULL, 2),
('gp-003', '美团买菜', 'meituan', '🛍️', 'imeituan://', 'https://wxapp.meituan.com/maicai/search?keyword={keyword}', 3);

-- 插入食材分类
INSERT INTO ingredient_categories (id, name, icon, sort_order) VALUES
('ic-001', '蔬菜', '🥬', 1),
('ic-002', '肉类', '🥩', 2),
('ic-003', '禽蛋', '🥚', 3),
('ic-004', '水产', '🐟', 4),
('ic-005', '豆制品', '🧈', 5),
('ic-006', '调味品', '🧂', 6),
('ic-007', '粮油', '🍚', 7),
('ic-008', '水果', '🍎', 8);

-- ============================================
-- 创建视图: 用户健康画像完整信息
-- ============================================
CREATE VIEW v_user_health_profile AS
SELECT 
    u.id AS user_id,
    u.nickname,
    u.avatar_url,
    hp.health_goal,
    hp.height,
    hp.weight,
    hp.bmi,
    hp.age,
    hp.daily_calories,
    hp.target_weight,
    hp.restrictions,
    hp.preferences,
    hp.allergy_ingredients,
    hp.medical_conditions
FROM users u
LEFT JOIN health_profiles hp ON u.id = hp.user_id;

-- ============================================
-- 创建视图: 菜品完整信息(含餐厅)
-- ============================================
CREATE VIEW v_dish_with_restaurant AS
SELECT 
    d.*,
    r.name AS restaurant_name,
    r.brand_name,
    r.latitude AS restaurant_lat,
    r.longitude AS restaurant_lng,
    r.address AS restaurant_address,
    r.rating AS restaurant_rating,
    r.avg_price AS restaurant_avg_price,
    r.cuisine_types AS restaurant_cuisine_types
FROM dishes d
INNER JOIN restaurants r ON d.restaurant_id = r.id;

-- ============================================
-- 创建视图: 菜谱完整信息(含食材和步骤数)
-- ============================================
CREATE VIEW v_recipe_full AS
SELECT 
    r.*,
    (SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id = r.id) AS ingredient_count,
    (SELECT COUNT(*) FROM recipe_steps WHERE recipe_id = r.id) AS step_count
FROM recipes r;