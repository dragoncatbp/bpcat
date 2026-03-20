import { useMemo } from 'react';
import { recommendCounters, getCounteredBy, counterRelations } from '@/data/heroCounters';
import heroesData from '@/data/heroes.json';

interface CounterTipsProps {
  radiantPicks: number[];
  direPicks: number[];
  currentTeam: 'radiant' | 'dire';
  bannedHeroes: number[];
}



export function CounterTips({ radiantPicks, direPicks, currentTeam, bannedHeroes }: CounterTipsProps) {
  const suggestions = useMemo(() => {
    const opponentPicks = currentTeam === 'radiant' ? direPicks : radiantPicks;
    const myPicks = currentTeam === 'radiant' ? radiantPicks : direPicks;
    
    if (opponentPicks.length === 0) return [];
    
    // 获取推荐克制英雄
    const recommended = recommendCounters(opponentPicks);
    
    // 过滤掉已ban和已pick的英雄，以及对方已选的英雄
    const unavailable = new Set([...bannedHeroes, ...myPicks, ...opponentPicks]);
    
    return recommended
      .filter(r => !unavailable.has(r.heroId))
      .slice(0, 8) // 只显示前8个
      .map(r => {
        // 找出具体克制对方哪些英雄
        const against = opponentPicks.filter(oppId => 
          counterRelations.some(cr => 
            (cr.heroId === r.heroId && cr.counterId === oppId && cr.advantage > 0) ||
            (cr.counterId === r.heroId && cr.heroId === oppId && cr.advantage < 0)
          )
        );
        
        return {
          heroId: r.heroId,
          score: r.score,
          reasons: r.reasons.slice(0, 2), // 只显示前2个原因
          against,
        };
      });
  }, [radiantPicks, direPicks, currentTeam, bannedHeroes]);

  // 显示对方阵容对自己的克制关系
  const threats = useMemo(() => {
    const myPicks = currentTeam === 'radiant' ? radiantPicks : direPicks;
    const opponentPicks = currentTeam === 'radiant' ? direPicks : radiantPicks;
    
    const threatsList: { heroId: number; counteredBy: number[] }[] = [];
    
    myPicks.forEach(myHeroId => {
      const counters = getCounteredBy(myHeroId)
        .filter(c => opponentPicks.includes(c.heroId))
        .map(c => c.heroId);
      
      if (counters.length > 0) {
        threatsList.push({ heroId: myHeroId, counteredBy: counters });
      }
    });
    
    return threatsList;
  }, [radiantPicks, direPicks, currentTeam]);

  const getHeroName = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.localizedName || `英雄#${heroId}`;
  };

  const getHeroImage = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.image || '';
  };

  if (suggestions.length === 0 && threats.length === 0) {
    return (
      <div className="counter-tips">
        <h4>💡 克制提示</h4>
        <p className="tips-empty">对方选择英雄后将显示克制建议</p>
      </div>
    );
  }

  return (
    <div className="counter-tips">
      <h4>💡 克制提示</h4>
      
      {suggestions.length > 0 && (
        <div className="tips-section">
          <span className="tips-label">推荐选择（克制对方）</span>
          <div className="suggestions-list">
            {suggestions.map(s => (
              <div key={s.heroId} className="suggestion-item">
                <img src={getHeroImage(s.heroId)} alt="" className="suggestion-img" />
                <div className="suggestion-info">
                  <span className="suggestion-name">{getHeroName(s.heroId)}</span>
                  <div className="suggestion-against">
                    克制: {s.against.map(id => getHeroName(id)).join(', ')}
                  </div>
                  {s.reasons.map((r, i) => (
                    <div key={i} className="suggestion-reason">• {r}</div>
                  ))}
                </div>
                <span className="suggestion-score">+{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {threats.length > 0 && (
        <div className="tips-section">
          <span className="tips-label warning">⚠️ 注意（被克制）</span>
          <div className="threats-list">
            {threats.map(t => (
              <div key={t.heroId} className="threat-item">
                <img src={getHeroImage(t.heroId)} alt="" className="threat-img" />
                <span className="threat-name">{getHeroName(t.heroId)}</span>
                <span className="threat-arrow">→</span>
                <span className="threat-counters">
                  被 {t.counteredBy.map(id => getHeroName(id)).join(', ')} 克制
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
