/**
 * OpenDota API 接口
 * 用于获取真实职业比赛数据
 * 文档: https://docs.opendota.com/
 */

import type { ProMatch, ProTeam, PickBan } from '@/types/proMatches';

const API_BASE = 'https://api.opendota.com/api';

// 联赛ID映射 (Tier 1 & 2 赛事)
const LEAGUE_IDS: Record<number, string> = {
  15251: 'The International 2024',
  15438: 'Riyadh Masters 2024',
  15728: 'ESL One Birmingham 2024',
  15640: 'DreamLeague Season 23',
  15439: 'DreamLeague Season 22',
  15196: 'BetBoom Dacha 2024',
  15003: 'ESL One Kuala Lumpur 2023',
  15912: 'BLAST Slam VI',
  15934: 'DreamLeague Season 28',
  15892: 'ESL One Raleigh 2025',
  15901: 'PGL Wallachia Season 3',
  15855: 'FISSURE Playground 1',
  15836: 'BLAST Slam V',
  15793: 'DreamLeague Season 27',
  15761: 'PGL Wallachia Season 2',
};

interface OpenDotaMatchListItem {
  match_id: number;
  leagueid: number;
  radiant_team_id: number;
  dire_team_id: number;
  radiant_name?: string;
  dire_name?: string;
  radiant_win: boolean;
  duration: number;
  start_time: number;
  radiant_score: number;
  dire_score: number;
  league_name?: string;
}

interface OpenDotaMatchDetail {
  match_id: number;
  leagueid: number;
  radiant_team_id: number;
  dire_team_id: number;
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
  radiant_name?: string;
  dire_name?: string;
  league_name?: string;
}

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取职业比赛列表 (简要信息，无BP)
 */
export async function fetchProMatchesList(limit: number = 50): Promise<OpenDotaMatchListItem[]> {
  try {
    const response = await fetch(`${API_BASE}/proMatches?limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch pro matches list:', error);
    throw error;
  }
}

/**
 * 获取特定比赛详情 (包含BP)
 */
export async function fetchMatchDetails(matchId: number): Promise<OpenDotaMatchDetail | null> {
  try {
    const response = await fetch(`${API_BASE}/matches/${matchId}`);
    if (!response.ok) {
      console.warn(`Failed to fetch match ${matchId}: HTTP ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch match ${matchId}:`, error);
    return null;
  }
}

/**
 * 批量获取比赛详情（带延迟避免请求过快）
 */
export async function fetchMatchesDetailsBatch(
  matchIds: number[],
  onProgress?: (current: number, total: number) => void
): Promise<OpenDotaMatchDetail[]> {
  const results: OpenDotaMatchDetail[] = [];
  
  for (let i = 0; i < matchIds.length; i++) {
    const matchId = matchIds[i];
    onProgress?.(i + 1, matchIds.length);
    
    const detail = await fetchMatchDetails(matchId);
    if (detail) {
      results.push(detail);
    }
    
    // 延迟100ms避免请求过快
    if (i < matchIds.length - 1) {
      await delay(100);
    }
  }
  
  return results;
}

/**
 * 转换OpenDota比赛数据为应用格式
 */
export function convertToProMatch(openDotaMatch: OpenDotaMatchDetail): ProMatch | null {
  // 只处理有BP数据的比赛
  if (!openDotaMatch.picks_bans || openDotaMatch.picks_bans.length < 10) {
    return null;
  }

  // 获取队伍名称
  const radiantTeam: ProTeam = {
    id: `team_${openDotaMatch.radiant_team_id || 'unknown'}`,
    name: openDotaMatch.radiant_name || `Radiant ${openDotaMatch.radiant_team_id || ''}`,
    tag: 'RAD',
  };
  
  const direTeam: ProTeam = {
    id: `team_${openDotaMatch.dire_team_id || 'unknown'}`,
    name: openDotaMatch.dire_name || `Dire ${openDotaMatch.dire_team_id || ''}`,
    tag: 'DIRE',
  };

  // 转换BP数据
  const picksBans: PickBan[] = openDotaMatch.picks_bans.map((pb, index) => ({
    order: index,
    isPick: pb.is_pick,
    heroId: pb.hero_id,
    team: pb.team === 0 ? 'radiant' : 'dire',
  }));

  // 尝试从players添加选手名称
  if (openDotaMatch.players) {
    picksBans.forEach((pb) => {
      if (pb.isPick) {
        const player = openDotaMatch.players?.find(
          p => p.hero_id === pb.heroId && p.team_number === (pb.team === 'radiant' ? 0 : 1)
        );
        if (player) {
          pb.playerName = player.name || `Player ${player.account_id}`;
        }
      }
    });
  }

  const date = new Date(openDotaMatch.start_time * 1000);
  
  // 获取赛事名称
  const tournamentName = LEAGUE_IDS[openDotaMatch.leagueid] || 
    openDotaMatch.league_name ||
    `League ${openDotaMatch.leagueid}`;

  // 判断赛事等级
  const tier = Object.keys(LEAGUE_IDS).includes(String(openDotaMatch.leagueid)) ? 1 : 2;

  return {
    id: `opendota_${openDotaMatch.match_id}`,
    matchId: openDotaMatch.match_id,
    tournament: tournamentName,
    date: date.toISOString().split('T')[0],
    patch: '7.40c',
    tier,
    duration: openDotaMatch.duration,
    radiantTeam,
    direTeam,
    picksBans,
    result: {
      winner: openDotaMatch.radiant_win ? 'radiant' : 'dire',
      radiantScore: openDotaMatch.radiant_score || 0,
      direScore: openDotaMatch.dire_score || 0,
    },
  };
}

/**
 * 获取真实职业比赛（带BP数据）
 */
export async function fetchRealProMatches(
  count: number = 20,
  onProgress?: (message: string) => void
): Promise<ProMatch[]> {
  onProgress?.('正在获取比赛列表...');
  
  // 1. 获取比赛列表
  const matchList = await fetchProMatchesList(count * 2); // 多获取一些，因为有些可能没有BP
  
  if (matchList.length === 0) {
    throw new Error('未获取到任何比赛');
  }
  
  onProgress?.(`获取到 ${matchList.length} 场比赛，正在获取详情...`);
  
  // 2. 批量获取详情
  const matchIds = matchList.map(m => m.match_id);
  const details = await fetchMatchesDetailsBatch(matchIds, (current, total) => {
    onProgress?.(`正在处理第 ${current}/${total} 场比赛...`);
  });
  
  // 3. 转换数据
  const converted: ProMatch[] = [];
  for (const detail of details) {
    const convertedMatch = convertToProMatch(detail);
    if (convertedMatch) {
      converted.push(convertedMatch);
    }
    if (converted.length >= count) break;
  }
  
  return converted;
}

/**
 * 获取特定比赛的详情
 */
export async function fetchSingleMatch(matchId: number): Promise<ProMatch | null> {
  const detail = await fetchMatchDetails(matchId);
  if (!detail) return null;
  return convertToProMatch(detail);
}

// 一些已知的精彩比赛ID（用于演示）
export const KNOWN_MATCH_IDS = [
  8734097373, // 最近的比赛
  8734082075,
  8734049048,
  8734029478,
  8734021145,
];
