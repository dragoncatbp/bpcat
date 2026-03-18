/**
 * 英雄克制关系数据
 * 基于Dota2 7.40c版本常见克制关系
 * advantage: 正值表示heroId克制counterId，负值表示被克制
 */

export interface CounterRelation {
  heroId: number;
  counterId: number;
  advantage: number; // 优势值，范围 -10 到 +10
  reason: string;    // 克制原因
}

// 克制关系表（部分关键克制，可根据需要扩展）
export const counterRelations: CounterRelation[] = [
  // 敌法师克制
  { heroId: 1, counterId: 34, advantage: 8, reason: "法力损毁克制修补匠低蓝量" },
  { heroId: 1, counterId: 74, advantage: 7, reason: "法力损毁克制卡尔低蓝量" },
  { heroId: 1, counterId: 22, advantage: 6, reason: "闪烁躲避宙斯大招" },
  
  // 斧王克制
  { heroId: 2, counterId: 12, advantage: 8, reason: "狂战士之吼克制猴子幻象" },
  { heroId: 2, counterId: 61, advantage: 8, reason: "反击螺旋清蜘蛛小蜘蛛" },
  { heroId: 2, counterId: 41, advantage: 6, reason: "刃甲反弹虚空伤害" },
  
  // 祸乱之源克制
  { heroId: 3, counterId: 1, advantage: 7, reason: "噩梦+虚弱限制敌法师" },
  { heroId: 3, counterId: 44, advantage: 6, reason: "虚弱降低PA暴击伤害" },
  
  // 撼地者克制
  { heroId: 7, counterId: 61, advantage: 9, reason: "回音击秒杀蜘蛛小蜘蛛" },
  { heroId: 7, counterId: 12, advantage: 8, reason: "回音击克制猴子幻象" },
  { heroId: 7, counterId: 80, advantage: 7, reason: "沟壑打断小熊回归" },
  
  // 沉默术士克制
  { heroId: 75, counterId: 74, advantage: 9, reason: "全领域静默克制卡尔连招" },
  { heroId: 75, counterId: 17, advantage: 8, reason: "静默克制蓝猫技能连招" },
  { heroId: 75, counterId: 10, advantage: 8, reason: "静默限制水人变身" },
  { heroId: 75, counterId: 106, advantage: 7, reason: "静默限制火猫技能释放" },
  
  // 末日使者克制
  { heroId: 69, counterId: 34, advantage: 9, reason: "末日封印修补匠刷新" },
  { heroId: 69, counterId: 106, advantage: 8, reason: "末日封印火猫技能" },
  { heroId: 69, counterId: 17, advantage: 8, reason: "末日克制蓝猫" },
  { heroId: 69, counterId: 74, advantage: 8, reason: "末日克制卡尔" },
  { heroId: 69, counterId: 10, advantage: 7, reason: "末日限制水人" },
  
  // 蝙蝠骑士克制
  { heroId: 65, counterId: 44, advantage: 8, reason: "烈焰破击无视PA闪避" },
  { heroId: 65, counterId: 41, advantage: 7, reason: "燃烧枷锁无视时间结界" },
  
  // 军团指挥官克制
  { heroId: 104, counterId: 44, advantage: 7, reason: "决斗无视PA闪避" },
  { heroId: 104, counterId: 12, advantage: 6, reason: "决斗锁定猴子真身" },
  
  // 血魔克制
  { heroId: 4, counterId: 32, advantage: 8, reason: "血之祭祀显隐克制SA" },
  { heroId: 4, counterId: 93, advantage: 7, reason: "血之狂暴克制小鱼普攻" },
  
  // 幻影刺客克制
  { heroId: 44, counterId: 34, advantage: 7, reason: "高爆发秒杀修补匠" },
  { heroId: 44, counterId: 74, advantage: 6, reason: "闪烁突袭秒杀卡尔" },
  { heroId: 44, counterId: 11, advantage: 5, reason: "闪避克制影魔物理" },
  
  // 狙击手克制
  { heroId: 35, counterId: 34, advantage: 7, reason: "超远射程克制修补匠" },
  { heroId: 35, counterId: 74, advantage: 6, reason: "超远射程克制卡尔" },
  
  // 卓尔游侠克制
  { heroId: 6, counterId: 80, advantage: 7, reason: "沉默克制德鲁伊小熊" },
  { heroId: 6, counterId: 34, advantage: 6, reason: "高输出秒杀修补匠" },
  
  // 斯拉达克制
  { heroId: 27, counterId: 32, advantage: 8, reason: "深海重击显隐克制SA" },
  { heroId: 27, counterId: 44, advantage: 6, reason: "侵蚀雾霭降低PA护甲" },
  
  // 神谕者克制
  { heroId: 111, counterId: 104, advantage: 7, reason: "虚妄之诺救人克制军团决斗" },
  { heroId: 111, counterId: 2, advantage: 6, reason: "气运之末驱散狂战士之吼" },
  
  // 寒冬飞龙克制
  { heroId: 112, counterId: 44, advantage: 8, reason: "极寒之拥克制PA爆发" },
  { heroId: 112, counterId: 18, advantage: 7, reason: "极寒之拥救人克制斯温" },
  { heroId: 112, counterId: 104, advantage: 6, reason: "寒冬诅咒克制军团决斗" },
  
  // 黑皇杖相关克制
  { heroId: 75, counterId: 3, advantage: -5, reason: "BKB可抵挡部分静默效果" },
  { heroId: 69, counterId: 57, advantage: -6, reason: "全能驱逐可驱散末日" },
  
  // 虚空假面克制
  { heroId: 41, counterId: 44, advantage: 7, reason: "时间结界锁定PA" },
  { heroId: 41, counterId: 10, advantage: 6, reason: "时间结界锁定水人" },
  { heroId: 41, counterId: 34, advantage: 8, reason: "时间结界锁定修补匠" },
  
  // 马格纳斯克制
  { heroId: 97, counterId: 12, advantage: 8, reason: "两级反转聚怪克制猴子幻象" },
  { heroId: 97, counterId: 61, advantage: 7, reason: "两极反转聚怪克制蜘蛛小蜘蛛" },
  
  // 潮汐猎人克制
  { heroId: 28, counterId: 12, advantage: 7, reason: "毁灭克制猴子幻象" },
  { heroId: 28, counterId: 44, advantage: 6, reason: "锚击降低PA攻击力" },
  
  // 暗影恶魔克制
  { heroId: 79, counterId: 10, advantage: 8, reason: "崩裂禁锢分离水人幻象" },
  { heroId: 79, counterId: 12, advantage: 7, reason: "崩裂禁锢清猴子幻象" },
  
  // 剧毒术士克制
  { heroId: 40, counterId: 1, advantage: 6, reason: "剧毒新星减速克制敌法" },
  { heroId: 40, counterId: 44, advantage: 5, reason: "毒刺减速克制PA追击" },
  
  // 巫妖克制
  { heroId: 31, counterId: 12, advantage: 7, reason: "连环霜冻弹射击杀猴子幻象" },
  { heroId: 31, counterId: 61, advantage: 7, reason: "连环霜冻弹射小蜘蛛" },
  
  // 沙王克制
  { heroId: 16, counterId: 61, advantage: 7, reason: "地震清小蜘蛛" },
  { heroId: 16, counterId: 12, advantage: 6, reason: "地震清猴子幻象" },
  
  // 斯温克制
  { heroId: 18, counterId: 12, advantage: 7, reason: "巨力挥舞溅射清幻象" },
  { heroId: 18, counterId: 61, advantage: 7, reason: "巨力挥舞溅射清小蜘蛛" },
  
  // 干扰者克制
  { heroId: 87, counterId: 10, advantage: 8, reason: "动能力场+静态风暴克制水人" },
  { heroId: 87, counterId: 17, advantage: 8, reason: "静态风暴沉默蓝猫" },
  { heroId: 87, counterId: 1, advantage: 6, reason: "动能力场限制敌法闪烁" },
  
  // 上古巨神克制
  { heroId: 103, counterId: 67, advantage: 8, reason: "灵体游魂克制幽鬼折射" },
  { heroId: 103, counterId: 44, advantage: 6, reason: "自然秩序降低PA护甲" },
  
  // 维萨吉克制
  { heroId: 92, counterId: 34, advantage: 7, reason: "召唤物集火秒杀修补匠" },
  { heroId: 92, counterId: 35, advantage: 6, reason: "佣兽突进克制狙击手" },
  
  // 狼人克制
  { heroId: 77, counterId: 34, advantage: 6, reason: "召唤物+高移速追杀修补匠" },
  { heroId: 77, counterId: 35, advantage: 7, reason: "高移速突进狙击手" },
  
  // 娜迦海妖克制
  { heroId: 89, counterId: 34, advantage: 7, reason: "网+幻象集火修补匠" },
  { heroId: 89, counterId: 74, advantage: 6, reason: "网住卡尔限制其走位" },
  
  // 育母蜘蛛克制
  { heroId: 61, counterId: 1, advantage: 7, reason: "网限制敌法闪烁" },
  { heroId: 61, counterId: 44, advantage: 6, reason: "网限制PA闪烁" },
  { heroId: 61, counterId: 10, advantage: 6, reason: "小蜘蛛黏住水人" },
  
  // 变体精灵被克制
  { heroId: 10, counterId: 79, advantage: -8, reason: "暗影恶魔崩裂禁锢克水人" },
  { heroId: 10, counterId: 87, advantage: -8, reason: "干扰者静态风暴克水人" },
  { heroId: 10, counterId: 69, advantage: -7, reason: "末日克水人" },
  
  // 修补匠被克制
  { heroId: 34, counterId: 1, advantage: -8, reason: "敌法师法力损毁克TK" },
  { heroId: 34, counterId: 44, advantage: -7, reason: "PA高爆发秒TK" },
  { heroId: 34, counterId: 41, advantage: -8, reason: "虚空时间结界克TK" },
  { heroId: 34, counterId: 69, advantage: -9, reason: "末日封印TK刷新" },
  { heroId: 34, counterId: 89, advantage: -7, reason: "娜迦网住TK" },
  
  // 幻影刺客被克制
  { heroId: 44, counterId: 27, advantage: -6, reason: "斯拉达侵蚀雾霭降护甲" },
  { heroId: 44, counterId: 103, advantage: -6, reason: "大牛自然秩序降护甲" },
  { heroId: 44, counterId: 41, advantage: -7, reason: "虚空时间结界锁定PA" },
  { heroId: 44, counterId: 112, advantage: -8, reason: "冰龙极寒之拥克制爆发" },
  { heroId: 44, counterId: 104, advantage: -7, reason: "军团决斗无视闪避" },
  
  // 敌法师被克制
  { heroId: 1, counterId: 3, advantage: -7, reason: "祸乱之源噩梦限制" },
  { heroId: 1, counterId: 87, advantage: -6, reason: "干扰者动能力场限制闪烁" },
  { heroId: 1, counterId: 61, advantage: -7, reason: "蜘蛛网限制闪烁" },
  
  // 幽鬼被克制
  { heroId: 67, counterId: 103, advantage: -8, reason: "大牛灵体游魂克制折射" },
  { heroId: 67, counterId: 6, advantage: -5, reason: "小黑沉默限制技能" },
  
  // 力丸被克制
  { heroId: 32, counterId: 4, advantage: -8, reason: "血魔血之祭祀显隐" },
  { heroId: 32, counterId: 27, advantage: -8, reason: "斯拉达深海重击显隐" },
  { heroId: 32, counterId: 103, advantage: -6, reason: "大牛回音重踏显隐" },
  { heroId: 32, counterId: 93, advantage: -5, reason: "小鱼能量转移显隐附近" },
  
  // 斧王被克制
  { heroId: 2, counterId: 111, advantage: -6, reason: "神谕气运之末驱散狂战士之吼" },
  { heroId: 2, counterId: 57, advantage: -6, reason: "全能驱逐救人" },
  
  // 幻影长矛手被克制
  { heroId: 12, counterId: 2, advantage: -8, reason: "斧王狂战士之吼清幻象" },
  { heroId: 12, counterId: 7, advantage: -8, reason: "撼地者回音击清幻象" },
  { heroId: 12, counterId: 28, advantage: -7, reason: "潮汐毁灭清幻象" },
  { heroId: 12, counterId: 31, advantage: -7, reason: "巫妖连环霜冻弹射击杀幻象" },
  { heroId: 12, counterId: 16, advantage: -6, reason: "沙王地震清幻象" },
  { heroId: 12, counterId: 18, advantage: -7, reason: "斯温溅射清幻象" },
  { heroId: 12, counterId: 97, advantage: -8, reason: "马格纳斯两级反转聚怪清幻象" },
  { heroId: 12, counterId: 79, advantage: -7, reason: "暗影恶魔崩裂禁锢清幻象" },
  { heroId: 12, counterId: 104, advantage: -6, reason: "军团决斗锁定真身" },
  
  // 祈求者被克制
  { heroId: 74, counterId: 75, advantage: -9, reason: "沉默全领域静默克制" },
  { heroId: 74, counterId: 69, advantage: -8, reason: "末日封印技能" },
  { heroId: 74, counterId: 44, advantage: -6, reason: "PA闪烁突袭秒杀" },
  { heroId: 74, counterId: 35, advantage: -6, reason: "狙击手超远射程消耗" },
  
  // 风暴之灵被克制
  { heroId: 17, counterId: 75, advantage: -8, reason: "沉默克制蓝猫" },
  { heroId: 17, counterId: 69, advantage: -8, reason: "末日克制蓝猫" },
  { heroId: 17, counterId: 87, advantage: -8, reason: "干扰者静态风暴沉默" },
  { heroId: 17, counterId: 3, advantage: -7, reason: "祸乱之源虚弱+噩梦" },
  
  // 灰烬之灵被克制
  { heroId: 106, counterId: 69, advantage: -8, reason: "末日封印技能" },
  { heroId: 106, counterId: 75, advantage: -7, reason: "沉默限制技能释放" },
  { heroId: 106, counterId: 112, advantage: -6, reason: "寒冬飞龙极寒之拥救人" },
  
  // 狙击手被克制
  { heroId: 35, counterId: 77, advantage: -7, reason: "狼人高移速突进" },
  { heroId: 35, counterId: 17, advantage: -6, reason: "蓝猫滚脸秒杀" },
  { heroId: 35, counterId: 44, advantage: -6, reason: "PA闪烁突袭" },
  { heroId: 35, counterId: 92, advantage: -6, reason: "维萨吉佣兽突进" },
  { heroId: 35, counterId: 10, advantage: -5, reason: "水人波浪形态突进" },
  
  // 美杜莎被克制
  { heroId: 94, counterId: 1, advantage: -7, reason: "敌法师法力虚空炸蓝" },
  { heroId: 94, counterId: 52, advantage: -8, reason: "拉席克魔法伤害消耗护盾" },
  { heroId: 94, counterId: 22, advantage: -6, reason: "宙斯魔法伤害消耗护盾" },
  
  // 斯拉克被克制
  { heroId: 93, counterId: 4, advantage: -7, reason: "血魔血之狂暴克制普攻" },
  { heroId: 93, counterId: 44, advantage: -6, reason: "PA高爆发秒杀" },
  { heroId: 93, counterId: 41, advantage: -7, reason: "虚空时间结界锁定" },
  { heroId: 93, counterId: 112, advantage: -6, reason: "冰龙极寒之拥救人" },
  
  // 恐怖利刃被克制
  { heroId: 109, counterId: 7, advantage: -7, reason: "撼地者回音击克幻象" },
  { heroId: 109, counterId: 28, advantage: -6, reason: "潮汐毁灭克幻象" },
  { heroId: 109, counterId: 41, advantage: -6, reason: "虚空时间结界锁定" },
  
  // 编织者被克制
  { heroId: 63, counterId: 44, advantage: -7, reason: "PA闪烁突袭秒杀" },
  { heroId: 63, counterId: 41, advantage: -6, reason: "虚空时间锁定打断" },
  { heroId: 63, counterId: 17, advantage: -6, reason: "蓝猫滚脸带走" },
  
  // 克林克兹被克制
  { heroId: 56, counterId: 44, advantage: -6, reason: "PA秒杀小骷髅" },
  { heroId: 56, counterId: 32, advantage: -5, reason: "SA雾克制物理" },
  { heroId: 56, counterId: 41, advantage: -6, reason: "虚空锁定" },
  
  // 哈斯卡被克制
  { heroId: 59, counterId: 76, advantage: -8, reason: "黑鸟法球纯粹伤害克制魔抗" },
  { heroId: 59, counterId: 47, advantage: -7, reason: "毒龙法球克制被动" },
  { heroId: 59, counterId: 112, advantage: -6, reason: "冰龙极寒之拥救人" },
  
  // 冥魂大帝被克制
  { heroId: 42, counterId: 76, advantage: -7, reason: "黑鸟关小黑屋阻止复活" },
  { heroId: 42, counterId: 75, advantage: -6, reason: "沉默阻止复活时技能" },
  { heroId: 42, counterId: 11, advantage: -6, reason: "影魔魂之挽歌清骷髅兵" },
  
  // 酒仙被克制
  { heroId: 78, counterId: 69, advantage: -7, reason: "末日封印大招" },
  { heroId: 78, counterId: 75, advantage: -6, reason: "沉默限制技能" },
  { heroId: 78, counterId: 44, advantage: -5, reason: "PA秒杀" },
  
  // 陈被克制
  { heroId: 66, counterId: 2, advantage: -7, reason: "斧王斩杀召唤物" },
  { heroId: 66, counterId: 7, advantage: -7, reason: "撼地者回音击清召唤物" },
  { heroId: 66, counterId: 18, advantage: -6, reason: "斯温溅射清召唤物" },
  
  // 德鲁伊被克制
  { heroId: 80, counterId: 7, advantage: -7, reason: "撼地者沟壑打断小熊回归" },
  { heroId: 80, counterId: 6, advantage: -7, reason: "小黑沉默克制小熊" },
  { heroId: 80, counterId: 69, advantage: -6, reason: "末日封印小熊技能" },
  
  // 米波被克制
  { heroId: 82, counterId: 7, advantage: -8, reason: "撼地者回音击秒杀多分身" },
  { heroId: 82, counterId: 28, advantage: -7, reason: "潮汐毁灭清分身" },
  { heroId: 82, counterId: 16, advantage: -7, reason: "沙王地震清分身" },
  { heroId: 82, counterId: 11, advantage: -8, reason: "影魔魂之挽歌清分身" },
  { heroId: 82, counterId: 22, advantage: -7, reason: "宙斯雷神之怒全图打击" },
  { heroId: 82, counterId: 52, advantage: -7, reason: "拉席克脉冲新星清分身" },
  { heroId: 82, counterId: 18, advantage: -6, reason: "斯温风暴之锤晕多目标" },
  
  // 娜迦海妖被克制
  { heroId: 89, counterId: 7, advantage: -7, reason: "撼地者回音击清幻象" },
  { heroId: 89, counterId: 28, advantage: -6, reason: "潮汐毁灭清幻象" },
  { heroId: 89, counterId: 18, advantage: -6, reason: "斯温溅射清幻象" },
  { heroId: 89, counterId: 97, advantage: -7, reason: "马格纳斯两级反转聚怪" },
  
  // 育母蜘蛛被克制
  { heroId: 61, counterId: 2, advantage: -8, reason: "斧王反击螺旋清小蜘蛛" },
  { heroId: 61, counterId: 7, advantage: -9, reason: "撼地者回音击秒杀小蜘蛛" },
  { heroId: 61, counterId: 28, advantage: -7, reason: "潮汐毁灭清小蜘蛛" },
  { heroId: 61, counterId: 16, advantage: -7, reason: "沙王地震清小蜘蛛" },
  { heroId: 61, counterId: 18, advantage: -7, reason: "斯温溅射清小蜘蛛" },
  { heroId: 61, counterId: 52, advantage: -7, reason: "拉席克脉冲新星清小蜘蛛" },
  { heroId: 61, counterId: 11, advantage: -7, reason: "影魔影压清小蜘蛛" },
  
  // 齐天大圣被克制
  { heroId: 114, counterId: 7, advantage: -7, reason: "撼地者回音击清猴子猴孙" },
  { heroId: 114, counterId: 69, advantage: -7, reason: "末日封印大招" },
  { heroId: 114, counterId: 41, advantage: -6, reason: "虚空时间结界锁定" },
  
  // 虚空假面被克制
  { heroId: 41, counterId: 112, advantage: -6, reason: "寒冬飞龙极寒之拥救人" },
  { heroId: 41, counterId: 111, advantage: -6, reason: "神谕虚妄之诺救人" },
  { heroId: 41, counterId: 57, advantage: -5, reason: "全能驱逐救人" },
  { heroId: 41, counterId: 65, advantage: -7, reason: "蝙蝠燃烧枷锁无视时间结界" },
];

