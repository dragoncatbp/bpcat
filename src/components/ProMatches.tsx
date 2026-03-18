import { useState, useEffect, useMemo } from 'react';
import type { ProMatch } from '@/types/proMatches';
import { loadProMatches, analyzeHeroStats, getPopularCombos } from '@/types/proMatches';
import { initSampleProMatches } from '@/data/proMatchesSample';
import heroesData from '@/data/heroes.json';

export function ProMatches() {
  const [matches, setMatches] = useState<ProMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<ProMatch | null>(null);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'matches' | 'stats' | 'combos'>('matches');

  useEffect(() => {
    initSampleProMatches();
    setMatches(loadProMatches());
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => 
      m.tournament.toLowerCase().includes(filter.toLowerCase()) ||
      m.radiantTeam.name.toLowerCase().includes(filter.toLowerCase()) ||
      m.direTeam.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [matches, filter]);

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
                <div className="match-teams">
                  <div className={`team radiant ${match.result.winner === 'radiant' ? 'winner' : ''}`}>
                    <span className="team-name">{match.radiantTeam.name}</span>
                    <span className="team-score">{match.result.radiantScore}</span>
                  </div>
                  <span className="vs">VS</span>
                  <div className={`team dire ${match.result.winner === 'dire' ? 'winner' : ''}`}>
                    <span className="team-score">{match.result.direScore}</span>
                    <span className="team-name">{match.direTeam.name}</span>
                  </div>
                </div>
                <div className="match-meta">
                  <span>时长: {formatDuration(match.duration)}</span>
                  <span>版本: {match.patch}</span>
                </div>

                {selectedMatch?.id === match.id && (
                  <div className="match-bp-detail">
                    <h5>BP详情</h5>
                    <div className="bp-phase">
                      <div className="bp-team radiant">
                        <h6>{match.radiantTeam.name}</h6>
                        <div className="bp-heroes">
                          {match.picksBans
                            .filter(pb => pb.team === 'radiant' && pb.isPick)
                            .map(pb => (
                              <div key={pb.order} className="bp-hero">
                                <img src={getHeroImage(pb.heroId)} alt="" />
                                <span>{getHeroName(pb.heroId)}</span>
                                {pb.playerName && <small>{pb.playerName}</small>}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="bp-team dire">
                        <h6>{match.direTeam.name}</h6>
                        <div className="bp-heroes">
                          {match.picksBans
                            .filter(pb => pb.team === 'dire' && pb.isPick)
                            .map(pb => (
                              <div key={pb.order} className="bp-hero">
                                <img src={getHeroImage(pb.heroId)} alt="" />
                                <span>{getHeroName(pb.heroId)}</span>
                                {pb.playerName && <small>{pb.playerName}</small>}
                              </div>
                            ))}
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

      {activeTab === 'stats' && (
        <div className="hero-stats-pro">
          <h4>职业赛场英雄数据</h4>
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
    </div>
  );
}
