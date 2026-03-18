/**
 * BP引擎 - 处理Dota2 Captain's Mode的BP逻辑
 * 基于7.34+版本的BP规则
 */

import type { Team, PhaseType, BPStep, BPDraft } from '@/types';

// CM模式BP顺序（先选方视角）
// 格式: [team, type]
// 先选方: 'radiant', 后选方: 'dire'
export const CM_SEQUENCE: { team: Team; type: PhaseType }[] = [
  // Ban Phase 1: 先3后4
  { team: 'radiant', type: 'ban' },   // 1
  { team: 'dire', type: 'ban' },      // 2
  { team: 'dire', type: 'ban' },      // 3
  { team: 'radiant', type: 'ban' },   // 4
  { team: 'dire', type: 'ban' },      // 5
  { team: 'dire', type: 'ban' },      // 6
  { team: 'radiant', type: 'ban' },   // 7
  
  // Pick Phase 1: 各1个
  { team: 'radiant', type: 'pick' },  // 8
  { team: 'dire', type: 'pick' },     // 9
  { team: 'dire', type: 'pick' },     // 10
  { team: 'radiant', type: 'pick' },  // 11
  
  // Ban Phase 2: 先2后1
  { team: 'radiant', type: 'ban' },   // 12
  { team: 'radiant', type: 'ban' },   // 13
  { team: 'dire', type: 'ban' },      // 14
  
  // Pick Phase 2: 各3个
  { team: 'dire', type: 'pick' },     // 15
  { team: 'radiant', type: 'pick' },  // 16
  { team: 'radiant', type: 'pick' },  // 17
  { team: 'dire', type: 'pick' },     // 18
  { team: 'dire', type: 'pick' },     // 19
  { team: 'radiant', type: 'pick' },  // 20
  { team: 'dire', type: 'pick' },     // 21
  { team: 'radiant', type: 'pick' },  // 22
  
  // Ban Phase 3: 各2个
  { team: 'radiant', type: 'ban' },   // 23
  { team: 'dire', type: 'ban' },      // 24
  { team: 'dire', type: 'ban' },      // 25
  { team: 'radiant', type: 'ban' },   // 26
  
  // Pick Phase 3: 各1个
  { team: 'radiant', type: 'pick' },  // 27
  { team: 'dire', type: 'pick' },     // 28
];

// 如果夜魇先选，交换队伍
function getAdjustedSequence(isRadiantFirst: boolean): { team: Team; type: PhaseType }[] {
  if (isRadiantFirst) return CM_SEQUENCE;
  
  return CM_SEQUENCE.map(step => ({
    team: step.team === 'radiant' ? 'dire' : 'radiant',
    type: step.type
  }));
}

// 创建新的BP对局
export function createDraft(isRadiantFirst: boolean = true): BPDraft {
  const sequence = getAdjustedSequence(isRadiantFirst);
  
  return {
    id: Date.now().toString(),
    radiantBans: [],
    direBans: [],
    radiantPicks: [],
    direPicks: [],
    currentStep: 0,
    isFirstPickRadiant: isRadiantFirst,
    steps: sequence.map((s, i) => ({
      id: i,
      team: s.team,
      type: s.type,
      heroId: null,
    })),
  };
}

// 获取当前步骤信息
export function getCurrentStep(draft: BPDraft): BPStep | null {
  if (draft.currentStep >= draft.steps.length) return null;
  return draft.steps[draft.currentStep];
}

