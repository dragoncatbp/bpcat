/**
 * 英雄属性数据
 * 用于阵容分析 - 记录每个英雄的关键能力标签
 */

export interface HeroAttributes {
  heroId: number;
  // 控制能力 (晕眩、缠绕、沉默、恐惧等)
  control: number; // 0-10
  // AOE能力 (范围伤害/控制)
  aoe: number; // 0-10
  // 爆发伤害
  burst: number; // 0-10
  // 持续输出
  sustained: number; // 0-10
  // 推进能力
  push: number; // 0-10
  // 生存能力/坦度
  durable: number; // 0-10
  // 逃生/机动性
  mobility: number; // 0-10
  // 治疗/护盾
  heal: number; // 0-10
  // 团战作用
  teamfight: number; // 0-10
  // 对线强度
  laning: number; // 0-10
  // 关键标签
  tags: string[];
}

// 英雄能力属性表 (基于7.40c版本)
export const heroAttributes: HeroAttributes[] = [
  // 力量英雄
  { heroId: 1, control: 0, aoe: 2, burst: 4, sustained: 7, push: 4, durable: 6, mobility: 8, heal: 0, teamfight: 4, laning: 6, tags: ['carry', 'escape', 'mobile'] }, // 敌法师
  { heroId: 2, control: 6, aoe: 6, burst: 5, sustained: 5, push: 3, durable: 7, mobility: 4, heal: 0, teamfight: 6, laning: 7, tags: ['initiator', 'durable', 'disable'] }, // 斧王
  { heroId: 3, control: 9, aoe: 4, burst: 4, sustained: 3, push: 2, durable: 5, mobility: 0, heal: 2, teamfight: 7, laning: 5, tags: ['disabler', 'support', 'nuker'] }, // 祸乱之源
  { heroId: 4, control: 3, aoe: 4, burst: 6, sustained: 6, push: 3, durable: 5, mobility: 6, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'escape', 'durable'] }, // 嗜血狂魔
  { heroId: 5, control: 6, aoe: 7, burst: 4, sustained: 3, push: 4, durable: 3, mobility: 3, heal: 0, teamfight: 7, laning: 6, tags: ['support', 'disabler', 'nuker'] }, // 水晶室女
  { heroId: 6, control: 2, aoe: 2, burst: 4, sustained: 7, push: 6, durable: 3, mobility: 4, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'pusher', 'disabler'] }, // 卓尔游侠
  { heroId: 7, control: 8, aoe: 8, burst: 6, sustained: 3, push: 4, durable: 5, mobility: 4, heal: 0, teamfight: 9, laning: 6, tags: ['initiator', 'disabler', 'nuker'] }, // 撼地者
  { heroId: 8, control: 0, aoe: 4, burst: 6, sustained: 6, push: 4, durable: 5, mobility: 5, heal: 5, teamfight: 6, laning: 7, tags: ['carry', 'pusher', 'healer'] }, // 主宰
  { heroId: 9, control: 4, aoe: 5, burst: 6, sustained: 4, push: 3, durable: 4, mobility: 8, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'escape', 'nuker'] }, // 米拉娜
  { heroId: 10, control: 4, aoe: 4, burst: 7, sustained: 6, push: 4, durable: 5, mobility: 9, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'escape', 'nuker'] }, // 变体精灵
  { heroId: 11, control: 0, aoe: 7, burst: 8, sustained: 5, push: 5, durable: 3, mobility: 0, heal: 0, teamfight: 6, laning: 5, tags: ['carry', 'nuker', 'pusher'] }, // 影魔
  { heroId: 12, control: 2, aoe: 3, burst: 4, sustained: 7, push: 8, durable: 4, mobility: 6, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'escape', 'pusher'] }, // 幻影长矛手
  { heroId: 13, control: 7, aoe: 7, burst: 6, sustained: 4, push: 4, durable: 4, mobility: 8, heal: 0, teamfight: 8, laning: 6, tags: ['initiator', 'disabler', 'escape'] }, // 帕克
  { heroId: 14, control: 4, aoe: 0, burst: 6, sustained: 4, push: 3, durable: 7, mobility: 0, heal: 0, teamfight: 4, laning: 6, tags: ['disabler', 'initiator', 'durable'] }, // 帕吉
  { heroId: 15, control: 0, aoe: 5, burst: 5, sustained: 6, push: 5, durable: 5, mobility: 5, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'durable', 'pusher'] }, // 剃刀
  { heroId: 16, control: 7, aoe: 8, burst: 6, sustained: 3, push: 4, durable: 5, mobility: 6, heal: 0, teamfight: 8, laning: 6, tags: ['initiator', 'disabler', 'nuker'] }, // 沙王
  { heroId: 17, control: 2, aoe: 7, burst: 9, sustained: 5, push: 5, durable: 4, mobility: 9, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'escape', 'nuker'] }, // 风暴之灵
  { heroId: 18, control: 5, aoe: 5, burst: 7, sustained: 5, push: 4, durable: 6, mobility: 5, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'disabler', 'initiator'] }, // 斯温
  { heroId: 19, control: 5, aoe: 7, burst: 8, sustained: 4, push: 6, durable: 7, mobility: 0, heal: 0, teamfight: 8, laning: 6, tags: ['nuker', 'disabler', 'initiator'] }, // 小小
  { heroId: 20, control: 6, aoe: 3, burst: 5, sustained: 3, push: 3, durable: 4, mobility: 8, heal: 0, teamfight: 6, laning: 5, tags: ['support', 'disabler', 'initiator'] }, // 复仇之魂
  { heroId: 21, control: 4, aoe: 5, burst: 6, sustained: 5, push: 4, durable: 4, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'disabler', 'escape'] }, // 风行者
  { heroId: 22, control: 2, aoe: 9, burst: 8, sustained: 5, push: 5, durable: 3, mobility: 3, heal: 0, teamfight: 7, laning: 6, tags: ['nuker', 'carry'] }, // 宙斯
  { heroId: 23, control: 4, aoe: 6, burst: 6, sustained: 4, push: 4, durable: 5, mobility: 0, heal: 0, teamfight: 7, laning: 6, tags: ['initiator', 'disabler', 'nuker'] }, // 昆卡
  { heroId: 25, control: 4, aoe: 8, burst: 8, sustained: 5, push: 5, durable: 4, mobility: 4, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'nuker', 'disabler'] }, // 莉娜
  { heroId: 26, control: 8, aoe: 5, burst: 7, sustained: 3, push: 3, durable: 4, mobility: 0, heal: 0, teamfight: 7, laning: 5, tags: ['support', 'disabler', 'nuker'] }, // 莱恩
  { heroId: 27, control: 5, aoe: 2, burst: 4, sustained: 5, push: 4, durable: 6, mobility: 5, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'durable', 'disabler'] }, // 斯拉达
  { heroId: 28, control: 6, aoe: 8, burst: 5, sustained: 4, push: 4, durable: 8, mobility: 3, heal: 0, teamfight: 9, laning: 7, tags: ['initiator', 'durable', 'disabler'] }, // 潮汐猎人
  { heroId: 30, control: 5, aoe: 6, burst: 5, sustained: 3, push: 4, durable: 4, mobility: 3, heal: 5, teamfight: 7, laning: 6, tags: ['support', 'healer', 'disabler'] }, // 巫医
  { heroId: 31, control: 3, aoe: 5, burst: 5, sustained: 4, push: 6, durable: 5, mobility: 3, heal: 0, teamfight: 6, laning: 6, tags: ['support', 'nuker', 'pusher'] }, // 巫妖
  { heroId: 32, control: 2, aoe: 0, burst: 6, sustained: 5, push: 3, durable: 4, mobility: 9, heal: 0, teamfight: 4, laning: 5, tags: ['carry', 'escape', 'disabler'] }, // 力丸
  { heroId: 33, control: 5, aoe: 6, burst: 5, sustained: 4, push: 5, durable: 5, mobility: 0, heal: 0, teamfight: 8, laning: 5, tags: ['disabler', 'initiator', 'pusher'] }, // 谜团
  { heroId: 34, control: 2, aoe: 8, burst: 7, sustained: 6, push: 7, durable: 4, mobility: 4, heal: 0, teamfight: 7, laning: 6, tags: ['nuker', 'pusher'] }, // 修补匠
  { heroId: 35, control: 3, aoe: 3, burst: 5, sustained: 6, push: 5, durable: 3, mobility: 3, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'nuker'] }, // 狙击手
  { heroId: 36, control: 2, aoe: 5, burst: 5, sustained: 5, push: 5, durable: 5, mobility: 4, heal: 6, teamfight: 6, laning: 6, tags: ['nuker', 'durable', 'disabler'] }, // 死灵法师
  { heroId: 37, control: 3, aoe: 5, burst: 5, sustained: 4, push: 4, durable: 5, mobility: 3, heal: 3, teamfight: 7, laning: 5, tags: ['support', 'healer', 'initiator'] }, // 术士
  { heroId: 38, control: 5, aoe: 4, burst: 4, sustained: 5, push: 4, durable: 5, mobility: 3, heal: 0, teamfight: 6, laning: 6, tags: ['initiator', 'disabler', 'durable'] }, // 兽王
  { heroId: 39, control: 3, aoe: 7, burst: 8, sustained: 6, push: 4, durable: 4, mobility: 8, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'nuker', 'escape'] }, // 痛苦女王
  { heroId: 40, control: 3, aoe: 7, burst: 5, sustained: 5, push: 6, durable: 5, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['support', 'nuker', 'pusher'] }, // 剧毒术士
  { heroId: 41, control: 5, aoe: 5, burst: 5, sustained: 6, push: 4, durable: 5, mobility: 5, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'initiator', 'disabler'] }, // 虚空假面
  { heroId: 42, control: 4, aoe: 0, burst: 4, sustained: 6, push: 6, durable: 7, mobility: 3, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'durable', 'pusher'] }, // 冥魂大帝
  { heroId: 43, control: 4, aoe: 7, burst: 6, sustained: 6, push: 8, durable: 5, mobility: 5, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'pusher', 'nuker'] }, // 死亡先知
  { heroId: 44, control: 0, aoe: 0, burst: 7, sustained: 7, push: 4, durable: 4, mobility: 8, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'escape'] }, // 幻影刺客
  { heroId: 45, control: 0, aoe: 5, burst: 7, sustained: 5, push: 7, durable: 4, mobility: 4, heal: 2, teamfight: 5, laning: 6, tags: ['nuker', 'pusher'] }, // 帕格纳
  { heroId: 46, control: 0, aoe: 0, burst: 8, sustained: 6, push: 4, durable: 4, mobility: 6, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'escape'] }, // 圣堂刺客
  { heroId: 47, control: 4, aoe: 4, burst: 5, sustained: 6, push: 5, durable: 7, mobility: 4, heal: 0, teamfight: 5, laning: 7, tags: ['carry', 'durable'] }, // 冥界亚龙
  { heroId: 48, control: 3, aoe: 5, burst: 6, sustained: 6, push: 6, durable: 4, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'nuker', 'pusher'] }, // 露娜
  { heroId: 49, control: 5, aoe: 5, burst: 5, sustained: 5, push: 5, durable: 6, mobility: 4, heal: 0, teamfight: 6, laning: 7, tags: ['carry', 'durable', 'disabler'] }, // 龙骑士
  { heroId: 50, control: 5, aoe: 5, burst: 4, sustained: 4, push: 4, durable: 4, mobility: 4, heal: 5, teamfight: 6, laning: 5, tags: ['support', 'healer', 'disabler'] }, // 戴泽
  { heroId: 51, control: 7, aoe: 4, burst: 5, sustained: 4, push: 4, durable: 6, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['initiator', 'disabler', 'durable'] }, // 发条技师
  { heroId: 52, control: 4, aoe: 9, burst: 7, sustained: 7, push: 7, durable: 5, mobility: 5, heal: 0, teamfight: 8, laning: 6, tags: ['nuker', 'pusher', 'carry'] }, // 拉席克
  { heroId: 53, control: 4, aoe: 4, burst: 5, sustained: 5, push: 8, durable: 4, mobility: 8, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'pusher', 'escape'] }, // 先知
  { heroId: 54, control: 4, aoe: 0, burst: 5, sustained: 6, push: 4, durable: 6, mobility: 5, heal: 5, teamfight: 5, laning: 6, tags: ['carry', 'durable', 'disabler'] }, // 噬魂鬼
  { heroId: 55, control: 4, aoe: 5, burst: 4, sustained: 4, push: 5, durable: 6, mobility: 6, heal: 2, teamfight: 6, laning: 6, tags: ['initiator', 'durable'] }, // 黑暗贤者
  { heroId: 56, control: 0, aoe: 4, burst: 6, sustained: 7, push: 6, durable: 4, mobility: 8, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'escape', 'pusher'] }, // 克林克兹
  { heroId: 57, control: 4, aoe: 0, burst: 4, sustained: 4, push: 4, durable: 7, mobility: 3, heal: 5, teamfight: 5, laning: 6, tags: ['support', 'healer', 'durable'] }, // 全能骑士
  { heroId: 58, control: 3, aoe: 0, burst: 5, sustained: 5, push: 4, durable: 4, mobility: 5, heal: 5, teamfight: 5, laning: 6, tags: ['support', 'healer', 'jungler'] }, // 魅惑魔女
  { heroId: 59, control: 0, aoe: 0, burst: 7, sustained: 6, push: 4, durable: 4, mobility: 4, heal: 3, teamfight: 5, laning: 6, tags: ['carry', 'durable'] }, // 哈斯卡
  { heroId: 60, control: 4, aoe: 4, burst: 5, sustained: 5, push: 4, durable: 6, mobility: 6, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'durable', 'initiator'] }, // 暗夜魔王
  { heroId: 61, control: 4, aoe: 3, burst: 5, sustained: 6, push: 7, durable: 5, mobility: 9, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'pusher', 'escape'] }, // 育母蜘蛛
  { heroId: 62, control: 2, aoe: 4, burst: 5, sustained: 5, push: 4, durable: 4, mobility: 7, heal: 0, teamfight: 5, laning: 6, tags: ['escape', 'nuker'] }, // 赏金猎人
  { heroId: 63, control: 0, aoe: 0, burst: 5, sustained: 6, push: 6, durable: 4, mobility: 7, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'escape', 'pusher'] }, // 编织者
  { heroId: 64, control: 5, aoe: 8, burst: 6, sustained: 5, push: 6, durable: 5, mobility: 4, heal: 0, teamfight: 7, laning: 6, tags: ['support', 'nuker', 'pusher'] }, // 杰奇洛
  { heroId: 65, control: 6, aoe: 6, burst: 5, sustained: 4, push: 4, durable: 5, mobility: 6, heal: 0, teamfight: 7, laning: 6, tags: ['initiator', 'disabler', 'escape'] }, // 蝙蝠骑士
  { heroId: 66, control: 4, aoe: 0, burst: 3, sustained: 3, push: 5, durable: 4, mobility: 5, heal: 6, teamfight: 5, laning: 6, tags: ['support', 'healer', 'pusher'] }, // 陈
  { heroId: 67, control: 0, aoe: 0, burst: 5, sustained: 7, push: 6, durable: 6, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'durable'] }, // 幽鬼
  { heroId: 68, control: 4, aoe: 5, burst: 6, sustained: 4, push: 4, durable: 4, mobility: 3, heal: 0, teamfight: 6, laning: 5, tags: ['support', 'disabler'] }, // 远古冰魄
  { heroId: 69, control: 6, aoe: 5, burst: 5, sustained: 5, push: 4, durable: 7, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'durable', 'disabler'] }, // 末日使者
  { heroId: 70, control: 4, aoe: 0, burst: 6, sustained: 7, push: 4, durable: 5, mobility: 6, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'durable', 'disabler'] }, // 熊战士
  { heroId: 71, control: 6, aoe: 4, burst: 5, sustained: 4, push: 4, durable: 6, mobility: 8, heal: 0, teamfight: 6, laning: 5, tags: ['carry', 'initiator', 'disabler'] }, // 裂魂人
  { heroId: 72, control: 2, aoe: 8, burst: 7, sustained: 6, push: 5, durable: 4, mobility: 4, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'nuker', 'disabler'] }, // 矮人直升机
  { heroId: 73, control: 4, aoe: 4, burst: 5, sustained: 6, push: 5, durable: 6, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'durable', 'disabler'] }, // 炼金术士
  { heroId: 74, control: 0, aoe: 8, burst: 7, sustained: 6, push: 5, durable: 4, mobility: 4, heal: 0, teamfight: 6, laning: 5, tags: ['carry', 'nuker', 'pusher'] }, // 祈求者
  { heroId: 75, control: 6, aoe: 6, burst: 5, sustained: 4, push: 4, durable: 4, mobility: 3, heal: 0, teamfight: 6, laning: 5, tags: ['support', 'disabler', 'initiator'] }, // 沉默术士
  { heroId: 76, control: 3, aoe: 5, burst: 7, sustained: 6, push: 4, durable: 5, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'nuker', 'disabler'] }, // 殁境神蚀者
  { heroId: 77, control: 0, aoe: 0, burst: 5, sustained: 6, push: 8, durable: 5, mobility: 6, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'pusher', 'durable'] }, // 狼人
  { heroId: 78, control: 5, aoe: 5, burst: 5, sustained: 5, push: 4, durable: 6, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'initiator', 'durable'] }, // 酒仙
  { heroId: 79, control: 6, aoe: 5, burst: 5, sustained: 3, push: 4, durable: 4, mobility: 3, heal: 0, teamfight: 6, laning: 5, tags: ['support', 'disabler'] }, // 暗影恶魔
  { heroId: 80, control: 4, aoe: 0, burst: 5, sustained: 6, push: 7, durable: 5, mobility: 5, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'pusher', 'durable'] }, // 德鲁伊
  { heroId: 81, control: 6, aoe: 4, burst: 6, sustained: 5, push: 5, durable: 6, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'disabler', 'initiator'] }, // 混沌骑士
  { heroId: 82, control: 4, aoe: 5, burst: 6, sustained: 6, push: 6, durable: 5, mobility: 8, heal: 0, teamfight: 6, laning: 7, tags: ['carry', 'escape', 'nuker'] }, // 米波
  { heroId: 83, control: 4, aoe: 0, burst: 4, sustained: 4, push: 5, durable: 8, mobility: 3, heal: 5, teamfight: 6, laning: 5, tags: ['support', 'durable', 'disabler'] }, // 树精卫士
  { heroId: 84, control: 5, aoe: 5, burst: 5, sustained: 4, push: 4, durable: 7, mobility: 3, heal: 3, teamfight: 6, laning: 6, tags: ['support', 'durable', 'nuker'] }, // 食人魔魔法师
  { heroId: 85, control: 5, aoe: 5, burst: 4, sustained: 4, push: 5, durable: 7, mobility: 3, heal: 0, teamfight: 6, laning: 6, tags: ['support', 'durable', 'disabler'] }, // 不朽尸王
  { heroId: 86, control: 5, aoe: 6, burst: 5, sustained: 4, push: 4, durable: 4, mobility: 4, heal: 0, teamfight: 7, laning: 5, tags: ['support', 'disabler', 'nuker'] }, // 拉比克
  { heroId: 87, control: 7, aoe: 6, burst: 5, sustained: 3, push: 4, durable: 4, mobility: 4, heal: 0, teamfight: 7, laning: 5, tags: ['support', 'disabler', 'nuker'] }, // 干扰者
  { heroId: 88, control: 6, aoe: 4, burst: 6, sustained: 4, push: 4, durable: 5, mobility: 6, heal: 0, teamfight: 6, laning: 5, tags: ['disabler', 'nuker', 'escape'] }, // 司夜刺客
  { heroId: 89, control: 6, aoe: 0, burst: 5, sustained: 6, push: 6, durable: 5, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'pusher', 'disabler'] }, // 娜迦海妖
  { heroId: 90, control: 3, aoe: 5, burst: 4, sustained: 4, push: 5, durable: 4, mobility: 4, heal: 6, teamfight: 5, laning: 5, tags: ['support', 'healer', 'pusher'] }, // 光之守卫
  { heroId: 91, control: 0, aoe: 0, burst: 4, sustained: 4, push: 4, durable: 5, mobility: 9, heal: 5, teamfight: 5, laning: 5, tags: ['support', 'escape', 'healer'] }, // 艾欧
  { heroId: 92, control: 4, aoe: 0, burst: 6, sustained: 5, push: 5, durable: 5, mobility: 5, heal: 0, teamfight: 5, laning: 6, tags: ['nuker', 'pusher'] }, // 维萨吉
  { heroId: 93, control: 3, aoe: 3, burst: 6, sustained: 6, push: 4, durable: 5, mobility: 9, heal: 3, teamfight: 5, laning: 6, tags: ['carry', 'escape', 'disabler'] }, // 斯拉克
  { heroId: 94, control: 6, aoe: 0, burst: 5, sustained: 6, push: 4, durable: 6, mobility: 4, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'durable', 'disabler'] }, // 美杜莎
  { heroId: 95, control: 4, aoe: 0, burst: 6, sustained: 7, push: 6, durable: 5, mobility: 4, heal: 0, teamfight: 5, laning: 6, tags: ['carry', 'pusher'] }, // 巨魔战将
  { heroId: 96, control: 5, aoe: 5, burst: 5, sustained: 4, push: 4, durable: 7, mobility: 6, heal: 0, teamfight: 7, laning: 6, tags: ['durable', 'initiator', 'disabler'] }, // 半人马战行者
  { heroId: 97, control: 6, aoe: 7, burst: 6, sustained: 4, push: 4, durable: 6, mobility: 4, heal: 0, teamfight: 9, laning: 6, tags: ['initiator', 'disabler', 'nuker'] }, // 马格纳斯
  { heroId: 98, control: 2, aoe: 6, burst: 6, sustained: 6, push: 5, durable: 6, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['nuker', 'durable'] }, // 伐木机
  { heroId: 99, control: 2, aoe: 5, burst: 5, sustained: 7, push: 5, durable: 8, mobility: 3, heal: 0, teamfight: 6, laning: 7, tags: ['carry', 'durable', 'initiator'] }, // 钢背兽
  { heroId: 100, control: 6, aoe: 5, burst: 5, sustained: 4, push: 4, durable: 6, mobility: 7, heal: 0, teamfight: 6, laning: 6, tags: ['initiator', 'disabler', 'escape'] }, // 巨牙海民
  { heroId: 101, control: 5, aoe: 7, burst: 8, sustained: 4, push: 4, durable: 3, mobility: 3, heal: 0, teamfight: 7, laning: 5, tags: ['support', 'nuker', 'disabler'] }, // 天怒法师
  { heroId: 102, control: 4, aoe: 0, burst: 4, sustained: 5, push: 5, durable: 6, mobility: 5, heal: 5, teamfight: 5, laning: 6, tags: ['support', 'healer', 'durable'] }, // 亚巴顿
  { heroId: 103, control: 6, aoe: 6, burst: 5, sustained: 4, push: 4, durable: 6, mobility: 4, heal: 0, teamfight: 7, laning: 5, tags: ['initiator', 'disabler', 'nuker'] }, // 上古巨神
  { heroId: 104, control: 6, aoe: 4, burst: 5, sustained: 5, push: 4, durable: 6, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'durable', 'disabler'] }, // 军团指挥官
  { heroId: 105, control: 4, aoe: 9, burst: 9, sustained: 3, push: 5, durable: 3, mobility: 3, heal: 0, teamfight: 8, laning: 5, tags: ['nuker', 'disabler'] }, // 工程师
  { heroId: 106, control: 4, aoe: 7, burst: 8, sustained: 5, push: 5, durable: 4, mobility: 9, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'escape', 'nuker'] }, // 灰烬之灵
  { heroId: 107, control: 6, aoe: 6, burst: 6, sustained: 4, push: 4, durable: 6, mobility: 6, heal: 0, teamfight: 7, laning: 6, tags: ['initiator', 'disabler', 'nuker'] }, // 大地之灵
  { heroId: 108, control: 4, aoe: 5, burst: 5, sustained: 5, push: 7, durable: 7, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['durable', 'pusher', 'nuker'] }, // 孽主
  { heroId: 109, control: 2, aoe: 3, burst: 6, sustained: 7, push: 7, durable: 5, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'pusher', 'nuker'] }, // 恐怖利刃
  { heroId: 110, control: 4, aoe: 7, burst: 5, sustained: 4, push: 4, durable: 5, mobility: 7, heal: 4, teamfight: 7, laning: 5, tags: ['support', 'nuker', 'disabler'] }, // 凤凰
  { heroId: 111, control: 5, aoe: 4, burst: 5, sustained: 3, push: 4, durable: 4, mobility: 4, heal: 6, teamfight: 6, laning: 5, tags: ['support', 'healer', 'disabler'] }, // 神谕者
  { heroId: 112, control: 5, aoe: 6, burst: 5, sustained: 3, push: 4, durable: 4, mobility: 4, heal: 5, teamfight: 6, laning: 5, tags: ['support', 'healer', 'disabler'] }, // 寒冬飞龙
  { heroId: 113, control: 5, aoe: 4, burst: 6, sustained: 5, push: 5, durable: 5, mobility: 4, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'escape', 'nuker'] }, // 天穹守望者
  { heroId: 114, control: 5, aoe: 5, burst: 5, sustained: 5, push: 4, durable: 5, mobility: 9, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'escape', 'initiator'] }, // 齐天大圣
  { heroId: 119, control: 6, aoe: 5, burst: 6, sustained: 4, push: 4, durable: 4, mobility: 7, heal: 0, teamfight: 7, laning: 6, tags: ['support', 'disabler', 'escape'] }, // 邪影芳灵
  { heroId: 120, control: 6, aoe: 5, burst: 5, sustained: 5, push: 4, durable: 6, mobility: 8, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'initiator', 'escape'] }, // 石鳞剑士
  { heroId: 121, control: 5, aoe: 6, burst: 5, sustained: 4, push: 4, durable: 4, mobility: 4, heal: 0, teamfight: 6, laning: 5, tags: ['support', 'nuker', 'disabler'] }, // 天涯墨客
  { heroId: 123, control: 5, aoe: 5, burst: 6, sustained: 5, push: 4, durable: 4, mobility: 6, heal: 0, teamfight: 6, laning: 6, tags: ['support', 'nuker', 'escape'] }, // 森海飞霞
  { heroId: 126, control: 5, aoe: 7, burst: 7, sustained: 5, push: 5, durable: 4, mobility: 8, heal: 0, teamfight: 7, laning: 6, tags: ['carry', 'escape', 'nuker'] }, // 虚无之灵
  { heroId: 128, control: 5, aoe: 7, burst: 7, sustained: 5, push: 5, durable: 5, mobility: 4, heal: 0, teamfight: 7, laning: 6, tags: ['support', 'nuker', 'disabler'] }, // 电炎绝手
  { heroId: 129, control: 7, aoe: 5, burst: 5, sustained: 4, push: 4, durable: 7, mobility: 5, heal: 0, teamfight: 7, laning: 6, tags: ['initiator', 'disabler', 'durable'] }, // 玛尔斯
  { heroId: 135, control: 6, aoe: 6, burst: 5, sustained: 5, push: 5, durable: 6, mobility: 4, heal: 3, teamfight: 7, laning: 6, tags: ['support', 'disabler', 'healer'] }, // 百戏大王
  { heroId: 136, control: 6, aoe: 5, burst: 5, sustained: 5, push: 4, durable: 6, mobility: 5, heal: 2, teamfight: 7, laning: 6, tags: ['initiator', 'disabler', 'durable'] }, // 破晓辰星
  { heroId: 137, control: 7, aoe: 4, burst: 6, sustained: 5, push: 4, durable: 5, mobility: 8, heal: 0, teamfight: 7, laning: 6, tags: ['support', 'initiator', 'disabler'] }, // 玛西
  { heroId: 138, control: 7, aoe: 6, burst: 6, sustained: 5, push: 4, durable: 7, mobility: 4, heal: 0, teamfight: 8, laning: 6, tags: ['initiator', 'disabler', 'durable'] }, // 獸
  { heroId: 141, control: 4, aoe: 6, burst: 7, sustained: 6, push: 5, durable: 4, mobility: 5, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'nuker', 'disabler'] }, // 琼英碧灵
  { heroId: 145, control: 5, aoe: 5, burst: 6, sustained: 6, push: 5, durable: 5, mobility: 7, heal: 0, teamfight: 6, laning: 6, tags: ['carry', 'escape', 'nuker'] }, // 凯
  { heroId: 147, control: 4, aoe: 5, burst: 5, sustained: 5, push: 5, durable: 4, mobility: 5, heal: 3, teamfight: 5, laning: 6, tags: ['support', 'nuker', 'healer'] }, // 劳戈
];

