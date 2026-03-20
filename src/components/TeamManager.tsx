import { useState, useEffect, useCallback } from 'react';
import type { Team, Player } from '@/types/team';
import { 
  loadTeamsFromStorage, 
  saveTeamsToStorage, 
  setMainTeam,
  upsertPlayer,
  generateId, 
  positionNames,
} from '@/types/team';
import { getRankName } from '@/services/opendota';
import { PlayerPool } from './PlayerPool';
import heroesData from '@/data/heroes.json';
import './TeamManager.css';

interface TeamManagerProps {
  onSelectTeam?: (team: Team | null) => void;
  selectedTeamId?: string | null;
}

export function TeamManager({ onSelectTeam, selectedTeamId }: TeamManagerProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'edit' | 'add-from-pool'>('list');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

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

  // 从玩家池添加成员
  const addPlayerFromPool = (player: Player) => {
    if (!editingTeam) return;
    
    // 检查是否已在队伍中
    if (editingTeam.players.some(p => p.id === player.id)) {
      alert('该玩家已在队伍中！');
      return;
    }
    
    const updatedPlayers = [...editingTeam.players, player];
    const updatedTeam = {
      ...editingTeam,
      players: updatedPlayers,
      updatedAt: new Date().toISOString(),
    };
    
    const teamIndex = teams.findIndex(t => t.id === updatedTeam.id);
    const newTeams = [...teams];
    if (teamIndex >= 0) {
      newTeams[teamIndex] = updatedTeam;
    }
    
    saveTeams(newTeams);
    
    // 更新玩家的teamIds
    const updatedPlayer = {
      ...player,
      teamIds: [...new Set([...(player.teamIds || []), editingTeam.id])]
    };
    upsertPlayer(updatedPlayer);
    
    setEditingTeam(updatedTeam);
    setActiveTab('edit');
    alert(`已将 ${player.name} 添加到队伍！`);
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
            <button className="btn-secondary" onClick={() => setActiveTab('add-from-pool')}>
              📋 从玩家池添加
            </button>
          </div>
          
          {editingTeam.players.length === 0 ? (
            <p className="empty-text">还没有队员，点击上方按钮添加</p>
          ) : (
            <div className="players-list">
              {editingTeam.players.map(player => (
                <div key={player.id} className="player-card">
                  <img 
                    src={player.avatar || '/default-avatar.svg'} 
                    alt="" 
                    className="player-avatar"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }}
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

  // 从玩家池添加成员界面
  if (activeTab === 'add-from-pool' && editingTeam) {
    return (
      <div className="team-manager">
        <div className="manager-header">
          <button className="btn-back" onClick={() => setActiveTab('edit')}>
            ← 返回
          </button>
          <h3>从选手池添加成员 - {editingTeam.name}</h3>
        </div>
        
        <PlayerPool 
          onSelectPlayer={addPlayerFromPool}
          selectionMode={true}
        />
      </div>
    );
  }

  return null;
}
