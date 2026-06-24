# 真享吃 - 项目部署与开发指南

## 项目概述

**真享吃** 是一个基于个人健康需求的智能美食推荐平台，核心功能包括：
- 基于用户健康画像的智能推荐
- 周边餐厅和菜品推荐
- AI 生成个性化菜谱
- 食材一键购买跳转
- 饮食记录与反馈

## 技术栈

### 后端
- **框架**: NestJS (Node.js + TypeScript)
- **数据库**: MySQL 8.0+
- **缓存**: Redis
- **AI服务**: 通义千问/DeepSeek API
- **地图服务**: 高德地图 API

### 前端
- **框架**: uni-app (Vue 3)
- **状态管理**: Pinia
- **支持平台**: 
  - 微信小程序
  - 鸿蒙应用
  - H5
  - Android APP
  - iOS APP

## 目录结构

```
YumWise/
├── database/              # 数据库
│   └── schema.sql        # 数据库表结构
├── backend/              # 后端服务
│   ├── src/
│   │   ├── entities/     # 数据实体
│   │   ├── modules/      # 业务模块
│   │   ├── common/       # 公共模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env              # 环境配置
│   └── package.json
├── frontend/             # 前端应用
│   ├── pages/            # 页面
│   ├── store/            # 状态管理
│   ├── utils/            # 工具函数
│   ├── App.vue
│   ├── main.js
│   ├── pages.json
│   └── manifest.json
├── PRD_真享吃_v1.0.md     # 产品需求文档
└── prototype.html        # 原型设计
```

## 快速开始

### 1. 数据库初始化

```bash
# 创建数据库并导入表结构
mysql -u root -p < database/schema.sql
```

### 2. 后端服务启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量（修改 .env 文件）
# 必须配置项：
# - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
# - JWT_SECRET
# - WX_APPID, WX_SECRET (微信登录)
# - AI_API_KEY (AI服务)
# - AMAP_KEY (高德地图)

# 启动开发服务器
npm run start:dev

# 访问 API 文档
# http://localhost:3000/api/docs
```

### 3. 前端应用启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 微信小程序开发
npm run dev:mp-weixin
# 使用微信开发者工具打开 dist/dev/mp-weixin 目录

# H5 开发
npm run dev:h5

# 鸿蒙应用开发
npm run dev:harmony

# Android/iOS APP 开发
npm run dev:app
```

## 环境配置说明

### 后端环境变量 (.env)

```env
# 应用配置
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=yumwise

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 微信配置
WX_APPID=your_wechat_appid
WX_SECRET=your_wechat_secret

# AI服务配置
AI_API_KEY=your_ai_api_key
AI_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
AI_MODEL=qwen-plus

# 高德地图配置
AMAP_KEY=your_amap_key
```

### 前端配置 (manifest.json)

```json
{
  "mp-weixin": {
    "appid": "你的微信小程序AppID"
  }
}
```

## API 接口文档

启动后端服务后，访问 `http://localhost:3000/api/docs` 查看完整的 Swagger API 文档。

### 主要接口

#### 认证相关
- `POST /api/v1/users/login` - 用户登录/注册（微信授权）
- `GET /api/v1/users/profile` - 获取用户信息
- `PATCH /api/v1/users/profile` - 更新用户信息

#### 健康画像
- `GET /api/v1/health-profile` - 获取健康画像
- `POST /api/v1/health-profile` - 创建/更新健康画像

#### 推荐相关
- `GET /api/v1/recommendations/home` - 获取主页推荐
- `GET /api/v1/recommendations/restaurants` - 获取附近餐厅推荐
- `GET /api/v1/recommendations/dishes` - 获取菜品推荐
- `GET /api/v1/recommendations/recipes` - 获取菜谱推荐

#### 餐厅和菜品
- `GET /api/v1/restaurants/nearby` - 获取附近餐厅
- `GET /api/v1/restaurants/:id` - 获取餐厅详情
- `GET /api/v1/dishes/restaurant/:restaurantId` - 获取餐厅菜品

