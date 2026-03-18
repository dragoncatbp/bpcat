import type { Team } from '@/types';

interface SideSelectorProps {
  userSide: Team | null;
  onSelectSide: (side: Team) => void;
}

export function SideSelector({ userSide, onSelectSide }: SideSelectorProps) {
  return (
    <div className="side-selector">
      <h4>🎯 选择你的阵营</h4>
      <p className="side-hint">选择后将会从你方的视角提供分析和建议</p>
      <div className="side-buttons">
        <button
          className={`side-btn radiant ${userSide === 'radiant' ? 'active' : ''}`}
          onClick={() => onSelectSide('radiant')}
        >
          <span className="side-icon">☀️</span>
          <span className="side-name">天辉</span>
          <span className="side-desc">Radiant</span>
        </button>
        <button
          className={`side-btn dire ${userSide === 'dire' ? 'active' : ''}`}
          onClick={() => onSelectSide('dire')}
        >
          <span className="side-icon">🌙</span>
          <span className="side-name">夜魇</span>
          <span className="side-desc">Dire</span>
        </button>
      </div>
    </div>
  );
}
