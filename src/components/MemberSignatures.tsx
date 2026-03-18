import { useState } from 'react';
import { teamMembers, getMembersByHero } from '@/data/teamMembers';
import heroesData from '@/data/heroes.json';

interface MemberSignaturesProps {
  onFilterByMember?: (memberId: string | null) => void;
}

export function MemberSignatures({ onFilterByMember }: MemberSignaturesProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'members' | 'heroes'>('members');

  const getHeroName = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.localizedName || `英雄#${heroId}`;
  };

  const getHeroImage = (heroId: number) => {
    return heroesData.find(h => h.id === heroId)?.image || '';
  };

  const handleSelectMember = (memberId: string | null) => {
    setSelectedMember(memberId);
    onFilterByMember?.(memberId);
  };

  // 获取每个英雄的擅长人数
  const heroPopularity = new Map<number, { count: number; members: string[] }>();
  teamMembers.forEach(member => {
    [...member.signatureHeroes, ...member.goodHeroes].forEach(heroId => {
      const existing = heroPopularity.get(heroId);
      if (existing) {
        if (!existing.members.includes(member.nickname)) {
          existing.count++;
          existing.members.push(member.nickname);
        }
      } else {
        heroPopularity.set(heroId, { count: 1, members: [member.nickname] });
      }
    });
  });

  // 按擅长人数排序的英雄
  const popularHeroes = Array.from(heroPopularity.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20);

  return (
    <div className="member-signatures">
      <h4>👥 念爱杯队员</h4>
      
      <div className="view-toggle">
        <button 
          className={viewMode === 'members' ? 'active' : ''}
          onClick={() => setViewMode('members')}
        >
          按队员
        </button>
        <button 
          className={viewMode === 'heroes' ? 'active' : ''}
          onClick={() => setViewMode('heroes')}
        >
          按英雄
        </button>
      </div>

      {viewMode === 'members' ? (
        <div className="members-list">
          <div 
            className={`member-card ${selectedMember === null ? 'selected' : ''}`}
            onClick={() => handleSelectMember(null)}
          >
            <span className="member-name">全部显示</span>
          </div>
          
          {teamMembers.map(member => (
            <div 
              key={member.id}
              className={`member-card ${selectedMember === member.id ? 'selected' : ''}`}
              onClick={() => handleSelectMember(member.id)}
            >
              <div className="member-header">
                <span className="member-name">{member.nickname}</span>
                <span className="member-positions">
                  {member.positions.map(p => p).join(',')}号位
                </span>
              </div>
              
              {member.signatureHeroes.length > 0 && (
                <div className="hero-section">
                  <span className="section-label">招牌英雄</span>
                  <div className="hero-icons">
                    {member.signatureHeroes.slice(0, 5).map(heroId => (
                      <img 
                        key={heroId}
                        src={getHeroImage(heroId)}
                        alt={getHeroName(heroId)}
                        title={getHeroName(heroId)}
                        className="hero-icon signature"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {member.playstyle && (
                <div className="member-style">{member.playstyle}</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="heroes-popularity">
          <p className="popularity-hint">队员熟练度最高的英雄</p>
          <div className="popular-list">
            {popularHeroes.map(([heroId, data]) => (
              <div key={heroId} className="popular-item">
                <img src={getHeroImage(heroId)} alt="" className="popular-img" />
                <div className="popular-info">
                  <span className="popular-name">{getHeroName(heroId)}</span>
                  <span className="popular-count">{data.count}人会玩</span>
                  <span className="popular-members">{data.members.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 在英雄网格中显示队员标记的组件
interface HeroMemberBadgeProps {
  heroId: number;
}

export function HeroMemberBadge({ heroId }: HeroMemberBadgeProps) {
  const members = getMembersByHero(heroId);
  if (members.length === 0) return null;

  const signatureMembers = members.filter(m => m.signatureHeroes.includes(heroId));
  const goodMembers = members.filter(m => m.goodHeroes.includes(heroId));

  return (
    <div className="hero-member-badge">
      {signatureMembers.length > 0 && (
        <span className="badge signature" title={`招牌: ${signatureMembers.map(m => m.nickname).join(', ')}`}>
          ★{signatureMembers.length}
        </span>
      )}
      {goodMembers.length > 0 && (
        <span className="badge good" title={`熟练: ${goodMembers.map(m => m.nickname).join(', ')}`}>
          ✓{goodMembers.length}
        </span>
      )}
    </div>
  );
}
