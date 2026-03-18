import type { Hero } from '@/types';
import heroesData from '@/data/heroes.json';
import { HeroMemberBadge } from './MemberSignatures';

interface HeroGridProps {
  bannedHeroes: number[];
  pickedHeroes: number[];
  onSelect: (heroId: number) => void;
  disabled?: boolean;
}

const heroes: Hero[] = heroesData as Hero[];

export function HeroGrid({ bannedHeroes, pickedHeroes, onSelect, disabled }: HeroGridProps) {
  const unavailableHeroes = new Set([...bannedHeroes, ...pickedHeroes]);
  
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

  return (
    <div className="hero-grid">
      {(Object.keys(heroesByAttr) as Array<keyof typeof heroesByAttr>).map(attr => (
        <div key={attr} className="attr-section">
          <div className="attr-header" style={{ color: attrColors[attr] }}>
            {attrLabels[attr]} ({heroesByAttr[attr].length})
          </div>
          <div className="heroes-row">
            {heroesByAttr[attr].map(hero => {
              const isUnavailable = unavailableHeroes.has(hero.id);
              return (
                <button
                  key={hero.id}
                  className={`hero-item ${isUnavailable ? 'unavailable' : ''}`}
                  onClick={() => !isUnavailable && !disabled && onSelect(hero.id)}
                  disabled={isUnavailable || disabled}
                  title={hero.localizedName}
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
      ))}
    </div>
  );
}
