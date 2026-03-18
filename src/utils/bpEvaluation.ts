import type { BPDraft } from '@/types';
import heroesData from '@/data/heroes.json';

// 评分维度
export interface BPBlankScores {
  lineupBalance: number;  // 阵容平衡性（前后排、物理/法术平衡）
  teamfight: number;      // 团战能力
  push: number;           // 推进能力
  gank: number;           // 抓人能力
  lateGame: number;       // 后期能力
  coordination: number;   // 英雄配合度
}

// 评价结果
export interface BPBlankEvaluation {
  scores: BPBlankScores;
  overallScore: number;   // 总分 0-100
  tags: string[];         // 阵容标签
  strengths: string[];    // 优势
  weaknesses: string[];   // 劣势
  suggestions: string[];  // 建议
  keyTimings: string[];   // 关键时间点
  counterStrategy?: string[]; // 针对策略（对抗方视角）
}

// 英雄能力数据
interface HeroCapabilities {
  control: number;      // 控制能力
  burst: number;        // 爆发能力
  aoe: number;          // AOE能力
  push: number;         // 推进能力
  gank: number;         // 抓人能力
  durable: number;      // 坦度
  mobility: number;     // 机动性
  vision: number;       // 视野/侦查
  save: number;         // 救人能力
  lateGame?: number;    // 后期能力（可选）
}

// 默认能力值
const DEFAULT_CAPABILITIES: HeroCapabilities = {
  control: 5, burst: 5, aoe: 5, push: 5, gank: 5, 
  durable: 5, mobility: 5, vision: 3, save: 3, lateGame: 5
};

