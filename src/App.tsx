import { useState, useCallback } from 'react';
import { HeroGrid } from '@/components/HeroGrid';
import { BPPanel } from '@/components/BPPanel';
import { TeamAnalysis } from '@/components/TeamAnalysis';
import { CounterTips } from '@/components/CounterTips';
import { MemberSignatures } from '@/components/MemberSignatures';
import { TeamManager } from '@/components/TeamManager';
import type { Team } from '@/types/team';
import { 
  createDraft, 
  makeSelection, 
  isDraftComplete,
  getBannedHeroes,
  getPickedHeroes,
  getCurrentStep,
  getCurrentTeamName,
  undoLastStep,
} from '@/utils/bpEngine';
import type { BPDraft } from '@/types';
import heroesData from '@/data/heroes.json';
import './App.css';

type AppView = 'bp' | 'teams';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('bp');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // BP相关状态
  const [draft, setDraft] = useState<BPDraft | null>(null);
  const [isRadiantFirst, setIsRadiantFirst] = useState(true);
  const [showAnalysis] = useState(true);
  const [showCounters] = useState(true);
  const [showMembers] = useState(true);

  // 开始新的BP
  const startDraft = useCallback(() => {
    setDraft(createDraft(isRadiantFirst));
  }, [isRadiantFirst]);

  // 选择英雄
  const handleSelectHero = useCallback((heroId: number) => {
    if (!draft || isDraftComplete(draft)) return;
    
    setDraft(prev => {
      if (!prev) return null;
      return makeSelection(prev, heroId);
    });
  }, [draft]);

  // 重置BP
  const resetDraft = useCallback(() => {
    setDraft(null);
  }, []);

  // 撤回上一步
  const handleUndo = useCallback(() => {
    setDraft(prev => {
      if (!prev) return null;
      return undoLastStep(prev);
    });
  }, []);

  // 获取当前不可用的英雄
  const bannedHeroes = draft ? getBannedHeroes(draft) : [];
  const pickedHeroes = draft ? getPickedHeroes(draft) : [];
  
  // 获取当前步骤信息
  const currentStep = draft ? getCurrentStep(draft) : null;
  const isComplete = draft ? isDraftComplete(draft) : false;
  const currentTeamName = draft ? getCurrentTeamName(draft) : '';



  return (
    <div className="app">
      <header className="app-header">
        <h1>🐱 BPCat - 念爱杯BP助手</h1>
        <p className="subtitle">Dota2 Captain's Mode BP模拟器 (7.40c)</p>
        
        {/* 主导航 */}
        <nav className="main-nav">
          <button 
            className={currentView === 'bp' ? 'active' : ''}
            onClick={() => setCurrentView('bp')}
          >
            🎮 BP模拟器
          </button>
          <button 
            className={currentView === 'teams' ? 'active' : ''}
            onClick={() => setCurrentView('teams')}
          >
            👥 队伍管理
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'teams' ? (
          /* 队伍管理界面 */
          <div className="teams-view">
            <TeamManager 
              onSelectTeam={setSelectedTeam}
              selectedTeamId={selectedTeam?.id}
            />
            
            {selectedTeam && (
              <div className="selected-team-info">
                <h3>当前选中队伍: {selectedTeam.name}</h3>
                <p>队员: {selectedTeam.players.length}人</p>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setCurrentView('bp');
                    startDraft();
                  }}
                >
                  用此队伍开始BP
                </button>
              </div>
            )}
          </div>
        ) : (
          /* BP界面 */
          <>
            {/* 显示当前队伍信息 */}
            {selectedTeam && (
              <div className="active-team-bar">
                <span>当前队伍: <strong>{selectedTeam.name}</strong></span>
                <span>队员: {selectedTeam.players.length}人</span>
                <button className="btn-link" onClick={() => setCurrentView('teams')}>
                  切换队伍
                </button>
              </div>
            )}
            
            {!draft ? (
              /* 开始界面 */
              <div className="start-screen">
                <div className="settings-card">
                  <h2>开始BP</h2>
                  
                  {selectedTeam && (
                    <div className="team-brief">
                      <h4>使用队伍: {selectedTeam.name}</h4>
                      <div className="team-players-preview">
                        {selectedTeam.players.map(player => (
                          <div key={player.id} className="player-mini">
                            <img 
                              src={player.avatar || '/default-avatar.png'} 
                              alt="" 
                              className="mini-avatar"
                            />
                            <span>{player.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="setting-row">
                    <label>先选方:</label>
                    <div className="radio-group">
                      <label className={`radio-label ${isRadiantFirst ? 'active' : ''}`}>
                        <input
                          type="radio"
                          checked={isRadiantFirst}
                          onChange={() => setIsRadiantFirst(true)}
                        />
                        <span className="team-badge radiant">天辉</span>
                      </label>
                      <label className={`radio-label ${!isRadiantFirst ? 'active' : ''}`}>
                        <input
                          type="radio"
                          checked={!isRadiantFirst}
                          onChange={() => setIsRadiantFirst(false)}
                        />
                        <span className="team-badge dire">夜魇</span>
                      </label>
                    </div>
                  </div>

                  <button className="btn-primary" onClick={startDraft}>
                    {selectedTeam ? `以 ${selectedTeam.name} 开始BP` : '开始BP'}
                  </button>
                  
                  {!selectedTeam && (
                    <p className="hint">
                      💡 提示: 先到"队伍管理"创建队伍，可以自动加载队员擅长英雄
                    </p>
                  )}
                </div>

                <div className="rules-card">
                  <h3>📋 BP规则 (7.40c)</h3>
                  <ul>
                    <li>第一轮禁用: 先3后4</li>
                    <li>第一轮选择: 各1个</li>
                    <li>第二轮禁用: 先2后1</li>
                    <li>第二轮选择: 各3个</li>
                    <li>第三轮禁用: 各2个</li>
                    <li>第三轮选择: 各1个</li>
                  </ul>
                  <p className="rules-note">每方共禁用7个，选择5个英雄</p>
                </div>

                <div className="features-card">
                  <h3>✨ 功能特色</h3>
                  <ul>
                    <li>📊 阵容分析 - 实时分析双方阵容优缺点</li>
                    <li>💡 克制提示 - 智能推荐克制英雄</li>
                    <li>👥 队伍管理 - 管理念爱杯队伍和队员</li>
                    <li>🎮 Steam集成 - 查询天梯数据和擅长英雄</li>
                    <li>🎯 完整BP流程 - 严格遵循CM模式规则</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* BP界面 */
              <div className="draft-layout">
                {/* 左侧：阵容分析和克制提示 */}
                <aside className="draft-sidebar left">
                  {showAnalysis && (
                    <TeamAnalysis 
                      radiantPicks={draft.radiantPicks} 
                      direPicks={draft.direPicks} 
                    />
                  )}
                  
                  {showCounters && currentStep && (
                    <CounterTips 
                      radiantPicks={draft.radiantPicks}
                      direPicks={draft.direPicks}
                      currentTeam={currentStep.team}
                      bannedHeroes={bannedHeroes}
                    />
                  )}
                </aside>

                {/* 中间：BP面板和英雄选择 */}
                <div className="draft-main">
                  <BPPanel draft={draft} onUndo={handleUndo} />
                  
                  {!isComplete ? (
                    <div className="selection-area">
                      <div className="selection-header">
                        <h3>
                          {currentStep && (
                            <>
                              <span className={`team-badge ${currentStep.team}`}>
                                {currentTeamName}
                              </span>
                              <span className="action-text">
                                {currentStep.type === 'ban' ? '请禁用英雄' : '请选择英雄'}
                              </span>
                            </>
                          )}
                        </h3>
                      </div>
                      
                      <HeroGrid
                        bannedHeroes={bannedHeroes}
                        pickedHeroes={pickedHeroes}
                        onSelect={handleSelectHero}
                      />
                    </div>
                  ) : (
                    <div className="complete-message">
                      <h2>🎉 BP完成!</h2>
                    </div>
                  )}

                  {isComplete && (
                    <div className="draft-result">
                      <h3>最终阵容</h3>
                      <div className="final-teams">
                        <div className="final-team radiant">
                          <h4>天辉</h4>
                          <div className="final-heroes">
                            {draft.radiantPicks.map((heroId, i) => {
                              const hero = heroesData.find(h => h.id === heroId);
                              return (
                                <div key={i} className="final-hero">
                                  <img src={hero?.image} alt={hero?.localizedName} />
                                  <span>{hero?.localizedName}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="final-team dire">
                          <h4>夜魇</h4>
                          <div className="final-heroes">
                            {draft.direPicks.map((heroId, i) => {
                              const hero = heroesData.find(h => h.id === heroId);
                              return (
                                <div key={i} className="final-hero">
                                  <img src={hero?.image} alt={hero?.localizedName} />
                                  <span>{hero?.localizedName}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button className="btn-secondary reset-btn" onClick={resetDraft}>
                    重新开始
                  </button>
                </div>

                {/* 右侧：队员信息 */}
                <aside className="draft-sidebar right">
                  {showMembers && selectedTeam && (
                    <div className="team-players-panel">
                      <h4>👥 {selectedTeam.name}</h4>
                      <div className="players-list-bp">
                        {selectedTeam.players.map(player => (
                          <div key={player.id} className="player-item-bp">
                            <img 
                              src={player.avatar || '/default-avatar.png'} 
                              alt="" 
                              className="player-avatar-bp"
                            />
                            <div className="player-info-bp">
                              <span className="name">{player.name}</span>
                              <span className="position">
                                {player.position.join(',')}号位
                              </span>
                            </div>
                            <div className="player-heroes-bp">
                              {player.signatureHeroes.slice(0, 3).map(heroId => {
                                const hero = heroesData.find(h => h.id === heroId);
                                return (
                                  <img 
                                    key={heroId} 
                                    src={hero?.image} 
                                    title={hero?.localizedName}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!selectedTeam && <MemberSignatures />}
                </aside>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>BPCat v1.0.0 | 为念爱杯内战服务 🎮</p>
      </footer>
    </div>
  );
}

export default App;
