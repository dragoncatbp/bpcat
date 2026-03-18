import { useState, useMemo } from 'react';
import type { Hero } from '@/types';
import heroesData from '@/data/heroes.json';
import { HeroMemberBadge } from './MemberSignatures';
import { searchHeroes } from '@/data/heroAliases';

interface HeroGridProps {
  bannedHeroes: number[];
  pickedHeroes: number[];
  onSelect: (heroId: number) => void;
  disabled?: boolean;
}

const heroes: Hero[] = heroesData as Hero[];

export function HeroGrid({ bannedHeroes, pickedHeroes, onSelect, disabled }: HeroGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const unavailableHeroes = new Set([...bannedHeroes, ...pickedHeroes]);
  
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

  return (
    <div className="hero-grid">
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
                
                return (
                  <button
                    key={hero.id}
                    className={`hero-item ${isUnavailable ? 'unavailable' : ''}`}
                    onClick={() => !isUnavailable && !disabled && onSelect(hero.id)}
                    disabled={isUnavailable || disabled}
                    title={hero.localizedName}
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
                    <HeroMemberBadge heroId={hero.id} />
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
