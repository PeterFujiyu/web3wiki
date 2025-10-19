# 快速部署到 Vercel

## 5分钟快速部署指南

### 1️⃣ 设置 MongoDB（2分钟）

1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 免费注册并创建 **M0 FREE** 集群
3. 创建数据库用户（记住密码！）
4. 网络访问设置为 "Allow Access from Anywhere"
5. 获取连接字符串：
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/web3wiki
   ```

### 2️⃣ 推送到 GitHub（1分钟）

```bash
git add .
git commit -m "Deploy to Vercel"
git push
```

### 3️⃣ 部署到 Vercel（2分钟）

1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点击 "Add New..." → "Project"
4. 选择你的 GitHub 仓库（web3wiki）
5. 点击 "Import"

#### 配置项目设置：

**Framework Preset:**
- 选择 `Vite`（会自动检测）

**Root Directory:**
- 保持默认 `./`（不要修改）

**Build and Output Settings:**

| 设置项 | 填写内容 | 说明 |
|--------|----------|------|
| **Build Command** | `yarn build` 或 `npm run build` | 构建命令 |
| **Output Directory** | `dist` | 构建输出目录 |
| **Install Command** | `yarn install` 或 `npm install` | 安装依赖命令 |

**Environment Variables（环境变量）:**
- 点击 "Add" 添加变量
- Name: `MONGODB_URI`
- Value: 你的 MongoDB 连接字符串
- 例如: `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/web3wiki`

6. 点击 "Deploy" 开始部署

💡 **需要更详细的配置说明？** 查看 [Vercel 配置页面详细指南](./VERCEL_CONFIG_GUIDE.md)

✅ 完成！你的应用现在已上线！

---

## API 端点

部署后，你的 API 端点将是：

```
https://your-project.vercel.app/api/newsletter/subscribe
https://your-project.vercel.app/api/newsletter/count
https://your-project.vercel.app/api/feedback
```

## 测试部署

```bash
# 替换为你的 Vercel URL
curl https://your-project.vercel.app/api/newsletter/count
```

## 查看详细指南

详细的部署说明请查看：[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## 常见问题

**Q: API 返回 500 错误？**
A: 检查 Vercel 环境变量中的 `MONGODB_URI` 是否正确

**Q: 如何查看日志？**
A: Vercel 仪表板 → 项目 → Deployments → 点击部署 → Functions 标签

**Q: 如何更新代码？**
A: 只需 push 到 GitHub，Vercel 会自动重新部署

**Q: 成本是多少？**
A: 使用免费套餐，成本为 $0/月
