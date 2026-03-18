import type { BPDraft } from './index';
import type { BPBlankEvaluation } from '@/utils/bpEvaluation';

// BP历史记录
export interface BPHistoryRecord {
  id: string;
  matchName: string;
  createdAt: string;
  updatedAt: string;
  draft: BPDraft;
  tags?: string[];
  matchResult?: {
    winner: 'radiant' | 'dire' | null;
    radiantScore?: number;
    direScore?: number;
    duration?: number;
  };
  evaluation?: BPBlankEvaluation;
  notes?: string;
}

// BP模板（预设阵容）
export interface BPBlankTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  radiantPicks: number[];
  direPicks: number[];
  radiantBans: number[];
  direBans: number[];
}

// 常用套路库
export const COMMON_BLANK_STRATEGIES: BPBlankTemplate[] = [
  {
    id: 'deathball',
    name: '死亡推进流',
    description: '以推进能力强的英雄为核心，快速破路结束比赛',
    tags: ['推进', '快节奏', '团战'],
    radiantPicks: [9, 88, 75, 86, 40], // 火女 德鲁伊 DP 剧毒 炼金
    direPicks: [],
    radiantBans: [89, 90, 48], // 炼金 先知 狼人
    direBans: [],
  },
  {
    id: 'turtledota',
    name: '高地防守流',
    description: '以守塔能力强的英雄拖后期',
    tags: ['防守', '后期', '膀胱'],
    radiantPicks: [74, 93, 60, 51, 22], // 蓝猫 Medusa 瘟疫术士 龙骑 冰女
    direPicks: [],
    radiantBans: [],
    direBans: [],
  },
  {
    id: 'pickyourself',
    name: '四保一',
    description: '四个工具人保一个超级核心',
    tags: ['核心', '后期', '保护'],
    radiantPicks: [52, 27, 93, 41, 6], // 神牛 大鱼 Medusa 虚空 冰魂
    direPicks: [],
    radiantBans: [],
    direBans: [],
  },
  {
    id: 'fightdota',
    name: '全球流',
    description: '利用全屏技能抓人',
    tags: ['gank', '全屏', '快节奏'],
    radiantPicks: [89, 80, 79, 53, 88], // 先知 幽鬼 Zeus 发条 DP
    direPicks: [],
    radiantBans: [],
    direBans: [],
  },
  {
    id: 'aoecombo',
    name: 'AOE爆发流',
    description: '团控+AOE爆发打出完美团',
    tags: ['团战', '控制', '爆发'],
    radiantPicks: [41, 22, 44, 54, 97], // 虚空 冰女 PA 马格纳斯 血魔
    direPicks: [],
    radiantBans: [],
    direBans: [],
  },
];

// 本地存储键
const STORAGE_KEY = 'bpcat_bp_history';
const TEMPLATES_STORAGE_KEY = 'bpcat_bp_templates';

// 生成唯一ID
export function generateBPHistoryId(): string {
  return `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 加载历史记录
export function loadBPHistoryFromStorage(): BPHistoryRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load BP history:', e);
  }
  return [];
}

// 保存历史记录
export function saveBPHistoryToStorage(records: BPHistoryRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save BP history:', e);
  }
}

// 添加历史记录
export function addBPHistoryRecord(record: Omit<BPHistoryRecord, 'id' | 'createdAt' | 'updatedAt'>): BPHistoryRecord {
  const newRecord: BPHistoryRecord = {
    ...record,
    id: generateBPHistoryId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const records = loadBPHistoryFromStorage();
  records.unshift(newRecord);
  
  // 限制最多保存50条
  if (records.length > 50) {
    records.pop();
  }
  
  saveBPHistoryToStorage(records);
  return newRecord;
}

// 删除历史记录
export function deleteBPHistoryRecord(id: string): boolean {
  const records = loadBPHistoryFromStorage();
  const newRecords = records.filter(r => r.id !== id);
  
  if (newRecords.length !== records.length) {
    saveBPHistoryToStorage(newRecords);
    return true;
  }
  return false;
}

// 更新历史记录
export function updateBPHistoryRecord(id: string, updates: Partial<BPHistoryRecord>): BPHistoryRecord | null {
  const records = loadBPHistoryFromStorage();
  const index = records.findIndex(r => r.id === id);
  
  if (index !== -1) {
    records[index] = {
      ...records[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveBPHistoryToStorage(records);
    return records[index];
  }
  return null;
}

// 加载自定义模板
export function loadBPTemplates(): BPBlankTemplate[] {
  try {
    const data = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (data) {
      return [...COMMON_BLANK_STRATEGIES, ...JSON.parse(data)];
    }
  } catch (e) {
    console.error('Failed to load BP templates:', e);
  }
  return COMMON_BLANK_STRATEGIES;
}

// 保存自定义模板
export function saveBPTemplate(template: Omit<BPBlankTemplate, 'id'>): BPBlankTemplate {
  const newTemplate: BPBlankTemplate = {
    ...template,
    id: `template_${Date.now()}`,
  };
  
  const customTemplates = loadCustomBPTemplates();
  customTemplates.push(newTemplate);
  
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(customTemplates));
  } catch (e) {
    console.error('Failed to save BP template:', e);
  }
  
  return newTemplate;
}

// 加载仅自定义模板
function loadCustomBPTemplates(): BPBlankTemplate[] {
  try {
    const data = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load custom BP templates:', e);
  }
  return [];
}

// 删除模板
export function deleteBPTemplate(id: string): boolean {
  if (id.startsWith('template_')) {
    const customTemplates = loadCustomBPTemplates();
    const newTemplates = customTemplates.filter(t => t.id !== id);
    
    if (newTemplates.length !== customTemplates.length) {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(newTemplates));
      return true;
    }
  }
  return false;
}
