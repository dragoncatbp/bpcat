import { useState, useCallback, useEffect } from 'react';
import { HeroGrid } from '@/components/HeroGrid';
import { BPPanel } from '@/components/BPPanel';
import { TeamAnalysis } from '@/components/TeamAnalysis';
import { CounterTips } from '@/components/CounterTips';
import { MemberSignatures } from '@/components/MemberSignatures';
import { TeamManager } from '@/components/TeamManager';
import { PlayerPool } from '@/components/PlayerPool';
import { BPHistory } from '@/components/BPHistory';
import { SideSelector } from '@/components/SideSelector';
import { BPEvaluation } from '@/components/BPEvaluation';
import { OpponentSelector } from '@/components/OpponentSelector';
import { ProMatches } from '@/components/ProMatches';
import type { Team } from '@/types/team';
import type { BPDraft } from '@/types';
import type { Team as BPTeam } from '@/types';
import { 
  loadTeamsFromStorage,
  getMainTeam,
} from '@/types/team';
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
import { evaluateDraft, getScoreColor, getScoreLevel } from '@/utils/bpEvaluation';
import heroesData from '@/data/heroes.json';
import './App.css';

type AppView = 'bp' | 'teams' | 'history' | 'pro' | 'players';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('bp');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [mainTeam, setMainTeam] = useState<Team | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<Team | null>(null);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  
  // BP相关状态
  const [draft, setDraft] = useState<BPDraft | null>(null);
  const [isRadiantFirst, setIsRadiantFirst] = useState(true);
  const [userSide, setUserSide] = useState<BPTeam | null>(null);
  const [showAnalysis] = useState(true);
  const [showCounters] = useState(true);
  const [showMembers] = useState(true);

  // 加载主队和所有队伍
  useEffect(() => {
    const main = getMainTeam();
    const teams = loadTeamsFromStorage();
    setMainTeam(main);
    setAllTeams(teams);
  }, []);

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
    setUserSide(null);
    setOpponentTeam(null);
  }, []);

  // 刷新队伍数据
  const refreshTeams = useCallback(() => {
    const main = getMainTeam();
    const teams = loadTeamsFromStorage();
    setMainTeam(main);
    setAllTeams(teams);
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
            className={currentView === 'pro' ? 'active' : ''}
            onClick={() => setCurrentView('pro')}
          >
            🏆 职业BP
          </button>
          <button 
            className={currentView === 'history' ? 'active' : ''}
            onClick={() => setCurrentView('history')}
          >
            📚 BP记录
          </button>
          <button 
            className={currentView === 'teams' ? 'active' : ''}
            onClick={() => setCurrentView('teams')}
          >
            👥 队伍管理
          </button>
          <button 
            className={currentView === 'players' ? 'active' : ''}
            onClick={() => setCurrentView('players')}
          >
            🏅 选手池
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'teams' ? (
          /* 队伍管理界面 */
          <div className="teams-view">
            <TeamManager 
              onSelectTeam={(team) => {
                setSelectedTeam(team);
                refreshTeams();
              }}
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
        ) : currentView === 'history' ? (
          /* BP历史记录界面 */
          <div className="history-view">
            <BPHistory 
              currentDraft={isComplete ? draft : null}
              onLoadDraft={(loadedDraft) => {
                setDraft(loadedDraft);
                setCurrentView('bp');
              }}
            />
          </div>
        ) : currentView === 'pro' ? (
          /* 职业BP界面 */
          <div className="pro-view">
            <ProMatches />
          </div>
        ) : currentView === 'players' ? (
          /* 选手池界面 */
          <div className="players-view">
            <PlayerPool />
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
                              src={player.avatar || '/default-avatar.svg'} 
                              alt="" 
                              className="mini-avatar"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }}
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
                  <h3>📋 BP规则 (7.40)</h3>
                  <ul>
                    <li>第一轮禁用: 先2后2先1后2 (7个)</li>
                    <li>第一轮选择: 先1后1 (2个)</li>
                    <li>第二轮禁用: 先2后1 (3个)</li>
                    <li>第二轮选择: 后1先2后2先1 (6个)</li>
                    <li>第三轮禁用: 先1后1先1后1 (4个)</li>
                    <li>第三轮选择: 先1后1 (2个)</li>
                  </ul>
                  <p className="rules-note">每方共禁用7个，选择5个英雄 (24步)</p>
                  <p className="rules-note" style={{color: '#60a5fa'}}>7.40更新: 第一/三轮ban阶段顺序改变</p>
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
                {/* 左侧：阵营选择、阵容分析和评价 */}
                <aside className="draft-sidebar left">
                  {/* 阵营选择 */}
                  {!userSide ? (
                    <SideSelector 
                      userSide={userSide}
                      onSelectSide={setUserSide}
                    />
                  ) : (
                    <>
                      <div className="user-side-indicator" style={{ 
                        background: userSide === 'radiant' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        borderLeft: `3px solid ${userSide === 'radiant' ? '#4ade80' : '#f87171'}`
                      }}>
                        <span>当前视角: <strong style={{ color: userSide === 'radiant' ? '#4ade80' : '#f87171' }}>
                          {userSide === 'radiant' ? '天辉' : '夜魇'}
                        </strong></span>
                        <button className="btn-link" onClick={() => setUserSide(null)}>切换</button>
                      </div>
                      
                      {showAnalysis && (
                        <TeamAnalysis 
                          radiantPicks={draft.radiantPicks} 
                          direPicks={draft.direPicks} 
                        />
                      )}
                      
                      {/* 基于阵营的详细评价 */}
                      {(draft.radiantPicks.length > 0 || draft.direPicks.length > 0) && (
                        <BPEvaluation draft={draft} userSide={userSide} />
                      )}
                      
                      {showCounters && currentStep && userSide === currentStep.team && (
                        <CounterTips 
                          radiantPicks={draft.radiantPicks}
                          direPicks={draft.direPicks}
                          currentTeam={currentStep.team}
                          bannedHeroes={bannedHeroes}
                        />
                      )}
                    </>
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
                        myTeam={mainTeam}
                        opponentTeam={opponentTeam}
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
                      
                      {/* 阵容评价 */}
                      <div className="draft-evaluation">
                        <h4>📊 阵容评价</h4>
                        {(() => {
                          const eval1 = evaluateDraft(draft, 'radiant');
                          const eval2 = evaluateDraft(draft, 'dire');
                          return (
                            <div className="evaluation-comparison">
                              <div className="eval-team radiant">
                                <span className="eval-team-name">天辉</span>
                                <span 
                                  className="eval-score"
                                  style={{ color: getScoreColor(eval1.overallScore) }}
                                >
                                  {eval1.overallScore}
                                </span>
                                <span className="eval-level">{getScoreLevel(eval1.overallScore)}</span>
                              </div>
                              <div className="eval-vs">VS</div>
                              <div className="eval-team dire">
                                <span className="eval-team-name">夜魇</span>
                                <span 
                                  className="eval-score"
                                  style={{ color: getScoreColor(eval2.overallScore) }}
                                >
                                  {eval2.overallScore}
                                </span>
                                <span className="eval-level">{getScoreLevel(eval2.overallScore)}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      
                      <button 
                        className="btn-primary save-bp-btn"
                        onClick={() => setCurrentView('history')}
                      >
                        💾 保存此BP到记录
                      </button>
                    </div>
                  )}

                  <button className="btn-secondary reset-btn" onClick={resetDraft}>
                    重新开始
                  </button>
                </div>

                {/* 右侧：对手选择 + 队员信息 */}
                <aside className="draft-sidebar right">
                  {/* 对手选择 */}
                  <OpponentSelector
                    teams={allTeams}
                    mainTeam={mainTeam}
                    opponentTeam={opponentTeam}
                    onSelectOpponent={setOpponentTeam}
                  />
                  
                  {/* 主队成员信息 */}
                  {showMembers && mainTeam && (
                    <div className="team-players-panel main-team-panel">
                      <h4>⭐ 主队: {mainTeam.name}</h4>
                      <div className="players-list-bp">
                        {mainTeam.players.map(player => (
                          <div key={player.id} className="player-item-bp">
                            <img 
                              src={player.avatar || '/default-avatar.svg'} 
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
                  
                  {!mainTeam && <MemberSignatures />}
                </aside>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>BPCat v1.0.0 | 为念爱杯内战服务 🎮</p>
        <p className="update-time">版本更新: 2026-03-21 00:59</p>
      </footer>
    </div>
  );
}

export default App;
