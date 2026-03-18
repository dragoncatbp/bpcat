#!/bin/bash

# BPCat 部署脚本 - 部署到 Vercel
# 使用方法: ./deploy.sh

echo "🚀 开始部署 BPCat..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

# 复制静态资源到 dist
echo "📁 复制静态资源..."
cp -r public/heroes dist/ 2>/dev/null || true

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
echo "提示: 如果是首次部署，会提示你登录 Vercel 账号"
echo "      请使用 GitHub 账号登录即可"
echo ""

vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 提示:"
echo "   - 如果是首次部署，Vercel 会提供一个 .vercel.app 域名"
echo "   - 你可以在 Vercel Dashboard 中配置自定义域名"
echo "   - 数据存储在浏览器本地，换设备需要重新创建队伍"