// 获取英雄属性
export function getHeroAttributes(heroId: number): HeroAttributes | undefined {
  return heroAttributes.find(attr => attr.heroId === heroId);
}

// 计算阵容分析
export function analyzeTeam(heroIds: number[]) {
  const attrs = heroIds.map(id => getHeroAttributes(id)).filter(Boolean) as HeroAttributes[];
  
  if (attrs.length === 0) {
    return {
      totalControl: 0,
      totalAoe: 0,
      totalBurst: 0,
      totalSustained: 0,
      totalPush: 0,
      totalDurable: 0,
      totalMobility: 0,
      totalHeal: 0,
      totalTeamfight: 0,
      averageLaning: 0,
      weaknesses: [] as string[],
      strengths: [] as string[],
      tags: [] as string[],
    };
  }
  
  const sum = (key: keyof HeroAttributes) => attrs.reduce((acc, a) => acc + (a[key] as number), 0);
  
  const result = {
    totalControl: sum('control'),
    totalAoe: sum('aoe'),
    totalBurst: sum('burst'),
    totalSustained: sum('sustained'),
    totalPush: sum('push'),
    totalDurable: sum('durable'),
    totalMobility: sum('mobility'),
    totalHeal: sum('heal'),
    totalTeamfight: sum('teamfight'),
    averageLaning: sum('laning') / attrs.length,
    weaknesses: [] as string[],
    strengths: [] as string[],
    tags: [...new Set(attrs.flatMap(a => a.tags))],
  };
  
  // 分析弱点（基于5人阵容的理想值）
  const ideal = {
    control: 20,     // 4/hero
    aoe: 20,
    durable: 25,     // 需要前排
    heal: 8,         // 至少有点恢复
    push: 15,
  };
  
  if (result.totalControl < ideal.control) result.weaknesses.push('缺乏控制');
  if (result.totalAoe < ideal.aoe) result.weaknesses.push('缺乏AOE');
  if (result.totalDurable < ideal.durable) result.weaknesses.push('缺乏前排/坦度');
  if (result.totalHeal < ideal.heal) result.weaknesses.push('缺乏治疗/回复');
  if (result.totalPush < ideal.push) result.weaknesses.push('推进能力弱');
  if (result.totalMobility < 20) result.weaknesses.push('机动性不足');
  
  // 分析优点
  if (result.totalControl > 28) result.strengths.push('控制充足');
  if (result.totalAoe > 30) result.strengths.push('AOE强力');
  if (result.totalBurst > 30) result.strengths.push('爆发极高');
  if (result.totalDurable > 30) result.strengths.push('前排扎实');
  if (result.totalTeamfight > 35) result.strengths.push('团战强势');
  
  return result;
}
