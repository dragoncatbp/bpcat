#!/bin/bash

# BPCat 部署脚本 - 用于 GitHub Pages

set -e  # 出错立即退出

echo "🚀 开始部署 BPCat 到 GitHub Pages..."

# 1. 确保在 main 分支
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  当前不在 main 分支，切换到 main..."
    git checkout main
fi

# 2. 确认 base 配置正确
if ! grep -q "base: '/bpcat/'" vite.config.ts; then
    echo "❌ vite.config.ts 中的 base 配置不正确！"
    echo "   应该为: base: '/bpcat/'"
    exit 1
fi

# 3. 安装依赖并构建
echo "📦 安装依赖..."
npm install

echo "🔨 构建项目..."
npm run build

# 4. 保存 dist 目录
echo "💾 保存构建产物..."
tmp_dir=$(mktemp -d)
cp -r dist/* "$tmp_dir/"

# 5. 切换到 gh-pages 分支
echo "🔄 切换到 gh-pages 分支..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
else
    git checkout -B gh-pages
fi

# 6. 清空当前目录（保留 .git）
echo "🧹 清理旧文件..."
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# 7. 复制新构建的文件
echo "📋 复制新构建文件..."
cp -r "$tmp_dir"/* .

# 8. 确保 vite.config.ts 正确（gh-pages 分支也需要）
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/bpcat/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
EOF

# 9. 提交并推送
echo "💾 提交更改..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "没有需要提交的更改"

echo "📤 推送到 GitHub..."
git push -f origin gh-pages

# 10. 清理临时文件
rm -rf "$tmp_dir"

# 11. 切回 main 分支
echo "🔙 切换回 main 分支..."
git checkout main

echo ""
echo "✅ 部署完成！"
echo "🌐 访问地址: https://dragoncatbp.github.io/bpcat"
echo "⏳ 等待 1-2 分钟后刷新页面查看效果"
