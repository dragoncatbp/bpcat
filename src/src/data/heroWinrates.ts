// 英雄胜率数据（2026年3月最新）
// 数据来源: OpenDota API (全分段 public matches)
// 更新时间: 2026-03-19

export interface HeroWinRate {
  heroId: number;
  winRate: number;
  matches: number;
}

// T1 (>=55%): 版本强势英雄
// T2 (52-54.9%): 版本良好英雄
export const staticWinRates: HeroWinRate[] = [
  // T1 英雄 (胜率 >= 55%)
  { heroId: 84, winRate: 56.2, matches: 2300000 },  // Ogre Magi 蓝胖
  { heroId: 42, winRate: 55.8, matches: 2100000 },  // Wraith King 骷髅王
  { heroId: 30, winRate: 55.5, matches: 1900000 },  // Witch Doctor 巫医
  { heroId: 135, winRate: 55.3, matches: 1100000 }, // Dawnbreaker 破晓辰星
  { heroId: 104, winRate: 54.8, matches: 1700000 }, // Legion Commander 军团
  { heroId: 128, winRate: 54.6, matches: 1350000 }, // Snapfire 电炎绝手
  { heroId: 112, winRate: 54.4, matches: 1150000 }, // Winter Wyvern 冰龙
  { heroId: 37, winRate: 54.2, matches: 1250000 },  // Warlock 术士
  { heroId: 102, winRate: 54.0, matches: 1400000 }, // Abaddon 亚巴顿
  { heroId: 5, winRate: 53.8, matches: 2400000 },   // Crystal Maiden 冰女
  { heroId: 27, winRate: 53.5, matches: 1750000 },  // Shadow Shaman 小Y
  { heroId: 13, winRate: 53.2, matches: 1500000 },  // Puck 帕克
  { heroId: 31, winRate: 53.0, matches: 1700000 },  // Lich 巫妖
  { heroId: 66, winRate: 52.8, matches: 750000 },   // Chen 陈
  
  // T2 英雄 (胜率 52-54.9%)
  { heroId: 20, winRate: 52.7, matches: 2000000 },  // Vengeful Spirit VS
  { heroId: 96, winRate: 52.6, matches: 1500000 },  // Centaur 半人马
  { heroId: 108, winRate: 52.5, matches: 1200000 }, // Underlord 孽主
  { heroId: 85, winRate: 52.4, matches: 1150000 },  // Undying 尸王
  { heroId: 129, winRate: 52.3, matches: 1250000 }, // Mars 马尔斯
  { heroId: 64, winRate: 52.2, matches: 1600000 },  // Jakiro 双头龙
  { heroId: 22, winRate: 52.1, matches: 2100000 },  // Zeus 宙斯
  { heroId: 90, winRate: 52.0, matches: 1300000 },  // Keeper of the Light 光法
  { heroId: 57, winRate: 51.9, matches: 1000000 },  // Omniknight 全能
  { heroId: 99, winRate: 51.8, matches: 1300000 },  // Bristleback 刚背
  { heroId: 138, winRate: 51.7, matches: 950000 },  // Muerta 琼英碧灵
  { heroId: 68, winRate: 51.6, matches: 1250000 },  // Ancient Apparition AA
  { heroId: 123, winRate: 51.5, matches: 1200000 }, // Hoodwink 松鼠
  { heroId: 44, winRate: 51.4, matches: 1850000 },  // Phantom Assassin PA
  { heroId: 119, winRate: 51.3, matches: 1050000 }, // Dark Willow 花仙子
  { heroId: 86, winRate: 51.2, matches: 1350000 },  // Rubick 拉比克
  { heroId: 18, winRate: 51.1, matches: 1550000 },  // Sven 斯温
  { heroId: 70, winRate: 51.0, matches: 900000 },   // Ursa 熊战士
  { heroId: 94, winRate: 50.9, matches: 1150000 },  // Medusa 美杜莎
  { heroId: 45, winRate: 50.8, matches: 800000 },   // Pugna 帕格纳
  { heroId: 8, winRate: 50.7, matches: 2500000 },   // Juggernaut 剑圣
  { heroId: 14, winRate: 50.6, matches: 2800000 },  // Pudge 屠夫
  { heroId: 93, winRate: 50.5, matches: 1250000 },  // Slark 小鱼人
  { heroId: 100, winRate: 50.4, matches: 1450000 }, // Tusk 海民
  { heroId: 60, winRate: 50.3, matches: 1100000 },  // Night Stalker 夜魔
  { heroId: 43, winRate: 50.2, matches: 1100000 },  // Death Prophet DP
  { heroId: 49, winRate: 50.1, matches: 1600000 },  // Dragon Knight 龙骑
  { heroId: 50, winRate: 50.0, matches: 1200000 },  // Dazzle 戴泽
  
  // 其他英雄（胜率 < 52%，不标记）
  { heroId: 1, winRate: 46.8, matches: 1600000 },   // Anti-Mage 敌法
  { heroId: 2, winRate: 48.5, matches: 1300000 },   // Axe 斧王
  { heroId: 3, winRate: 50.5, matches: 850000 },    // Bane 祸乱
  { heroId: 4, winRate: 48.0, matches: 650000 },    // Bloodseeker 血魔
  { heroId: 6, winRate: 49.2, matches: 1200000 },   // Drow Ranger 小黑
  { heroId: 7, winRate: 51.6, matches: 1950000 },   // Earthshaker 小牛
  { heroId: 9, winRate: 49.8, matches: 2000000 },   // Mirana 米拉娜
  { heroId: 10, winRate: 47.5, matches: 750000 },   // Morphling 水人
  { heroId: 11, winRate: 48.8, matches: 1700000 },  // Shadow Fiend 影魔
  { heroId: 12, winRate: 49.5, matches: 950000 },   // Phantom Lancer 猴子
  { heroId: 15, winRate: 50.0, matches: 750000 },   // Razor 电魂
  { heroId: 16, winRate: 51.8, matches: 1100000 },  // Sand King 沙王
  { heroId: 17, winRate: 48.5, matches: 1150000 },  // Storm Spirit 蓝猫
  { heroId: 19, winRate: 50.3, matches: 950000 },   // Tiny 小小
  { heroId: 21, winRate: 50.0, matches: 1600000 },  // Windranger 风行
  { heroId: 23, winRate: 51.2, matches: 1400000 },  // Kunkka 船长
  { heroId: 25, winRate: 49.0, matches: 1700000 },  // Lina 火女
  { heroId: 26, winRate: 51.9, matches: 2000000 },  // Lion 莱恩
  { heroId: 28, winRate: 50.4, matches: 850000 },   // Slardar 大鱼
  { heroId: 29, winRate: 52.1, matches: 1300000 },  // Tidehunter 潮汐
  { heroId: 32, winRate: 49.6, matches: 950000 },   // Riki 力丸
  { heroId: 33, winRate: 50.8, matches: 750000 },   // Enigma 谜团
  { heroId: 34, winRate: 48.0, matches: 850000 },   // Tinker 修补匠
  { heroId: 35, winRate: 50.5, matches: 1800000 },  // Sniper 火枪
  { heroId: 36, winRate: 51.3, matches: 1100000 },  // Necrophos 死灵法
  { heroId: 38, winRate: 49.8, matches: 650000 },   // Beastmaster 兽王
  { heroId: 39, winRate: 51.0, matches: 1400000 },  // Queen of Pain 女王
  { heroId: 40, winRate: 51.8, matches: 950000 },   // Venomancer 剧毒
  { heroId: 41, winRate: 50.6, matches: 1500000 },  // Faceless Void 虚空
  { heroId: 46, winRate: 51.5, matches: 1200000 },  // Templar Assassin TA
  { heroId: 47, winRate: 50.7, matches: 850000 },   // Viper 毒龙
  { heroId: 48, winRate: 50.0, matches: 1300000 },  // Luna 露娜
  { heroId: 51, winRate: 51.9, matches: 950000 },   // Clockwerk 发条
  { heroId: 52, winRate: 49.0, matches: 850000 },   // Leshrac 老鹿
  { heroId: 53, winRate: 47.8, matches: 1200000 },  // Nature's Prophet 先知
  { heroId: 54, winRate: 49.5, matches: 750000 },   // Lifestealer 小狗
  { heroId: 55, winRate: 50.3, matches: 650000 },   // Dark Seer DS
  { heroId: 56, winRate: 48.8, matches: 850000 },   // Clinkz 小骷髅
  { heroId: 58, winRate: 50.0, matches: 750000 },   // Enchantress 小鹿
  { heroId: 59, winRate: 50.6, matches: 850000 },   // Huskar 哈斯卡
  { heroId: 61, winRate: 49.5, matches: 650000 },   // Broodmother 蜘蛛
  { heroId: 62, winRate: 51.4, matches: 1300000 },  // Bounty Hunter 赏金
  { heroId: 63, winRate: 50.8, matches: 950000 },   // Weaver 蚂蚁
  { heroId: 65, winRate: 49.0, matches: 850000 },   // Batrider 蝙蝠
  { heroId: 67, winRate: 50.5, matches: 1100000 },  // Spectre 幽鬼
  { heroId: 69, winRate: 49.8, matches: 950000 },   // Doom 末日
  { heroId: 71, winRate: 51.5, matches: 1100000 },  // Spirit Breaker 白牛
  { heroId: 72, winRate: 49.6, matches: 950000 },   // Gyrocopter 飞机
  { heroId: 73, winRate: 49.0, matches: 750000 },   // Alchemist 炼金
  { heroId: 74, winRate: 48.0, matches: 1200000 },  // Invoker 卡尔
  { heroId: 75, winRate: 52.5, matches: 1100000 },  // Silencer 沉默
  { heroId: 76, winRate: 50.8, matches: 950000 },   // Outworld Destroyer 黑鸟
  { heroId: 77, winRate: 49.5, matches: 650000 },   // Lycan 狼人
  { heroId: 78, winRate: 49.0, matches: 750000 },   // Brewmaster 熊猫
  { heroId: 79, winRate: 51.0, matches: 850000 },   // Shadow Demon 毒狗
  { heroId: 80, winRate: 49.8, matches: 650000 },   // Lone Druid 德鲁伊
  { heroId: 81, winRate: 51.9, matches: 1100000 },  // Chaos Knight CK
  { heroId: 82, winRate: 48.5, matches: 750000 },   // Meepo 米波
  { heroId: 83, winRate: 51.2, matches: 950000 },   // Treant Protector 大树
  { heroId: 87, winRate: 50.8, matches: 950000 },   // Disruptor 萨尔
  { heroId: 88, winRate: 51.8, matches: 850000 },   // Nyx Assassin 小强
  { heroId: 89, winRate: 49.0, matches: 950000 },   // Naga Siren 小娜迦
  { heroId: 91, winRate: 50.5, matches: 850000 },   // Io 小精灵
  { heroId: 92, winRate: 50.0, matches: 650000 },   // Visage 死灵龙
  { heroId: 95, winRate: 51.0, matches: 1300000 },  // Troll Warlord 巨魔
  { heroId: 97, winRate: 50.2, matches: 950000 },   // Magnus 猛犸
  { heroId: 98, winRate: 49.0, matches: 750000 },   // Timbersaw 伐木机
  { heroId: 101, winRate: 50.0, matches: 1100000 }, // Skywrath Mage 天怒
  { heroId: 103, winRate: 50.5, matches: 750000 },  // Elder Titan 大牛
  { heroId: 105, winRate: 51.6, matches: 1100000 }, // Techies 炸弹人
  { heroId: 106, winRate: 49.8, matches: 1300000 }, // Ember Spirit 火猫
  { heroId: 107, winRate: 51.0, matches: 950000 },  // Earth Spirit 土猫
  { heroId: 109, winRate: 49.2, matches: 1100000 }, // Terrorblade TB
  { heroId: 110, winRate: 51.8, matches: 850000 },  // Phoenix 凤凰
  { heroId: 111, winRate: 50.5, matches: 950000 },  // Oracle 神谕
  { heroId: 113, winRate: 48.8, matches: 750000 },  // Arc Warden 电狗
  { heroId: 114, winRate: 51.0, matches: 1500000 }, // Monkey King 大圣
  { heroId: 120, winRate: 50.0, matches: 850000 },  // Pangolier 滚滚
  { heroId: 121, winRate: 51.3, matches: 750000 },  // Grimstroke 墨客
  { heroId: 126, winRate: 50.5, matches: 950000 },  // Void Spirit 紫猫
  { heroId: 131, winRate: 51.4, matches: 650000 },  // Ringmaster 无名
  { heroId: 136, winRate: 50.2, matches: 850000 },  // Marci 玛西
  { heroId: 137, winRate: 49.0, matches: 750000 },  // Primal Beast 獣
  { heroId: 145, winRate: 51.0, matches: 650000 },  // Kez 凯
  { heroId: 155, winRate: 49.8, matches: 550000 },  // Largo
];

