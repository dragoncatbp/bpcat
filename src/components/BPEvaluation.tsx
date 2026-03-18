import { useMemo } from 'react';
import type { BPDraft, Team } from '@/types';
import { evaluateDraft, getScoreColor, getScoreLevel } from '@/utils/bpEvaluation';

interface BPEvaluationProps {
  draft: BPDraft;
  userSide: Team;
}

export function BPEvaluation({ draft, userSide }: BPEvaluationProps) {
  const myTeam = userSide;
  const enemyTeam = userSide === 'radiant' ? 'dire' : 'radiant';
  
  // 从我方视角评价
  const myEval = useMemo(() => evaluateDraft(draft, myTeam), [draft, myTeam]);
  // 从敌方视角评价
  const enemyEval = useMemo(() => evaluateDraft(draft, enemyTeam), [draft, enemyTeam]);

  const myTeamName = myTeam === 'radiant' ? '天辉' : '夜魇';
  const enemyTeamName = enemyTeam === 'radiant' ? '天辉' : '夜魇';
  const myTeamColor = myTeam === 'radiant' ? '#4ade80' : '#f87171';
  const enemyTeamColor = enemyTeam === 'radiant' ? '#4ade80' : '#f87171';

  return (
    <div className="bp-evaluation-panel">
      <h4>📊 阵容评价 ({myTeamName}视角)</h4>
      
      {/* 双方评分对比 */}
      <div className="eval-comparison">
        <div className="eval-side my-side">
          <span className="eval-label">我方 ({myTeamName})</span>
          <span 
            className="eval-score"
            style={{ color: getScoreColor(myEval.overallScore) }}
          >
            {myEval.overallScore}
          </span>
          <span className="eval-level">{getScoreLevel(myEval.overallScore)}</span>
        </div>
        <div className="eval-vs">VS</div>
        <div className="eval-side enemy-side">
          <span className="eval-label">敌方 ({enemyTeamName})</span>
          <span 
            className="eval-score"
            style={{ color: getScoreColor(enemyEval.overallScore) }}
          >
            {enemyEval.overallScore}
          </span>
          <span className="eval-level">{getScoreLevel(enemyEval.overallScore)}</span>
        </div>
      </div>

      {/* 我方详细评价 */}
      <div className="eval-detail my-eval" style={{ borderLeftColor: myTeamColor }}>
        <h5 style={{ color: myTeamColor }}>✅ 我方阵容分析</h5>
        
        {/* 各项分数 */}
        <div className="eval-scores">
          {Object.entries(myEval.scores).map(([key, score]) => {
            const labels: Record<string, string> = {
              lineupBalance: '阵容平衡',
              teamfight: '团战能力',
              push: '推进能力',
              gank: 'gank能力',
              lateGame: '后期能力',
              coordination: '英雄配合',
            };
            return (
              <div key={key} className="eval-score-item">
                <span className="score-label">{labels[key]}</span>
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ 
                      width: `${score}%`,
                      background: getScoreColor(score),
                    }}
                  />
                </div>
                <span className="score-value">{score}</span>
              </div>
            );
          })}
        </div>

        {/* 标签 */}
        {myEval.tags.length > 0 && (
          <div className="eval-section">
            <span className="section-title">🏷️ 阵容类型</span>
            <div className="eval-tags">
              {myEval.tags.map((tag, i) => (
                <span key={i} className="eval-tag my-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* 优势 */}
        {myEval.strengths.length > 0 && (
          <div className="eval-section">
            <span className="section-title">💪 我方优势</span>
            <ul className="eval-list">
              {myEval.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 劣势 */}
        {myEval.weaknesses.length > 0 && (
          <div className="eval-section">
            <span className="section-title">⚠️ 需要注意</span>
            <ul className="eval-list">
              {myEval.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 建议 */}
        {myEval.suggestions.length > 0 && (
          <div className="eval-section">
            <span className="section-title">💡 战术建议</span>
            <ul className="eval-list">
              {myEval.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 敌方分析 - 针对策略 */}
      <div className="eval-detail enemy-eval" style={{ borderLeftColor: enemyTeamColor }}>
        <h5 style={{ color: enemyTeamColor }}>🎯 敌方分析与针对</h5>
        
        {/* 敌方阵容标签 */}
        {enemyEval.tags.length > 0 && (
          <div className="eval-section">
            <span className="section-title">敌方阵容: {enemyEval.tags.join('、')}</span>
          </div>
        )}

        {/* 针对策略 */}
        {enemyEval.counterStrategy && enemyEval.counterStrategy.length > 0 && (
          <div className="eval-section">
            <span className="section-title">🛡️ 针对策略</span>
            <ul className="eval-list">
              {enemyEval.counterStrategy.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 关键时间点 */}
        {myEval.keyTimings.length > 0 && (
          <div className="eval-section">
            <span className="section-title">⏰ 关键时间点</span>
            <ul className="eval-list">
              {myEval.keyTimings.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
