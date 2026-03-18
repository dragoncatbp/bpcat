/**
 * 职业比赛数据类型定义
 */

export interface ProMatch {
  id: string;
  matchId?: number;  // OpenDota match ID
  tournament: string;  // 赛事名称
  tournamentLogo?: string;
  date: string;  // 比赛日期
  patch: string;  // 游戏版本
  
  // 队伍信息
  radiantTeam: ProTeam;
  direTeam: ProTeam;
  
  // BP数据
  picksBans: PickBan[];
  
  // 比赛结果
  result: MatchResult;
  
  // 比赛时长(秒)
  duration?: number;
  
  // 联赛等级 (1=Tier 1, 2=Tier 2, etc.)
  tier: number;
}

export interface ProTeam {
  id: string;
  name: string;  // 队伍名称
  tag?: string;  // 简称
  logo?: string;  // 队标
  region?: string;  // 地区
}

export interface PickBan {
  order: number;  // BP顺序 0-23
  isPick: boolean;  // true=pick, false=ban
  heroId: number;
  team: 'radiant' | 'dire';
  // 额外信息
  playerName?: string;  // 使用该英雄的玩家
}

export interface MatchResult {
  winner: 'radiant' | 'dire';
  radiantScore: number;
  direScore: number;
  // 详细数据
  radiantNetWorth?: number;
  direNetWorth?: number;
}

// 从localStorage加载职业比赛数据
export function loadProMatches(): ProMatch[] {
  try {
    const data = localStorage.getItem('bpcat_pro_matches');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load pro matches:', e);
  }
  return [];
}

// 保存职业比赛数据
export function saveProMatches(matches: ProMatch[]): void {
  try {
    localStorage.setItem('bpcat_pro_matches', JSON.stringify(matches));
  } catch (e) {
    console.error('Failed to save pro matches:', e);
  }
}

// 添加职业比赛
export function addProMatch(match: Omit<ProMatch, 'id'>): ProMatch {
  const newMatch: ProMatch = {
    ...match,
    id: `pro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  
  const matches = loadProMatches();
  matches.unshift(newMatch);
  
  // 最多保存100场比赛
  if (matches.length > 100) {
    matches.pop();
  }
  
  saveProMatches(matches);
  return newMatch;
}

// 删除职业比赛
export function deleteProMatch(matchId: string): boolean {
  const matches = loadProMatches();
  const newMatches = matches.filter(m => m.id !== matchId);
  
  if (newMatches.length !== matches.length) {
    saveProMatches(newMatches);
    return true;
  }
  return false;
}

// 按时间范围获取比赛
export function getMatchesByDateRange(startDate: string, endDate: string): ProMatch[] {
  const matches = loadProMatches();
  return matches.filter(m => m.date >= startDate && m.date <= endDate);
}

// 获取最近N场比赛
export function getRecentMatches(count: number = 10): ProMatch[] {
  const matches = loadProMatches();
  return matches.slice(0, count);
}

// 按赛事筛选
export function getMatchesByTournament(tournament: string): ProMatch[] {
  const matches = loadProMatches();
  return matches.filter(m => m.tournament === tournament);
}

// 按队伍筛选
export function getMatchesByTeam(teamName: string): ProMatch[] {
  const matches = loadProMatches();
  return matches.filter(m => 
    m.radiantTeam.name === teamName || m.direTeam.name === teamName
  );
}

// 获取所有赛事列表
export function getAllTournaments(): string[] {
  const matches = loadProMatches();
  const tournaments = new Set(matches.map(m => m.tournament));
  return Array.from(tournaments);
}

// 获取所有队伍列表
export function getAllTeams(): ProTeam[] {
  const matches = loadProMatches();
  const teamMap = new Map<string, ProTeam>();
  
  matches.forEach(m => {
    if (!teamMap.has(m.radiantTeam.name)) {
      teamMap.set(m.radiantTeam.name, m.radiantTeam);
    }
    if (!teamMap.has(m.direTeam.name)) {
      teamMap.set(m.direTeam.name, m.direTeam);
    }
  });
  
  return Array.from(teamMap.values());
}

// 分析英雄在职业比赛中的表现
export function analyzeHeroStats(heroId: number): {
  picks: number;
  bans: number;
  wins: number;
  losses: number;
  winRate: number;
  pickRate: number;
  banRate: number;
} {
  const matches = loadProMatches();
  let picks = 0, bans = 0, wins = 0, losses = 0;
  const totalMatches = matches.length;
  
  matches.forEach(match => {
    const heroPb = match.picksBans.filter(pb => pb.heroId === heroId);
    
    heroPb.forEach(pb => {
      if (pb.isPick) {
        picks++;
        // 检查胜负
        const won = match.result.winner === pb.team;
        if (won) wins++;
        else losses++;
      } else {
        bans++;
      }
    });
  });
  
  return {
    picks,
    bans,
    wins,
    losses,
    winRate: picks > 0 ? Math.round((wins / picks) * 100) : 0,
    pickRate: totalMatches > 0 ? Math.round((picks / totalMatches) * 100) : 0,
    banRate: totalMatches > 0 ? Math.round((bans / totalMatches) * 100) : 0,
  };
}

// 获取热门BP组合
export function getPopularCombos(): { heroes: number[]; count: number; winRate: number }[] {
  const matches = loadProMatches();
  const comboMap = new Map<string, { count: number; wins: number }>();
  
  matches.forEach(match => {
    const radiantPicks = match.picksBans
      .filter(pb => pb.isPick && pb.team === 'radiant')
      .map(pb => pb.heroId)
      .sort();
    
    const direPicks = match.picksBans
      .filter(pb => pb.isPick && pb.team === 'dire')
      .map(pb => pb.heroId)
      .sort();
    
    // 记录 radiant 组合
    if (radiantPicks.length === 5) {
      const key = radiantPicks.join(',');
      const current = comboMap.get(key) || { count: 0, wins: 0 };
      current.count++;
      if (match.result.winner === 'radiant') current.wins++;
      comboMap.set(key, current);
    }
    
    // 记录 dire 组合
    if (direPicks.length === 5) {
      const key = direPicks.join(',');
      const current = comboMap.get(key) || { count: 0, wins: 0 };
      current.count++;
      if (match.result.winner === 'dire') current.wins++;
      comboMap.set(key, current);
    }
  });
  
  return Array.from(comboMap.entries())
    .filter(([_, data]) => data.count >= 2) // 至少出现2次
    .map(([heroes, data]) => ({
      heroes: heroes.split(',').map(Number),
      count: data.count,
      winRate: Math.round((data.wins / data.count) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