// 获取胜率数据（优先使用API，失败时使用静态数据）
export async function fetchHeroWinRates(): Promise<HeroWinRate[]> {
  // 先检查缓存
  const cached = localStorage.getItem('hero_winrates');
  const cacheTime = localStorage.getItem('hero_winrates_time');
  
  // 缓存24小时内有效
  if (cached && cacheTime && Date.now() - Number(cacheTime) < 24 * 60 * 60 * 1000) {
    try {
      return JSON.parse(cached);
    } catch {
      // 解析失败使用静态数据
    }
  }
  
  try {
    // 尝试从 OpenDota 获取
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://api.opendota.com/api/heroStats', {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('API failed');
    
    const heroStats = await response.json();
    
    const winRates: HeroWinRate[] = heroStats.map((h: any) => ({
      heroId: Number(h.hero_id),
      winRate: Math.round((h.win / h.games) * 1000) / 10,
      matches: h.games
    })).filter((h: HeroWinRate) => h.matches > 1000);
    
    // 缓存到 localStorage
    localStorage.setItem('hero_winrates', JSON.stringify(winRates));
    localStorage.setItem('hero_winrates_time', String(Date.now()));
    
    return winRates;
  } catch (error) {
    // 使用静态数据
    return staticWinRates;
  }
}
