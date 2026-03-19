import { useState, useMemo } from 'react';
import type { Hero } from '@/types';
import type { Team } from '@/types/team';
import heroesData from '@/data/heroes.json';
import { searchHeroes } from '@/data/heroAliases';

interface HeroGridProps {
  bannedHeroes: number[];
  pickedHeroes: number[];
  onSelect: (heroId: number) => void;
  disabled?: boolean;
  myTeam?: Team | null;      // 己方队伍（主队）
  opponentTeam?: Team | null; // 对手队伍
}

const heroes: Hero[] = heroesData as Hero[];

// 获取队伍的所有擅长英雄（包括核心和辅助）
function getTeamSignatureHeroes(team: Team | null | undefined): Set<number> {
  if (!team || !team.players) return new Set();
  
  const heroIds = new Set<number>();
  team.players.forEach(player => {
    // 核心英雄
    (player.signatureCoreHeroes || []).forEach(id => heroIds.add(id));
    // 辅助英雄
    (player.signatureSupportHeroes || []).forEach(id => heroIds.add(id));
    // 兼容旧数据
    (player.signatureHeroes || []).forEach(id => heroIds.add(id));
  });
  
  return heroIds;
}

export function HeroGrid({ 
  bannedHeroes, 
  pickedHeroes, 
  onSelect, 
  disabled,
  myTeam,
  opponentTeam 
}: HeroGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const unavailableHeroes = new Set([...bannedHeroes, ...pickedHeroes]);
  
  // 计算双方擅长英雄
  const myTeamHeroes = useMemo(() => getTeamSignatureHeroes(myTeam), [myTeam]);
  const opponentHeroes = useMemo(() => getTeamSignatureHeroes(opponentTeam), [opponentTeam]);
  
  // 搜索匹配的英雄ID
  const matchedHeroes = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return new Set(searchHeroes(searchQuery));
  }, [searchQuery]);
  
  // 按属性分组
  const heroesByAttr = {
    str: heroes.filter(h => h.primaryAttr === 'str'),
    agi: heroes.filter(h => h.primaryAttr === 'agi'),
    int: heroes.filter(h => h.primaryAttr === 'int'),
    all: heroes.filter(h => h.primaryAttr === 'all'),
  };

  const attrLabels = {
    str: '力量',
    agi: '敏捷', 
    int: '智力',
    all: '全才',
  };

  const attrColors = {
    str: '#ef4444',
    agi: '#22c55e',
    int: '#3b82f6',
    all: '#a855f7',
  };

  // 高亮匹配的英雄
  const getHighlightStyle = (heroId: number) => {
    if (!matchedHeroes || matchedHeroes.size === 0) return {};
    if (matchedHeroes.has(heroId)) {
      return {
        boxShadow: '0 0 0 3px #fbbf24, 0 0 10px #fbbf24',
        transform: 'scale(1.05)',
        zIndex: 10,
      };
    }
    return { opacity: 0.4 };
  };

  // 获取英雄标记类型
  function getHeroMark(heroId: number): 'my' | 'opponent' | null {
    if (myTeamHeroes.has(heroId)) return 'my';
    if (opponentHeroes.has(heroId)) return 'opponent';
    return null;
  }

  return (
    <div className="hero-grid">
      {/* 队伍标记说明 */}
      {(myTeamHeroes.size > 0 || opponentHeroes.size > 0) && (
        <div className="hero-legend">
          {myTeamHeroes.size > 0 && (
            <span className="legend-item my">
              <span className="legend-dot"></span>
              己方擅长 ({myTeamHeroes.size})
            </span>
          )}
          {opponentHeroes.size > 0 && (
            <span className="legend-item opponent">
              <span className="legend-dot"></span>
              敌方擅长 ({opponentHeroes.size})
            </span>
          )}
        </div>
      )}

      {/* 搜索框 */}
      <div className="hero-search">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索英雄（中文/英文/简称，如：PA、敌法、虚空）"
            className="hero-search-input"
          />
          {searchQuery && (
            <button 
              className="search-clear" 
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
        {searchQuery && matchedHeroes && matchedHeroes.size > 0 && (
          <span className="search-result">
            找到 {matchedHeroes.size} 个英雄
          </span>
        )}
      </div>
      
      {(Object.keys(heroesByAttr) as Array<keyof typeof heroesByAttr>).map(attr => {
        const attrHeroes = heroesByAttr[attr];
        // 如果有搜索，只显示匹配的英雄
        const visibleHeroes = matchedHeroes && matchedHeroes.size > 0
          ? attrHeroes.filter(h => matchedHeroes.has(h.id))
          : attrHeroes;
        
        if (visibleHeroes.length === 0) return null;
        
        return (
          <div key={attr} className="attr-section">
            <div className="attr-header" style={{ color: attrColors[attr] }}>
              {attrLabels[attr]} ({visibleHeroes.length})
            </div>
            <div className="heroes-row">
              {visibleHeroes.map(hero => {
                const isUnavailable = unavailableHeroes.has(hero.id);
                const highlightStyle = getHighlightStyle(hero.id);
                const mark = getHeroMark(hero.id);
                
                // 构建提示文字
                let titleText = hero.localizedName;
                if (mark === 'my') {
                  titleText += ' (己方擅长)';
                } else if (mark === 'opponent') {
                  titleText += ' (敌方擅长)';
                }
                
                return (
                  <button
                    key={hero.id}
                    className={`hero-item ${isUnavailable ? 'unavailable' : ''} ${mark || ''}`}
                    onClick={() => !isUnavailable && !disabled && onSelect(hero.id)}
                    disabled={isUnavailable || disabled}
                    title={titleText}
                    style={highlightStyle}
                  >
                    <img 
                      src={hero.image} 
                      alt={hero.localizedName}
                      className="hero-image"
                    />
                    <span className="hero-name">{hero.localizedName}</span>
                    {isUnavailable && (
                      <div className="hero-overlay">
                        {bannedHeroes.includes(hero.id) ? '❌' : '✓'}
                      </div>
                    )}
                    {mark && (
                      <div className={`hero-team-badge ${mark}`}>
                        {mark === 'my' ? '己' : '敌'}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {matchedHeroes && matchedHeroes.size === 0 && (
        <div className="search-empty">
          未找到匹配的英雄，试试其他关键词
        </div>
      )}
    </div>
  );
}
