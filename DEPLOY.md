# 🚀 BPCat 部署指南

## 方案一：Vercel（推荐，最简单）

### 1. 准备
- 确保你有一个 **GitHub 账号**
- 将项目代码上传到 GitHub（可选，但推荐）

### 2. 部署步骤

#### 方式 A：使用 Vercel CLI（命令行）

```bash
# 1. 进入项目目录
cd /Users/hcm-b0656/bpcat

# 2. 运行部署脚本
./deploy.sh
```

或者手动步骤：
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel（会弹出浏览器让你用 GitHub 登录）
vercel login

# 3. 构建项目
npm run build

# 4. 部署
vercel --prod
```

#### 方式 B：使用 GitHub + Vercel 自动部署（推荐）

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建新仓库（如 `bpcat`）
   - 不要添加 README 或 .gitignore

2. **上传代码到 GitHub**
   ```bash
   cd /Users/hcm-b0656/bpcat
   
   # 初始化 git
   git init
   git add .
   git commit -m "Initial commit"
   
   # 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/bpcat.git
   git branch -M main
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 访问 https://vercel.com/new
   - 使用 GitHub 登录
   - 选择 `bpcat` 仓库
   - Framework Preset 选择 `Vite`
   - 点击 **Deploy**
   - 等待 1-2 分钟，部署完成！

4. **配置自定义域名**（可选）
   - 在 Vercel Dashboard 中选择你的项目
   - 进入 Settings → Domains
   - 添加你的域名（如 `bp.nianai.com`）
   - 按提示配置 DNS

---

## 方案二：Netlify

### 使用 GitHub + Netlify

1. 将代码上传到 GitHub（同上）
2. 访问 https://app.netlify.com/start
3. 选择 GitHub，导入 `bpcat` 仓库
4. Build command: `npm run build`
5. Publish directory: `dist`
6. 点击 Deploy

---

## 方案三：Cloudflare Pages

1. 将代码上传到 GitHub
2. 访问 https://dash.cloudflare.com
3. Pages → Create a project
4. 连接 GitHub 仓库
5. Build command: `npm run build`
6. Build output directory: `dist`
7. 部署

---

## 方案四：GitHub Pages（最简单，但有缺点）

**缺点**：不支持单页应用路由（刷新页面会404）

```bash
# 1. 安装 gh-pages
npm install -D gh-pages

# 2. 修改 vite.config.ts，添加 base 路径
export default defineConfig({
  base: '/bpcat/',  // 你的仓库名
  // ...
})

# 3. 修改 package.json，添加脚本
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# 4. 部署
npm run deploy
```

---

## 🌐 部署后访问

部署成功后，你会得到一个类似 `https://bpcat-xxxx.vercel.app` 的链接，分享给念爱杯的队员们即可使用！

---

## 📝 注意事项

1. **数据存储**：队伍数据存储在浏览器本地（localStorage），换设备需要重新创建队伍
2. **跨域问题**：OpenDota API 支持跨域，无需额外配置
3. **国内访问**：Vercel 在国内访问速度不错，如有需要可以使用自定义域名 + CDN

---

## 🆘 常见问题

**Q: 部署后英雄头像不显示？**
A: 确保 `public/heroes` 目录下的图片已上传到部署平台

**Q: 如何更新网站？**
A: 
- 如果是 GitHub + Vercel：推送代码到 GitHub，自动重新部署
- 如果是 CLI：重新运行 `vercel --prod`

**Q: 如何绑定自己的域名？**
A: 在 Vercel Dashboard → Settings → Domains 中添加

**Q: 免费额度够用吗？**
A: Vercel 免费版足够个人/小团队使用，有 100GB 带宽/月
