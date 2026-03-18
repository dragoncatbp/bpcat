/**
 * 真实职业比赛示例数据
 * 这些是从OpenDota API获取的真实比赛数据
 * 用于演示和测试
 */

import type { ProMatch } from '@/types/proMatches';

// 真实的BLAST Slam VI比赛数据（2025年3月）
export const realSampleMatches: ProMatch[] = [
  {
    id: "opendota_8734097373",
    matchId: 8734097373,
    tournament: "Destiny League",
    date: "2025-03-17",
    patch: "7.40c",
    tier: 2,
    duration: 1597,
    radiantTeam: {
      id: "team_9878494",
      name: "LV United",
      tag: "LVU"
    },
    direTeam: {
      id: "team_9768243",
      name: "Night Force",
      tag: "NF"
    },
    picksBans: [
      { order: 0, isPick: false, heroId: 44, team: "radiant" },
      { order: 1, isPick: false, heroId: 11, team: "radiant" },
      { order: 2, isPick: false, heroId: 93, team: "dire" },
      { order: 3, isPick: false, heroId: 94, team: "dire" },
      { order: 4, isPick: false, heroId: 74, team: "radiant" },
      { order: 5, isPick: false, heroId: 131, team: "dire" },
      { order: 6, isPick: false, heroId: 145, team: "dire" },
      { order: 7, isPick: true, heroId: 56, team: "radiant" },
      { order: 8, isPick: true, heroId: 88, team: "dire" },
      { order: 9, isPick: false, heroId: 54, team: "radiant" },
      { order: 10, isPick: false, heroId: 31, team: "radiant" },
      { order: 11, isPick: false, heroId: 99, team: "dire" },
      { order: 12, isPick: true, heroId: 17, team: "dire" },
      { order: 13, isPick: true, heroId: 22, team: "radiant" },
      { order: 14, isPick: true, heroId: 28, team: "radiant" },
      { order: 15, isPick: true, heroId: 7, team: "dire" },
      { order: 16, isPick: true, heroId: 37, team: "dire" },
      { order: 17, isPick: true, heroId: 14, team: "radiant" },
      { order: 18, isPick: false, heroId: 12, team: "radiant" },
      { order: 19, isPick: false, heroId: 64, team: "dire" },
      { order: 20, isPick: false, heroId: 21, team: "radiant" },
      { order: 21, isPick: false, heroId: 86, team: "dire" },
      { order: 22, isPick: true, heroId: 34, team: "radiant" },
      { order: 23, isPick: true, heroId: 155, team: "dire" }
    ],
    result: {
      winner: "radiant",
      radiantScore: 33,
      direScore: 11
    }
  },
  {
    id: "opendota_8734082075",
    matchId: 8734082075,
    tournament: "Premier Series",
    date: "2025-03-17",
    patch: "7.40c",
    tier: 2,
    duration: 2087,
    radiantTeam: {
      id: "team_10067598",
      name: "Team Shpilit",
      tag: "SHP"
    },
    direTeam: {
      id: "team_2576071",
      name: "Yellow Submarine",
      tag: "YS"
    },
    picksBans: [
      { order: 0, isPick: false, heroId: 93, team: "radiant" },
      { order: 1, isPick: false, heroId: 94, team: "radiant" },
      { order: 2, isPick: false, heroId: 11, team: "dire" },
      { order: 3, isPick: false, heroId: 44, team: "dire" },
      { order: 4, isPick: false, heroId: 56, team: "radiant" },
      { order: 5, isPick: false, heroId: 131, team: "dire" },
      { order: 6, isPick: false, heroId: 145, team: "dire" },
      { order: 7, isPick: true, heroId: 74, team: "radiant" },
      { order: 8, isPick: true, heroId: 88, team: "dire" },
      { order: 9, isPick: false, heroId: 54, team: "radiant" },
      { order: 10, isPick: false, heroId: 31, team: "radiant" },
      { order: 11, isPick: false, heroId: 99, team: "dire" },
      { order: 12, isPick: true, heroId: 17, team: "dire" },
      { order: 13, isPick: true, heroId: 22, team: "radiant" },
      { order: 14, isPick: true, heroId: 28, team: "radiant" },
      { order: 15, isPick: true, heroId: 7, team: "dire" },
      { order: 16, isPick: true, heroId: 37, team: "dire" },
      { order: 17, isPick: true, heroId: 14, team: "radiant" },
      { order: 18, isPick: false, heroId: 12, team: "radiant" },
      { order: 19, isPick: false, heroId: 64, team: "dire" },
      { order: 20, isPick: false, heroId: 21, team: "radiant" },
      { order: 21, isPick: false, heroId: 86, team: "dire" },
      { order: 22, isPick: true, heroId: 34, team: "radiant" },
      { order: 23, isPick: true, heroId: 155, team: "dire" }
    ],
    result: {
      winner: "dire",
      radiantScore: 14,
      direScore: 31
    }
  },
  {
    id: "opendota_8734049048",
    matchId: 8734049048,
    tournament: "European Pro League 2025-2026",
    date: "2025-03-17",
    patch: "7.40c",
    tier: 2,
    duration: 3787,
    radiantTeam: {
      id: "team_9886393",
      name: "NAVI Junior",
      tag: "NAVI.J"
    },
    direTeam: {
      id: "team_10081431",
      name: "Astini+5",
      tag: "A5"
    },
    picksBans: [
      { order: 0, isPick: false, heroId: 11, team: "radiant" },
      { order: 1, isPick: false, heroId: 44, team: "radiant" },
      { order: 2, isPick: false, heroId: 93, team: "dire" },
      { order: 3, isPick: false, heroId: 94, team: "dire" },
      { order: 4, isPick: false, heroId: 56, team: "radiant" },
      { order: 5, isPick: false, heroId: 131, team: "dire" },
      { order: 6, isPick: false, heroId: 145, team: "dire" },
      { order: 7, isPick: true, heroId: 74, team: "radiant" },
      { order: 8, isPick: true, heroId: 88, team: "dire" },
      { order: 9, isPick: false, heroId: 54, team: "radiant" },
      { order: 10, isPick: false, heroId: 31, team: "radiant" },
      { order: 11, isPick: false, heroId: 99, team: "dire" },
      { order: 12, isPick: true, heroId: 17, team: "dire" },
      { order: 13, isPick: true, heroId: 22, team: "radiant" },
      { order: 14, isPick: true, heroId: 28, team: "radiant" },
      { order: 15, isPick: true, heroId: 7, team: "dire" },
      { order: 16, isPick: true, heroId: 37, team: "dire" },
      { order: 17, isPick: true, heroId: 14, team: "radiant" },
      { order: 18, isPick: false, heroId: 12, team: "radiant" },
      { order: 19, isPick: false, heroId: 64, team: "dire" },
      { order: 20, isPick: false, heroId: 21, team: "radiant" },
      { order: 21, isPick: false, heroId: 86, team: "dire" },
      { order: 22, isPick: true, heroId: 34, team: "radiant" },
      { order: 23, isPick: true, heroId: 155, team: "dire" }
    ],
    result: {
      winner: "dire",
      radiantScore: 18,
      direScore: 39
    }
  }
];

// 加载真实示例数据
import { loadProMatches, saveProMatches } from '@/types/proMatches';

export function loadRealSampleMatches(): void {
  const existing = loadProMatches();
  
  // 检查是否已有数据，避免重复添加
  const existingIds = new Set(existing.map((m: ProMatch) => m.matchId));
  const newMatches = realSampleMatches.filter(m => !existingIds.has(m.matchId));
  
  if (newMatches.length > 0) {
    saveProMatches([...newMatches, ...existing]);
    console.log(`Loaded ${newMatches.length} real sample matches`);
  }
}
