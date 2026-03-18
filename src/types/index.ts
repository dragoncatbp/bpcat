// ===== 英雄相关类型 =====

export interface Hero {
  id: number;
  name: string;           // 英文代码名，如 "antimage"
  localizedName: string;  // 中文名，如 "敌法师"
  primaryAttr: 'str' | 'agi' | 'int' | 'all';
  attackType: 'Melee' | 'Ranged';
  roles: HeroRole[];
  image: string;          // 头像URL或本地路径
  icon: string;           // 小图标
}

export type HeroRole = 
  | 'Carry' | 'Support' | 'Nuker' | 'Disabler' | 'Jungler'
  | 'Durable' | 'Escape' | 'Pusher' | 'Initiator';

// ===== BP相关类型 =====

export type Team = 'radiant' | 'dire';
export type PhaseType = 'ban' | 'pick';

export interface BPStep {
  id: number;
  team: Team;
  type: PhaseType;
  heroId: number | null;  // 选择的英雄ID，null表示未选择
  timestamp?: number;
}

export interface BPDraft {
  id: string;
  radiantBans: number[];
  direBans: number[];
  radiantPicks: number[];
  direPicks: number[];
  currentStep: number;
  isFirstPickRadiant: boolean;
  steps: BPStep[];
}

// ===== 统计数据类型 =====

export interface HeroStats {
  heroId: number;
  winRate: number;        // 胜率 0-100
  pickRate: number;       // 选取率
  banRate: number;        // 禁用率
  matches: number;        // 样本场次
}

export interface HeroCounter {
  heroId: number;
  counterHeroId: number;
  advantage: number;      // 克制优势值，正数表示counter有效
  winRateDiff: number;    // 胜率差
}

// ===== 组件Props类型 =====

export interface HeroGridProps {
  heroes: Hero[];
  bannedHeroes: number[];
  pickedHeroes: number[];
  onSelect: (heroId: number) => void;
  selectableHeroes?: number[];
}

export interface BPPanelProps {
  draft: BPDraft;
  currentTeam: Team;
  onAction: (heroId: number) => void;
}
