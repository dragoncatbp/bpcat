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
  signatureHeroes: number[];  // 招牌英雄ID列表（向后兼容）
  signatureCoreHeroes: number[];    // 擅长核心英雄（1/2/3号位）
  signatureSupportHeroes: number[]; // 擅长辅助英雄（4/5号位）
  goodHeroes: number[];   // 熟练英雄
  avoidHeroes: number[];  // 避免英雄
  avatar?: string;        // Steam头像URL
  playstyle?: string;     // 打法风格
  notes?: string;         // 备注
  
  // 评分系统（按位置类型分开）
  ratings?: {
    // 核心位评分 (1,2,3号位)
    core?: {
      score: number;  // 综合评分 1-12
    };
    // 辅助位评分 (4,5号位)
    support?: {
      score: number;  // 综合评分 1-12
    };
    notes?: string;    // 评分备注
    updatedAt?: string; // 评分更新时间
  };
  
  // 所属队伍ID列表
  teamIds?: string[];
  
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
  isMainTeam?: boolean;   // 是否为主队
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

// 获取主队
export function getMainTeam(): Team | null {
  const teams = loadTeamsFromStorage();
  return teams.find(t => t.isMainTeam) || null;
}

// 设置主队
export function setMainTeam(teamId: string): void {
  const teams = loadTeamsFromStorage();
  const updatedTeams = teams.map(t => ({
    ...t,
    isMainTeam: t.id === teamId
  }));
  saveTeamsToStorage(updatedTeams);
}

// 取消主队设置
export function clearMainTeam(): void {
  const teams = loadTeamsFromStorage();
  const updatedTeams = teams.map(t => ({
    ...t,
    isMainTeam: false
  }));
  saveTeamsToStorage(updatedTeams);
}

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 转换SteamID到SteamID64
export function toSteamId64(steamId: string): string | null {
  const trimmed = steamId.trim();
  
  // 如果已经是17位数字 (SteamID64)
  if (/^\d{17}$/.test(trimmed)) {
    return trimmed;
  }
  
  // 如果是9位以下数字 (account ID)，转换为 SteamID64
  // 例如: 310911931 -> 76561198271177659
  if (/^\d{1,10}$/.test(trimmed)) {
    const accountId = BigInt(trimmed);
    const steamId64 = BigInt(76561197960265728) + accountId;
    return steamId64.toString();
  }
  
  // 转换 STEAM_X:Y:Z 格式
  const match = trimmed.match(/^STEAM_(\d+):(\d+):(\d+)$/);
  if (match) {
    const [, , Y, Z] = match;
    const steamId64 = BigInt(76561197960265728) + BigInt(Y) + BigInt(2) * BigInt(Z);
    return steamId64.toString();
  }
  
  // 转换 [U:1:XXXX] 格式
  const uMatch = trimmed.match(/^\[U:1:(\d+)\]$/);
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

// ============ 玩家池管理（全局玩家库）============

const PLAYERS_STORAGE_KEY = 'bpcat_players_pool';

// 从localStorage加载玩家池
export function loadPlayersPool(): Player[] {
  try {
    const data = localStorage.getItem(PLAYERS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load players pool:', e);
  }
  return [];
}

// 保存玩家池到localStorage
export function savePlayersPool(players: Player[]): void {
  try {
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save players pool:', e);
  }
}

// 添加或更新玩家
export function upsertPlayer(player: Player): void {
  const players = loadPlayersPool();
  const existingIndex = players.findIndex(p => p.id === player.id);
  
  if (existingIndex >= 0) {
    players[existingIndex] = { ...players[existingIndex], ...player };
  } else {
    players.push(player);
  }
  
  savePlayersPool(players);
}

// 删除玩家
export function deletePlayer(playerId: string): void {
  const players = loadPlayersPool();
  const filtered = players.filter(p => p.id !== playerId);
  savePlayersPool(filtered);
}

// 获取玩家
export function getPlayer(playerId: string): Player | null {
  const players = loadPlayersPool();
  return players.find(p => p.id === playerId) || null;
}

// 更新玩家所属队伍
export function updatePlayerTeams(playerId: string, teamIds: string[]): void {
  const player = getPlayer(playerId);
  if (player) {
    player.teamIds = teamIds;
    upsertPlayer(player);
  }
}

// 同步队伍中的玩家到玩家池
export function syncTeamPlayersToPool(team: Team): void {
  const players = loadPlayersPool();
  
  for (const teamPlayer of team.players) {
    const existingIndex = players.findIndex(p => p.id === teamPlayer.id);
    
    if (existingIndex >= 0) {
      // 更新现有玩家，保留评分等信息
      const existing = players[existingIndex];
      players[existingIndex] = {
        ...teamPlayer,
        ratings: existing.ratings,
        teamIds: [...new Set([...(existing.teamIds || []), team.id])]
      };
    } else {
      // 添加新玩家
      players.push({
        ...teamPlayer,
        teamIds: [team.id]
      });
    }
  }
  
  savePlayersPool(players);
}

// 获取评分（按位置类型）
export function getRating(
  ratings: Player['ratings'], 
  type: 'core' | 'support'
): number {
  return ratings?.[type]?.score || 0;
}

// 判断玩家是否打核心位
export function playsCore(position: Position[]): boolean {
  return position.some(p => p <= 3);
}

// 判断玩家是否打辅助位
export function playsSupport(position: Position[]): boolean {
  return position.some(p => p >= 4);
}