// 英雄能力数据扩展
const heroCapabilities: Record<number, HeroCapabilities> = {
  // 控制型
  31: { control: 9, burst: 6, aoe: 6, push: 3, gank: 8, durable: 6, mobility: 6, vision: 3, save: 3 }, // 小牛
  19: { control: 9, burst: 4, aoe: 6, push: 2, gank: 7, durable: 8, mobility: 3, vision: 3, save: 4 }, // 潮汐
  99: { control: 8, burst: 5, aoe: 7, push: 3, gank: 7, durable: 7, mobility: 5, vision: 3, save: 3 }, // 沙王
  68: { control: 8, burst: 6, aoe: 7, push: 3, gank: 7, durable: 6, mobility: 5, vision: 3, save: 4 }, // 谜团
  41: { control: 10, burst: 6, aoe: 4, push: 3, gank: 7, durable: 6, mobility: 5, vision: 3, save: 3 }, // 虚空
  54: { control: 9, burst: 5, aoe: 7, push: 4, gank: 6, durable: 6, mobility: 5, vision: 3, save: 6 }, // 猛犸
  29: { control: 8, burst: 5, aoe: 8, push: 2, gank: 6, durable: 5, mobility: 5, vision: 3, save: 4 }, // 斧王
  
  // 爆发型
  44: { control: 3, burst: 10, aoe: 5, push: 4, gank: 8, durable: 3, mobility: 7, vision: 3, save: 3 }, // PA
  11: { control: 4, burst: 9, aoe: 6, push: 4, gank: 8, durable: 4, mobility: 7, vision: 3, save: 3 }, // SF
  25: { control: 5, burst: 9, aoe: 7, push: 6, gank: 6, durable: 5, mobility: 5, vision: 3, save: 3 }, // 卡尔
  74: { control: 6, burst: 8, aoe: 7, push: 7, gank: 7, durable: 5, mobility: 8, vision: 3, save: 3 }, // 蓝猫
  13: { control: 4, burst: 9, aoe: 5, push: 4, gank: 8, durable: 3, mobility: 6, vision: 3, save: 3 }, // 血魔
  17: { control: 4, burst: 8, aoe: 5, push: 5, gank: 7, durable: 4, mobility: 6, vision: 3, save: 3 }, // 天怒
  
  // 推进型
  40: { control: 3, burst: 5, aoe: 5, push: 10, gank: 4, durable: 5, mobility: 5, vision: 3, save: 3 }, // 炼金
  88: { control: 5, burst: 6, aoe: 7, push: 9, gank: 5, durable: 6, mobility: 5, vision: 3, save: 4 }, // DP
  86: { control: 5, burst: 5, aoe: 9, push: 8, gank: 4, durable: 5, mobility: 4, vision: 3, save: 3 }, // 剧毒
  48: { control: 4, burst: 4, aoe: 4, push: 9, gank: 6, durable: 5, mobility: 7, vision: 3, save: 3 }, // 狼人
  89: { control: 5, burst: 5, aoe: 5, push: 8, gank: 7, durable: 5, mobility: 5, vision: 3, save: 5 }, // 先知
  75: { control: 4, burst: 5, aoe: 7, push: 8, gank: 5, durable: 5, mobility: 5, vision: 3, save: 3 }, // 死灵龙
  43: { control: 5, burst: 4, aoe: 6, push: 8, gank: 4, durable: 6, mobility: 4, vision: 3, save: 4 }, // 尸王
  
  // 后期核心
  93: { control: 3, burst: 7, aoe: 7, push: 6, gank: 4, durable: 9, mobility: 3, vision: 3, save: 3, lateGame: 10 }, // Medusa
  56: { control: 4, burst: 7, aoe: 4, push: 5, gank: 5, durable: 7, mobility: 4, vision: 3, save: 4, lateGame: 8 }, // 虚空
  94: { control: 6, burst: 7, aoe: 5, push: 5, gank: 5, durable: 6, mobility: 5, vision: 3, save: 3 }, // 电棍
  6: { control: 3, burst: 6, aoe: 4, push: 4, gank: 5, durable: 6, mobility: 5, vision: 3, save: 3 }, // 冰魂
  32: { control: 4, burst: 6, aoe: 6, push: 6, gank: 5, durable: 6, mobility: 4, vision: 3, save: 3 }, // 冰龙
  
  // 辅助/救人
  22: { control: 7, burst: 6, aoe: 8, push: 4, gank: 6, durable: 4, mobility: 4, vision: 3, save: 6 }, // 冰女
  26: { control: 8, burst: 5, aoe: 5, push: 3, gank: 7, durable: 5, mobility: 5, vision: 3, save: 8 }, // 神谕
  91: { control: 6, burst: 5, aoe: 6, push: 3, gank: 6, durable: 5, mobility: 5, vision: 3, save: 9 }, // 戴泽
  12: { control: 7, burst: 4, aoe: 5, push: 3, gank: 6, durable: 4, mobility: 5, vision: 3, save: 8 }, // 毒狗
  92: { control: 6, burst: 5, aoe: 5, push: 3, gank: 6, durable: 4, mobility: 6, vision: 3, save: 7 }, // 小精灵
  14: { control: 7, burst: 4, aoe: 4, push: 3, gank: 7, durable: 4, mobility: 6, vision: 4, save: 6 }, // 帕克
  
  // 全球流
  80: { control: 4, burst: 7, aoe: 4, push: 5, gank: 9, durable: 5, mobility: 7, vision: 3, save: 3 }, // 幽鬼
  79: { control: 5, burst: 9, aoe: 8, push: 6, gank: 6, durable: 5, mobility: 5, vision: 3, save: 3 }, // Zeus
  53: { control: 7, burst: 6, aoe: 5, push: 4, gank: 8, durable: 5, mobility: 5, vision: 3, save: 4 }, // 发条
};

// 获取英雄能力
function getHeroCapabilities(heroId: number): HeroCapabilities {
  return heroCapabilities[heroId] || DEFAULT_CAPABILITIES;
}

