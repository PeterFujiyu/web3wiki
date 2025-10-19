# Vercel 配置页面详细说明

当你在 Vercel 导入项目后，会看到一个配置页面。本指南详细说明每个字段应该如何填写。

## 📋 配置页面布局

```
┌─────────────────────────────────────────────────────┐
│  Configure Project                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Framework Preset                [Vite        ▼]   │
│  ✓ Detected automatically                           │
│                                                      │
│  Root Directory                  [./          ▼]   │
│  ○ Use repository root                             │
│                                                      │
│  Build and Output Settings                         │
│  ⚙ Override                                        │
│                                                      │
│  Build Command                                      │
│  [yarn build                                    ]   │
│                                                      │
│  Output Directory                                   │
│  [dist                                          ]   │
│                                                      │
│  Install Command                                    │
│  [yarn install                                  ]   │
│                                                      │
│  Environment Variables                             │
│  [+ Add]                                           │
│                                                      │
│  [ Deploy ]                                        │
└─────────────────────────────────────────────────────┘
```

## ✅ 逐项配置说明

### 1. Framework Preset（框架预设）

**显示内容**:
```
Framework Preset: Vite
✓ Detected automatically
```

**你需要做什么**:
- ✅ **什么都不用做**
- Vercel 会自动检测到这是一个 Vite 项目
- 如果没有自动检测，从下拉菜单选择 "Vite"

**为什么重要**:
- 这告诉 Vercel 如何正确构建你的项目

---

### 2. Root Directory（根目录）

**显示内容**:
```
Root Directory: ./
○ Use repository root
```

**你需要做什么**:
- ✅ **保持默认值 `./`**
- ✅ **不要修改这个设置**

**为什么重要**:
- `./` 表示使用 GitHub 仓库的根目录
- 如果你的项目在子文件夹中才需要修改（我们的项目不需要）

---

### 3. Build and Output Settings（构建和输出设置）

#### 3.1 Build Command（构建命令）

**字段名称**: Build Command

**应该填写**:
```
yarn build
```

**或者**（如果你使用 npm）:
```
npm run build
```

**说明**:
- 这是用来构建生产版本的命令
- 对应 `package.json` 中的 `"build": "tsc -b && vite build"`
- Vercel 通常会自动填充，确认即可

**如何验证**:
在本地运行 `yarn build`，应该能成功构建并生成 `dist/` 目录

---

#### 3.2 Output Directory（输出目录）

**字段名称**: Output Directory

**应该填写**:
```
dist
```

**说明**:
- 构建后的文件存放位置
- Vite 默认输出到 `dist/` 目录
- Vercel 会从这个目录部署静态文件

**⚠️ 常见错误**:
- ❌ 不要填写 `./dist`（不需要 `./`）
- ❌ 不要填写 `dist/`（不需要末尾斜杠）
- ✅ 只填写 `dist`

**如何验证**:
本地运行 `yarn build` 后，检查是否生成了 `dist/` 文件夹

---

#### 3.3 Install Command（安装命令）

**字段名称**: Install Command

**应该填写**:
```
yarn install
```

**或者**（如果你使用 npm）:
```
npm install
```

**说明**:
- 安装项目依赖的命令
- 在构建之前运行
- Vercel 通常会自动检测

---

### 4. Environment Variables（环境变量）

**显示内容**:
```
Environment Variables
[+ Add]
```

#### 步骤：

1️⃣ **点击 "+ Add" 按钮**

2️⃣ **填写环境变量**:

```
┌─────────────────────────────────────┐
│ Name:  [MONGODB_URI           ]    │
│                                     │
│ Value: [mongodb+srv://...      ]    │
│                                     │
│ Environment:                        │
│ ✓ Production                        │
│ ✓ Preview                           │
│ ✓ Development                       │
│                                     │
│        [Cancel]  [Save]             │
└─────────────────────────────────────┘
```

**必需的环境变量**:

| Name | Value | 说明 |
|------|-------|------|
| `MONGODB_URI` | `mongodb+srv://user:password@cluster.mongodb.net/web3wiki` | MongoDB 连接字符串 |

**示例值**:
```
mongodb+srv://web3wiki_user:MySecurePass123@cluster0.abc123.mongodb.net/web3wiki?retryWrites=true&w=majority
```

**⚠️ 重要提醒**:
- 确保连接字符串中的 `<password>` 已替换为实际密码
- 确保数据库名称是 `web3wiki`（在 `.mongodb.net/` 后面）
- 不要有空格或换行符
- 保持开头的 `mongodb+srv://`

**Environment 选项**:
- ✅ Production（生产环境） - 勾选
- ✅ Preview（预览环境） - 勾选
- ✅ Development（开发环境） - 可选

---

## 🎯 最终配置检查清单

在点击 "Deploy" 之前，确认：

- [ ] Framework Preset = `Vite`
- [ ] Root Directory = `./`
- [ ] Build Command = `yarn build` 或 `npm run build`
- [ ] Output Directory = `dist`
- [ ] Install Command = `yarn install` 或 `npm install`
- [ ] Environment Variables 中有 `MONGODB_URI`
- [ ] MongoDB URI 格式正确且密码已替换

## 🚀 点击 Deploy

所有设置确认无误后：

1. 点击页面底部的 **"Deploy"** 按钮
2. Vercel 开始构建（通常需要 2-3 分钟）
3. 看到进度条和日志输出
4. 等待部署完成

## 📊 构建日志示例

部署时你会看到类似这样的日志：

```
Running "yarn install"
✓ Dependencies installed

Running "yarn build"
✓ TypeScript compilation successful
✓ Vite build completed
✓ Output: dist/

Uploading build outputs
✓ 45 files uploaded

Deployment ready!
```

## ❌ 常见错误和解决方法

### 错误 1: "Build Command exited with 1"

**原因**: TypeScript 编译错误或依赖问题

**解决**:
1. 本地运行 `yarn build` 测试
2. 检查是否有 TypeScript 错误
3. 确保所有依赖都在 `package.json` 中

---

### 错误 2: "Output Directory not found"

**原因**: Output Directory 配置错误

**解决**:
- 确认填写的是 `dist`（不是 `./dist` 或 `dist/`）
- 检查 `vite.config.ts` 中的 `build.outDir` 设置

---

### 错误 3: API 端点 404

**原因**: Serverless Functions 没有正确部署

**解决**:
1. 确认 `api/` 文件夹在仓库根目录
2. 检查 `vercel.json` 配置
3. 查看 Vercel Functions 日志

---

## 💡 小贴士

### 如果使用 npm 而不是 yarn:

将所有 `yarn` 命令替换为 `npm`:
- Build Command: `npm run build`
- Install Command: `npm install`

### 如何修改已部署的配置:

1. 进入 Vercel 项目设置
2. 点击 "Settings" 标签
3. 左侧菜单选择 "General"
4. 找到 "Build & Development Settings"
5. 修改后点击 "Save"
6. 重新部署项目

### 查看构建日志:

1. 项目仪表板 → "Deployments"
2. 点击任何一个部署
3. 查看 "Building" 部分的日志

---

## 📚 相关文档

- [返回快速部署指南](./DEPLOY_QUICKSTART.md)
- [返回详细部署文档](./VERCEL_DEPLOYMENT.md)
- [Vercel 官方文档](https://vercel.com/docs)
