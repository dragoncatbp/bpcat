import { useState, useEffect, useMemo, useRef } from 'react';
import type { Player, Position, Team } from '@/types/team';
import { 
  loadPlayersPool, 
  deletePlayer, 
  upsertPlayer,
  generateId,
  positionNames,
  getRating,
  playsCore,
  playsSupport,
  loadTeamsFromStorage,
  toSteamId64,
} from '@/types/team';
import { 
  getCompletePlayerData, 
  calculateRecentStats, 
  getRankName 
} from '@/services/opendota';
import heroesData from '@/data/heroes.json';
import { heroAliases } from '@/data/heroAliases';
import './PlayerPool.css';

interface PlayerPoolProps {
  onSelectPlayer?: (_player: Player) => void;
  selectionMode?: boolean;
}

export function PlayerPool({ onSelectPlayer, selectionMode }: PlayerPoolProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<{[key: string]: string}>({});
  const [filter, setFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState<Position | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  
  // 导入导出状态
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportCode, setExportCode] = useState('');
  
  // 排序状态 - maxRating 按最高分排序，team 按队伍+位置排序
  const [sortBy, setSortBy] = useState<'name' | 'position' | 'maxRating' | 'team'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 处理表头点击排序
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      // 同一字段，切换排序方向
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 新字段，设置默认排序方向
      setSortBy(field);
      // 评分默认降序（高分在前），其他默认升序
      if (field === 'maxRating') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
  };
  
  // 获取选手最高分（核心或辅助）
  const getMaxRating = (player: Player) => {
    const core = getRating(player.ratings, 'core') || 0;
    const support = getRating(player.ratings, 'support') || 0;
    return Math.max(core, support);
  };
  
  // 渲染排序箭头
  const SortArrow = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) return <span className="sort-arrow">↕</span>;
    return <span className="sort-arrow active">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  // 加载数据
  useEffect(() => {
    const loadedPlayers = loadPlayersPool();
    setPlayers(loadedPlayers);
    
    // 加载队伍名称映射
    const teamsList = loadTeamsFromStorage();
    const teamsMap: {[key: string]: string} = {};
    teamsList.forEach(t => teamsMap[t.id] = t.name);
    setTeams(teamsMap);
  }, []);

  // 保存玩家
  const savePlayer = (player: Player) => {
    upsertPlayer(player);
    setPlayers(loadPlayersPool());
    setShowForm(false);
    setEditingPlayer(null);
  };

  // 删除玩家
  const handleDelete = (playerId: string) => {
    if (confirm('确定要删除这个玩家吗？')) {
      deletePlayer(playerId);
      setPlayers(loadPlayersPool());
    }
  };

  // 导出数据 - 生成分享码（精简字段 + 压缩 + 支持中文）
  const handleExport = () => {
    const teams = loadTeamsFromStorage();
    
    // 1. 精简字段：只保留核心数据，移除大字段和可实时获取的数据
    const essentialPlayers = players.map(p => ({
      id: p.id,
      n: p.name,           // name -> n
      sid: p.steamId,      // steamId -> sid
      pos: p.position,     // position -> pos
      tids: p.teamIds || [], // teamIds -> tids
      r: p.ratings || {},  // ratings -> r
      sch: p.signatureCoreHeroes || [],     // signatureCoreHeroes -> sch
      ssh: p.signatureSupportHeroes || [],  // signatureSupportHeroes -> ssh
      // 移除：avatar, steamData, recentStats, playstyle, notes, steamId64
    }));
    
    // 2. 精简队伍字段
    const essentialTeams = teams.map(t => ({
      id: t.id,
      n: t.name,           // name -> n
      d: t.description,    // description -> d
      p: t.players.map(tp => tp.id), // 只存玩家ID，不存完整玩家数据
      c: t.createdAt,      // createdAt -> c
      u: t.updatedAt,      // updatedAt -> u
      cap: t.captainId,    // captainId -> cap
      main: t.isMainTeam,  // isMainTeam -> main
    }));
    
    const data = { 
      v: '2.0',            // version -> v
      t: new Date().toISOString(), // exportedAt -> t
      p: essentialPlayers, // players -> p
      tm: essentialTeams,  // teams -> tm
    };
    
    // 3. 压缩：使用 encodeURIComponent + Base64
    const jsonStr = JSON.stringify(data);
    const encoded = encodeURIComponent(jsonStr);
    const code = btoa(encoded);
    setExportCode(code);
    setShowExportDialog(true);
  };

  // 导入数据 - 解析分享码（解压 + 支持中文 + 自动生成队伍）
  const handleImport = (mode: 'merge' | 'replace') => {
    try {
      // 先 Base64 解码，再 decodeURIComponent 处理中文
      const decoded = decodeURIComponent(atob(importCode));
      const data = JSON.parse(decoded);
      
      // 判断版本：v2.0 是压缩格式，其他是老格式
      const isCompressed = data.v === '2.0';
      
      let importedPlayers: Player[];
      let importedTeams: any[];
      
      if (isCompressed) {
        // v2.0 压缩格式：解压字段名
        importedPlayers = data.p.map((ep: any) => ({
          id: ep.id,
          name: ep.n,
          steamId: ep.sid,
          position: ep.pos,
          teamIds: ep.tids,
          ratings: ep.r,
          signatureCoreHeroes: ep.sch,
          signatureSupportHeroes: ep.ssh,
          // 头像和其他字段会根据 steamId 自动获取
        } as Player));
        
        importedTeams = data.tm?.map((et: any) => ({
          id: et.id,
          name: et.n,
          description: et.d,
          players: et.p, // 这里存的是玩家ID数组
          createdAt: et.c,
          updatedAt: et.u,
          captainId: et.cap,
          isMainTeam: et.main,
        })) || [];
      } else {
        // 老格式兼容
        importedPlayers = data.players || [];
        importedTeams = data.teams || [];
      }
      
      if (!importedPlayers || importedPlayers.length === 0) {
        alert('分享码中没有玩家数据');
        return;
      }
      
      // 获取现有队伍
      const existingTeams = loadTeamsFromStorage();
      const existingTeamIds = new Set(existingTeams.map(t => t.id));
      const existingTeamNames = new Set(existingTeams.map(t => t.name));
      
      // 导入玩家
      if (mode === 'replace') {
        // 替换：清空现有数据，导入新数据
        importedPlayers.forEach((p: Player) => upsertPlayer(p));
      } else {
        // 合并：按ID去重，保留本地数据
        const existingIds = new Set(players.map(p => p.id));
        const newPlayers = importedPlayers.filter((p: Player) => !existingIds.has(p.id));
        newPlayers.forEach((p: Player) => upsertPlayer(p));
      }
      
      // 根据 teamIds 自动生成队伍
      if (importedTeams.length > 0) {
        const newTeams = [...existingTeams];
        const allImportedPlayers = loadPlayersPool(); // 重新加载获取完整玩家列表
        
        importedTeams.forEach((importedTeam: any) => {
          // 检查队伍ID是否已存在
          if (!existingTeamIds.has(importedTeam.id)) {
            // 检查队伍名称是否冲突，如果冲突则重命名
            let teamName = importedTeam.name;
            let counter = 1;
            while (existingTeamNames.has(teamName)) {
              teamName = `${importedTeam.name} (${counter})`;
              counter++;
            }
            
            // 根据玩家ID列表获取完整玩家数据
            const teamPlayerIds = importedTeam.players || [];
            const teamPlayers = allImportedPlayers.filter((p: Player) => 
              teamPlayerIds.includes(p.id)
            );
            
            newTeams.push({
              ...importedTeam,
              name: teamName,
              players: teamPlayers,
              updatedAt: new Date().toISOString()
            } as Team);
            existingTeamNames.add(teamName);
            existingTeamIds.add(importedTeam.id);
          }
        });
        
        localStorage.setItem('bpcat_teams', JSON.stringify(newTeams));
      }
      
      setPlayers(loadPlayersPool());
      setShowImportDialog(false);
      setImportCode('');
      alert(`导入成功！共导入 ${importedPlayers.length} 名玩家，${importedTeams.length} 个队伍`);
    } catch (e) {
      console.error('导入错误:', e);
      alert('解析失败，请检查分享码');
    }
  };

  // 更新评分
  const updateRating = (
    player: Player, 
    type: 'core' | 'support', 
    value: number
  ) => {
    const newRatings = {
      ...player.ratings,
      [type]: {
        score: value
      },
      updatedAt: new Date().toISOString()
    };
    
    const updatedPlayer = { ...player, ratings: newRatings };
    savePlayer(updatedPlayer);
  };

  // 获取玩家所在队伍名称
  const getPlayerTeams = (player: Player) => {
    if (!player.teamIds || player.teamIds.length === 0) return '未分配';
    return player.teamIds.map(id => teams[id] || '未知队伍').join(', ');
  };

  // 筛选和排序玩家
  const filteredPlayers = useMemo(() => {
    let result = players.filter(p => {
      const matchesFilter = !filter || 
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.steamId?.includes(filter);
      
      const matchesPosition = positionFilter === 'all' || 
        p.position.map(pos => Number(pos)).includes(Number(positionFilter));
      
      return matchesFilter && matchesPosition;
    });
    
    // 排序
    result = [...result].sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'position':
          // 按最小位置排序（主位置），小的在前（1号位最前）
          const minPosA = Math.min(...a.position);
          const minPosB = Math.min(...b.position);
          compareValue = minPosA - minPosB;
          break;
        case 'maxRating':
          // 按最高分排序（核心或辅助的最高分）
          const maxA = getMaxRating(a);
          const maxB = getMaxRating(b);
          compareValue = maxA - maxB;
          break;
        case 'team':
          // 先按队伍排序
          const teamA = getPlayerTeams(a);
          const teamB = getPlayerTeams(b);
          compareValue = teamA.localeCompare(teamB);
          // 如果队伍相同，按位置排序（1-5号位）
          if (compareValue === 0) {
            const posA = Math.min(...a.position);
            const posB = Math.min(...b.position);
            compareValue = posA - posB;
          }
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
    
    return result;
  }, [players, filter, positionFilter, sortBy, sortOrder]);

  // 获取英雄名称
  const getHeroName = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.localizedName || `Hero ${heroId}`;
  };

  // 获取英雄图片
  const getHeroImage = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.image || '';
  };

  // 渲染评分行
  const RatingRow = ({ 
    player, 
    type 
  }: { 
    player: Player; 
    type: 'core' | 'support';
  }) => {
    const score = getRating(player.ratings, type);
    const label = type === 'core' ? '核心' : '辅助';
    
    return (
      <div className="rating-row-simple">
        <span className={`rating-label ${type}`}>{label}</span>
        <select 
          className={`rating-select-simple ${score >= 10 ? 'excellent' : score >= 8 ? 'good' : score >= 5 ? 'average' : score > 0 ? 'poor' : ''}`}
          value={score || ''}
          onChange={(e) => updateRating(player, type, Number(e.target.value) || 0)}
        >
          <option value="">未评分</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num}分</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="player-management">
      <div className="player-mgmt-header">
        <h3>👥 玩家管理</h3>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowImportDialog(true)}>
            📥 导入
          </button>
          <button className="btn-secondary" onClick={handleExport}>
            📤 导出
          </button>
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingPlayer(null);
              setShowForm(true);
            }}
          >
            ➕ 添加玩家
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="player-filters">
        <input
          type="text"
          className="filter-input"
          placeholder="搜索玩家昵称或Steam ID..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select 
          className="filter-select"
          value={positionFilter}
          onChange={(e) => {
            const value = e.target.value;
            setPositionFilter(value === 'all' ? 'all' : Number(value) as Position);
          }}
        >
          <option value="all">所有位置</option>
          {([1, 2, 3, 4, 5] as Position[]).map(pos => (
            <option key={pos} value={pos}>{positionNames[pos]}</option>
          ))}
        </select>
      </div>

      {/* 统计信息 */}
      <div className="players-stats">
        <span>共 {filteredPlayers.length} 名玩家</span>
        {filter && <span>（筛选自 {players.length} 名）</span>}
      </div>

      {/* 玩家列表 */}
      <div className="players-table-container">
        <table className="players-table v2">
          <thead>
            <tr>
              <th className="col-player sortable" onClick={() => handleSort('name')}>
                玩家信息 <SortArrow field="name" />
              </th>
              <th className="col-position sortable" onClick={() => handleSort('position')}>
                位置 <SortArrow field="position" />
              </th>
              <th className="col-ratings sortable" onClick={() => handleSort('maxRating')}>
                评分 <SortArrow field="maxRating" />
              </th>
              <th className="col-heroes">擅长英雄</th>
              <th className="col-team sortable" onClick={() => handleSort('team')}>
                所在队伍 <SortArrow field="team" />
              </th>
              {!selectionMode && <th className="col-actions">操作</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map(player => {
              const hasCore = playsCore(player.position);
              const hasSupport = playsSupport(player.position);
              const rowSpan = (hasCore ? 1 : 0) + (hasSupport ? 1 : 0);
              
              return (
                <>
                  {/* 核心评分行（如果有核心位） */}
                  {hasCore && (
                    <tr key={`${player.id}-core`} className="player-row core-row">
                      {rowSpan > 0 && (
                        <td rowSpan={rowSpan} className="col-player">
                          <div className="player-avatar-name">
                            <img 
                              src={player.avatar || '/default-avatar.svg'} 
                              alt="" 
                              className="player-avatar-small"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }}
                            />
                            <div className="player-name-id">
                              <span className="player-name">{player.name}</span>
                              {player.steamId && (
                                <span className="player-steam-id">{player.steamId}</span>
                              )}
                            </div>
                          </div>
                        </td>
                      )}
                      {rowSpan > 0 && (
                        <td rowSpan={rowSpan} className="col-position">
                          <div className="position-tags">
                            {player.position.map(pos => (
                              <span key={pos} className={`position-tag pos-${pos}`}>
                                {pos}号
                              </span>
                            ))}
                          </div>
                        </td>
                      )}
                      <td className="col-ratings">
                        <RatingRow player={player} type="core" />
                      </td>
                      <td className="col-heroes">
                        <div className="hero-icons-small">
                          {(player.signatureCoreHeroes || []).slice(0, 6).map(heroId => (
                            <img 
                              key={heroId}
                              src={getHeroImage(heroId)}
                              alt={getHeroName(heroId)}
                              title={getHeroName(heroId)}
                              className="hero-icon-small"
                            />
                          ))}
                          {(player.signatureCoreHeroes || []).length > 6 && (
                            <span className="more-heroes">+{(player.signatureCoreHeroes || []).length - 6}</span>
                          )}
                          {(player.signatureCoreHeroes || []).length === 0 && (
                            <span className="no-heroes">-</span>
                          )}
                        </div>
                      </td>
                      {rowSpan > 0 && (
                        <td rowSpan={rowSpan} className="col-team">
                          <span className="team-name">{getPlayerTeams(player)}</span>
                        </td>
                      )}
                      {rowSpan > 0 && (
                        <td rowSpan={rowSpan} className="col-actions">
                          <div className="action-buttons">
                            {selectionMode ? (
                              <button 
                                className="btn-select"
                                onClick={() => onSelectPlayer?.(player)}
                              >
                                选择
                              </button>
                            ) : (
                              <>
                                <button 
                                  className="btn-icon"
                                  onClick={() => {
                                    setEditingPlayer(player);
                                    setShowForm(true);
                                  }}
                                  title="编辑"
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon btn-delete"
                                  onClick={() => handleDelete(player.id)}
                                  title="删除"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )}
                  
                  {/* 辅助评分行（如果有辅助位） */}
                  {hasSupport && (
                    <tr key={`${player.id}-support`} className="player-row support-row">
                      {!hasCore && (
                        <>
                          <td className="col-player">
                            <div className="player-avatar-name">
                              <img 
                                src={player.avatar || '/default-avatar.svg'} 
                                alt="" 
                                className="player-avatar-small"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }}
                              />
                              <div className="player-name-id">
                                <span className="player-name">{player.name}</span>
                                {player.steamId && (
                                  <span className="player-steam-id">{player.steamId}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="col-position">
                            <div className="position-tags">
                              {player.position.map(pos => (
                                <span key={pos} className={`position-tag pos-${pos}`}>
                                  {pos}号
                                </span>
                              ))}
                            </div>
                          </td>
                        </>
                      )}
                      <td className="col-ratings">
                        <RatingRow player={player} type="support" />
                      </td>
                      {hasCore && (
                        <td className="col-heroes">
                          <div className="hero-icons-small">
                            {(player.signatureSupportHeroes || []).slice(0, 6).map(heroId => (
                              <img 
                                key={heroId}
                                src={getHeroImage(heroId)}
                                alt={getHeroName(heroId)}
                                title={getHeroName(heroId)}
                                className="hero-icon-small"
                              />
                            ))}
                            {(player.signatureSupportHeroes || []).length > 6 && (
                              <span className="more-heroes">+{(player.signatureSupportHeroes || []).length - 6}</span>
                            )}
                            {(player.signatureSupportHeroes || []).length === 0 && (
                              <span className="no-heroes">-</span>
                            )}
                          </div>
                        </td>
                      )}
                      {!hasCore && (
                        <>
                          <td className="col-heroes">
                            <div className="hero-icons-small">
                              {(player.signatureSupportHeroes || []).slice(0, 6).map(heroId => (
                                <img 
                                  key={heroId}
                                  src={getHeroImage(heroId)}
                                  alt={getHeroName(heroId)}
                                  title={getHeroName(heroId)}
                                  className="hero-icon-small"
                                />
                              ))}
                              {(player.signatureSupportHeroes || []).length > 6 && (
                                <span className="more-heroes">+{(player.signatureSupportHeroes || []).length - 6}</span>
                              )}
                              {(player.signatureSupportHeroes || []).length === 0 && (
                                <span className="no-heroes">-</span>
                              )}
                            </div>
                          </td>
                          <td className="col-team">
                            <span className="team-name">{getPlayerTeams(player)}</span>
                          </td>
                          <td className="col-actions">
                            <div className="action-buttons">
                              {selectionMode ? (
                                <button 
                                  className="btn-select"
                                  onClick={() => onSelectPlayer?.(player)}
                                >
                                  选择
                                </button>
                              ) : (
                                <>
                                  <button 
                                    className="btn-icon"
                                    onClick={() => {
                                      setEditingPlayer(player);
                                      setShowForm(true);
                                    }}
                                    title="编辑"
                                  >
                                    ✏️
                                  </button>
                                  <button 
                                    className="btn-icon btn-delete"
                                    onClick={() => handleDelete(player.id)}
                                    title="删除"
                                  >
                                    🗑️
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        
        {filteredPlayers.length === 0 && (
          <div className="empty-players">
            <p>暂无玩家数据</p>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingPlayer(null);
                setShowForm(true);
              }}
            >
              添加第一个玩家
            </button>
          </div>
        )}
      </div>

      {/* 添加/编辑玩家表单弹窗 */}
      {showForm && (
        <PlayerForm 
          player={editingPlayer}
          onSave={savePlayer}
          onCancel={() => {
            setShowForm(false);
            setEditingPlayer(null);
          }}
        />
      )}
      
      {/* 导出对话框 */}
      {showExportDialog && (
        <div className="dialog-overlay" onClick={() => setShowExportDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h4>📤 导出分享码</h4>
            <p>复制下方代码分享给你的队友：</p>
            <textarea 
              className="code-textarea"
              value={exportCode} 
              readOnly 
              rows={4}
            />
            <div className="dialog-actions">
              <button 
                className="btn-primary" 
                onClick={() => {
                  navigator.clipboard.writeText(exportCode);
                  alert('已复制到剪贴板！');
                }}
              >
                复制
              </button>
              <button className="btn-secondary" onClick={() => setShowExportDialog(false)}>
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 导入对话框 */}
      {showImportDialog && (
        <div className="dialog-overlay" onClick={() => setShowImportDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h4>📥 导入分享码</h4>
            <p>粘贴分享码导入玩家和队伍数据：</p>
            <textarea 
              className="code-textarea"
              value={importCode} 
              onChange={e => setImportCode(e.target.value)}
              placeholder="粘贴分享码..."
              rows={4}
            />
            <div className="dialog-actions">
              <button 
                className="btn-primary" 
                onClick={() => handleImport('merge')}
                disabled={!importCode}
              >
                合并导入
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => handleImport('replace')}
                disabled={!importCode}
              >
                覆盖导入
              </button>
              <button className="btn-secondary" onClick={() => setShowImportDialog(false)}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 英雄选择器组件（搜索+下拉）
function HeroSelector({ onSelect }: { onSelect: (heroId: number) => void }) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 过滤英雄列表（支持别名模糊搜索）
  const filteredHeroes = useMemo(() => {
    if (!search.trim()) return []; // 不打字时不显示英雄
    const query = search.toLowerCase();
    
    return heroesData.filter(hero => {
      // 1. 匹配中文名
      if (hero.localizedName.toLowerCase().includes(query)) return true;
      
      // 2. 匹配英文名
      if (hero.name.toLowerCase().includes(query)) return true;
      
      // 3. 匹配别名（支持拼音、简称、俗称等）
      const aliases = heroAliases.find(a => a.heroId === hero.id)?.aliases || [];
      return aliases.some(alias => alias.toLowerCase().includes(query));
    }).slice(0, 15); // 最多显示15个
  }, [search]);

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredHeroes.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredHeroes[highlightedIndex]) {
        onSelect(filteredHeroes[highlightedIndex].id);
        setSearch('');
        setHighlightedIndex(0);
        inputRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="hero-selector-dropdown">
      <div className="hero-search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="搜索英雄名称..."
          className="hero-search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      {isOpen && filteredHeroes.length > 0 && (
        <div className="hero-dropdown-list">
          {filteredHeroes.map((hero, index) => (
            <div
              key={hero.id}
              className={`hero-dropdown-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => {
                onSelect(hero.id);
                setSearch('');
                setIsOpen(false);
                setHighlightedIndex(0);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <img 
                src={hero.image} 
                alt="" 
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="hero-name">{hero.localizedName}</span>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && search && filteredHeroes.length === 0 && (
        <div className="hero-dropdown-empty">
          未找到匹配的英雄
        </div>
      )}
    </div>
  );
}

// 玩家表单组件
function PlayerForm({ 
  player, 
  onSave, 
  onCancel 
}: { 
  player: Player | null;
  onSave: (player: Player) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Player>>({
    id: player?.id || generateId(),
    name: player?.name || '',
    steamId: player?.steamId || '',
    steamId64: player?.steamId64 || '',
    position: player?.position || [],
    signatureHeroes: player?.signatureHeroes || [],
    signatureCoreHeroes: player?.signatureCoreHeroes || player?.signatureHeroes || [],
    signatureSupportHeroes: player?.signatureSupportHeroes || [],
    playstyle: player?.playstyle || '',
    notes: player?.notes || '',
    ratings: player?.ratings,
    teamIds: player?.teamIds || [],
    avatar: player?.avatar || '',
    steamData: player?.steamData,
    recentStats: player?.recentStats,
  });
  const [isLoading, setIsLoading] = useState(false);

  // 选择位置
  const togglePosition = (pos: Position) => {
    const current = formData.position || [];
    if (current.includes(pos)) {
      setFormData({
        ...formData,
        position: current.filter(p => p !== pos)
      });
    } else {
      setFormData({
        ...formData,
        position: [...current, pos].sort()
      });
    }
  };

  // 添加核心英雄
  const addCoreHero = (heroId: number) => {
    const current = formData.signatureCoreHeroes || [];
    if (!current.includes(heroId) && current.length < 6) {
      setFormData({
        ...formData,
        signatureCoreHeroes: [...current, heroId]
      });
    }
  };

  // 移除核心英雄
  const removeCoreHero = (heroId: number) => {
    const current = formData.signatureCoreHeroes || [];
    setFormData({
      ...formData,
      signatureCoreHeroes: current.filter(h => h !== heroId)
    });
  };

  // 添加辅助英雄
  const addSupportHero = (heroId: number) => {
    const current = formData.signatureSupportHeroes || [];
    if (!current.includes(heroId) && current.length < 6) {
      setFormData({
        ...formData,
        signatureSupportHeroes: [...current, heroId]
      });
    }
  };

  // 移除辅助英雄
  const removeSupportHero = (heroId: number) => {
    const current = formData.signatureSupportHeroes || [];
    setFormData({
      ...formData,
      signatureSupportHeroes: current.filter(h => h !== heroId)
    });
  };

  // 查询Steam数据
  const querySteamData = async () => {
    const steamId = formData.steamId;
    if (!steamId) return;
    
    setIsLoading(true);
    try {
      const steamId64 = toSteamId64(steamId);
      if (!steamId64) {
        alert('无效的Steam ID');
        return;
      }
      
      const data = await getCompletePlayerData(steamId64);
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
      
      // 根据位置自动分配英雄
      const hasCore = (formData.position || []).some(p => p <= 3);
      const hasSupport = (formData.position || []).some(p => p >= 4);
      
      setFormData({
        ...formData,
        steamId,
        steamId64,
        name: data.profile?.personaname || formData.name,
        avatar: data.profile?.avatar,
        steamData: {
          rank: data.rank?.rank_tier,
          leaderboardRank: data.rank?.leaderboard_rank,
          wins: data.winLoss?.win,
          losses: data.winLoss?.lose,
          lastMatchDate: data.recentMatches?.[0]?.start_time?.toString(),
        },
        recentStats: recentStats || undefined,
        // 自动分配英雄到对应类别
        signatureCoreHeroes: hasCore && (formData.signatureCoreHeroes || []).length === 0
          ? topHeroes.slice(0, 3)
          : formData.signatureCoreHeroes,
        signatureSupportHeroes: hasSupport && (formData.signatureSupportHeroes || []).length === 0
          ? topHeroes.slice(0, 3)
          : formData.signatureSupportHeroes,
      });
    } catch (error) {
      alert('查询失败，请检查Steam ID是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.position?.length === 0) {
      alert('请填写昵称和至少一个位置');
      return;
    }
    onSave(formData as Player);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content player-form-modal">
        <h4>{player ? '编辑玩家' : '添加玩家'}</h4>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>昵称 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="玩家昵称"
              required
            />
          </div>

          <div className="form-group steam-query">
            <label>Steam ID / SteamID64</label>
            <div className="input-group">
              <input
                type="text"
                value={formData.steamId}
                onChange={(e) => setFormData({...formData, steamId: e.target.value})}
                placeholder="输入Steam ID (如: 123456789 或 STEAM_0:1:123456)"
              />
              <button 
                type="button"
                className="btn-primary" 
                onClick={querySteamData}
                disabled={isLoading || !formData.steamId}
              >
                {isLoading ? '查询中...' : '🔍 查询天梯数据'}
              </button>
            </div>
            <p className="hint">支持17位数字ID、SteamID格式，查询后会自动获取天梯段位和近期战绩</p>
          </div>
          
          {/* Steam数据显示 */}
          {formData.steamData && (
            <div className="steam-data-panel">
              <div className="steam-data-header">
                {formData.avatar && (
                  <img src={formData.avatar} alt="" className="steam-avatar" />
                )}
                <div className="steam-data-info">
                  <div className="data-item">
                    <span className="label">天梯段位</span>
                    <span className="value rank">{getRankName(formData.steamData.rank)}</span>
                  </div>
                  {formData.steamData.leaderboardRank && (
                    <div className="data-item">
                      <span className="label">排行榜</span>
                      <span className="value highlight">#{formData.steamData.leaderboardRank}</span>
                    </div>
                  )}
                  <div className="data-item">
                    <span className="label">总场次</span>
                    <span className="value">
                      {((formData.steamData.wins || 0) + (formData.steamData.losses || 0)).toLocaleString()}场
                    </span>
                  </div>
                </div>
              </div>
              
              {/* 近期战绩 */}
              {formData.recentStats && (
                <div className="recent-stats">
                  <h5>近期20场战绩</h5>
                  <div className="stats-row">
                    <span className={`win-rate ${formData.recentStats.winRate >= 50 ? 'good' : 'bad'}`}>
                      {formData.recentStats.winRate}% 胜率
                    </span>
                    <span>{formData.recentStats.wins}胜 / {formData.recentStats.matches - formData.recentStats.wins}负</span>
                  </div>
                  <div className="top-heroes">
                    <span>常用英雄:</span>
                    {formData.recentStats.topHeroes.slice(0, 5).map(h => {
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

          <div className="form-group">
            <label>擅长位置 *</label>
            <div className="position-selector">
              {(Object.keys(positionNames) as unknown as Position[]).map(pos => (
                <label 
                  key={pos} 
                  className={`position-checkbox ${formData.position?.includes(pos) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.position?.includes(pos) || false}
                    onChange={() => togglePosition(pos)}
                  />
                  <span>{positionNames[pos]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 核心英雄 */}
          <div className="form-group">
            <label>擅长核心英雄 ({formData.signatureCoreHeroes?.length || 0}/6)</label>
            
            {/* 已选择的核心英雄 */}
            {formData.signatureCoreHeroes && formData.signatureCoreHeroes.length > 0 && (
              <div className="selected-heroes-list core-heroes">
                {formData.signatureCoreHeroes.map(heroId => {
                  const hero = heroesData.find(h => h.id === heroId);
                  return hero ? (
                    <div key={heroId} className="selected-hero-tag core">
                      <img 
                        src={hero.image} 
                        alt="" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span>{hero.localizedName}</span>
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => removeCoreHero(heroId)}
                      >
                        ×
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            
            {/* 核心英雄搜索添加 */}
            <HeroSelector onSelect={addCoreHero} />
          </div>

          {/* 辅助英雄 */}
          <div className="form-group">
            <label>擅长辅助英雄 ({formData.signatureSupportHeroes?.length || 0}/6)</label>
            
            {/* 已选择的辅助英雄 */}
            {formData.signatureSupportHeroes && formData.signatureSupportHeroes.length > 0 && (
              <div className="selected-heroes-list support-heroes">
                {formData.signatureSupportHeroes.map(heroId => {
                  const hero = heroesData.find(h => h.id === heroId);
                  return hero ? (
                    <div key={heroId} className="selected-hero-tag support">
                      <img 
                        src={hero.image} 
                        alt="" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span>{hero.localizedName}</span>
                      <button 
                        type="button" 
                        className="remove-btn"
                        onClick={() => removeSupportHero(heroId)}
                      >
                        ×
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            
            {/* 辅助英雄搜索添加 */}
            <HeroSelector onSelect={addSupportHero} />
          </div>

          <div className="form-group">
            <label>打法风格</label>
            <input
              type="text"
              value={formData.playstyle}
              onChange={(e) => setFormData({...formData, playstyle: e.target.value})}
              placeholder="例如：激进型、发育型、团队型"
            />
          </div>

          <div className="form-group">
            <label>备注</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="其他备注信息..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              {player ? '保存修改' : '添加玩家'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
