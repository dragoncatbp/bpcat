import { useState, useEffect, useCallback } from 'react';
import type { BPHistoryRecord } from '@/types/bpHistory';
import { loadBPHistoryFromStorage, saveBPHistoryToStorage, generateBPHistoryId } from '@/types/bpHistory';
import { evaluateDraft, getScoreColor, getScoreLevel } from '@/utils/bpEvaluation';
import type { BPDraft } from '@/types';
import heroesData from '@/data/heroes.json';
import './BPHistory.css';

interface BPHistoryProps {
  currentDraft?: BPDraft | null;
  onLoadDraft?: (draft: BPDraft) => void;
}

export function BPHistory({ currentDraft, onLoadDraft }: BPHistoryProps) {
  const [records, setRecords] = useState<BPHistoryRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchName, setMatchName] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<BPHistoryRecord | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [filter, setFilter] = useState('');

  // 加载历史记录
  useEffect(() => {
    setRecords(loadBPHistoryFromStorage());
  }, []);

  // 保存历史记录
  const saveRecords = useCallback((newRecords: BPHistoryRecord[]) => {
    setRecords(newRecords);
    saveBPHistoryToStorage(newRecords);
  }, []);

  // 保存当前BP
  const handleSaveCurrent = () => {
    if (!currentDraft) return;
    
    const name = matchName.trim() || `BP记录 ${new Date().toLocaleString()}`;
    
    const newRecord: BPHistoryRecord = {
      id: generateBPHistoryId(),
      matchName: name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      draft: currentDraft,
      evaluation: evaluateDraft(currentDraft, 'both'),
    };
    
    const newRecords = [newRecord, ...records];
    saveRecords(newRecords);
    
    setMatchName('');
    setIsModalOpen(false);
  };

  // 删除记录
  const handleDelete = (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    const newRecords = records.filter(r => r.id !== id);
    saveRecords(newRecords);
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
      setViewMode('list');
    }
  };

  // 查看详情
  const handleViewDetail = (record: BPHistoryRecord) => {
    setSelectedRecord(record);
    setViewMode('detail');
  };

  // 加载BP
  const handleLoadDraft = (record: BPHistoryRecord) => {
    if (onLoadDraft) {
      onLoadDraft(record.draft);
    }
  };

  // 更新比赛结果
  const handleUpdateResult = (id: string, winner: 'radiant' | 'dire' | null) => {
    const newRecords = records.map(r => {
      if (r.id === id) {
        return {
          ...r,
          matchResult: { ...r.matchResult, winner },
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    saveRecords(newRecords);
  };

  // 过滤记录
  const filteredRecords = records.filter(r => 
    r.matchName.toLowerCase().includes(filter.toLowerCase()) ||
    r.tags?.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  // 列表视图
  if (viewMode === 'list') {
    return (
      <div className="bp-history-panel">
        <div className="bp-history-header">
          <h3>📚 BP记录</h3>
          <div className="bp-history-actions">
            {currentDraft && (
              <button 
                className="btn-primary small"
                onClick={() => setIsModalOpen(true)}
              >
                保存当前BP
              </button>
            )}
          </div>
        </div>

        <div className="bp-history-filter">
          <input
            type="text"
            placeholder="搜索记录..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {records.length === 0 ? (
          <div className="bp-history-empty">
            <p>暂无BP记录</p>
            {currentDraft && (
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                保存当前BP
              </button>
            )}
          </div>
        ) : (
          <div className="bp-history-list">
            {filteredRecords.map(record => (
              <div 
                key={record.id} 
                className={`bp-history-item ${record.matchResult?.winner ? 'has-result' : ''}`}
              >
                <div className="bp-history-info" onClick={() => handleViewDetail(record)}>
                  <h4>{record.matchName}</h4>
                  <p className="bp-history-date">
                    {new Date(record.createdAt).toLocaleString()}
                  </p>
                  <div className="bp-history-teams">
                    <span className="team-radiant">天辉 {record.draft.radiantPicks.length}</span>
                    <span className="vs">vs</span>
                    <span className="team-dire">夜魇 {record.draft.direPicks.length}</span>
                  </div>
                  {record.evaluation && (
                    <div className="bp-history-score">
                      <span 
                        className="score-badge"
                        style={{ background: getScoreColor(record.evaluation.overallScore) }}
                      >
                        {record.evaluation.overallScore}分 {getScoreLevel(record.evaluation.overallScore)}
                      </span>
                    </div>
                  )}
                  {record.matchResult?.winner && (
                    <div className={`bp-history-result ${record.matchResult.winner}`}>
                      {record.matchResult.winner === 'radiant' ? '天辉胜' : '夜魇胜'}
                    </div>
                  )}
                </div>
                <div className="bp-history-actions">
                  {onLoadDraft && (
                    <button onClick={() => handleLoadDraft(record)}>加载</button>
                  )}
                  <button onClick={() => handleViewDetail(record)}>详情</button>
                  <button className="danger" onClick={() => handleDelete(record.id)}>删除</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 保存弹窗 */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>保存BP记录</h3>
              <input
                type="text"
                placeholder="输入比赛名称（如：念爱杯决赛第一场）"
                value={matchName}
                onChange={(e) => setMatchName(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  取消
                </button>
                <button className="btn-primary" onClick={handleSaveCurrent}>
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 详情视图
  if (selectedRecord) {
    return (
      <div className="bp-history-panel detail">
        <div className="bp-history-header">
          <button className="btn-back" onClick={() => setViewMode('list')}>
            ← 返回列表
          </button>
          <h3>{selectedRecord.matchName}</h3>
        </div>

        {/* 阵容展示 */}
        <div className="bp-detail-teams">
          <div className="detail-team radiant">
            <h4>天辉</h4>
            <div className="detail-heroes">
              {selectedRecord.draft.radiantPicks.map(heroId => {
                const hero = heroesData.find(h => h.id === heroId);
                return hero ? (
                  <div key={heroId} className="detail-hero">
                    <img src={hero.image} alt={hero.localizedName} />
                    <span>{hero.localizedName}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div className="detail-team dire">
            <h4>夜魇</h4>
            <div className="detail-heroes">
              {selectedRecord.draft.direPicks.map(heroId => {
                const hero = heroesData.find(h => h.id === heroId);
                return hero ? (
                  <div key={heroId} className="detail-hero">
                    <img src={hero.image} alt={hero.localizedName} />
                    <span>{hero.localizedName}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* 评价详情 */}
        {selectedRecord.evaluation && (
          <div className="bp-evaluation">
            <h4>📊 阵容评价</h4>
            
            {/* 总分 */}
            <div className="eval-overall">
              <div 
                className="eval-score-big"
                style={{ color: getScoreColor(selectedRecord.evaluation.overallScore) }}
              >
                {selectedRecord.evaluation.overallScore}
              </div>
              <div className="eval-level">{getScoreLevel(selectedRecord.evaluation.overallScore)}</div>
            </div>

            {/* 各项分数 */}
            <div className="eval-scores">
              {Object.entries(selectedRecord.evaluation.scores).map(([key, score]) => {
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
                    <span className="eval-label">{labels[key]}</span>
                    <div className="eval-bar">
                      <div 
                        className="eval-fill"
                        style={{ 
                          width: `${score}%`,
                          background: getScoreColor(score),
                        }}
                      />
                    </div>
                    <span className="eval-value">{score}</span>
                  </div>
                );
              })}
            </div>

            {/* 标签 */}
            {selectedRecord.evaluation.tags.length > 0 && (
              <div className="eval-section">
                <h5>🏷️ 阵容标签</h5>
                <div className="eval-tags">
                  {selectedRecord.evaluation.tags.map(tag => (
                    <span key={tag} className="eval-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 优势 */}
            {selectedRecord.evaluation.strengths.length > 0 && (
              <div className="eval-section">
                <h5>✅ 阵容优势</h5>
                <ul>
                  {selectedRecord.evaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 劣势 */}
            {selectedRecord.evaluation.weaknesses.length > 0 && (
              <div className="eval-section">
                <h5>⚠️ 阵容劣势</h5>
                <ul>
                  {selectedRecord.evaluation.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 建议 */}
            {selectedRecord.evaluation.suggestions.length > 0 && (
              <div className="eval-section">
                <h5>💡 战术建议</h5>
                <ul>
                  {selectedRecord.evaluation.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 关键时间点 */}
            {selectedRecord.evaluation.keyTimings.length > 0 && (
              <div className="eval-section">
                <h5>⏰ 关键时间点</h5>
                <ul>
                  {selectedRecord.evaluation.keyTimings.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 针对策略 */}
            {selectedRecord.evaluation.counterStrategy && selectedRecord.evaluation.counterStrategy.length > 0 && (
              <div className="eval-section">
                <h5>🎯 针对策略</h5>
                <ul>
                  {selectedRecord.evaluation.counterStrategy.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 比赛结果 */}
        <div className="bp-result-section">
          <h4>🏆 比赛结果</h4>
          <div className="result-buttons">
            <button 
              className={selectedRecord.matchResult?.winner === 'radiant' ? 'active radiant' : ''}
              onClick={() => handleUpdateResult(selectedRecord.id, 'radiant')}
            >
              天辉获胜
            </button>
            <button 
              className={selectedRecord.matchResult?.winner === 'dire' ? 'active dire' : ''}
              onClick={() => handleUpdateResult(selectedRecord.id, 'dire')}
            >
              夜魇获胜
            </button>
            <button 
              className={!selectedRecord.matchResult?.winner ? 'active' : ''}
              onClick={() => handleUpdateResult(selectedRecord.id, null)}
            >
              未记录
            </button>
          </div>
        </div>

        <div className="bp-detail-actions">
          {onLoadDraft && (
            <button className="btn-primary" onClick={() => handleLoadDraft(selectedRecord)}>
              加载此BP
            </button>
          )}
          <button className="btn-secondary" onClick={() => setViewMode('list')}>
            返回列表
          </button>
        </div>
      </div>
    );
  }

  return null;
}
