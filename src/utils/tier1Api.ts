/**
 * Tier 1 赛事数据获取
 * BLAST Slam VI 和 DreamLeague Season 28
 */

import type { ProMatch, ProTeam, PickBan } from '@/types/proMatches';

const API_BASE = 'https://api.opendota.com/api';

// Tier 1 赛事配置
export const TIER1_LEAGUES = {
  BLAST_SLAM_VI: {
    id: 19099,
    name: 'BLAST Slam VI',
    tier: 1,
  },
  DREAMLEAGUE_S28: {
    id: 19269,
    name: 'DreamLeague Season 28',
    tier: 1,
  },
};

interface LeagueMatch {
  match_id: number;
  radiant_team_id?: number;
  dire_team_id?: number;
  radiant_name?: string;
  dire_name?: string;
  radiant_win: boolean;
  duration: number;
  start_time: number;
  radiant_score: number;
  dire_score: number;
}

interface MatchDetail {
  match_id: number;
  leagueid: number;
  radiant_team_id?: number;
  dire_team_id?: number;
  radiant_name?: string;
  dire_name?: string;
  radiant_win: boolean;
  duration: number;
  start_time: number;
  radiant_score: number;
  dire_score: number;
  picks_bans?: Array<{
    is_pick: boolean;
    hero_id: number;
    team: number;
    order: number;
  }>;
  players?: Array<{
    account_id: number;
    name: string;
    hero_id: number;
    team_number: number;
  }>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取联赛比赛列表
 */
async function fetchLeagueMatches(leagueId: number): Promise<LeagueMatch[]> {
  const response = await fetch(`${API_BASE}/leagues/${leagueId}/matches`);
  if (!response.ok) throw new Error(`获取联赛比赛列表失败: HTTP ${response.status}`);
  return await response.json();
}

/**
 * 获取比赛详情
 */
async function fetchMatchDetail(matchId: number): Promise<MatchDetail | null> {
  try {
    const response = await fetch(`${API_BASE}/matches/${matchId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * 转换为ProMatch格式
 */
function convertToProMatch(
  detail: MatchDetail,
  leagueName: string,
  tier: number
): ProMatch | null {
  if (!detail.picks_bans || detail.picks_bans.length < 10) {
    return null;
  }

  const radiantTeam: ProTeam = {
    id: `team_${detail.radiant_team_id || 'unknown'}`,
    name: detail.radiant_name || 'Unknown Radiant',
    tag: 'RAD',
  };

  const direTeam: ProTeam = {
    id: `team_${detail.dire_team_id || 'unknown'}`,
    name: detail.dire_name || 'Unknown Dire',
    tag: 'DIRE',
  };

  const picksBans: PickBan[] = detail.picks_bans.map((pb, index) => ({
    order: index,
    isPick: pb.is_pick,
    heroId: pb.hero_id,
    team: pb.team === 0 ? 'radiant' : 'dire',
  }));

  // 添加选手名
  if (detail.players) {
    picksBans.forEach((pb) => {
      if (pb.isPick) {
        const player = detail.players?.find(
          p => p.hero_id === pb.heroId && p.team_number === (pb.team === 'radiant' ? 0 : 1)
        );
        if (player?.name) {
          pb.playerName = player.name;
        }
      }
    });
  }

  const date = new Date(detail.start_time * 1000);

  return {
    id: `opendota_${detail.match_id}`,
    matchId: detail.match_id,
    tournament: leagueName,
    date: date.toISOString().split('T')[0],
    patch: '7.40c',
    tier,
    duration: detail.duration,
    radiantTeam,
    direTeam,
    picksBans,
    result: {
      winner: detail.radiant_win ? 'radiant' : 'dire',
      radiantScore: detail.radiant_score || 0,
      direScore: detail.dire_score || 0,
    },
  };
}

/**
 * 获取Tier 1赛事的所有比赛
 */
export async function fetchTier1Matches(
  leagueKey: 'BLAST_SLAM_VI' | 'DREAMLEAGUE_S28',
  maxMatches: number = 50,
  onProgress?: (msg: string) => void
): Promise<ProMatch[]> {
  const league = TIER1_LEAGUES[leagueKey];
  onProgress?.(`正在获取 ${league.name} 比赛列表...`);

  const matches = await fetchLeagueMatches(league.id);
  onProgress?.(`${league.name} 共有 ${matches.length} 场比赛`);

  const converted: ProMatch[] = [];
  const matchIds = matches.slice(0, maxMatches).map(m => m.match_id);

  for (let i = 0; i < matchIds.length; i++) {
    onProgress?.(`正在获取第 ${i + 1}/${matchIds.length} 场比赛详情...`);
    
    const detail = await fetchMatchDetail(matchIds[i]);
    if (detail) {
      const convertedMatch = convertToProMatch(detail, league.name, league.tier);
      if (convertedMatch) {
        converted.push(convertedMatch);
      }
    }

    // 延迟避免请求过快
    if (i < matchIds.length - 1) {
      await delay(150);
    }
  }

  onProgress?.(`成功获取 ${converted.length} 场带BP数据的比赛`);
  return converted;
}

/**
 * 获取所有Tier 1赛事的比赛
 */
export async function fetchAllTier1Matches(
  maxPerLeague: number = 30,
  onProgress?: (msg: string) => void
): Promise<ProMatch[]> {
  const allMatches: ProMatch[] = [];

  for (const key of Object.keys(TIER1_LEAGUES) as Array<keyof typeof TIER1_LEAGUES>) {
    try {
      const matches = await fetchTier1Matches(key, maxPerLeague, onProgress);
      allMatches.push(...matches);
    } catch (error) {
      console.error(`Failed to fetch ${key}:`, error);
    }
  }

  return allMatches;
}

// 获取单个比赛（用于测试）
export async function fetchSingleTier1Match(matchId: number): Promise<ProMatch | null> {
  const detail = await fetchMatchDetail(matchId);
  if (!detail) return null;
  
  const league = Object.values(TIER1_LEAGUES).find(l => l.id === detail.leagueid);
  return convertToProMatch(detail, league?.name || 'Unknown', league?.tier || 1);
}
