/**
 * 队伍管理系统类型定义
 */

export type Position = 1 | 2 | 3 | 4 | 5;

export interface Player {
  id: string;
  name: string;           // 队员昵称
  steamId?: string;       // Steam ID (数字ID或SteamID64)
  steamId64?: string;     // SteamID64 (17位数字)
  position: Position[];   // 擅长位置
  signatureHeroes: number[];  // 招牌英雄ID列表
  goodHeroes: number[];   // 熟练英雄
  avoidHeroes: number[];  // 避免英雄
  avatar?: string;        // Steam头像URL
  playstyle?: string;     // 打法风格
  notes?: string;         // 备注
  
  // Steam数据（从API获取）
  steamData?: {
    rank?: number;        // 天梯分数
    leaderboardRank?: number; // 排行榜排名
    wins?: number;
    losses?: number;
    lastMatchDate?: string;
  };
  
  // 近期战绩数据
  recentStats?: {
    matches: number;
    wins: number;
    winRate: number;
    topHeroes: { heroId: number; games: number; winRate: number }[];
    updatedAt: string;
  };
}

export interface Team {
  id: string;
  name: string;           // 队伍名称
  description?: string;   // 队伍描述
  createdAt: string;
  updatedAt: string;
  players: Player[];      // 队员列表
  captainId?: string;     // 队长ID
}

export const positionNames: Record<Position, string> = {
  1: '一号位 (Carry)',
  2: '二号位 (Mid)',
  3: '三号位 (Offlane)',
  4: '四号位 (Soft Support)',
  5: '五号位 (Hard Support)',
};

export const positionShortNames: Record<Position, string> = {
  1: '1号',
  2: '2号',
  3: '3号',
  4: '4号',
  5: '5号',
};

// 从localStorage加载队伍数据
export function loadTeamsFromStorage(): Team[] {
  try {
    const data = localStorage.getItem('bpcat_teams');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load teams:', e);
  }
  return [];
}

// 保存队伍数据到localStorage
export function saveTeamsToStorage(teams: Team[]): void {
  try {
    localStorage.setItem('bpcat_teams', JSON.stringify(teams));
  } catch (e) {
    console.error('Failed to save teams:', e);
  }
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 转换SteamID到SteamID64
export function toSteamId64(steamId: string): string | null {
  // 如果已经是17位数字
  if (/^\d{17}$/.test(steamId)) {
    return steamId;
  }
  
  // 转换 STEAM_X:Y:Z 格式
  const match = steamId.match(/^STEAM_(\d+):(\d+):(\d+)$/);
  if (match) {
    const [, , Y, Z] = match;
    const steamId64 = BigInt(76561197960265728) + BigInt(Y) + BigInt(2) * BigInt(Z);
    return steamId64.toString();
  }
  
  // 转换 [U:1:XXXX] 格式
  const uMatch = steamId.match(/^\[U:1:(\d+)\]$/);
  if (uMatch) {
    const accountId = BigInt(uMatch[1]);
    const steamId64 = BigInt(76561197960265728) + accountId;
    return steamId64.toString();
  }
  
  return null;
}

// 从SteamID64获取account ID（用于OpenDota API）
export function toAccountId(steamId64: string): string | null {
  try {
    const id = BigInt(steamId64);
    const accountId = id - BigInt(76561197960265728);
    return accountId.toString();
  } catch {
    return null;
  }
}
