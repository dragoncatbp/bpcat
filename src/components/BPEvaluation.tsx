import { useState, useEffect } from 'react';
import type { BPDraft, Team } from '@/types';
import { 
  evaluateDraftWithAPI, 
  evaluateDraft,
  getScoreColor, 
  getScoreLevel,
  type BPBlankEvaluation 
} from '@/utils/bpEvaluation';

interface BPEvaluationProps {
  draft: BPDraft;
  userSide: Team;
}

export function BPEvaluation({ draft, userSide }: BPEvaluationProps) {
  const myTeam = userSide;
  const enemyTeam = userSide === 'radiant' ? 'dire' : 'radiant';
  
  const [myEval, setMyEval] = useState<BPBlankEvaluation | null>(null);
  const [enemyEval, setEnemyEval] = useState<BPBlankEvaluation | null>(null);
  const [, setLoading] = useState(true);
  const [useRealData] = useState(true);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchEvaluation() {
      setLoading(true);
      
      try {
        if (useRealData) {
          // 使用 OpenDota API 真实数据
          const [myResult, enemyResult] = await Promise.all([
            evaluateDraftWithAPI(draft, myTeam),
            evaluateDraftWithAPI(draft, enemyTeam)
          ]);
          
          if (!cancelled) {
            setMyEval(myResult);
            setEnemyEval(enemyResult);
          }
        } else {
          // 使用本地规则评估
          const myResult = evaluateDraft(draft, myTeam);
          const enemyResult = evaluateDraft(draft, enemyTeam);
          
          if (!cancelled) {
            setMyEval(myResult);
            setEnemyEval(enemyResult);
          }
        }
      } catch (error) {
        console.error('评估失败:', error);
        // 失败时回退到本地规则
        const myResult = evaluateDraft(draft, myTeam);
        const enemyResult = evaluateDraft(draft, enemyTeam);
        
        if (!cancelled) {
          setMyEval(myResult);
          setEnemyEval(enemyResult);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchEvaluation();
    
    return () => {
      cancelled = true;
    };
  }, [draft, myTeam, enemyTeam, useRealData]);
  
  // 如果还没有评估结果，使用默认规则评估作为占位
  const displayMyEval = myEval || evaluateDraft(draft, myTeam);
  const displayEnemyEval = enemyEval || evaluateDraft(draft, enemyTeam);

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
            style={{ color: getScoreColor(displayMyEval.overallScore) }}
          >
            {displayMyEval.overallScore}
          </span>
          <span className="eval-level">{getScoreLevel(displayMyEval.overallScore)}</span>
        </div>
        <div className="eval-vs">VS</div>
        <div className="eval-side enemy-side">
          <span className="eval-label">敌方 ({enemyTeamName})</span>
          <span 
            className="eval-score"
            style={{ color: getScoreColor(displayEnemyEval.overallScore) }}
          >
            {displayEnemyEval.overallScore}
          </span>
          <span className="eval-level">{getScoreLevel(displayEnemyEval.overallScore)}</span>
        </div>
      </div>

      {/* 我方详细评价 */}
      <div className="eval-detail my-eval" style={{ borderLeftColor: myTeamColor }}>
        <h5 style={{ color: myTeamColor }}>✅ 我方阵容分析</h5>
        
        {/* 各项分数 */}
        <div className="eval-scores">
          {Object.entries(displayMyEval.scores).map(([key, score]) => {
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
        {displayMyEval.tags.length > 0 && (
          <div className="eval-section">
            <span className="section-title">🏷️ 阵容类型</span>
            <div className="eval-tags">
              {displayMyEval.tags.map((tag, i) => (
                <span key={i} className="eval-tag my-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* 优势 */}
        {displayMyEval.strengths.length > 0 && (
          <div className="eval-section">
            <span className="section-title">💪 我方优势</span>
            <ul className="eval-list">
              {displayMyEval.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 劣势 */}
        {displayMyEval.weaknesses.length > 0 && (
          <div className="eval-section">
            <span className="section-title">⚠️ 需要注意</span>
            <ul className="eval-list">
              {displayMyEval.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 建议 */}
        {displayMyEval.suggestions.length > 0 && (
          <div className="eval-section">
            <span className="section-title">💡 战术建议</span>
            <ul className="eval-list">
              {displayMyEval.suggestions.map((s, i) => (
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
        {displayEnemyEval.tags.length > 0 && (
          <div className="eval-section">
            <span className="section-title">敌方阵容: {displayEnemyEval.tags.join('、')}</span>
          </div>
        )}

        {/* 针对策略 */}
        {displayEnemyEval.counterStrategy && displayEnemyEval.counterStrategy.length > 0 && (
          <div className="eval-section">
            <span className="section-title">🛡️ 针对策略</span>
            <ul className="eval-list">
              {displayEnemyEval.counterStrategy.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 关键时间点 */}
        {displayMyEval.keyTimings.length > 0 && (
          <div className="eval-section">
            <span className="section-title">⏰ 关键时间点</span>
            <ul className="eval-list">
              {displayMyEval.keyTimings.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