#### 菜谱
- `GET /api/v1/recipes/popular` - 获取热门菜谱
- `GET /api/v1/recipes/health-goal/:goal` - 根据健康目标获取菜谱
- `GET /api/v1/recipes/:id` - 获取菜谱详情

#### AI 服务
- `POST /api/v1/ai/recipe/generate` - AI 生成菜谱

#### 买菜跳转
- `GET /api/v1/grocery/platforms` - 获取支持的买菜平台
- `POST /api/v1/grocery/batch-purchase-urls` - 批量生成购买链接

#### 饮食记录
- `POST /api/v1/meal-records` - 创建饮食记录
- `GET /api/v1/meal-records` - 获取饮食记录列表
- `GET /api/v1/meal-records/calendar` - 获取日历数据
- `GET /api/v1/meal-records/statistics` - 获取统计数据

## 数据库表说明

### 核心表

1. **users** - 用户表
2. **health_profiles** - 健康画像表
3. **restaurants** - 餐厅表
4. **dishes** - 菜品表
5. **recipes** - 菜谱表
6. **recipe_ingredients** - 菜谱食材表
7. **recipe_steps** - 菜谱步骤表
8. **meal_records** - 饮食记录表
9. **user_favorites** - 用户收藏表
10. **grocery_platforms** - 买菜平台配置表

详细表结构见 `database/schema.sql`

## 部署指南

### 后端部署

#### 使用 Docker

```bash
# 构建镜像
docker build -t yumwise-backend ./backend

# 运行容器
docker run -d \
  --name yumwise-backend \
  -p 3000:3000 \
  -e DB_HOST=your_db_host \
  -e DB_PASSWORD=your_db_password \
  -e JWT_SECRET=your_jwt_secret \
  yumwise-backend
```

#### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 构建应用
npm run build

# 启动应用
pm2 start dist/main.js --name yumwise-backend
```

### 前端部署

#### 微信小程序

```bash
# 构建
npm run build:mp-weixin

# 使用微信开发者工具上传代码
# 路径: dist/build/mp-weixin
```

#### H5 部署

```bash
# 构建
npm run build:h5

# 将 dist/build/h5 目录部署到静态服务器
```

#### APP 打包

```bash
# 构建
npm run build:app

# 使用 HBuilderX 进行云打包或本地打包
```

## 开发注意事项

### 1. 微信小程序配置

- 在 `manifest.json` 中配置 `appid`
- 在微信公众平台配置服务器域名
- 配置合法域名：后端API域名、高德地图域名等

### 2. 数据安全

- JWT Secret 必须使用强密码
- 用户健康数据属于敏感信息，注意隐私保护
- 所有 API 接口需要认证（除了登录接口）

### 3. AI 服务

- 推荐使用通义千问或 DeepSeek API
- 需要配置正确的 API Key
- 注意 API 调用频率和费用控制

### 4. 地图服务

- 使用高德地图 API
- 需要申请高德地图 Key
- 微信小程序需要在公众平台配置高德地图域名

### 5. 买菜平台跳转

- 多多买菜、叮咚买菜、美团买菜
- 使用 URL Scheme 或小程序跳转
- 需要各平台的合作权限

## 常见问题

### 1. 数据库连接失败

- 检查 MySQL 服务是否启动
- 检查 .env 中的数据库配置是否正确
- 检查数据库用户权限

### 2. 微信登录失败

- 检查 WX_APPID 和 WX_SECRET 是否正确
- 检查微信公众平台的配置
- 检查网络连接

### 3. AI 生成失败

- 检查 AI_API_KEY 是否正确
- 检查 API 额度是否充足
- 检查网络连接

### 4. 小程序真机调试问题

- 检查域名是否在微信公众平台配置
- 检查 HTTPS 证书是否有效
- 检查 API 接口是否正常

## 技术支持

- 项目文档：本 README
- API 文档：http://localhost:3000/api/docs
- PRD 文档：PRD_真享吃_v1.0.md

## 许可证

MIT License