// 执行BP操作
export function makeSelection(draft: BPDraft, heroId: number): BPDraft {
  const currentStep = getCurrentStep(draft);
  if (!currentStep) return draft;

  const newSteps = [...draft.steps];
  newSteps[draft.currentStep] = {
    ...currentStep,
    heroId,
    timestamp: Date.now(),
  };

  const newDraft: BPDraft = {
    ...draft,
    steps: newSteps,
    currentStep: draft.currentStep + 1,
  };

  // 更新ban/pick列表
  if (currentStep.type === 'ban') {
    if (currentStep.team === 'radiant') {
      newDraft.radiantBans = [...draft.radiantBans, heroId];
    } else {
      newDraft.direBans = [...draft.direBans, heroId];
    }
  } else {
    if (currentStep.team === 'radiant') {
      newDraft.radiantPicks = [...draft.radiantPicks, heroId];
    } else {
      newDraft.direPicks = [...draft.direPicks, heroId];
    }
  }

  return newDraft;
}

// 撤回上一步操作
export function undoLastStep(draft: BPDraft): BPDraft {
  if (draft.currentStep === 0) return draft;
  
  const lastStepIndex = draft.currentStep - 1;
  const lastStep = draft.steps[lastStepIndex];
  
  if (!lastStep || !lastStep.heroId) return draft;
  
  const newSteps = [...draft.steps];
  newSteps[lastStepIndex] = {
    ...lastStep,
    heroId: null,
    timestamp: undefined,
  };
  
  const newDraft: BPDraft = {
    ...draft,
    steps: newSteps,
    currentStep: lastStepIndex,
  };
  
  // 从ban/pick列表中移除
  if (lastStep.type === 'ban') {
    if (lastStep.team === 'radiant') {
      newDraft.radiantBans = draft.radiantBans.filter(id => id !== lastStep.heroId);
    } else {
      newDraft.direBans = draft.direBans.filter(id => id !== lastStep.heroId);
    }
  } else {
    if (lastStep.team === 'radiant') {
      newDraft.radiantPicks = draft.radiantPicks.filter(id => id !== lastStep.heroId);
    } else {
      newDraft.direPicks = draft.direPicks.filter(id => id !== lastStep.heroId);
    }
  }
  
  return newDraft;
}

// 判断是否可撤回
export function canUndo(draft: BPDraft): boolean {
  return draft.currentStep > 0;
}

// 判断BP是否结束
export function isDraftComplete(draft: BPDraft): boolean {
  return draft.currentStep >= draft.steps.length;
}

// 获取已ban的英雄
export function getBannedHeroes(draft: BPDraft): number[] {
  return [...draft.radiantBans, ...draft.direBans];
}

// 获取已pick的英雄
export function getPickedHeroes(draft: BPDraft): number[] {
  return [...draft.radiantPicks, ...draft.direPicks];
}

// 获取不可选择的英雄（已ban或已pick）
export function getUnavailableHeroes(draft: BPDraft): number[] {
  return [...getBannedHeroes(draft), ...getPickedHeroes(draft)];
}

// 获取BP阶段名称
export function getPhaseName(stepIndex: number): string {
  if (stepIndex < 7) return '第一轮禁用';
  if (stepIndex < 11) return '第一轮选择';
  if (stepIndex < 14) return '第二轮禁用';
  if (stepIndex < 22) return '第二轮选择';
  if (stepIndex < 26) return '第三轮禁用';
  return '第三轮选择';
}

// 获取当前操作方名称
export function getCurrentTeamName(draft: BPDraft): string {
  const step = getCurrentStep(draft);
  if (!step) return 'BP结束';
  return step.team === 'radiant' ? '天辉' : '夜魇';
}

// 获取当前操作类型
export function getCurrentActionName(draft: BPDraft): string {
  const step = getCurrentStep(draft);
  if (!step) return '';
  return step.type === 'ban' ? '禁用' : '选择';
}

// 获取BP统计
export function getDraftStats(draft: BPDraft) {
  return {
    radiantBans: draft.radiantBans.length,
    direBans: draft.direBans.length,
    radiantPicks: draft.radiantPicks.length,
    direPicks: draft.direPicks.length,
    totalSteps: draft.steps.length,
    completedSteps: draft.currentStep,
    progress: Math.round((draft.currentStep / draft.steps.length) * 100),
  };
}
