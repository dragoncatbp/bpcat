/**
 * OpenDota API 服务
 * 用于查询玩家天梯数据、近期战绩、擅长英雄等
 */

import { toAccountId } from '@/types/team';

const OPENDOTA_BASE = 'https://api.opendota.com/api';

export interface PlayerProfile {
  account_id: number;
  personaname: string;
  name?: string;
  avatar: string;
  avatarfull: string;
  profileurl: string;
  last_login?: string;
  loccountrycode?: string;
}

export interface PlayerWinLoss {
  win: number;
  lose: number;
}

export interface PlayerRank {
  rank_tier?: number;      // 天梯段位 (11-80, 11=先锋1, 80=冠绝一世)
  leaderboard_rank?: number; // 排行榜排名（如果是前1000）
}

export interface HeroStats {
  hero_id: string;
  games: number;
  win: number;
  last_played: number;
}

export interface PlayerRecentMatch {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  duration: number;
  game_mode: number;
  lobby_type: number;
  hero_id: number;
  start_time: number;
  kills: number;
  deaths: number;
  assists: number;
  xp_per_min: number;
  gold_per_min: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
  last_hits: number;
  win: number;
  lose: number;
}

// 获取玩家基础信息
export async function getPlayerProfile(steamId64: string): Promise<PlayerProfile | null> {
  try {
    const accountId = toAccountId(steamId64);
    if (!accountId) return null;
    
    const response = await fetch(`${OPENDOTA_BASE}/players/${accountId}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.profile || null;
  } catch (error) {
    console.error('Failed to fetch player profile:', error);
    return null;
  }
}

// 获取玩家胜负统计
export async function getPlayerWinLoss(steamId64: string): Promise<PlayerWinLoss | null> {
  try {
    const accountId = toAccountId(steamId64);
    if (!accountId) return null;
    
    const response = await fetch(`${OPENDOTA_BASE}/players/${accountId}/wl`);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch win/loss:', error);
    return null;
  }
}

// 获取玩家天梯数据
export async function getPlayerRank(steamId64: string): Promise<PlayerRank | null> {
  try {
    const accountId = toAccountId(steamId64);
    if (!accountId) return null;
    
    const response = await fetch(`${OPENDOTA_BASE}/players/${accountId}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      rank_tier: data.rank_tier,
      leaderboard_rank: data.leaderboard_rank,
    };
  } catch (error) {
    console.error('Failed to fetch rank:', error);
    return null;
  }
}

// 获取玩家英雄统计数据
export async function getPlayerHeroStats(steamId64: string): Promise<HeroStats[] | null> {
  try {
    const accountId = toAccountId(steamId64);
    if (!accountId) return null;
    
    const response = await fetch(`${OPENDOTA_BASE}/players/${accountId}/heroes`);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch hero stats:', error);
    return null;
  }
}

// 获取近期比赛
export async function getRecentMatches(steamId64: string): Promise<PlayerRecentMatch[] | null> {
  try {
    const accountId = toAccountId(steamId64);
    if (!accountId) return null;
    
    const response = await fetch(`${OPENDOTA_BASE}/players/${accountId}/recentMatches`);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch recent matches:', error);
    return null;
  }
}

// 天梯段位名称
export function getRankName(rankTier?: number): string {
  if (!rankTier) return '未校准';
  
  const medals = ['先锋', '卫士', '中军', '统帅', '传奇', '万古流芳', '超凡入圣', '冠绝一世'];
  const medalIndex = Math.floor((rankTier - 11) / 10);
  const star = ((rankTier - 11) % 10) + 1;
  
  if (medalIndex >= 0 && medalIndex < medals.length) {
    return `${medals[medalIndex]} ${star}`;
  }
  return '未知';
}

// 获取完整玩家数据
export interface CompletePlayerData {
  profile: PlayerProfile | null;
  winLoss: PlayerWinLoss | null;
  rank: PlayerRank | null;
  heroStats: HeroStats[] | null;
  recentMatches: PlayerRecentMatch[] | null;
}

export async function getCompletePlayerData(steamId64: string): Promise<CompletePlayerData> {
  const [profile, winLoss, rank, heroStats, recentMatches] = await Promise.all([
    getPlayerProfile(steamId64),
    getPlayerWinLoss(steamId64),
    getPlayerRank(steamId64),
    getPlayerHeroStats(steamId64),
    getRecentMatches(steamId64),
  ]);
  
  return {
    profile,
    winLoss,
    rank,
    heroStats,
    recentMatches,
  };
}

// 计算近期战绩（最近20场）
export function calculateRecentStats(matches: PlayerRecentMatch[] | null) {
  if (!matches || matches.length === 0) return null;
  
  const recent = matches.slice(0, 20);
  const wins = recent.filter(m => m.win === 1).length;
  
  // 统计英雄使用
  const heroMap = new Map<number, { games: number; wins: number }>();
  recent.forEach(match => {
    const current = heroMap.get(match.hero_id) || { games: 0, wins: 0 };
    current.games++;
    if (match.win === 1) current.wins++;
    heroMap.set(match.hero_id, current);
  });
  
  const topHeroes = Array.from(heroMap.entries())
    .map(([heroId, stats]) => ({
      heroId,
      games: stats.games,
      winRate: Math.round((stats.wins / stats.games) * 100),
    }))
    .sort((a, b) => b.games - a.games)
    .slice(0, 5);
  
  return {
    matches: recent.length,
    wins,
    winRate: Math.round((wins / recent.length) * 100),
    topHeroes,
    updatedAt: new Date().toISOString(),
  };
}
