import { useState, useEffect, useMemo } from 'react';
import type { ProMatch } from '@/types/proMatches';
import '@/styles/proMatches.css';
import { loadProMatches, saveProMatches, analyzeHeroStats, getPopularCombos, getMatchesByTournament } from '@/types/proMatches';
import { initSampleProMatches } from '@/data/proMatchesSample';
import { 
  fetchRealProMatches, 
  fetchSingleMatch, 
  fetchMatchesDetailsBatch,
  convertToProMatch,
  KNOWN_MATCH_IDS 
} from '@/utils/opendotaApi';
import { realSampleMatches } from '@/data/realMatchesSample';
import { fetchTier1Matches, fetchAllTier1Matches, TIER1_LEAGUES } from '@/utils/tier1Api';
import heroesData from '@/data/heroes.json';

export function ProMatches() {
  const [matches, setMatches] = useState<ProMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<ProMatch | null>(null);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'matches' | 'stats' | 'combos' | 'tournaments' | 'import' | 'manage'>('matches');
  const [selectedTournament, setSelectedTournament] = useState<string>('');
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [tier1Loading, setTier1Loading] = useState<'none' | 'blast' | 'dreamleague' | 'all'>('none');
  const [selectedMatchesToDelete, setSelectedMatchesToDelete] = useState<Set<string>>(new Set());
  const [manageFilter, setManageFilter] = useState('');

  useEffect(() => {
    initSampleProMatches();
    const loaded = loadProMatches();
    setMatches(loaded);
    console.log(`[ProMatches] Loaded ${loaded.length} matches from localStorage`);
    // 默认选择第一个赛事
    const tournaments = [...new Set(loaded.map(m => m.tournament))];
    if (tournaments.length > 0 && !selectedTournament) {
      setSelectedTournament(tournaments[0]);
    }
  }, []);

  const tournaments = useMemo(() => {
    const tourneyMap = new Map<string, { count: number; wins: { radiant: number; dire: number } }>();
    matches.forEach(m => {
      const existing = tourneyMap.get(m.tournament);
      if (existing) {
        existing.count++;
        if (m.result.winner === 'radiant') existing.wins.radiant++;
        else existing.wins.dire++;
      } else {
        tourneyMap.set(m.tournament, {
          count: 1,
          wins: { radiant: m.result.winner === 'radiant' ? 1 : 0, dire: m.result.winner === 'dire' ? 1 : 0 }
        });
      }
    });
    return Array.from(tourneyMap.entries()).map(([name, data]) => ({
      name,
      ...data
    }));
  }, [matches]);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => 
      m.tournament.toLowerCase().includes(filter.toLowerCase()) ||
      m.radiantTeam.name.toLowerCase().includes(filter.toLowerCase()) ||
      m.direTeam.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [matches, filter]);

  // 按赛事统计
  const tournamentStats = useMemo(() => {
    if (!selectedTournament) return null;
    const tourneyMatches = getMatchesByTournament(selectedTournament);
    
    // 统计英雄
    const heroStats: Record<number, { picks: number; bans: number; wins: number; losses: number }> = {};
    const teamStats: Record<string, { wins: number; losses: number; matches: number }> = {};
    
    tourneyMatches.forEach(match => {
      // 队伍统计
      const rTeam = match.radiantTeam.name;
      const dTeam = match.direTeam.name;
      
      if (!teamStats[rTeam]) teamStats[rTeam] = { wins: 0, losses: 0, matches: 0 };
      if (!teamStats[dTeam]) teamStats[dTeam] = { wins: 0, losses: 0, matches: 0 };
      
      teamStats[rTeam].matches++;
      teamStats[dTeam].matches++;
      
      if (match.result.winner === 'radiant') {
        teamStats[rTeam].wins++;
        teamStats[dTeam].losses++;
      } else {
        teamStats[dTeam].wins++;
        teamStats[rTeam].losses++;
      }
      
      // 英雄统计
      match.picksBans.forEach(pb => {
        if (!heroStats[pb.heroId]) heroStats[pb.heroId] = { picks: 0, bans: 0, wins: 0, losses: 0 };
        
        if (pb.isPick) {
          heroStats[pb.heroId].picks++;
          const won = match.result.winner === pb.team;
          if (won) heroStats[pb.heroId].wins++;
          else heroStats[pb.heroId].losses++;
        } else {
          heroStats[pb.heroId].bans++;
        }
      });
    });
    
    return {
      matches: tourneyMatches,
      heroStats: Object.entries(heroStats)
        .sort((a, b) => (b[1].picks + b[1].bans) - (a[1].picks + a[1].bans)),
      teamStats: Object.entries(teamStats)
        .sort((a, b) => b[1].wins - a[1].wins)
    };
  }, [matches, selectedTournament]);

  const heroStats = useMemo(() => {
    const stats: Record<number, ReturnType<typeof analyzeHeroStats>> = {};
    heroesData.forEach(hero => {
      stats[hero.id] = analyzeHeroStats(hero.id);
    });
    return Object.entries(stats)
      .filter(([_, s]) => s.picks > 0 || s.bans > 0)
      .sort((a, b) => (b[1].picks + b[1].bans) - (a[1].picks + a[1].bans))
      .slice(0, 20);
  }, [matches]);

  const combos = useMemo(() => getPopularCombos(), [matches]);

  const getHeroName = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.localizedName || `英雄#${heroId}`;
  };

  const getHeroImage = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.image || '';
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '未知';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importJson);
      const newMatches: ProMatch[] = Array.isArray(data) ? data : [data];
      
      // 验证数据格式
      for (const match of newMatches) {
        if (!match.tournament || !match.radiantTeam || !match.direTeam || !match.picksBans || !match.result) {
          throw new Error('比赛数据格式不正确，缺少必要字段');
        }
      }
      
      // 添加ID
      const matchesWithId = newMatches.map((m, i) => ({
        ...m,
        id: m.id || `imported_${Date.now()}_${i}`,
      }));
      
      // 保存到localStorage
      const existing = loadProMatches();
      const updated = [...matchesWithId, ...existing];
      saveProMatches(updated);
      setMatches(updated);
      
      setImportJson('');
      setImportError('');
      alert(`成功导入 ${matchesWithId.length} 场比赛！`);
      setActiveTab('matches');
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'JSON解析失败');
    }
  };

  const handleFetchFromAPI = async () => {
    setIsLoading(true);
    try {
      const matches = await fetchRealProMatches(20, (msg) => {
        setLoadingMessage(msg);
      });
      
      if (matches.length === 0) {
        alert('获取到的比赛都没有BP数据，尝试获取已知比赛...');
        // 尝试获取已知比赛
        const knownMatches: ProMatch[] = [];
        for (const matchId of KNOWN_MATCH_IDS.slice(0, 5)) {
          setLoadingMessage(`正在获取比赛 ${matchId}...`);
          const match = await fetchSingleMatch(matchId);
          if (match) knownMatches.push(match);
          await new Promise(r => setTimeout(r, 200));
        }
        
        if (knownMatches.length > 0) {
          const existing = loadProMatches();
          const updated = [...knownMatches, ...existing];
          saveProMatches(updated);
          setMatches(updated);
          alert(`成功获取 ${knownMatches.length} 场真实职业比赛！`);
        } else {
          alert('未能获取到任何带有BP数据的比赛。这可能是由于：\n1. API暂时不可用\n2. 这些比赛还没有被解析BP数据\n\n建议手动从Liquipedia复制比赛数据粘贴导入。');
        }
        return;
      }
      
      // 合并现有数据
      const existing = loadProMatches();
      const updated = [...matches, ...existing];
      saveProMatches(updated);
      setMatches(updated);
      
      alert(`成功获取 ${matches.length} 场真实职业比赛！`);
      setActiveTab('matches');
    } catch (error) {
      alert('获取数据失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleFetchTier1 = async (leagueKey: 'BLAST_SLAM_VI' | 'DREAMLEAGUE_S28' | 'all') => {
    setTier1Loading(leagueKey === 'all' ? 'all' : leagueKey === 'BLAST_SLAM_VI' ? 'blast' : 'dreamleague');
    setIsLoading(true);
    
    try {
      let matches: ProMatch[] = [];
      
      if (leagueKey === 'all') {
        matches = await fetchAllTier1Matches(30, (msg) => setLoadingMessage(msg));
      } else {
        const leagueName = TIER1_LEAGUES[leagueKey].name;
        setLoadingMessage(`正在获取 ${leagueName} 数据...`);
        matches = await fetchTier1Matches(leagueKey, 50, (msg) => setLoadingMessage(msg));
      }
      
      if (matches.length === 0) {
        alert('未能获取到带BP数据的比赛，请稍后重试');
        return;
      }
      
      // 合并现有数据
      const existing = loadProMatches();
      const existingIds = new Set(existing.map((m: ProMatch) => m.matchId));
      const newMatches = matches.filter(m => !existingIds.has(m.matchId));
      
      const updated = [...newMatches, ...existing];
      saveProMatches(updated);
      setMatches(updated);
      
      alert(`成功获取 ${newMatches.length} 场新的Tier 1比赛！\n${leagueKey === 'all' ? '包括BLAST Slam VI和DreamLeague S28' : ''}`);
      setActiveTab('matches');
    } catch (error) {
      alert('获取失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setIsLoading(false);
      setTier1Loading('none');
      setLoadingMessage('');
    }
  };

  const handleLoadSampleData = () => {
    const existing = loadProMatches();
    const existingIds = new Set(existing.map((m: ProMatch) => m.matchId));
    const newMatches = realSampleMatches.filter(m => !existingIds.has(m.matchId));
    
    if (newMatches.length === 0) {
      alert('示例数据已存在！');
      return;
    }
    
    const updated = [...newMatches, ...existing];
    saveProMatches(updated);
    setMatches(updated);
    alert(`已加载 ${newMatches.length} 场真实示例比赛！`);
    setActiveTab('matches');
  };

  const handleFetchByLeague = async () => {
    if (!leagueId) {
      alert('请输入联赛ID');
      return;
    }
    setIsLoading(true);
    setLoadingMessage(`正在获取联赛 ${leagueId} 的比赛数据...`);
    try {
      // 先获取该联赛的比赛列表
      const listResponse = await fetch(`https://api.opendota.com/api/leagues/${leagueId}/matches`);
      if (!listResponse.ok) throw new Error('获取联赛比赛列表失败');
      const matchList = await listResponse.json();
      
      if (!Array.isArray(matchList) || matchList.length === 0) {
        alert('该联赛暂无比赛数据');
        return;
      }
      
      setLoadingMessage(`找到 ${matchList.length} 场比赛，正在获取详情...`);
      
      // 批量获取详情
      const matchIds = matchList.slice(0, 30).map((m: { match_id: number }) => m.match_id);
      const details = await fetchMatchesDetailsBatch(matchIds, (current, total) => {
        setLoadingMessage(`正在获取第 ${current}/${total} 场比赛详情...`);
      });
      
      // 转换数据
      const converted: ProMatch[] = [];
      for (const detail of details) {
        const convertedMatch = convertToProMatch(detail);
        if (convertedMatch) {
          converted.push(convertedMatch);
        }
      }
      
      if (converted.length === 0) {
        alert('获取到的比赛都没有BP数据');
        return;
      }
      
      // 合并现有数据
      const existing = loadProMatches();
      const updated = [...converted, ...existing];
      saveProMatches(updated);
      setMatches(updated);
      
      alert(`成功获取 ${converted.length} 场带BP数据的比赛！`);
      setActiveTab('matches');
    } catch (error) {
      alert('获取数据失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const clearAllData = () => {
    if (confirm('⚠️ 确定要清空所有职业比赛数据吗？\n\n此操作不可恢复！')) {
      saveProMatches([]);
      setMatches([]);
      setSelectedMatchesToDelete(new Set());
      alert('已清空所有数据');
    }
  };

  const deleteMatchesByTournament = (tournamentName: string) => {
    if (confirm(`确定要删除「${tournamentName}」的所有比赛吗？`)) {
      const existing = loadProMatches();
      const filtered = existing.filter((m: ProMatch) => m.tournament !== tournamentName);
      saveProMatches(filtered);
      setMatches(filtered);
      setSelectedMatchesToDelete(new Set());
      alert(`已删除「${tournamentName}」的比赛`);
    }
  };

  const deleteSelectedMatches = () => {
    if (selectedMatchesToDelete.size === 0) {
      alert('请先选择要删除的比赛');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedMatchesToDelete.size} 场比赛吗？`)) {
      const existing = loadProMatches();
      const filtered = existing.filter((m: ProMatch) => !selectedMatchesToDelete.has(m.id));
      saveProMatches(filtered);
      setMatches(filtered);
      setSelectedMatchesToDelete(new Set());
      alert(`已删除 ${selectedMatchesToDelete.size} 场比赛`);
    }
  };

  const removeDuplicates = () => {
    const existing = loadProMatches();
    const seen = new Map<string, ProMatch>();
    let duplicates = 0;
    
    for (const match of existing) {
      // 使用matchId或id作为唯一标识
      const key = String(match.matchId || match.id);
      if (seen.has(key)) {
        duplicates++;
      } else {
        seen.set(key, match);
      }
    }
    
    if (duplicates === 0) {
      alert('没有发现重复的比赛');
      return;
    }
    
    if (confirm(`发现 ${duplicates} 场重复的比赛，确定要清理吗？`)) {
      const unique = Array.from(seen.values());
      saveProMatches(unique);
      setMatches(unique);
      setSelectedMatchesToDelete(new Set());
      alert(`已清理 ${duplicates} 场重复比赛`);
    }
  };

  const toggleMatchSelection = (matchId: string) => {
    const newSet = new Set(selectedMatchesToDelete);
    if (newSet.has(matchId)) {
      newSet.delete(matchId);
    } else {
      newSet.add(matchId);
    }
    setSelectedMatchesToDelete(newSet);
  };

  const selectAllInFilter = () => {
    const filtered = matches.filter(m => 
      m.tournament.toLowerCase().includes(manageFilter.toLowerCase()) ||
      m.radiantTeam.name.toLowerCase().includes(manageFilter.toLowerCase()) ||
      m.direTeam.name.toLowerCase().includes(manageFilter.toLowerCase())
    );
    const newSet = new Set(selectedMatchesToDelete);
    filtered.forEach(m => newSet.add(m.id));
    setSelectedMatchesToDelete(newSet);
  };

  const clearSelection = () => {
    setSelectedMatchesToDelete(new Set());
  };

  return (
    <div className="pro-matches">
      <div className="pro-matches-header">
        <h3>🏆 职业BP</h3>
        <div className="pro-tabs">
          <button 
            className={activeTab === 'matches' ? 'active' : ''}
            onClick={() => setActiveTab('matches')}
          >
            比赛列表
          </button>
          <button 
            className={activeTab === 'tournaments' ? 'active' : ''}
            onClick={() => setActiveTab('tournaments')}
          >
            赛事统计
          </button>
          <button 
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            英雄数据
          </button>
          <button 
            className={activeTab === 'combos' ? 'active' : ''}
            onClick={() => setActiveTab('combos')}
          >
            热门组合
          </button>
          <button 
            className={activeTab === 'import' ? 'active' : ''}
            onClick={() => setActiveTab('import')}
          >
            导入数据
          </button>
          <button 
            className={activeTab === 'manage' ? 'active' : ''}
            onClick={() => setActiveTab('manage')}
          >
            数据管理
          </button>
        </div>
      </div>

      {activeTab === 'matches' && (
        <>
          <input
            type="text"
            className="pro-filter"
            placeholder="搜索赛事或队伍..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div className="pro-matches-list">
            {filteredMatches.map(match => (
              <div 
                key={match.id} 
                className={`pro-match-card ${selectedMatch?.id === match.id ? 'active' : ''}`}
                onClick={() => setSelectedMatch(selectedMatch?.id === match.id ? null : match)}
              >
                <div className="match-header">
                  <span className="tournament">{match.tournament}</span>
                  <span className="date">{match.date}</span>
                  <span className={`tier tier-${match.tier}`}>T{match.tier}</span>
                </div>
                
                {/* 队伍和胜负 */}
                <div className="match-teams-with-winner">
                  <div className={`team-side radiant ${match.result.winner === 'radiant' ? 'winner' : 'loser'}`}>
                    <div className="team-info">
                      <span className="team-name">{match.radiantTeam.name}</span>
                      {match.result.winner === 'radiant' && <span className="winner-badge">🏆 获胜</span>}
                    </div>
                    <div className="team-score-section">
                      <span className="score">{match.result.radiantScore}</span>
                      <span className="networth">{match.result.radiantNetWorth ? `${(match.result.radiantNetWorth / 1000).toFixed(1)}k` : ''}</span>
                    </div>
                  </div>
                  
                  <div className="vs-divider">
                    <span className="vs">VS</span>
                    <span className="duration">{formatDuration(match.duration)}</span>
                  </div>
                  
                  <div className={`team-side dire ${match.result.winner === 'dire' ? 'winner' : 'loser'}`}>
                    <div className="team-score-section">
                      <span className="score">{match.result.direScore}</span>
                      <span className="networth">{match.result.direNetWorth ? `${(match.result.direNetWorth / 1000).toFixed(1)}k` : ''}</span>
                    </div>
                    <div className="team-info">
                      <span className="team-name">{match.direTeam.name}</span>
                      {match.result.winner === 'dire' && <span className="winner-badge">🏆 获胜</span>}
                    </div>
                  </div>
                </div>

                {selectedMatch?.id === match.id && (
                  <div className="match-bp-detail">
                    {/* BP顺序 */}
                    <div className="bp-timeline">
                      <h6>完整BP</h6>
                      <div className="bp-steps">
                        {match.picksBans.map((pb, idx) => (
                          <div 
                            key={idx} 
                            className={`bp-step ${pb.team} ${pb.isPick ? 'pick' : 'ban'}`}
                          >
                            <span className="step-num">{idx + 1}</span>
                            <img src={getHeroImage(pb.heroId)} alt="" />
                            <span className="step-type">{pb.isPick ? '选' : '禁'}</span>
                            <span className="step-hero">{getHeroName(pb.heroId)}</span>
                            {pb.playerName && <span className="step-player">{pb.playerName}</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 分队伍显示 */}
                    <div className="bp-by-team">
                      <div className="bp-team-section radiant">
                        <h6>{match.radiantTeam.name}</h6>
                        <div className="pb-section">
                          <div className="pb-group">
                            <label>禁用</label>
                            <div className="pb-heroes">
                              {match.picksBans
                                .filter(pb => pb.team === 'radiant' && !pb.isPick)
                                .map(pb => (
                                  <div key={pb.order} className="pb-hero ban">
                                    <img src={getHeroImage(pb.heroId)} alt="" title={getHeroName(pb.heroId)} />
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="pb-group">
                            <label>选择</label>
                            <div className="pb-heroes">
                              {match.picksBans
                                .filter(pb => pb.team === 'radiant' && pb.isPick)
                                .map(pb => (
                                  <div key={pb.order} className="pb-hero pick">
                                    <img src={getHeroImage(pb.heroId)} alt="" title={getHeroName(pb.heroId)} />
                                    {pb.playerName && <small>{pb.playerName}</small>}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bp-team-section dire">
                        <h6>{match.direTeam.name}</h6>
                        <div className="pb-section">
                          <div className="pb-group">
                            <label>禁用</label>
                            <div className="pb-heroes">
                              {match.picksBans
                                .filter(pb => pb.team === 'dire' && !pb.isPick)
                                .map(pb => (
                                  <div key={pb.order} className="pb-hero ban">
                                    <img src={getHeroImage(pb.heroId)} alt="" title={getHeroName(pb.heroId)} />
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="pb-group">
                            <label>选择</label>
                            <div className="pb-heroes">
                              {match.picksBans
                                .filter(pb => pb.team === 'dire' && pb.isPick)
                                .map(pb => (
                                  <div key={pb.order} className="pb-hero pick">
                                    <img src={getHeroImage(pb.heroId)} alt="" title={getHeroName(pb.heroId)} />
                                    {pb.playerName && <small>{pb.playerName}</small>}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'tournaments' && (
        <div className="tournament-stats">
          <div className="tournament-selector">
            <label>选择赛事:</label>
            <select value={selectedTournament} onChange={(e) => setSelectedTournament(e.target.value)}>
              {tournaments.map(t => (
                <option key={t.name} value={t.name}>{t.name} ({t.count}场)</option>
              ))}
            </select>
          </div>

          {tournamentStats && (
            <>
              <div className="tourney-summary">
                <h4>{selectedTournament} 数据统计</h4>
                <p>总场次: {tournamentStats.matches.length} | 天辉胜率: {Math.round((tournaments.find(t => t.name === selectedTournament)?.wins.radiant || 0) / tournamentStats.matches.length * 100)}%</p>
              </div>

              <div className="tourney-section">
                <h5>队伍战绩</h5>
                <div className="team-standings">
                  {tournamentStats.teamStats.map(([teamName, stats]) => (
                    <div key={teamName} className="team-standing">
                      <span className="team-name">{teamName}</span>
                      <span className="record">{stats.wins}胜 {stats.losses}负</span>
                      <span className={`winrate ${stats.wins / stats.matches >= 0.5 ? 'high' : 'low'}`}>
                        {Math.round(stats.wins / stats.matches * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tourney-section">
                <h5>英雄数据</h5>
                <div className="hero-standings">
                  <div className="standings-header">
                    <span>英雄</span>
                    <span>Pick</span>
                    <span>Ban</span>
                    <span>胜率</span>
                  </div>
                  {tournamentStats.heroStats.slice(0, 15).map(([heroId, stats]) => (
                    <div key={heroId} className="hero-standing">
                      <div className="hero-info">
                        <img src={getHeroImage(Number(heroId))} alt="" />
                        <span>{getHeroName(Number(heroId))}</span>
                      </div>
                      <span className="stat">{stats.picks}</span>
                      <span className="stat">{stats.bans}</span>
                      <span className={`stat ${stats.picks > 0 && stats.wins / stats.picks >= 0.5 ? 'high' : 'low'}`}>
                        {stats.picks > 0 ? Math.round(stats.wins / stats.picks * 100) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="hero-stats-pro">
          <h4>职业赛场英雄数据 (所有赛事)</h4>
          <div className="stats-table">
            <div className="stats-header">
              <span>英雄</span>
              <span>Pick</span>
              <span>Ban</span>
              <span>胜率</span>
            </div>
            {heroStats.map(([heroId, stats]) => (
              <div key={heroId} className="stats-row">
                <div className="hero-cell">
                  <img src={getHeroImage(Number(heroId))} alt="" />
                  <span>{getHeroName(Number(heroId))}</span>
                </div>
                <span className="stat pick">{stats.picks}</span>
                <span className="stat ban">{stats.bans}</span>
                <span className={`stat winrate ${stats.winRate >= 50 ? 'high' : 'low'}`}>
                  {stats.winRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'combos' && (
        <div className="combo-stats">
          <h4>热门阵容组合</h4>
          {combos.length === 0 ? (
            <p className="empty">暂无足够数据</p>
          ) : (
            <div className="combo-list">
              {combos.map((combo, i) => (
                <div key={i} className="combo-card">
                  <div className="combo-heroes">
                    {combo.heroes.map(heroId => (
                      <img key={heroId} src={getHeroImage(heroId)} alt="" title={getHeroName(heroId)} />
                    ))}
                  </div>
                  <div className="combo-stats-info">
                    <span>出现: {combo.count}次</span>
                    <span className={`winrate ${combo.winRate >= 50 ? 'high' : 'low'}`}>
                      胜率: {combo.winRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="manage-section">
          <h4>🗑️ 数据管理</h4>
          
          {/* 统计概览 */}
          <div className="manage-stats">
            <div className="stat-card">
              <span className="stat-number">{matches.length}</span>
              <span className="stat-label">总比赛数</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{tournaments.length}</span>
              <span className="stat-label">赛事数</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{selectedMatchesToDelete.size}</span>
              <span className="stat-label">已选择</span>
            </div>
          </div>

          {/* 快速清理 */}
          <div className="manage-block">
            <h5>⚡ 快速清理</h5>
            <div className="quick-actions">
              <button className="manage-btn danger" onClick={clearAllData}>
                🗑️ 清空所有数据
              </button>
              <button className="manage-btn warning" onClick={removeDuplicates}>
                🧹 清理重复比赛
              </button>
              {selectedMatchesToDelete.size > 0 && (
                <button className="manage-btn danger" onClick={deleteSelectedMatches}>
                  ❌ 删除选中的 {selectedMatchesToDelete.size} 场
                </button>
              )}
            </div>
          </div>

          {/* 按赛事删除 */}
          {tournaments.length > 0 && (
            <div className="manage-block">
              <h5>📂 按赛事删除</h5>
              <div className="tournament-delete-list">
                {tournaments.map(t => (
                  <div key={t.name} className="tournament-delete-item">
                    <span className="tournament-name">{t.name}</span>
                    <span className="tournament-count">{t.count}场</span>
                    <button 
                      className="delete-btn-small"
                      onClick={() => deleteMatchesByTournament(t.name)}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 选择性删除 */}
          {matches.length > 0 && (
            <div className="manage-block">
              <h5>☑️ 选择性删除</h5>
              <div className="select-actions">
                <input
                  type="text"
                  className="manage-filter"
                  placeholder="搜索比赛..."
                  value={manageFilter}
                  onChange={(e) => setManageFilter(e.target.value)}
                />
                <button className="manage-btn" onClick={selectAllInFilter}>
                  全选筛选结果
                </button>
                <button className="manage-btn" onClick={clearSelection}>
                  清空选择
                </button>
              </div>
              
              <div className="matches-select-list">
                {matches
                  .filter(m => 
                    m.tournament.toLowerCase().includes(manageFilter.toLowerCase()) ||
                    m.radiantTeam.name.toLowerCase().includes(manageFilter.toLowerCase()) ||
                    m.direTeam.name.toLowerCase().includes(manageFilter.toLowerCase())
                  )
                  .slice(0, 50)
                  .map(match => (
                    <label key={match.id} className="match-select-item">
                      <input
                        type="checkbox"
                        checked={selectedMatchesToDelete.has(match.id)}
                        onChange={() => toggleMatchSelection(match.id)}
                      />
                      <span className="match-info">
                        {match.tournament} · {match.radiantTeam.name} vs {match.direTeam.name}
                      </span>
                      <span className="match-date">{match.date}</span>
                    </label>
                  ))}
              </div>
              {matches.filter(m => 
                m.tournament.toLowerCase().includes(manageFilter.toLowerCase()) ||
                m.radiantTeam.name.toLowerCase().includes(manageFilter.toLowerCase()) ||
                m.direTeam.name.toLowerCase().includes(manageFilter.toLowerCase())
              ).length > 50 && (
                <p className="list-note">仅显示前50条结果，请使用搜索筛选</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'import' && (
        <div className="import-section">
          <h4>📥 导入真实比赛数据</h4>
          
          {/* Tier 1 赛事专区 */}
          <div className="api-fetch-section tier1-section">
            <h5>🏆 Tier 1 赛事专区</h5>
            <p className="import-desc">
              导入顶级赛事（BLAST Slam VI、DreamLeague S28）的完整比赛数据
            </p>
            
            <div className="tier1-actions">
              <button 
                className="api-btn blast-btn" 
                onClick={() => handleFetchTier1('BLAST_SLAM_VI')}
                disabled={isLoading || tier1Loading !== 'none'}
              >
                {tier1Loading === 'blast' ? '获取中...' : '🔥 BLAST Slam VI'}
              </button>
              <button 
                className="api-btn dreamleague-btn" 
                onClick={() => handleFetchTier1('DREAMLEAGUE_S28')}
                disabled={isLoading || tier1Loading !== 'none'}
              >
                {tier1Loading === 'dreamleague' ? '获取中...' : '⚡ DreamLeague S28'}
              </button>
              <button 
                className="api-btn all-tier1-btn" 
                onClick={() => handleFetchTier1('all')}
                disabled={isLoading || tier1Loading !== 'none'}
              >
                {tier1Loading === 'all' ? '获取中...' : '🏆 获取全部Tier 1'}
              </button>
            </div>
            <p className="tier1-note">
              <small>💡 这些赛事有完整的BP数据，共约100-200场比赛</small>
            </p>
          </div>

          <div className="import-divider">
            <span>其他方式</span>
          </div>

          {/* API获取区域 */}
          <div className="api-fetch-section">
            <h5>🌐 从OpenDota API获取数据</h5>
            <p className="import-desc">
              获取最近的职业比赛（可能包含Tier 2赛事）
            </p>
            
            <div className="api-actions">
              <button 
                className="api-btn" 
                onClick={handleFetchFromAPI}
                disabled={isLoading}
              >
                {isLoading ? '获取中...' : '获取最近20场职业比赛'}
              </button>
              <button 
                className="api-btn secondary" 
                onClick={handleLoadSampleData}
                disabled={isLoading}
                title="直接加载3场预置的真实比赛数据（无需网络请求）"
              >
                📦 加载示例真实数据
              </button>
            </div>

            <div className="league-fetch">
              <p className="import-desc">按联赛ID获取特定赛事数据：</p>
              <div className="league-input-group">
                <input
                  type="text"
                  className="league-input"
                  placeholder="输入联赛ID (如: 15912)"
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                />
                <button 
                  className="api-btn" 
                  onClick={handleFetchByLeague}
                  disabled={isLoading}
                >
                  获取
                </button>
              </div>
              <div className="league-hints">
                <small>常用联赛ID：15912(BLAST Slam), 15934(DreamLeague S28)</small>
              </div>
            </div>

            {isLoading && (
              <div className="loading-status">
                <div className="loading-spinner"></div>
                <span>{loadingMessage}</span>
              </div>
            )}
          </div>

          <div className="import-divider">
            <span>或者</span>
          </div>

          {/* 手动导入区域 */}
          <div className="manual-import-section">
            <h5>📝 手动粘贴JSON数据</h5>
            <p className="import-desc">
              从Dotabuff、Liquipedia等网站复制比赛数据JSON格式粘贴
            </p>
            
            <div className="import-format">
              <h6>数据格式示例：</h6>
              <pre>{`{
  "tournament": "BLAST Slam VI",
  "date": "2026-03-15",
  "radiantTeam": { "name": "Team Spirit" },
  "direTeam": { "name": "Team Falcons" },
  "picksBans": [...],
  "result": { "winner": "radiant", ... }
}`}</pre>
            </div>

            <textarea
              className="import-textarea"
              placeholder="粘贴比赛JSON数据（可以是数组或单个对象）..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              rows={8}
            />
            
            {importError && <div className="import-error">❌ {importError}</div>}
            
            <div className="import-actions">
              <button className="import-btn" onClick={handleImport} disabled={isLoading}>
                导入比赛
              </button>
              <button className="clear-btn" onClick={clearAllData} disabled={isLoading}>
                清空所有数据
              </button>
            </div>
          </div>

          <div className="current-stats">
            <h5>📊 当前数据状态</h5>
            <p>共有 <strong>{matches.length}</strong> 场比赛数据</p>
            {tournaments.length > 0 && (
              <ul>
                {tournaments.map(t => (
                  <li key={t.name}>{t.name}: {t.count}场</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
