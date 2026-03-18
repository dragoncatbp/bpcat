import type { BPDraft, Hero } from '@/types';
import { 
  getCurrentStep, 
  getPhaseName, 
  getCurrentTeamName, 
  getCurrentActionName,
  getDraftStats,
  isDraftComplete
} from '@/utils/bpEngine';
import heroesData from '@/data/heroes.json';

const heroes: Hero[] = heroesData as Hero[];

interface BPPanelProps {
  draft: BPDraft;
}

function HeroSlot({ heroId, size = 'normal' }: { heroId: number | null; size?: 'normal' | 'small' }) {
  const hero = heroId ? heroes.find(h => h.id === heroId) : null;
  
  if (!hero) {
    return (
      <div className={`hero-slot empty ${size}`}>
        <span>?</span>
      </div>
    );
  }
  
  return (
    <div className={`hero-slot ${size}`}>
      <img src={hero.image} alt={hero.localizedName} />
      <span className="slot-name">{hero.localizedName}</span>
    </div>
  );
}

export function BPPanel({ draft }: BPPanelProps) {
  const currentStep = getCurrentStep(draft);
  const stats = getDraftStats(draft);
  const isComplete = isDraftComplete(draft);
  
  // 获取当前步骤的序号（1-28）
  const stepNumber = draft.currentStep + 1;

  return (
    <div className="bp-panel">
      {/* 顶部状态栏 */}
      <div className="bp-status">
        <div className="phase-info">
          {!isComplete ? (
            <>
              <span className="phase-name">{getPhaseName(draft.currentStep)}</span>
              <span className="step-counter">步骤 {stepNumber} / {stats.totalSteps}</span>
            </>
          ) : (
            <span className="phase-name complete">BP完成</span>
          )}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      {/* 当前操作提示 */}
      {!isComplete && currentStep && (
        <div className={`current-action ${currentStep.team}`}>
          <span className="team-name">{getCurrentTeamName(draft)}</span>
          <span className="action-name">{getCurrentActionName(draft)}</span>
        </div>
      )}

      {/* 双方阵容 */}
      <div className="teams-container">
        {/* 天辉 */}
        <div className="team-section radiant">
          <div className="team-header">
            <span className="team-badge radiant">天辉</span>
            <span className="pick-count">{stats.radiantPicks}/5</span>
          </div>
          
          <div className="picks-row">
            {[0, 1, 2, 3, 4].map(i => (
              <HeroSlot key={i} heroId={draft.radiantPicks[i] || null} />
            ))}
          </div>
          
          <div className="bans-row">
            <span className="ban-label">禁用:</span>
            {draft.radiantBans.map((heroId, i) => (
              <HeroSlot key={i} heroId={heroId} size="small" />
            ))}
          </div>
        </div>

        {/* VS 分隔 */}
        <div className="vs-divider">
          <span>VS</span>
        </div>

        {/* 夜魇 */}
        <div className="team-section dire">
          <div className="team-header">
            <span className="team-badge dire">夜魇</span>
            <span className="pick-count">{stats.direPicks}/5</span>
          </div>
          
          <div className="picks-row">
            {[0, 1, 2, 3, 4].map(i => (
              <HeroSlot key={i} heroId={draft.direPicks[i] || null} />
            ))}
          </div>
          
          <div className="bans-row">
            <span className="ban-label">禁用:</span>
            {draft.direBans.map((heroId, i) => (
              <HeroSlot key={i} heroId={heroId} size="small" />
            ))}
          </div>
        </div>
      </div>

      {/* BP历史 */}
      <div className="bp-history">
        <h4>BP顺序</h4>
        <div className="history-list">
          {draft.steps.slice(0, draft.currentStep).map((step, i) => {
            const hero = step.heroId ? heroes.find(h => h.id === step.heroId) : null;
            return (
              <div key={i} className={`history-item ${step.team}`}>
                <span className="step-num">{i + 1}</span>
                <span className={`action-badge ${step.type}`}>
                  {step.type === 'ban' ? '禁' : '选'}
                </span>
                <span className="team-tag">{step.team === 'radiant' ? '天' : '夜'}</span>
                {hero && <span className="hero-name">{hero.localizedName}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
