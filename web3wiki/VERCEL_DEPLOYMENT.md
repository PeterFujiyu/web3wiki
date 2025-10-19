# Vercel 部署指南

本指南将帮助你将 Web3wiki 部署到 Vercel。

## 前提条件

- GitHub 账号
- Vercel 账号（使用 GitHub 登录）
- MongoDB Atlas 账号（免费）

## 第一步：设置 MongoDB Atlas（数据库）

### 1. 创建 MongoDB Atlas 账号

1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 使用 Google 或 GitHub 账号注册
3. 选择免费的 M0 集群

### 2. 创建数据库集群

1. 登录后，点击 "Build a Database"
2. 选择 **FREE** 选项（M0 Sandbox）
3. 选择最近的服务器位置（推荐：Singapore 或 Tokyo）
4. 集群名称可以保持默认或改为 `web3wiki`
5. 点击 "Create Cluster"

### 3. 配置数据库访问

#### 创建数据库用户：
1. 左侧菜单选择 "Database Access"
2. 点击 "Add New Database User"
3. 选择 "Password" 认证方式
4. 用户名：`web3wiki_user`
5. 生成安全密码（记住这个密码！）
6. Database User Privileges：选择 "Read and write to any database"
7. 点击 "Add User"

#### 配置网络访问：
1. 左侧菜单选择 "Network Access"
2. 点击 "Add IP Address"
3. 选择 "Allow Access from Anywhere"（用于 Vercel）
4. IP Address 会自动填充为 `0.0.0.0/0`
5. 点击 "Confirm"

### 4. 获取连接字符串

1. 回到 "Database" 页面
2. 点击 "Connect" 按钮
3. 选择 "Connect your application"
4. Driver 选择 "Node.js"，Version 选择 "5.5 or later"
5. 复制连接字符串，格式类似：
   ```
   mongodb+srv://web3wiki_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. 将 `<password>` 替换为你刚才设置的密码
7. 保存这个连接字符串，稍后在 Vercel 中使用

## 第二步：准备 GitHub 仓库

### 1. 推送代码到 GitHub

```bash
# 初始化 git（如果还没有）
git init

# 添加所有文件
git add .

# 创建提交
git commit -m "Ready for Vercel deployment"

# 在 GitHub 上创建新仓库
# 然后添加远程仓库并推送
git remote add origin https://github.com/你的用户名/web3wiki.git
git branch -M main
git push -u origin main
```

### 2. 确保 .gitignore 正确

确保以下内容在 `.gitignore` 中：
```
node_modules/
dist/
.env
.env.local
server/data/
.vercel
```

## 第三步：在 Vercel 上部署

### 1. 导入项目

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New..." → "Project"
4. 从 GitHub 仓库列表中选择 `web3wiki`
5. 点击 "Import"

### 2. 配置项目设置

#### Framework Preset:
- 选择 **Vite**

#### Root Directory:
- 保持默认（`.`）

#### Build and Output Settings:
- Build Command: `yarn build`
- Output Directory: `dist`
- Install Command: `yarn install`

### 3. 配置环境变量

在 "Environment Variables" 部分添加：

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://web3wiki_user:你的密码@cluster0.xxxxx.mongodb.net/web3wiki?retryWrites=true&w=majority` |
| `VITE_API_URL` | 留空（部署后自动使用 Vercel 域名） |

**重要**: 确保 MongoDB URI 的格式正确：
- 密码已替换
- 数据库名称是 `web3wiki`（在 `.mongodb.net/` 后面）

### 4. 开始部署

1. 点击 "Deploy"
2. 等待构建和部署完成（通常 2-3 分钟）
3. 部署成功后，你会看到庆祝动画 🎉

### 5. 获取部署 URL

部署完成后，Vercel 会提供一个 URL，类似：
```
https://web3wiki-xxxxx.vercel.app
```

## 第四步：测试部署

### 1. 测试前端

访问你的 Vercel URL，检查：
- ✅ 首页加载正常
- ✅ 导航链接工作
- ✅ 文章页面显示
- ✅ 语言切换功能

### 2. 测试 API 端点

