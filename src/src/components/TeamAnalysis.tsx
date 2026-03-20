import { analyzeTeam } from '@/data/heroAttributes';

interface TeamAnalysisProps {
  radiantPicks: number[];
  direPicks: number[];
}

export function TeamAnalysis({ radiantPicks, direPicks }: TeamAnalysisProps) {
  const radiantAnalysis = analyzeTeam(radiantPicks);
  const direAnalysis = analyzeTeam(direPicks);

  const renderBar = (value: number, max: number, color: string, label: string) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="analysis-bar">
        <span className="bar-label">{label}</span>
        <div className="bar-track">
          <div 
            className="bar-fill" 
            style={{ 
              width: `${percentage}%`, 
              background: color,
            }}
          />
        </div>
        <span className="bar-value">{Math.round(value)}</span>
      </div>
    );
  };

  const renderTeamAnalysis = (teamName: string, analysis: ReturnType<typeof analyzeTeam>, color: string) => (
    <div className="team-analysis" style={{ borderLeft: `3px solid ${color}` }}>
      <h4 style={{ color }}>{teamName}</h4>
      
      <div className="analysis-bars">
        {renderBar(analysis.totalControl, 35, '#f59e0b', '控制')}
        {renderBar(analysis.totalAoe, 40, '#ef4444', 'AOE')}
        {renderBar(analysis.totalDurable, 35, '#22c55e', '坦度')}
        {renderBar(analysis.totalPush, 30, '#3b82f6', '推进')}
        {renderBar(analysis.totalTeamfight, 45, '#8b5cf6', '团战')}
        {renderBar(analysis.totalHeal, 20, '#ec4899', '治疗')}
      </div>

      {analysis.strengths.length > 0 && (
        <div className="analysis-section">
          <span className="section-label">✅ 优势</span>
          <div className="tag-list">
            {analysis.strengths.map((s, i) => (
              <span key={i} className="tag tag-success">{s}</span>
            ))}
          </div>
        </div>
      )}

      {analysis.weaknesses.length > 0 && (
        <div className="analysis-section">
          <span className="section-label">⚠️ 不足</span>
          <div className="tag-list">
            {analysis.weaknesses.map((w, i) => (
              <span key={i} className="tag tag-warning">{w}</span>
            ))}
          </div>
        </div>
      )}

      <div className="analysis-section">
        <span className="section-label">🏷️ 标签</span>
        <div className="tag-list">
          {[...new Set(analysis.tags)].slice(0, 8).map((tag, i) => (
            <span key={i} className="tag tag-default">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="team-analysis-panel">
      <h3>📊 阵容分析</h3>
      <div className="analysis-grid">
        {renderTeamAnalysis('天辉', radiantAnalysis, '#4ade80')}
        {renderTeamAnalysis('夜魇', direAnalysis, '#f87171')}
      </div>
    </div>
  );
}
