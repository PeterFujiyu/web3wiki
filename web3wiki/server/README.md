# Web3wiki Backend Server

这是Web3wiki的后端服务器，用于处理Newsletter订阅和用户反馈。

## 功能

### 1. Newsletter订阅
- **端点**: `POST /api/newsletter/subscribe`
- **请求体**:
  ```json
  {
    "email": "user@example.com",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "Successfully subscribed to newsletter"
  }
  ```

### 2. 获取订阅者数量（公开）
- **端点**: `GET /api/newsletter/count`
- **响应**:
  ```json
  {
    "success": true,
    "count": 10
  }
  ```

### 3. 获取订阅者列表（仅管理员，需要认证）
- **端点**: `GET /api/admin/newsletter/subscribers`
- **认证**: 需要在请求头中提供认证令牌
- **状态**: 目前已禁用，需要先实现认证系统
- **响应**:
  ```json
  {
    "success": false,
    "message": "This endpoint requires authentication. Please implement admin authentication first."
  }
  ```

### 4. 用户反馈提交
- **端点**: `POST /api/feedback`
- **请求体**:
  ```json
  {
    "articleId": "blockchain",
    "language": "en",
    "selectedText": "Some text",
    "suggestion": "Improvement suggestion",
    "type": "correction",
    "contactEmail": "user@example.com",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
  ```

### 5. 词典术语提交
- **端点**: `POST /api/glossary`
- **请求体**:
  ```json
  {
    "term": "区块链",
    "definition": "分布式账本技术...",
    "category": "Blockchain",
    "tags": ["技术", "加密"],
    "relatedTerms": ["bitcoin", "ethereum"],
    "difficulty": "beginner",
    "language": "zh",
    "mode": "create"
  }
  ```

### 6. 获取词典提交列表（仅管理员，仅localhost）🔒
- **端点**: `GET /api/glossary/submissions`
- **认证**: 仅接受来自localhost的请求
- **响应**:
  ```json
  {
    "success": true,
    "count": 5,
    "submissions": [...]
  }
  ```

### 7. 批准词典提交（仅管理员，仅localhost）🔒
- **端点**: `POST /api/glossary/approve/:submissionId`
- **认证**: 仅接受来自localhost的请求
- **响应**:
  ```json
  {
    "success": true,
    "message": "Glossary term approved and published"
  }
  ```

### 8. 健康检查
- **端点**: `GET /api/health`
- **响应**:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-01-01T00:00:00.000Z"
  }
  ```

## 安装

```bash
# 安装依赖
yarn install

# 或使用 npm
npm install
```

## 运行

### 开发模式

```bash
# 只运行后端服务器
yarn server

# 同时运行前端和后端
yarn dev:all
```

服务器将在 http://localhost:3001 上运行。

## 数据存储

数据以JSON格式存储在 `server/data/` 目录中：

- `subscribers.json` - Newsletter订阅者列表
- `feedback.json` - 用户反馈
- `glossary-submissions.json` - 词典术语提交

### 数据格式

**subscribers.json**:
```json
[
  {
    "email": "user@example.com",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "status": "active"
  }
]
```

**feedback.json**:
```json
[
  {
    "id": "1234567890",
    "articleId": "blockchain",
    "language": "en",
    "selectedText": "Some text",
    "suggestion": "Improvement suggestion",
    "type": "correction",
    "contactEmail": "user@example.com",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "status": "pending"
  }
]
```

## 环境变量

在根目录创建 `.env` 文件（可以从 `.env.example` 复制）：

```env
# 服务器端口
PORT=3001

