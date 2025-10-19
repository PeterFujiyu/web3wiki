# Web3wiki

一个用于学习区块链和 Web3 技术的综合学习平台。

## ✨ 功能特点

- 📚 **丰富的教程**: 从初学者到高级的区块链教程
- 🌍 **多语言支持**: 支持英语和中文
- 🎨 **主题切换**: 深色/浅色模式
- 💬 **互动功能**: 文章反馈和测验
- 📝 **Markdown编辑器**: 实时预览和代码高亮
- 📧 **Newsletter订阅**: 获取最新更新

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
yarn install

# 同时运行前端和后端
yarn dev:all

# 或者分别运行
yarn dev       # 前端 (http://localhost:5173)
yarn server    # 后端 (http://localhost:3001)
```

### 环境配置

复制 `.env.example` 为 `.env`:

```bash
cp .env.example .env
```

## 📦 技术栈

### 前端
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **React Router** - 路由管理
- **i18next** - 国际化
- **React Markdown** - Markdown 渲染

### 后端
- **Express** - Web 框架
- **MongoDB** - 数据库 (Vercel 部署)
- **Node.js** - 运行时

## 🌐 部署到 Vercel

### 快速部署（5分钟）

查看 [快速部署指南](./DEPLOY_QUICKSTART.md)

### 详细部署指南

查看完整的 [Vercel 部署文档](./VERCEL_DEPLOYMENT.md)，包含：
- MongoDB Atlas 设置
- GitHub 配置
- Vercel 部署步骤
- 自定义域名配置
- 故障排除

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/web3wiki)

**注意**: 部署前需要准备：
1. MongoDB Atlas 账号（免费）
2. MongoDB 连接字符串

## 📂 项目结构

```
web3wiki/
├── api/                    # Vercel Serverless Functions
│   ├── newsletter/
│   │   ├── subscribe.js   # Newsletter 订阅
│   │   └── count.js       # 订阅者数量
│   └── feedback.js        # 用户反馈
├── server/                 # 本地开发服务器
│   ├── index.js           # Express 服务器
│   └── data/              # 本地数据存储
├── src/
│   ├── components/        # React 组件
│   ├── pages/            # 页面组件
│   ├── config/           # 配置文件
│   ├── i18n/             # 翻译文件
│   └── utils/            # 工具函数
├── public/
│   └── content/          # Markdown 文章
└── vercel.json           # Vercel 配置
```

## 🔧 本地后端设置

查看 [后端设置指南](./BACKEND_SETUP.md) 了解：
- API 端点说明
- 数据存储位置
- 测试方法
- 故障排除

## 📝 可用脚本

```bash
# 开发
yarn dev              # 启动前端开发服务器
yarn server           # 启动后端服务器
yarn dev:all          # 同时启动前端和后端

# 构建
yarn build            # 构建生产版本
yarn preview          # 预览生产构建

# 其他
yarn lint             # 运行 ESLint
```

## 🌍 API 端点

### 本地开发
```
http://localhost:3001/api/newsletter/subscribe  # Newsletter 订阅
http://localhost:3001/api/newsletter/count      # 订阅者数量
http://localhost:3001/api/feedback              # 用户反馈
http://localhost:3001/api/health                # 健康检查
```

### Vercel 生产环境
```
https://your-app.vercel.app/api/newsletter/subscribe
https://your-app.vercel.app/api/newsletter/count
https://your-app.vercel.app/api/feedback
```

## 🔐 环境变量

### 本地开发

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `VITE_API_URL` | API 基础 URL | 否 |
| `PORT` | 后端端口 | 否 |

### Vercel 部署

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `MONGODB_URI` | MongoDB 连接字符串 | 是 |
| `VITE_API_URL` | API URL | 否 |

## 📚 文档

- [快速部署指南](./DEPLOY_QUICKSTART.md) - 5分钟部署到 Vercel
- [Vercel 部署详细文档](./VERCEL_DEPLOYMENT.md) - 完整部署指南
- [后端设置](./BACKEND_SETUP.md) - 本地后端配置
- [服务器 API](./server/README.md) - API 文档

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

MIT License

## 🔗 链接

- **GitHub**: https://github.com/PeterFujiyu
- **Twitter**: https://twitter.com/00xPeter

## 💡 支持

如有问题或建议：
- 提交 Issue: https://github.com/你的用户名/web3wiki/issues
- Twitter: @00xPeter

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
