import { useState, useEffect, useCallback } from 'react';
import type { Team, Player } from '@/types/team';
import { 
  loadTeamsFromStorage, 
  saveTeamsToStorage, 
  setMainTeam,
  generateId, 
  toSteamId64,
  positionNames,
  type Position 
} from '@/types/team';
import { 
  getCompletePlayerData, 
  calculateRecentStats, 
  getRankName 
} from '@/services/opendota';
import heroesData from '@/data/heroes.json';
import './TeamManager.css';

interface TeamManagerProps {
  onSelectTeam?: (team: Team | null) => void;
  selectedTeamId?: string | null;
}

export function TeamManager({ onSelectTeam, selectedTeamId }: TeamManagerProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'edit' | 'player'>('list');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 加载队伍数据
  useEffect(() => {
    setTeams(loadTeamsFromStorage());
  }, []);

  // 保存队伍数据
  const saveTeams = useCallback((newTeams: Team[]) => {
    setTeams(newTeams);
    saveTeamsToStorage(newTeams);
  }, []);

  // 创建新队伍
  const createTeam = () => {
    const newTeam: Team = {
      id: generateId(),
      name: '新队伍',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      players: [],
    };
    setEditingTeam(newTeam);
    setActiveTab('edit');
  };

  // 编辑队伍
  const editTeam = (team: Team) => {
    setEditingTeam({ ...team });
    setActiveTab('edit');
  };

  // 保存队伍
  const saveTeam = () => {
    if (!editingTeam) return;
    
    const updatedTeam = { ...editingTeam, updatedAt: new Date().toISOString() };
    const existingIndex = teams.findIndex(t => t.id === updatedTeam.id);
    
    let newTeams: Team[];
    if (existingIndex >= 0) {
      newTeams = [...teams];
      newTeams[existingIndex] = updatedTeam;
    } else {
      newTeams = [...teams, updatedTeam];
    }
    
    saveTeams(newTeams);
    setActiveTab('list');
    setEditingTeam(null);
  };

  // 删除队伍
  const deleteTeam = (teamId: string) => {
    if (!confirm('确定要删除这个队伍吗？')) return;
    const newTeams = teams.filter(t => t.id !== teamId);
    saveTeams(newTeams);
    if (selectedTeamId === teamId) {
      onSelectTeam?.(null);
    }
  };

  // 设为主队
  const handleSetMainTeam = (teamId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMainTeam(teamId);
    setTeams(loadTeamsFromStorage());
  };

  // 添加/编辑队员
  const editPlayer = (team: Team, player?: Player) => {
    setEditingTeam(team);
    setEditingPlayer(player || {
      id: generateId(),
      name: '',
      position: [1],
      signatureHeroes: [],
      goodHeroes: [],
      avoidHeroes: [],
    });
    setActiveTab('player');
  };

  // 保存队员
  const savePlayer = () => {
    if (!editingTeam || !editingPlayer) return;
    
    const existingIndex = editingTeam.players.findIndex(p => p.id === editingPlayer.id);
    let updatedPlayers: Player[];
    
    if (existingIndex >= 0) {
      updatedPlayers = [...editingTeam.players];
      updatedPlayers[existingIndex] = editingPlayer;
    } else {
      updatedPlayers = [...editingTeam.players, editingPlayer];
    }
    
    const updatedTeam = { 
      ...editingTeam, 
      players: updatedPlayers,
      updatedAt: new Date().toISOString(),
    };
    
    const teamIndex = teams.findIndex(t => t.id === updatedTeam.id);
    const newTeams = [...teams];
    if (teamIndex >= 0) {
      newTeams[teamIndex] = updatedTeam;
    } else {
      newTeams.push(updatedTeam);
    }
    
    saveTeams(newTeams);
    setEditingTeam(updatedTeam);
    setEditingPlayer(null);
    setActiveTab('edit');
  };

  // 删除队员
  const deletePlayer = (playerId: string) => {
    if (!editingTeam) return;
    if (!confirm('确定要删除这个队员吗？')) return;
    
    const updatedTeam = {
      ...editingTeam,
      players: editingTeam.players.filter(p => p.id !== playerId),
      updatedAt: new Date().toISOString(),
    };
    
    const teamIndex = teams.findIndex(t => t.id === updatedTeam.id);
    const newTeams = [...teams];
    newTeams[teamIndex] = updatedTeam;
    
    saveTeams(newTeams);
    setEditingTeam(updatedTeam);
  };

  // 查询Steam数据
  const querySteamData = async (steamId: string) => {
    if (!steamId) return;
    
    setIsLoading(true);
    try {
      const steamId64 = toSteamId64(steamId);
      if (!steamId64) {
        alert('无效的Steam ID');
        return;
      }
      
      const data = await getCompletePlayerData(steamId64);
      
      if (editingPlayer) {
        const recentStats = calculateRecentStats(data.recentMatches);
        
        // 从近期战绩提取擅长英雄
        let topHeroes = recentStats?.topHeroes?.map(h => h.heroId) || [];
        
        // 如果战绩数据不够，用总体数据补充
        if (topHeroes.length < 5 && data.heroStats) {
          const sortedHeroes = data.heroStats
            .sort((a, b) => b.games - a.games)
            .slice(0, 5)
            .map(h => parseInt(h.hero_id));
          
          // 合并去重
          topHeroes = [...new Set([...topHeroes, ...sortedHeroes])].slice(0, 5);
        }
        
        setEditingPlayer({
          ...editingPlayer,
          steamId,
          steamId64,
          name: data.profile?.personaname || editingPlayer.name,
          avatar: data.profile?.avatar,
          steamData: {
            rank: data.rank?.rank_tier,
            leaderboardRank: data.rank?.leaderboard_rank,
            wins: data.winLoss?.win,
            losses: data.winLoss?.lose,
            lastMatchDate: data.recentMatches?.[0]?.start_time?.toString(),
          },
          ...(recentStats && { recentStats }),
          // 如果还没有设置招牌英雄，自动填入近期常用英雄
          signatureHeroes: editingPlayer.signatureHeroes.length > 0 
            ? editingPlayer.signatureHeroes 
            : topHeroes.slice(0, 3),
          goodHeroes: editingPlayer.goodHeroes.length > 0 
            ? editingPlayer.goodHeroes 
            : topHeroes.slice(3),
        });
      }
    } catch (error) {
      alert('查询失败，请检查Steam ID是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  // 英雄选择器
  const HeroSelector = ({ 
    selected, 
    onSelect, 
    max = 10, 
    label 
  }: { 
    selected: number[]; 
    onSelect: (heroes: number[]) => void; 
    max?: number;
    label: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="hero-selector">
        <label>{label} ({selected.length}/{max})</label>
        <div className="selected-heroes" onClick={() => setIsOpen(!isOpen)}>
          {selected.length === 0 ? (
            <span className="placeholder">点击选择英雄</span>
          ) : (
            selected.map(heroId => {
              const hero = heroesData.find(h => h.id === heroId);
              return (
                <img 
                  key={heroId} 
                  src={hero?.image} 
                  alt={hero?.localizedName}
                  className="selected-hero-img"
                  title={hero?.localizedName}
                />
              );
            })
          )}
        </div>
        
        {isOpen && (
          <div className="hero-dropdown">
            <div className="hero-grid-small">
              {heroesData.map(hero => (
                <button
                  key={hero.id}
                  className={`hero-option ${selected.includes(hero.id) ? 'selected' : ''}`}
                  onClick={() => {
                    if (selected.includes(hero.id)) {
                      onSelect(selected.filter(id => id !== hero.id));
                    } else if (selected.length < max) {
                      onSelect([...selected, hero.id]);
                    }
                  }}
                >
                  <img src={hero.image} alt={hero.localizedName} />
                  <span>{hero.localizedName}</span>
                </button>
              ))}
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>完成</button>
          </div>
        )}
      </div>
    );
  };

  // 队伍列表界面
  if (activeTab === 'list') {
    return (
      <div className="team-manager">
        <div className="manager-header">
          <h3>🎮 念爱杯队伍管理</h3>
          <button className="btn-primary small" onClick={createTeam}>
            + 新建队伍
          </button>
        </div>
        
        {teams.length === 0 ? (
          <div className="empty-state">
            <p>还没有队伍</p>
            <button className="btn-primary" onClick={createTeam}>
              创建第一支队伍
            </button>
          </div>
        ) : (
          <div className="teams-list">
            {teams.map(team => (
              <div 
                key={team.id} 
                className={`team-card ${selectedTeamId === team.id ? 'selected' : ''} ${team.isMainTeam ? 'main-team' : ''}`}
              >
                <div className="team-info" onClick={() => onSelectTeam?.(team)}>
                  <div className="team-header-row">
                    <h4>{team.name}</h4>
                    {team.isMainTeam && <span className="main-badge">⭐ 主队</span>}
                  </div>
                  <p className="team-desc">{team.description || '暂无描述'}</p>
                  <p className="team-stats">
                    队员: {team.players.length}人 | 
                    更新: {new Date(team.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="team-actions">
                  {!team.isMainTeam && (
                    <button 
                      className="btn-main" 
                      onClick={(e) => handleSetMainTeam(team.id, e)}
                      title="设定为主队"
                    >
                      设为主队
                    </button>
                  )}
                  <button onClick={() => editTeam(team)}>管理</button>
                  <button className="danger" onClick={() => deleteTeam(team.id)}>删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 编辑队伍界面
  if (activeTab === 'edit' && editingTeam) {
    return (
      <div className="team-manager">
        <div className="manager-header">
          <button className="btn-back" onClick={() => setActiveTab('list')}>
            ← 返回
          </button>
          <h3>编辑队伍</h3>
        </div>
        
        <div className="team-form">
          <div className="form-group">
            <label>队伍名称</label>
            <input
              type="text"
              value={editingTeam.name}
              onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })}
              placeholder="输入队伍名称"
            />
          </div>
          
          <div className="form-group">
            <label>队伍描述</label>
            <textarea
              value={editingTeam.description || ''}
              onChange={e => setEditingTeam({ ...editingTeam, description: e.target.value })}
              placeholder="输入队伍描述（可选）"
              rows={3}
            />
          </div>
          
          <button className="btn-primary" onClick={saveTeam}>
            保存队伍
          </button>
        </div>
        
        <div className="players-section">
          <div className="section-header">
            <h4>队员列表 ({editingTeam.players.length})</h4>
            <button className="btn-secondary" onClick={() => editPlayer(editingTeam)}>
              + 添加队员
            </button>
          </div>
          
          {editingTeam.players.length === 0 ? (
            <p className="empty-text">还没有队员，点击上方按钮添加</p>
          ) : (
            <div className="players-list">
              {editingTeam.players.map(player => (
                <div key={player.id} className="player-card">
                  <img 
                    src={player.avatar || '/default-avatar.png'} 
                    alt="" 
                    className="player-avatar"
                  />
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                    <span className="player-position">
                      {player.position.map(p => positionNames[p]).join(', ')}
                    </span>
                    {player.steamData?.rank && (
                      <span className="player-rank">
                        {getRankName(player.steamData.rank)}
                      </span>
                    )}
                  </div>
                  <div className="player-heroes">
                    {player.signatureHeroes.slice(0, 3).map(heroId => {
                      const hero = heroesData.find(h => h.id === heroId);
                      return (
                        <img 
                          key={heroId} 
                          src={hero?.image} 
                          alt={hero?.localizedName}
                          title={hero?.localizedName}
                        />
                      );
                    })}
                  </div>
                  <div className="player-actions">
                    <button onClick={() => editPlayer(editingTeam, player)}>编辑</button>
                    <button className="danger" onClick={() => deletePlayer(player.id)}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 编辑队员界面
  if (activeTab === 'player' && editingTeam && editingPlayer) {
    return (
      <div className="team-manager">
        <div className="manager-header">
          <button className="btn-back" onClick={() => setActiveTab('edit')}>
            ← 返回
          </button>
          <h3>{editingPlayer.id.includes('-') ? '编辑队员' : '添加队员'}</h3>
        </div>
        
        <div className="player-form">
          {/* Steam ID 查询 */}
          <div className="form-group steam-query">
            <label>Steam ID / SteamID64</label>
            <div className="input-group">
              <input
                type="text"
                value={editingPlayer.steamId || ''}
                onChange={e => setEditingPlayer({ ...editingPlayer, steamId: e.target.value })}
                placeholder="输入Steam ID (如: 123456789 或 STEAM_0:1:123456)"
              />
              <button 
                className="btn-primary" 
                onClick={() => querySteamData(editingPlayer.steamId || '')}
                disabled={isLoading || !editingPlayer.steamId}
              >
                {isLoading ? '查询中...' : '🔍 查询天梯数据'}
              </button>
            </div>
            <p className="hint">支持17位数字ID、SteamID格式，查询后会自动获取天梯段位和近期战绩</p>
          </div>
          
          {/* Steam数据显示 */}
          {editingPlayer.steamData && (
            <div className="steam-data">
              <h4>📊 Steam数据</h4>
              <div className="data-grid">
                {editingPlayer.avatar && (
                  <img src={editingPlayer.avatar} alt="" className="steam-avatar" />
                )}
                <div className="data-item">
                  <span className="label">天梯段位</span>
                  <span className="value rank">{getRankName(editingPlayer.steamData.rank)}</span>
                </div>
                {editingPlayer.steamData.leaderboardRank && (
                  <div className="data-item">
                    <span className="label">排行榜</span>
                    <span className="value highlight">#{editingPlayer.steamData.leaderboardRank}</span>
                  </div>
                )}
                <div className="data-item">
                  <span className="label">总场次</span>
                  <span className="value">
                    {((editingPlayer.steamData.wins || 0) + (editingPlayer.steamData.losses || 0)).toLocaleString()}场
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">胜率</span>
                  <span className="value">
                    {editingPlayer.steamData.wins && editingPlayer.steamData.losses
                      ? Math.round((editingPlayer.steamData.wins / (editingPlayer.steamData.wins + editingPlayer.steamData.losses)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
              
              {/* 近期战绩 */}
              {editingPlayer.recentStats && (
                <div className="recent-stats">
                  <h5>近期20场战绩</h5>
                  <div className="stats-row">
                    <span className={`win-rate ${(editingPlayer.recentStats.winRate) >= 50 ? 'good' : 'bad'}`}>
                      {editingPlayer.recentStats.winRate}% 胜率
                    </span>
                    <span>{editingPlayer.recentStats.wins}胜 / {editingPlayer.recentStats.matches - editingPlayer.recentStats.wins}负</span>
                  </div>
                  <div className="top-heroes">
                    <span>常用英雄:</span>
                    {editingPlayer.recentStats.topHeroes.map(h => {
                      const hero = heroesData.find(hero => hero.id === h.heroId);
                      return (
                        <div key={h.heroId} className="top-hero" title={`${hero?.localizedName} - ${h.games}场 ${h.winRate}%胜率`}>
                          <img src={hero?.image} alt={hero?.localizedName} />
                          <span className="games">{h.games}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 基本信息 */}
          <div className="form-group">
            <label>队员昵称 *</label>
            <input
              type="text"
              value={editingPlayer.name}
              onChange={e => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
              placeholder="输入队员昵称"
            />
          </div>
          
          {/* 位置选择 */}
          <div className="form-group">
            <label>擅长位置</label>
            <div className="position-selector">
              {[1, 2, 3, 4, 5].map(pos => (
                <label key={pos} className="position-checkbox">
                  <input
                    type="checkbox"
                    checked={editingPlayer.position.includes(pos as Position)}
                    onChange={e => {
                      if (e.target.checked) {
                        setEditingPlayer({ 
                          ...editingPlayer, 
                          position: [...editingPlayer.position, pos as Position].sort() 
                        });
                      } else {
                        setEditingPlayer({ 
                          ...editingPlayer, 
                          position: editingPlayer.position.filter(p => p !== pos) 
                        });
                      }
                    }}
                  />
                  <span>{positionNames[pos as Position]}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* 英雄选择 */}
          <HeroSelector
            label="招牌英雄（最擅长）"
            selected={editingPlayer.signatureHeroes}
            onSelect={heroes => setEditingPlayer({ ...editingPlayer, signatureHeroes: heroes })}
            max={5}
          />
          
          <HeroSelector
            label="熟练英雄（会玩）"
            selected={editingPlayer.goodHeroes}
            onSelect={heroes => setEditingPlayer({ ...editingPlayer, goodHeroes: heroes })}
            max={10}
          />
          
          <HeroSelector
            label="避免英雄（尽量不选）"
            selected={editingPlayer.avoidHeroes}
            onSelect={heroes => setEditingPlayer({ ...editingPlayer, avoidHeroes: heroes })}
            max={5}
          />
          
          {/* 打法风格 */}
          <div className="form-group">
            <label>打法风格</label>
            <input
              type="text"
              value={editingPlayer.playstyle || ''}
              onChange={e => setEditingPlayer({ ...editingPlayer, playstyle: e.target.value })}
              placeholder="如：激进型、发育型、节奏型等"
            />
          </div>
          
          {/* 备注 */}
          <div className="form-group">
            <label>备注</label>
            <textarea
              value={editingPlayer.notes || ''}
              onChange={e => setEditingPlayer({ ...editingPlayer, notes: e.target.value })}
              placeholder="其他备注信息"
              rows={2}
            />
          </div>
          
          <button className="btn-primary" onClick={savePlayer} disabled={!editingPlayer.name}>
            保存队员
          </button>
        </div>
      </div>
    );
  }

  return null;
}
