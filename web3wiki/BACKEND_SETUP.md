# 后端设置指南

## 快速开始

### 1. 安装依赖

依赖已经通过 `yarn install` 安装完成。主要后端依赖：
- `express` - Web服务器框架
- `cors` - 跨域资源共享
- `concurrently` - 同时运行多个命令

### 2. 环境配置

创建 `.env` 文件（可选）：

```bash
cp .env.example .env
```

默认配置：
- 后端端口: `3001`
- API URL: `http://localhost:3001`

### 3. 运行应用

#### 选项1: 同时运行前端和后端（推荐）

```bash
yarn dev:all
```

这将同时启动：
- 前端（Vite）在 http://localhost:5173
- 后端（Express）在 http://localhost:3001

#### 选项2: 分别运行

终端1 - 前端：
```bash
yarn dev
```

终端2 - 后端：
```bash
yarn server
```

### 4. 测试后端

访问健康检查端点：
```bash
curl http://localhost:3001/api/health
```

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2025-10-19T..."
}
```

## 数据存储位置

后端会自动创建 `server/data/` 目录来存储数据：

```
server/
  └── data/
      ├── subscribers.json    # Newsletter订阅者
      └── feedback.json       # 用户反馈
```

## API端点

### Newsletter订阅
```bash
POST http://localhost:3001/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 获取订阅者数量（公开）
```bash
GET http://localhost:3001/api/newsletter/count
```

### 查看订阅者列表（仅管理员，需要认证）
```bash
GET http://localhost:3001/api/admin/newsletter/subscribers
```
**注意**: 此端点目前已禁用，需要先实现管理员认证系统。

### 提交反馈
```bash
POST http://localhost:3001/api/feedback
Content-Type: application/json

{
  "articleId": "blockchain",
  "language": "en",
  "selectedText": "text...",
  "suggestion": "suggestion...",
  "type": "correction"
}
```

## 故障排除

### 端口已被占用

如果端口3001已被占用，在 `.env` 文件中修改端口：

```env
PORT=3002
VITE_API_URL=http://localhost:3002
```

记得重启服务器。

### CORS错误

确保后端正在运行在 `http://localhost:3001`，前端会自动连接到这个地址。

### 数据没有保存

检查 `server/data/` 目录的权限，确保Node.js进程有写入权限。

## 生产部署

对于生产环境，建议：

1. 使用真实数据库（MongoDB、PostgreSQL等）
2. 添加环境变量管理
3. 使用PM2或类似工具管理进程
4. 设置反向代理（Nginx）
5. 添加HTTPS支持
6. 实现邮件发送服务

详细信息请查看 `server/README.md`。