// 计算阵容评价
export function evaluateDraft(
  draft: BPDraft,
  perspective: 'radiant' | 'dire' | 'both' = 'radiant'
): BPBlankEvaluation {
  const teamPicks = perspective === 'dire' ? draft.direPicks : draft.radiantPicks;
  const opponentPicks = perspective === 'dire' ? draft.radiantPicks : draft.direPicks;
  
  // 计算各项能力
  const teamCaps = teamPicks.map(getHeroCapabilities);
  const opponentCaps = opponentPicks.map(getHeroCapabilities);
  
  // 求平均值
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
  
  const teamStats = {
    control: avg(teamCaps.map(c => c.control)),
    burst: avg(teamCaps.map(c => c.burst)),
    aoe: avg(teamCaps.map(c => c.aoe)),
    push: avg(teamCaps.map(c => c.push)),
    gank: avg(teamCaps.map(c => c.gank)),
    durable: avg(teamCaps.map(c => c.durable)),
    mobility: avg(teamCaps.map(c => c.mobility)),
    vision: avg(teamCaps.map(c => c.vision)),
    save: avg(teamCaps.map(c => c.save)),
  };
  
  const opponentStats = {
    control: avg(opponentCaps.map(c => c.control)),
    burst: avg(opponentCaps.map(c => c.burst)),
    aoe: avg(opponentCaps.map(c => c.aoe)),
    push: avg(opponentCaps.map(c => c.push)),
    gank: avg(opponentCaps.map(c => c.gank)),
    durable: avg(opponentCaps.map(c => c.durable)),
    mobility: avg(opponentCaps.map(c => c.mobility)),
    vision: avg(opponentCaps.map(c => c.vision)),
    save: avg(opponentCaps.map(c => c.save)),
  };
  
  // 计算各项分数 (0-100)
  const scores: BPBlankScores = {
    lineupBalance: calculateBalanceScore(teamPicks, teamStats),
    teamfight: Math.min(100, Math.round((teamStats.control * 8 + teamStats.aoe * 7 + teamStats.burst * 6) / 2.1)),
    push: Math.min(100, Math.round(teamStats.push * 10)),
    gank: Math.min(100, Math.round((teamStats.gank * 8 + teamStats.mobility * 5 + teamStats.vision * 3) / 1.6)),
    lateGame: calculateLateGameScore(teamPicks, teamCaps),
    coordination: calculateCoordinationScore(teamPicks),
  };
  
  // 总分（加权平均）
  const weights = { lineupBalance: 1.2, teamfight: 1.3, push: 0.8, gank: 0.9, lateGame: 1, coordination: 1.2 };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const overallScore = Math.round(
    (scores.lineupBalance * weights.lineupBalance +
     scores.teamfight * weights.teamfight +
     scores.push * weights.push +
     scores.gank * weights.gank +
     scores.lateGame * weights.lateGame +
     scores.coordination * weights.coordination) / totalWeight
  );
  
  // 分析标签、优势、劣势、建议
  const tags = generateTags(teamStats, scores);
  const strengths = generateStrengths(teamStats, scores, teamPicks);
  const weaknesses = generateWeaknesses(teamStats, scores, teamPicks);
  const suggestions = generateSuggestions(teamStats, scores, opponentStats);
  const keyTimings = generateKeyTimings(scores, teamPicks);
  const counterStrategy = perspective === 'both' ? undefined : generateCounterStrategy(teamStats, opponentStats);
  
  return {
    scores,
    overallScore,
    tags,
    strengths,
    weaknesses,
    suggestions,
    keyTimings,
    counterStrategy,
  };
}

// 计算平衡性分数
function calculateBalanceScore(picks: number[], _stats: Record<string, number>): number {
  // 检查前排/后排平衡
  const frontLine = picks.filter(id => {
    const caps = getHeroCapabilities(id);
    return caps.durable >= 7 || caps.control >= 7;
  }).length;
  
  // 检查物理/法术平衡（通过英雄类型简单判断）
  const physical = picks.filter(id => {
    const hero = heroesData.find(h => h.id === id);
    return hero?.primaryAttr === 'agi';
  }).length;
  
  const balanceScore = 70;
  const frontBonus = frontLine >= 2 ? 15 : (frontLine === 1 ? 5 : -10);
  const physBonus = Math.abs(physical - 2.5) < 1.5 ? 10 : 0;
  
  return Math.min(100, Math.max(0, balanceScore + frontBonus + physBonus));
}

// 计算后期分数
function calculateLateGameScore(picks: number[], caps: HeroCapabilities[]): number {
  const lateBonus = picks.filter(id => [93, 56, 44, 6, 40, 93].includes(id)).length * 15;
  const durable = avg(caps.map(c => c.durable));
  return Math.min(100, Math.round(durable * 5 + lateBonus));
}

