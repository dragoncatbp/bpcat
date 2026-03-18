/**
 * 英雄头像下载脚本
 * 从Steam CDN下载英雄头像到本地
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取英雄数据
const heroesPath = path.join(__dirname, '../src/data/heroes.json');
const heroes = JSON.parse(fs.readFileSync(heroesPath, 'utf8'));

const OUTPUT_DIR = path.join(__dirname, '../public/heroes');

// 确保输出目录存在
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Steam CDN头像URL模板
const getHeroImageUrl = (heroName) => {
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName}.png`;
};

// 下载单个文件
async function downloadImage(url, outputPath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    return false;
  }
}

async function downloadAll() {
  console.log('🖼️ 开始下载英雄头像...\n');
  
  let success = 0;
  let failed = 0;
  const failedList = [];

  for (let i = 0; i < heroes.length; i++) {
    const hero = heroes[i];
    const url = getHeroImageUrl(hero.name);
    const outputPath = path.join(OUTPUT_DIR, `${hero.name}.png`);
    
    // 如果已存在则跳过
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  [${i + 1}/${heroes.length}] ${hero.localizedName} - 已存在`);
      success++;
      continue;
    }

    const result = await downloadImage(url, outputPath);
    
    if (result) {
      console.log(`✅ [${i + 1}/${heroes.length}] ${hero.localizedName}`);
      success++;
    } else {
      console.log(`❌ [${i + 1}/${heroes.length}] ${hero.localizedName} - 失败`);
      failed++;
      failedList.push(hero.localizedName);
    }
    
    // 延迟避免请求过快
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n📊 下载完成: 成功 ${success}, 失败 ${failed}`);
  
  if (failedList.length > 0) {
    console.log(`\n⚠️ 下载失败的英雄: ${failedList.join(', ')}`);
  }
}

downloadAll().catch(console.error);