// 获取克制关系
export function getCounterRelations(heroId: number): CounterRelation[] {
  return counterRelations.filter(r => r.heroId === heroId || r.counterId === heroId);
}

// 获取某英雄克制谁
export function getCounters(heroId: number): CounterRelation[] {
  return counterRelations.filter(r => r.heroId === heroId && r.advantage > 0);
}

// 获取谁克制某英雄
export function getCounteredBy(heroId: number): CounterRelation[] {
  return counterRelations.filter(r => r.counterId === heroId && r.advantage > 0);
}

// 根据对手阵容推荐克制英雄
export function recommendCounters(opponentHeroIds: number[]): { heroId: number; score: number; reasons: string[] }[] {
  const scores = new Map<number, { score: number; reasons: string[] }>();
  
  opponentHeroIds.forEach(oppId => {
    const counters = getCounteredBy(oppId);
    counters.forEach(counter => {
      const existing = scores.get(counter.heroId);
      if (existing) {
        existing.score += counter.advantage;
        existing.reasons.push(`克制${counter.counterId}: ${counter.reason}`);
      } else {
        scores.set(counter.heroId, {
          score: counter.advantage,
          reasons: [`克制${counter.counterId}: ${counter.reason}`],
        });
      }
    });
  });
  
  return Array.from(scores.entries())
    .map(([heroId, data]) => ({ heroId, ...data }))
    .sort((a, b) => b.score - a.score);
}