// 计算配合分数
function calculateCoordinationScore(picks: number[]): number {
  let comboScore = 50;
  
  // 经典组合检测
  const pickIds = new Set(picks);
  
  // 虚空+马格纳斯
  if (pickIds.has(41) && pickIds.has(54)) comboScore += 15;
  // 小牛+谜团
  if (pickIds.has(31) && pickIds.has(68)) comboScore += 10;
  // 猛犸+PA/剑圣等近战核心
  if (pickIds.has(54) && (pickIds.has(44) || pickIds.has(8))) comboScore += 12;
  // 先知+幽鬼 全球流
  if (pickIds.has(89) && pickIds.has(80)) comboScore += 10;
  // 冰女+任意控制
  if (pickIds.has(22) && picks.some(id => getHeroCapabilities(id).control >= 7)) comboScore += 8;
  // 神谕/戴泽+核心
  if ((pickIds.has(26) || pickIds.has(91)) && picks.some(id => getHeroCapabilities(id).burst >= 8)) comboScore += 10;
  
  return Math.min(100, comboScore);
}

// 辅助函数
function avg(arr: number[]): number {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// 生成标签
function generateTags(stats: Record<string, number>, scores: BPBlankScores): string[] {
  const tags: string[] = [];
  
  if (scores.push >= 70) tags.push('推进阵容');
  if (scores.gank >= 70) tags.push('gank阵容');
  if (scores.lateGame >= 70) tags.push('后期阵容');
  if (scores.teamfight >= 75) tags.push('团战阵容');
  if (stats.control >= 7) tags.push('强控制');
  if (stats.aoe >= 7) tags.push('AOE爆发');
  if (stats.mobility >= 7) tags.push('高机动');
  if (stats.save >= 6) tags.push('救人能力');
  if (scores.push >= 70 && scores.teamfight >= 60) tags.push('死亡推进');
  if (stats.gank >= 7 && (stats.control >= 7 || stats.mobility >= 7)) tags.push('全球流');
  if (scores.lateGame >= 75 && scores.teamfight <= 60) tags.push('四保一');
  
  return tags;
}

// 生成优势
function generateStrengths(stats: Record<string, number>, scores: BPBlankScores, picks: number[]): string[] {
  const strengths: string[] = [];
  
  if (scores.teamfight >= 70) strengths.push('团战能力出色，正面交锋占优');
  if (scores.push >= 70) strengths.push('推进速度快，可快速破路');
  if (scores.gank >= 70) strengths.push('抓人能力强，节奏紧凑');
  if (scores.lateGame >= 70) strengths.push('后期能力强，拖后更优');
  if (stats.control >= 7) strengths.push('控制链充足，开团能力强');
  if (stats.aoe >= 7) strengths.push('AOE伤害充足，团战输出高');
  if (stats.save >= 6) strengths.push('救人能力强，核心生存有保障');
  if (stats.mobility >= 7) strengths.push('机动性高，支援和撤退灵活');
  if (scores.coordination >= 75) strengths.push('英雄配合默契，combo威力大');
  if (picks.filter(id => getHeroCapabilities(id).durable >= 7).length >= 2) {
    strengths.push('前排扎实，可以为后排创造输出环境');
  }
  
  return strengths;
}

// 生成劣势
function generateWeaknesses(stats: Record<string, number>, scores: BPBlankScores, picks: number[]): string[] {
  const weaknesses: string[] = [];
  
  if (scores.teamfight <= 40) weaknesses.push('团战能力弱，避免正面5v5');
  if (scores.push <= 40) weaknesses.push('推塔能力弱，需要人头优势');
  if (scores.gank <= 40) weaknesses.push('抓人能力不足，节奏较慢');
  if (scores.lateGame <= 40) weaknesses.push('后期能力弱，需在前中期结束比赛');
  if (stats.control <= 4) weaknesses.push('缺乏硬控，开团和留人困难');
  if (stats.aoe <= 4) weaknesses.push('AOE不足，面对分身系英雄乏力');
  if (stats.vision <= 3) weaknesses.push('视野能力弱，容易被蹲');
  if (picks.filter(id => getHeroCapabilities(id).durable >= 6).length < 2) {
    weaknesses.push('前排不足，容易被冲脸');
  }
  if (stats.burst <= 4) weaknesses.push('爆发不足，秒人能力差');
  
  return weaknesses;
}

// 生成建议
function generateSuggestions(
  stats: Record<string, number>, 
  scores: BPBlankScores,
  opponentStats: Record<string, number>
): string[] {
  const suggestions: string[] = [];
  
  if (scores.push >= 70) {
    suggestions.push('利用推进优势，抱团快速破塔');
    suggestions.push('控制肉山节奏，利用盾推进');
  }
  if (scores.gank >= 70) {
    suggestions.push('积极游走，打乱对方节奏');
    suggestions.push('做好视野，利用信息差抓人');
  }
  if (scores.lateGame >= 70 && scores.push <= 50) {
    suggestions.push('前期以发育为主，避免不必要的团战');
    suggestions.push('守住高地，等待核心装备成型');
  }
  if (stats.control >= 7) {
    suggestions.push('主动开团，利用控制链打出combo');
  }
  if (scores.teamfight >= 70) {
    suggestions.push('抱团打5v5正面团，避免被单抓');
  }
  if (stats.save >= 6) {
    suggestions.push('注意站位，随时准备救人技能');
  }
  if (scores.gank <= 40 && scores.lateGame <= 50) {
    suggestions.push('需要积极寻找节奏，避免被对方牵着走');
  }
  
  // 根据对手特点的建议
  if (opponentStats.push >= 7) {
    suggestions.push('对方推进强，注意防守，选择清线英雄');
  }
  if (opponentStats.gank >= 7) {
    suggestions.push('对方gank强，小心被抓，保持TP准备');
  }
  
  return suggestions;
}

// 生成关键时间点
function generateKeyTimings(scores: BPBlankScores, picks: number[]): string[] {
  const timings: string[] = [];
  
  // 强势期判断
  if (scores.gank >= 70 && scores.lateGame <= 50) {
    timings.push('5-15分钟：gank强势期，积极游走');
  }
  if (scores.push >= 70) {
    timings.push('15-25分钟：推进强势期，抱团破塔');
    timings.push('肉山刷新后：优先控盾，利用盾推进');
  }
  if (scores.lateGame >= 70) {
    timings.push('35分钟后：后期阵容成型，正面优势');
  }
  if (scores.teamfight >= 70) {
    timings.push('关键技能CD时：避免团战，等待技能');
  }
  
  // 英雄特定时间点
  if (picks.some(id => [40, 88].includes(id))) {
    timings.push('炼金/DP强势期：尽快拔外塔压制');
  }
  if (picks.some(id => [41, 54].includes(id))) {
    timings.push('虚空/猛犸大招CD：180秒，注意开团时机');
  }
  
  return timings;
}

// 生成针对策略（对抗方视角）
function generateCounterStrategy(
  _teamStats: Record<string, number>,
  opponentStats: Record<string, number>
): string[] {
  const strategies: string[] = [];
  
  if (opponentStats.push >= 7) {
    strategies.push('对方推进强，需要选择清线能力强的英雄防守');
    strategies.push('避开对方抱团推进的时间点，选择带线牵制');
  }
  if (opponentStats.gank >= 7) {
    strategies.push('对方gank能力强，做好防御眼，TP随时待命');
    strategies.push('避免单独行动，抱团发育或推进');
  }
  if (opponentStats.control >= 7) {
    strategies.push('对方控制多，选择带BKB或魔免技能');
    strategies.push('注意分散站位，避免被团控combo');
  }
  if (opponentStats.aoe >= 7) {
    strategies.push('对方AOE充足，幻象系英雄会受到克制');
  }
  
  return strategies;
}

// 获取分数颜色
export function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e'; // 绿色 - 优秀
  if (score >= 70) return '#84cc16'; // 浅绿 - 良好
  if (score >= 55) return '#eab308'; // 黄色 - 一般
  if (score >= 40) return '#f97316'; // 橙色 - 较差
  return '#ef4444'; // 红色 - 很差
}

// 获取分数等级
export function getScoreLevel(score: number): string {
  if (score >= 85) return '优秀';
  if (score >= 70) return '良好';
  if (score >= 55) return '一般';
  if (score >= 40) return '较差';
  return '需改进';
}
