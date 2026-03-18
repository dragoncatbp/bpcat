/**
 * 英雄别名/简称映射
 * 用于搜索功能，支持中文简称、英文简称等
 */

export interface HeroAlias {
  heroId: number;
  aliases: string[]; // 所有别名，包括中文简称、英文简称等
}

// 英雄别名表（7.40c版本）
export const heroAliases: HeroAlias[] = [
  { heroId: 1, aliases: ['am', '敌法', 'df'] },
  { heroId: 2, aliases: ['fw', 'axe', '斧王'] },
  { heroId: 3, aliases: ['bane', '祸乱', 'hlzy'] },
  { heroId: 4, aliases: ['bs', '血魔', 'xm'] },
  { heroId: 5, aliases: ['cm', '冰女', 'bn', '水晶室女'] },
  { heroId: 6, aliases: ['dr', '小黑', 'xh', '卓尔游侠'] },
  { heroId: 7, aliases: ['es', '小牛', 'xn', '撼地者'] },
  { heroId: 8, aliases: ['jugg', '剑圣', 'js', '主宰'] },
  { heroId: 9, aliases: ['pom', '白虎', 'bh', '米拉娜'] },
  { heroId: 10, aliases: ['mor', '水人', 'sr', '变体精灵'] },
  { heroId: 11, aliases: ['sf', '影魔', 'ym'] },
  { heroId: 12, aliases: ['pl', '猴子', 'hz', '幻影长矛手'] },
  { heroId: 13, aliases: ['puck', '帕克', 'pk'] },
  { heroId: 14, aliases: ['pudge', '屠夫', 'tf', '帕吉'] },
  { heroId: 15, aliases: ['razor', '电棍', 'dg', '剃刀'] },
  { heroId: 16, aliases: ['sk', '沙王', 'sw'] },
  { heroId: 17, aliases: ['st', '蓝猫', 'lm', '风暴之灵'] },
  { heroId: 18, aliases: ['sven', '斯温', 'sw2'] },
  { heroId: 19, aliases: ['tiny', '小小', 'xx'] },
  { heroId: 20, aliases: ['vs', '复仇', 'fc', '复仇之魂'] },
  { heroId: 21, aliases: ['wr', '风行', 'fx', '风行者'] },
  { heroId: 22, aliases: ['zeus', '宙斯', 'zs'] },
  { heroId: 23, aliases: ['kunkka', '船长', 'cz', '昆卡'] },
  { heroId: 25, aliases: ['lina', '火女', 'hn', '莉娜'] },
  { heroId: 26, aliases: ['lion', '恶魔巫师', 'emws', '莱恩'] },
  { heroId: 27, aliases: ['slardar', '大鱼', 'dy', '斯拉达'] },
  { heroId: 28, aliases: ['th', '潮汐', 'cx', '潮汐猎人'] },
  { heroId: 30, aliases: ['wd', '巫医', 'wy'] },
  { heroId: 31, aliases: ['lich', '巫妖', 'wy2'] },
  { heroId: 32, aliases: ['sa', '隐刺', 'yc', '力丸'] },
  { heroId: 33, aliases: ['enigma', '谜团', 'mt'] },
  { heroId: 34, aliases: ['tk', '修补匠', 'xbg', 'tinker'] },
  { heroId: 35, aliases: ['sniper', '火枪', 'hq', '狙击手'] },
  { heroId: 36, aliases: ['nec', 'necro', '死灵法', 'slf', '死灵法师'] },
  { heroId: 37, aliases: ['wl', '术士', 'ss'] },
  { heroId: 38, aliases: ['bm', '兽王', 'sw2'] },
  { heroId: 39, aliases: ['qop', '女王', 'nw', '痛苦女王'] },
  { heroId: 40, aliases: ['veno', '剧毒', 'jd', '剧毒术士'] },
  { heroId: 41, aliases: ['fv', '虚空', 'xk', '虚空假面'] },
  { heroId: 42, aliases: ['wk', '骷髅王', 'klw', '冥魂大帝'] },
  { heroId: 43, aliases: ['dp', '死亡先知', 'swxz'] },
  { heroId: 44, aliases: ['pa', '幻刺', 'hc', '幻影刺客'] },
  { heroId: 45, aliases: ['pugna', '骨法', 'gf', '帕格纳'] },
  { heroId: 46, aliases: ['ta', '圣堂', 'st', '圣堂刺客'] },
  { heroId: 47, aliases: ['viper', '毒龙', 'dl', '冥界亚龙'] },
  { heroId: 48, aliases: ['luna', '月骑', 'yq', '露娜'] },
  { heroId: 49, aliases: ['dk', '龙骑', 'lq', '龙骑士'] },
  { heroId: 50, aliases: ['dazzle', '暗牧', 'am2', '戴泽'] },
  { heroId: 51, aliases: ['cw', '发条', 'fl', '发条技师'] },
  { heroId: 52, aliases: ['ts', '老鹿', 'll', '拉席克'] },
  { heroId: 53, aliases: ['np', '先知', 'xz'] },
  { heroId: 54, aliases: ['naix', '小狗', 'xg', '噬魂鬼', 'lifestealer'] },
  { heroId: 55, aliases: ['ds', '黑贤', 'hx', '黑暗贤者'] },
  { heroId: 56, aliases: ['clinkz', '小骷髅', 'xkl', '克林克兹', '骨弓'] },
  { heroId: 57, aliases: ['omni', '全能', 'qn', '全能骑士'] },
  { heroId: 58, aliases: ['enchant', '小鹿', 'xl', '魅惑魔女'] },
  { heroId: 59, aliases: ['huskar', '神灵', 'sl', '哈斯卡'] },
  { heroId: 60, aliases: ['ns', '夜魔', 'ym2', '暗夜魔王'] },
  { heroId: 61, aliases: ['brood', '蜘蛛', 'zz', '育母蜘蛛'] },
  { heroId: 62, aliases: ['bh', '赏金', 'sj', '赏金猎人'] },
  { heroId: 63, aliases: ['weaver', '蚂蚁', 'my', '编织者'] },
  { heroId: 64, aliases: ['jakiro', '双头龙', 'stl', '杰奇洛'] },
  { heroId: 65, aliases: ['bat', '蝙蝠', 'bf', '蝙蝠骑士'] },
  { heroId: 66, aliases: ['chen', '圣骑士', 'sqs', '陈'] },
  { heroId: 67, aliases: ['spe', '幽鬼', 'yg', '幽鬼'] },
  { heroId: 68, aliases: ['aa', '冰魂', 'bh2', '远古冰魄'] },
  { heroId: 69, aliases: ['doom', '末日', 'mr', '末日使者'] },
  { heroId: 70, aliases: ['ursa', '拍拍', 'pp', '熊战士'] },
  { heroId: 71, aliases: ['sb', '白牛', 'bn', '裂魂人'] },
  { heroId: 72, aliases: [' gyro', '飞机', 'fj', '矮人直升机'] },
  { heroId: 73, aliases: ['alch', '炼金', 'lj', '炼金术士'] },
  { heroId: 74, aliases: ['invoker', '卡尔', 'ke', '祈求者'] },
  { heroId: 75, aliases: ['silencer', '沉默', 'cm2', '沉默术士'] },
  { heroId: 76, aliases: ['od', '黑鸟', 'hn2', '殁境神蚀者'] },
  { heroId: 77, aliases: ['lycan', '狼人', 'lr'] },
  { heroId: 78, aliases: ['brew', '熊猫', 'xm2', '酒仙'] },
  { heroId: 79, aliases: ['sd', '毒狗', 'dg2', '暗影恶魔'] },
  { heroId: 80, aliases: ['ld', '德鲁伊', 'dly'] },
  { heroId: 81, aliases: ['ck', '混沌', 'hd', '混沌骑士'] },
  { heroId: 82, aliases: ['meepo', '米波', 'mb'] },
  { heroId: 83, aliases: ['tree', '大树', 'ds2', '树精卫士'] },
  { heroId: 84, aliases: ['ogre', '蓝胖', 'lp', '食人魔魔法师'] },
  { heroId: 85, aliases: ['undying', '尸王', 'sw3', '不朽尸王'] },
  { heroId: 86, aliases: ['rubick', '拉比克', 'lbk'] },
  { heroId: 87, aliases: ['disruptor', '干扰者', 'grz', '萨尔'] },
  { heroId: 88, aliases: ['nyx', '小强', 'xq', '司夜刺客'] },
  { heroId: 89, aliases: ['naga', '小娜迦', 'xnj', '娜迦海妖'] },
  { heroId: 90, aliases: ['kotl', '光法', 'gf2', '光之守卫'] },
  { heroId: 91, aliases: ['io', '小精灵', 'xjl', '艾欧'] },
  { heroId: 92, aliases: ['visage', '死灵龙', 'sll', '维萨吉'] },
  { heroId: 93, aliases: ['slark', '小鱼', 'xy', '斯拉克'] },
  { heroId: 94, aliases: ['medusa', '美杜莎', 'mds', '一姐'] },
  { heroId: 95, aliases: ['troll', '巨魔', 'jm', '巨魔战将'] },
  { heroId: 96, aliases: ['centaur', '人马', 'rm', '半人马战行者'] },
  { heroId: 97, aliases: ['magnus', '猛犸', 'mm', '马格纳斯'] },
  { heroId: 98, aliases: ['timber', '伐木机', 'fmj', '伐木机'] },
  { heroId: 99, aliases: ['bb', '刚背', 'gb', '钢背兽'] },
  { heroId: 100, aliases: ['tusk', '海民', 'hm', '巨牙海民'] },
  { heroId: 101, aliases: ['sky', '天怒', 'tn', '天怒法师'] },
  { heroId: 102, aliases: ['abaddon', '亚巴顿', 'ybd'] },
  { heroId: 103, aliases: ['et', '大牛', 'dn', '上古巨神'] },
  { heroId: 104, aliases: ['lc', '军团', 'jt', '军团指挥官'] },
  { heroId: 105, aliases: ['techies', '炸弹人', 'zdr', '工程师'] },
  { heroId: 106, aliases: ['ember', '火猫', 'hm2', '灰烬之灵'] },
  { heroId: 107, aliases: ['earth', '土猫', 'tm', '大地之灵'] },
  { heroId: 108, aliases: ['underlord', '孽主', 'nz', '孽主'] },
  { heroId: 109, aliases: ['tb', '恐怖利刃', 'kbl'] },
  { heroId: 110, aliases: ['phoenix', '凤凰', 'fh'] },
  { heroId: 111, aliases: ['oracle', '神谕者', 'syz'] },
  { heroId: 112, aliases: ['ww', '冰龙', 'bl', '寒冬飞龙'] },
  { heroId: 113, aliases: ['arc', '电狗', 'dg3', '天穹守望者'] },
  { heroId: 114, aliases: ['mk', '大圣', 'ds3', '齐天大圣'] },
  { heroId: 119, aliases: ['willow', '花仙子', 'hxz', '邪影芳灵'] },
  { heroId: 120, aliases: ['pango', '滚滚', 'gg', '石鳞剑士'] },
  { heroId: 121, aliases: ['grim', '墨客', 'mk2', '天涯墨客'] },
  { heroId: 123, aliases: ['hoodwink', '松鼠', 'ss2', '森海飞霞'] },
  { heroId: 126, aliases: ['void', '紫猫', 'zm', '虚无之灵'] },
  { heroId: 128, aliases: ['snapfire', '老奶奶', 'lnn', '电炎绝手'] },
  { heroId: 129, aliases: ['mars', '玛尔斯', 'mes'] },
  { heroId: 135, aliases: ['ringmaster', '百戏大王', 'bxdw'] },
  { heroId: 136, aliases: ['dawnbreaker', '破晓辰星', 'pxcx'] },
  { heroId: 137, aliases: ['marci', '玛西', 'mx'] },
  { heroId: 138, aliases: ['primal', '兽', 'shou', '獸'] },
  { heroId: 141, aliases: ['muerta', '琼英碧灵', 'qybl'] },
  { heroId: 145, aliases: ['kez', '凯', 'kai'] },
  { heroId: 147, aliases: ['largo', '劳戈', 'lg'] },
];

// 构建搜索索引
const searchIndex = new Map<number, string[]>();
heroAliases.forEach(({ heroId, aliases }) => {
  searchIndex.set(heroId, aliases.map(a => a.toLowerCase()));
});

// 搜索英雄
export function searchHeroes(query: string): number[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const results: number[] = [];
  
  heroAliases.forEach(({ heroId, aliases }) => {
    // 完全匹配别名
    if (aliases.some(alias => alias.toLowerCase() === normalizedQuery)) {
      if (!results.includes(heroId)) {
        results.push(heroId);
      }
      return;
    }
    
    // 模糊匹配（包含）
    if (aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))) {
      if (!results.includes(heroId)) {
        results.push(heroId);
      }
    }
  });
  
  return results;
}

// 获取英雄别名
export function getHeroAliases(heroId: number): string[] {
  const hero = heroAliases.find(h => h.heroId === heroId);
  return hero?.aliases || [];
}
