/**
 * 示例职业比赛数据 - 仅用于演示
 * 真实数据需要通过API获取或手动录入
 */

import type { ProMatch } from '@/types/proMatches';

// 知名战队信息
export const proTeams = {
  spirit: { id: 'spirit', name: 'Team Spirit', tag: 'TS', region: 'EEU', logo: '/teams/spirit.png' },
  falcons: { id: 'falcons', name: 'Team Falcons', tag: 'FLC', region: 'MENA', logo: '/teams/falcons.png' },
  liquid: { id: 'liquid', name: 'Team Liquid', tag: 'TL', region: 'WEU', logo: '/teams/liquid.png' },
  gaimin: { id: 'gaimin', name: 'Gaimin Gladiators', tag: 'GG', region: 'WEU', logo: '/teams/gg.png' },
  tundra: { id: 'tundra', name: 'Tundra Esports', tag: 'TUN', region: 'WEU', logo: '/teams/tundra.png' },
  bb: { id: 'bb', name: 'BetBoom Team', tag: 'BB', region: 'EEU', logo: '/teams/bb.png' },
  parivision: { id: 'parivision', name: 'PARIVISION', tag: 'PV', region: 'EEU', logo: '/teams/parivision.png' },
  avulus: { id: 'avulus', name: 'AVULUS', tag: 'AVU', region: 'WEU', logo: '/teams/avulus.png' },
  lynx: { id: 'lynx', name: 'Lynx', tag: 'LYNX', region: 'WEU', logo: '/teams/lynx.png' },
  pwr: { id: 'pwr', name: 'PWR', tag: 'PWR', region: 'NA', logo: '/teams/pwr.png' },
  ivory: { id: 'ivory', name: 'Ivory', tag: 'IVO', region: 'SEA', logo: '/teams/ivory.png' },
  yg: { id: 'yg', name: 'Yakult Brothers', tag: 'YG', region: 'CN', logo: '/teams/yg.png' },
};

// 示例：1场真实格式的比赛数据（用于演示界面）
// 真实数据需要通过API或手动录入
export const sampleProMatches: ProMatch[] = [
  {
    id: 'pro_demo_001',
    tournament: 'BLAST Slam VI (示例数据)',
    tournamentLogo: '/tournaments/blast.png',
    date: '2026-03-15',
    patch: '7.40c',
    tier: 1,
    duration: 2345,
    radiantTeam: proTeams.spirit,
    direTeam: proTeams.falcons,
    picksBans: [
      // Ban Phase 1
      { order: 0, isPick: false, heroId: 93, team: 'radiant' }, // 禁 Medusa
      { order: 1, isPick: false, heroId: 94, team: 'radiant' }, // 禁 Muerta
      { order: 2, isPick: false, heroId: 44, team: 'dire' },    // 禁 PA
      { order: 3, isPick: false, heroId: 56, team: 'dire' },    // 禁 Void
      { order: 4, isPick: false, heroId: 131, team: 'radiant' }, // 禁 Ringmaster
      { order: 5, isPick: false, heroId: 145, team: 'dire' },   // 禁 Kez
      { order: 6, isPick: false, heroId: 74, team: 'dire' },    // 禁 Storm
      // Pick Phase 1
      { order: 7, isPick: true, heroId: 11, team: 'radiant', playerName: 'Yatoro' },    // SF
      { order: 8, isPick: true, heroId: 54, team: 'dire', playerName: 'Skiter' },      // Magnus
      // Ban Phase 2
      { order: 9, isPick: false, heroId: 31, team: 'radiant' }, // 禁 ES
      { order: 10, isPick: false, heroId: 41, team: 'radiant' }, // 禁 FV
      { order: 11, isPick: false, heroId: 22, team: 'dire' },   // 禁 CM
      // Pick Phase 2
      { order: 12, isPick: true, heroId: 99, team: 'dire', playerName: 'Malr1ne' },    // SK
      { order: 13, isPick: true, heroId: 17, team: 'radiant', playerName: 'Larl' },     // Silencer
      { order: 14, isPick: true, heroId: 28, team: 'radiant', playerName: 'Collapse' }, // Slardar
      { order: 15, isPick: true, heroId: 88, team: 'dire', playerName: 'ATF' },        // DP
      { order: 16, isPick: true, heroId: 37, team: 'dire', playerName: 'Cr1t' },       // Warlock
      { order: 17, isPick: true, heroId: 7, team: 'radiant', playerName: 'Mira' },      // Earthshaker
      // Ban Phase 3
      { order: 18, isPick: false, heroId: 86, team: 'radiant' }, // 禁 Enigma
      { order: 19, isPick: false, heroId: 12, team: 'dire' },    // 禁 Phantom Lancer
      { order: 20, isPick: false, heroId: 64, team: 'radiant' }, // 禁 Jakiro
      { order: 21, isPick: false, heroId: 21, team: 'dire' },    // 禁 Windranger
      // Pick Phase 3
      { order: 22, isPick: true, heroId: 14, team: 'radiant', playerName: 'Miposhka' }, // Pudge
      { order: 23, isPick: true, heroId: 34, team: 'dire', playerName: 'Sneyking' },    // Tinker
    ],
    result: {
      winner: 'radiant',
      radiantScore: 42,
      direScore: 28,
      radiantNetWorth: 98765,
      direNetWorth: 76543,
    },
  },
];

// 初始化示例数据到localStorage
import { loadProMatches, saveProMatches } from '@/types/proMatches';

const PRO_MATCHES_VERSION = 'v3-demo';

export function initSampleProMatches(): void {
  const existing = loadProMatches();
  const version = localStorage.getItem('bpcat_pro_matches_version');
  
  // 如果没有数据或版本过旧，则初始化示例数据
  if (existing.length === 0 || version !== PRO_MATCHES_VERSION) {
    saveProMatches(sampleProMatches);
    localStorage.setItem('bpcat_pro_matches_version', PRO_MATCHES_VERSION);
    console.log('Initialized demo pro matches:', sampleProMatches.length);
  }
}