```bash
# 替换为你的 Vercel URL
URL="https://web3wiki-xxxxx.vercel.app"

# 测试 Newsletter 订阅
curl -X POST $URL/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 测试订阅者数量
curl $URL/api/newsletter/count

# 测试反馈提交
curl -X POST $URL/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "blockchain",
    "language": "en",
    "selectedText": "test",
    "suggestion": "test suggestion",
    "type": "improvement"
  }'
```

### 3. 验证 MongoDB 数据

1. 返回 MongoDB Atlas
2. 左侧菜单选择 "Database"
3. 点击 "Browse Collections"
4. 你应该能看到 `web3wiki` 数据库
5. 包含 `subscribers` 和 `feedback` 集合

## 第五步：配置自定义域名（可选）

### 1. 在 Vercel 中添加域名

1. 进入你的项目设置
2. 选择 "Domains" 标签
3. 输入你的域名（例如：`web3wiki.com`）
4. 点击 "Add"

### 2. 配置 DNS

Vercel 会提供 DNS 配置说明，通常需要添加：

**A 记录**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 记录**（用于 www）:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. 等待 DNS 传播

DNS 更改可能需要几分钟到几小时才能生效。

## 环境变量说明

### 必需的环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `MONGODB_URI` | MongoDB 连接字符串 | `mongodb+srv://user:pass@cluster.mongodb.net/web3wiki` |

### 可选的环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础 URL | Vercel 部署 URL |

## 持续部署

### 自动部署

Vercel 已配置为自动部署：

1. **生产部署**: 每次推送到 `main` 分支时
2. **预览部署**: 每次创建 Pull Request 时

### 手动部署

在 Vercel 仪表板中：
1. 选择你的项目
2. 点击 "Deployments"
3. 点击右上角的 "..." → "Redeploy"

## 监控和日志

### 查看日志

1. Vercel 仪表板 → 项目 → "Deployments"
2. 点击任何部署查看构建日志
3. 点击 "Functions" 标签查看 API 日志

### 查看分析

1. 项目设置 → "Analytics"
2. 查看页面访问量、性能指标等

## 故障排除

### 构建失败

**问题**: 构建时出错
**解决**:
1. 检查 Vercel 构建日志
2. 确保 `package.json` 中的脚本正确
3. 本地运行 `yarn build` 测试

### API 不工作

**问题**: API 端点返回 500 错误
**解决**:
1. 检查 Vercel Functions 日志
2. 验证 `MONGODB_URI` 环境变量正确
3. 确保 MongoDB 网络访问配置为 `0.0.0.0/0`
4. 检查 MongoDB 用户权限

### MongoDB 连接失败

**问题**: "MongoServerError: Authentication failed"
**解决**:
1. 验证 MongoDB URI 中的用户名和密码
2. 确保密码中的特殊字符已正确编码
3. 检查数据库用户权限

**问题**: "MongoServerError: bad auth : IP not whitelisted"
**解决**:
1. MongoDB Atlas → Network Access
2. 确保允许 `0.0.0.0/0`（所有 IP）

### CORS 错误

**问题**: 前端无法访问 API
**解决**:
1. 检查 API 函数中的 CORS 配置
2. 确保请求 URL 正确

## 成本

### Vercel
- **Hobby 计划**: 免费
  - 100GB 带宽/月
  - 无限部署
  - Serverless Functions: 100GB-小时

### MongoDB Atlas
- **M0 Free Tier**: 免费
  - 512MB 存储
  - 共享 RAM
  - 适合小型项目

**总成本**: $0/月（使用免费套餐）

## 下一步

部署成功后：

1. ✅ 配置自定义域名
2. ✅ 设置 MongoDB 备份
3. ✅ 实现管理员认证
4. ✅ 添加邮件服务（SendGrid）
5. ✅ 配置监控和告警
6. ✅ 实现速率限制

## 有用的链接

- [Vercel 文档](https://vercel.com/docs)
- [MongoDB Atlas 文档](https://docs.atlas.mongodb.com/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [MongoDB Node.js 驱动](https://www.mongodb.com/docs/drivers/node/current/)
