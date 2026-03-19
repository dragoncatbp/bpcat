import { useState, useMemo, useEffect } from 'react';
import type { Hero } from '@/types';
import heroesData from '@/data/heroes.json';
import { searchHeroes } from '@/data/heroAliases';

interface HeroGridProps {
  bannedHeroes: number[];
  pickedHeroes: number[];
  onSelect: (heroId: number) => void;
  disabled?: boolean;
}

const heroes: Hero[] = heroesData as Hero[];

// 英雄胜率等级
interface HeroWinRate {
  heroId: number;
  winRate: number;
  matches: number;
}

// 获取英雄胜率数据（从 localStorage 或 OpenDota）
async function fetchHeroWinRates(): Promise<HeroWinRate[]> {
  // 先检查缓存
  const cached = localStorage.getItem('hero_winrates');
  const cacheTime = localStorage.getItem('hero_winrates_time');
  
  // 缓存24小时内有效
  if (cached && cacheTime && Date.now() - Number(cacheTime) < 24 * 60 * 60 * 1000) {
    return JSON.parse(cached);
  }
  
  try {
    // 从 OpenDota 获取英雄胜率数据
    const response = await fetch('https://api.opendota.com/api/heroes');
    const heroes = await response.json();
    
    const winRates: HeroWinRate[] = heroes.map((h: any) => ({
      heroId: h.id,
      winRate: h.pro_win / h.pro_pick * 100,
      matches: h.pro_pick
    })).filter((h: HeroWinRate) => h.matches > 0);
    
    // 缓存到 localStorage
    localStorage.setItem('hero_winrates', JSON.stringify(winRates));
    localStorage.setItem('hero_winrates_time', String(Date.now()));
    
    return winRates;
  } catch (error) {
    console.error('Failed to fetch hero winrates:', error);
    return [];
  }
}

// 获取胜率等级
function getWinRateTier(winRate: number): 't1' | 't2' | null {
  if (winRate >= 55) return 't1';  // T1: 胜率 >= 55%
  if (winRate >= 52) return 't2';  // T2: 胜率 52-54%
  return null;  // 其他不标记
}

export function HeroGrid({ bannedHeroes, pickedHeroes, onSelect, disabled }: HeroGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroWinRates, setHeroWinRates] = useState<Map<number, number>>(new Map());
  const unavailableHeroes = new Set([...bannedHeroes, ...pickedHeroes]);
  
  // 获取英雄胜率数据
  useEffect(() => {
    fetchHeroWinRates().then(rates => {
      const map = new Map<number, number>();
      rates.forEach(r => map.set(r.heroId, r.winRate));
      setHeroWinRates(map);
    });
  }, []);
  
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
                const winRate = heroWinRates.get(hero.id);
                const tier = winRate ? getWinRateTier(winRate) : null;
                
                return (
                  <button
                    key={hero.id}
                    className={`hero-item ${isUnavailable ? 'unavailable' : ''} ${tier || ''}`}
                    onClick={() => !isUnavailable && !disabled && onSelect(hero.id)}
                    disabled={isUnavailable || disabled}
                    title={`${hero.localizedName}${winRate ? ` (胜率: ${winRate.toFixed(1)}%)` : ''}`}
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
                    {tier && (
                      <div className={`hero-tier-badge ${tier}`}>
                        {tier === 't1' ? 'T1' : 'T2'}
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