# 前端API URL（在前端使用）
VITE_API_URL=http://localhost:3001
```

## 安全考虑

### Localhost鉴权机制 🔒

**管理员端点现已受localhost保护！** 以下端点仅接受来自localhost的请求：

- `GET /api/glossary/submissions`
- `POST /api/glossary/approve/:submissionId`
- `GET /api/admin/newsletter/subscribers`

支持的localhost地址：
- `127.0.0.1`
- `localhost`
- `::1` (IPv6)
- `::ffff:127.0.0.1` (IPv4-mapped IPv6)

任何来自其他IP地址的请求将收到 `403 Forbidden` 响应：
```json
{
  "success": false,
  "message": "Access denied. Admin endpoints are only accessible from localhost.",
  "ip": "192.168.1.100"
}
```

### 隐私保护
- ✅ 订阅者电子邮箱**不会**通过公开API暴露
- ✅ 只有本地管理员才能访问敏感数据
- ✅ 公开API仅返回统计数量，不包含任何个人信息
- ✅ 所有管理操作都记录日志

### 已实现的安全措施
1. **Localhost认证**:
   - 管理员端点自动检测请求来源IP
   - 拒绝所有非localhost的访问请求
   - 支持IPv4和IPv6 localhost地址

2. **端点隔离**:
   - 公开端点: 任何人可访问（提交、计数）
   - 管理员端点: 仅localhost可访问（审核、批准）

3. **输入验证**:
   - 邮箱格式验证
   - 必填字段检查
   - 防止重复订阅

4. **错误处理**:
   - 不暴露内部错误详情
   - 统一的错误响应格式
   - 安全日志记录

### TODO: 需要实现的安全功能
- [ ] JWT或OAuth认证系统（用于生产环境）
- [ ] 管理员角色和权限管理
- [ ] API请求速率限制
- [ ] HTTPS强制使用
- [ ] 邮箱验证（双重确认）
- [ ] GDPR合规（取消订阅功能）
- [ ] 完整的审计日志系统

## 生产部署建议

1. **使用真实数据库**: 将JSON文件存储替换为MongoDB、PostgreSQL等数据库
2. **实现认证系统**: 为管理员端点添加JWT或OAuth身份验证
3. **添加邮件服务**: 集成SendGrid、Mailchimp等服务发送确认邮件
4. **添加验证**: 使用验证码（reCAPTCHA）防止垃圾邮件
5. **速率限制**: 使用express-rate-limit防止滥用
6. **日志记录**: 添加Winston或类似的日志库
7. **错误处理**: 改进错误处理和监控
8. **HTTPS**: 强制使用HTTPS加密通信
9. **环境变量**: 使用dotenv管理敏感配置
10. **CORS配置**: 限制允许的来源域名

## API测试

### 使用测试脚本（推荐）

我们提供了一个完整的测试脚本来验证所有端点：

```bash
cd server
./test-api.sh
```

测试脚本将：
1. 检查服务器健康状态
2. 提交测试词条
3. 查看所有提交（管理员）
4. 批准测试提交（管理员）
5. 演示安全功能

### 手动测试示例

使用curl测试API：

```bash
# 订阅Newsletter
curl -X POST http://localhost:3001/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 获取订阅者数量（公开）
curl http://localhost:3001/api/newsletter/count

# 提交词典术语（公开）
curl -X POST http://localhost:3001/api/glossary \
  -H "Content-Type: application/json" \
  -d '{
    "term": "智能合约",
    "definition": "自动执行的合约代码",
    "category": "Ethereum",
    "language": "zh",
    "mode": "create"
  }'

# 查看词典提交（仅localhost）✓
curl http://localhost:3001/api/glossary/submissions

# 批准词典提交（仅localhost）✓
curl -X POST http://localhost:3001/api/glossary/approve/1234567890

# 获取订阅者列表（仅localhost）✓
curl http://localhost:3001/api/admin/newsletter/subscribers

# 提交反馈
curl -X POST http://localhost:3001/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "blockchain",
    "language": "en",
    "selectedText": "Sample text",
    "suggestion": "This could be improved",
    "type": "improvement"
  }'

# 健康检查
curl http://localhost:3001/api/health
```

## 详细文档

查看完整的API文档：[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
