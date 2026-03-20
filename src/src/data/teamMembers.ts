/**
 * 念爱杯队员数据
 * 记录各成员的擅长英雄、位置偏好等信息
 */

export type Position = 1 | 2 | 3 | 4 | 5; // 1=Carry, 2=Mid, 3=Offlane, 4=SoftSupport, 5=HardSupport

export interface TeamMember {
  id: string;
  nickname: string;      // 游戏昵称
  name?: string;         // 真实姓名（可选）
  positions: Position[]; // 擅长位置
  signatureHeroes: number[]; // 招牌英雄ID列表
  goodHeroes: number[];  // 熟练英雄
  avoidHeroes: number[]; // 尽量避免的英雄
  playstyle?: string;    // 打法风格描述
  notes?: string;        // 备注
}

// 念爱杯队员数据（示例数据，可根据实际情况修改）
export const teamMembers: TeamMember[] = [
  {
    id: "player1",
    nickname: "念爱一号",
    positions: [1, 2],
    signatureHeroes: [44, 10, 1], // PA, 水人, 敌法
    goodHeroes: [6, 48, 93, 8, 11, 72],
    avoidHeroes: [82, 81], // 米波, CK
    playstyle: "刷核型，喜欢刷钱后期接管比赛",
    notes: "需要辅助保，抗压能力一般",
  },
  {
    id: "player2",
    nickname: "念爱二号",
    positions: [2],
    signatureHeroes: [17, 74, 106, 13], // 蓝猫, 卡尔, 火猫, 帕克
    goodHeroes: [11, 25, 126, 76, 22, 34],
    avoidHeroes: [59, 82], // 哈斯卡, 米波
    playstyle: "节奏型中单，喜欢游走带节奏",
    notes: "对线能力较强，需要队友配合gank",
  },
  {
    id: "player3",
    nickname: "念爱三号",
    positions: [3],
    signatureHeroes: [2, 28, 97, 96], // 斧王, 潮汐, 马格纳斯, 人马
    goodHeroes: [69, 104, 99, 51, 78, 107],
    avoidHeroes: [61, 12], // 蜘蛛, 猴子
    playstyle: "先手型三号位，喜欢开团",
    notes: "声音大，指挥欲望强",
  },
  {
    id: "player4",
    nickname: "念爱四号",
    positions: [4, 3],
    signatureHeroes: [7, 100, 65, 119], // 撼地者, 海民, 蝙蝠, 花仙子
    goodHeroes: [16, 103, 137, 64, 86, 88],
    avoidHeroes: [66], // 陈
    playstyle: "游走型四号位，喜欢帮中",
    notes: "眼位做的一般，需要提醒",
  },
  {
    id: "player5",
    nickname: "念爱五号",
    positions: [5, 4],
    signatureHeroes: [111, 112, 75, 87], // 神谕, 冰龙, 沉默, 干扰者
    goodHeroes: [3, 50, 30, 5, 85, 121],
    avoidHeroes: [66, 90], // 陈, 光法
    playstyle: "保人型五号位，擅长反手救人",
    notes: "对线保人稳定，团战意识好",
  },
  {
    id: "player6",
    nickname: "念爱替补",
    positions: [1, 2, 3],
    signatureHeroes: [42, 67, 49], // 骷髅王, 幽鬼, 龙骑士
    goodHeroes: [8, 18, 94, 41, 95],
    avoidHeroes: [10, 44, 17], // 水人, PA, 蓝猫
    playstyle: "稳健型，打法偏保守",
    notes: "全能补位，但都不精通",
  },
];

// 位置名称映射
export const positionNames: Record<Position, string> = {
  1: '一号位 (Carry)',
  2: '二号位 (Mid)',
  3: '三号位 (Offlane)',
  4: '四号位 (Soft Support)',
  5: '五号位 (Hard Support)',
};

// 获取队员擅长的英雄
export function getMemberSignatureHeroes(memberId: string): number[] {
  const member = teamMembers.find(m => m.id === memberId);
  return member?.signatureHeroes || [];
}

// 获取会玩某英雄的队员
export function getMembersByHero(heroId: number): TeamMember[] {
  return teamMembers.filter(m => 
    m.signatureHeroes.includes(heroId) || m.goodHeroes.includes(heroId)
  );
}

// 获取某位置的队员
export function getMembersByPosition(position: Position): TeamMember[] {
  return teamMembers.filter(m => m.positions.includes(position));
}

// 检查某英雄是否适合某队员
export function isHeroGoodForMember(heroId: number, memberId: string): {
  suitable: boolean;
  level: 'signature' | 'good' | 'avoid' | 'neutral';
} {
  const member = teamMembers.find(m => m.id === memberId);
  if (!member) return { suitable: false, level: 'neutral' };
  
  if (member.signatureHeroes.includes(heroId)) {
    return { suitable: true, level: 'signature' };
  }
  if (member.goodHeroes.includes(heroId)) {
    return { suitable: true, level: 'good' };
  }
  if (member.avoidHeroes.includes(heroId)) {
    return { suitable: false, level: 'avoid' };
  }
  return { suitable: true, level: 'neutral' };
}

// 获取队员信息
export function getMemberInfo(memberId: string): TeamMember | undefined {
  return teamMembers.find(m => m.id === memberId);
}
