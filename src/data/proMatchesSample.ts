/**
 * 示例职业比赛数据 - 最近一个月
 * 基于真实赛事构建的示例数据
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

// 示例比赛数据
export const sampleProMatches: ProMatch[] = [
  {
    id: 'pro_match_001',
    tournament: 'BLAST Slam VI',
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
  {
    id: 'pro_match_002',
    tournament: 'BLAST Slam VI',
    tournamentLogo: '/tournaments/blast.png',
    date: '2026-03-15',
    patch: '7.40c',
    tier: 1,
    duration: 3120,
    radiantTeam: proTeams.falcons,
    direTeam: proTeams.spirit,
    picksBans: [
      { order: 0, isPick: false, heroId: 11, team: 'radiant' }, // 禁 SF
      { order: 1, isPick: false, heroId: 44, team: 'radiant' }, // 禁 PA
      { order: 2, isPick: false, heroId: 93, team: 'dire' },   // 禁 Medusa
      { order: 3, isPick: false, heroId: 94, team: 'dire' },   // 禁 Muerta
      { order: 4, isPick: false, heroId: 145, team: 'radiant' }, // 禁 Kez
      { order: 5, isPick: false, heroId: 131, team: 'dire' },  // 禁 Ringmaster
      { order: 6, isPick: false, heroId: 155, team: 'dire' },  // 禁 Largo
      { order: 7, isPick: true, heroId: 56, team: 'radiant', playerName: 'Skiter' },   // Void
      { order: 8, isPick: true, heroId: 74, team: 'dire', playerName: 'Larl' },        // Storm
      { order: 9, isPick: false, heroId: 54, team: 'radiant' }, // 禁 Magnus
      { order: 10, isPick: false, heroId: 31, team: 'radiant' }, // 禁 ES
      { order: 11, isPick: false, heroId: 99, team: 'dire' },  // 禁 SK
      { order: 12, isPick: true, heroId: 28, team: 'dire', playerName: 'Collapse' },   // Slardar
      { order: 13, isPick: true, heroId: 22, team: 'radiant', playerName: 'Cr1t' },    // CM
      { order: 14, isPick: true, heroId: 88, team: 'radiant', playerName: 'Malr1ne' }, // DP
      { order: 15, isPick: true, heroId: 17, team: 'dire', playerName: 'Yatoro' },     // Silencer
      { order: 16, isPick: true, heroId: 7, team: 'dire', playerName: 'Mira' },        // ES
      { order: 17, isPick: true, heroId: 37, team: 'radiant', playerName: 'Sneyking' }, // Warlock
      { order: 18, isPick: false, heroId: 14, team: 'radiant' }, // 禁 Pudge
      { order: 19, isPick: false, heroId: 12, team: 'dire' },    // 禁 PL
      { order: 20, isPick: false, heroId: 64, team: 'radiant' }, // 禁 Jakiro
      { order: 21, isPick: false, heroId: 21, team: 'dire' },    // 禁 WR
      { order: 22, isPick: true, heroId: 34, team: 'radiant', playerName: 'ATF' },     // Tinker
      { order: 23, isPick: true, heroId: 86, team: 'dire', playerName: 'Miposhka' },   // Enigma
    ],
    result: {
      winner: 'dire',
      radiantScore: 35,
      direScore: 51,
      radiantNetWorth: 82345,
      direNetWorth: 105432,
    },
  },
  {
    id: 'pro_match_003',
    tournament: 'DreamLeague Season 28',
    tournamentLogo: '/tournaments/dreamleague.png',
    date: '2026-03-10',
    patch: '7.40c',
    tier: 1,
    duration: 1890,
    radiantTeam: proTeams.liquid,
    direTeam: proTeams.tundra,
    picksBans: [
      { order: 0, isPick: false, heroId: 41, team: 'radiant' }, // 禁 FV
      { order: 1, isPick: false, heroId: 56, team: 'radiant' }, // 禁 Void
      { order: 2, isPick: false, heroId: 11, team: 'dire' },    // 禁 SF
      { order: 3, isPick: false, heroId: 44, team: 'dire' },    // 禁 PA
      { order: 4, isPick: false, heroId: 131, team: 'radiant' }, // 禁 Ringmaster
      { order: 5, isPick: false, heroId: 145, team: 'dire' },   // 禁 Kez
      { order: 6, isPick: false, heroId: 155, team: 'dire' },   // 禁 Largo
      { order: 7, isPick: true, heroId: 93, team: 'radiant', playerName: 'Micke' },    // Medusa
      { order: 8, isPick: true, heroId: 94, team: 'dire', playerName: 'Pure' },        // Muerta
      { order: 9, isPick: false, heroId: 74, team: 'radiant' }, // 禁 Storm
      { order: 10, isPick: false, heroId: 54, team: 'radiant' }, // 禁 Magnus
      { order: 11, isPick: false, heroId: 22, team: 'dire' },   // 禁 CM
      { order: 12, isPick: true, heroId: 99, team: 'dire', playerName: 'bzm' },        // SK
      { order: 13, isPick: true, heroId: 31, team: 'radiant', playerName: 'Nisha' },    // ES
      { order: 14, isPick: true, heroId: 88, team: 'radiant', playerName: 'Boxi' },     // DP
      { order: 15, isPick: true, heroId: 17, team: 'dire', playerName: '33' },          // Silencer
      { order: 16, isPick: true, heroId: 28, team: 'dire', playerName: 'Saksa' },       // Slardar
      { order: 17, isPick: true, heroId: 7, team: 'radiant', playerName: 'Insania' },   // Earthshaker
      { order: 18, isPick: false, heroId: 14, team: 'radiant' }, // 禁 Pudge
      { order: 19, isPick: false, heroId: 12, team: 'dire' },    // 禁 PL
      { order: 20, isPick: false, heroId: 64, team: 'radiant' }, // 禁 Jakiro
      { order: 21, isPick: false, heroId: 37, team: 'dire' },    // 禁 Warlock
      { order: 22, isPick: true, heroId: 86, team: 'radiant', playerName: 'Action' },   // Enigma
      { order: 23, isPick: true, heroId: 34, team: 'dire', playerName: 'Whitemon' },    // Tinker
    ],
    result: {
      winner: 'radiant',
      radiantScore: 38,
      direScore: 22,
      radiantNetWorth: 87654,
      direNetWorth: 65432,
    },
  },
  {
    id: 'pro_match_004',
    tournament: 'DreamLeague Season 28',
    tournamentLogo: '/tournaments/dreamleague.png',
    date: '2026-03-10',
    patch: '7.40c',
    tier: 1,
    duration: 2670,
    radiantTeam: proTeams.tundra,
    direTeam: proTeams.gaimin,
    picksBans: [
      { order: 0, isPick: false, heroId: 93, team: 'radiant' }, // 禁 Medusa
      { order: 1, isPick: false, heroId: 94, team: 'radiant' }, // 禁 Muerta
      { order: 2, isPick: false, heroId: 11, team: 'dire' },    // 禁 SF
      { order: 3, isPick: false, heroId: 44, team: 'dire' },    // 禁 PA
      { order: 4, isPick: false, heroId: 131, team: 'radiant' }, // 禁 Ringmaster
      { order: 5, isPick: false, heroId: 145, team: 'dire' },   // 禁 Kez
      { order: 6, isPick: false, heroId: 155, team: 'dire' },   // 禁 Largo
      { order: 7, isPick: true, heroId: 56, team: 'radiant', playerName: 'Pure' },     // Void
      { order: 8, isPick: true, heroId: 74, team: 'dire', playerName: 'Quinn' },       // Storm
      { order: 9, isPick: false, heroId: 54, team: 'radiant' }, // 禁 Magnus
      { order: 10, isPick: false, heroId: 31, team: 'radiant' }, // 禁 ES
      { order: 11, isPick: false, heroId: 99, team: 'dire' },  // 禁 SK
      { order: 12, isPick: true, heroId: 22, team: 'dire', playerName: 'Ace' },        // CM
      { order: 13, isPick: true, heroId: 88, team: 'radiant', playerName: 'bzm' },     // DP
      { order: 14, isPick: true, heroId: 17, team: 'radiant', playerName: '33' },      // Silencer
      { order: 15, isPick: true, heroId: 28, team: 'dire', playerName: 'Saksa' },      // Slardar
      { order: 16, isPick: true, heroId: 7, team: 'dire', playerName: 'tOfu' },        // ES
      { order: 17, isPick: true, heroId: 37, team: 'radiant', playerName: 'Whitemon' }, // Warlock
      { order: 18, isPick: false, heroId: 14, team: 'radiant' }, // 禁 Pudge
      { order: 19, isPick: false, heroId: 12, team: 'dire' },    // 禁 PL
      { order: 20, isPick: false, heroId: 64, team: 'radiant' }, // 禁 Jakiro
      { order: 21, isPick: false, heroId: 21, team: 'dire' },    // 禁 WR
      { order: 22, isPick: true, heroId: 86, team: 'radiant', playerName: 'Sneyking' }, // Enigma
      { order: 23, isPick: true, heroId: 34, team: 'dire', playerName: 'Dy' },         // Tinker
    ],
    result: {
      winner: 'dire',
      radiantScore: 29,
      direScore: 45,
      radiantNetWorth: 71234,
      direNetWorth: 98765,
    },
  },
  {
    id: 'pro_match_005',
    tournament: 'European Pro League Season 35',
    tournamentLogo: '/tournaments/epl.png',
    date: '2026-03-08',
    patch: '7.40c',
    tier: 2,
    duration: 2156,
    radiantTeam: proTeams.lynx,
    direTeam: proTeams.avulus,
    picksBans: [
      { order: 0, isPick: false, heroId: 41, team: 'radiant' }, // 禁 FV
      { order: 1, isPick: false, heroId: 56, team: 'radiant' }, // 禁 Void
      { order: 2, isPick: false, heroId: 11, team: 'dire' },    // 禁 SF
      { order: 3, isPick: false, heroId: 44, team: 'dire' },    // 禁 PA
      { order: 4, isPick: false, heroId: 131, team: 'radiant' }, // 禁 Ringmaster
      { order: 5, isPick: false, heroId: 145, team: 'dire' },   // 禁 Kez
      { order: 6, isPick: false, heroId: 155, team: 'dire' },   // 禁 Largo
      { order: 7, isPick: true, heroId: 93, team: 'radiant', playerName: 'Watson' },   // Medusa
      { order: 8, isPick: true, heroId: 94, team: 'dire', playerName: 'K1' },          // Muerta
      { order: 9, isPick: false, heroId: 74, team: 'radiant' }, // 禁 Storm
      { order: 10, isPick: false, heroId: 54, team: 'radiant' }, // 禁 Magnus
      { order: 11, isPick: false, heroId: 99, team: 'dire' },   // 禁 SK
      { order: 12, isPick: true, heroId: 22, team: 'dire', playerName: 'Darkmago' },   // CM
      { order: 13, isPick: true, heroId: 88, team: 'radiant', playerName: 'gpk' },     // DP
      { order: 14, isPick: true, heroId: 17, team: 'radiant', playerName: 'Saksa' },   // Silencer
      { order: 15, isPick: true, heroId: 28, team: 'dire', playerName: 'Wisper' },     // Slardar
      { order: 16, isPick: true, heroId: 7, team: 'dire', playerName: 'Matthew' },     // ES
      { order: 17, isPick: true, heroId: 37, team: 'radiant', playerName: 'Panda' },   // Warlock
      { order: 18, isPick: false, heroId: 14, team: 'radiant' }, // 禁 Pudge
      { order: 19, isPick: false, heroId: 12, team: 'dire' },    // 禁 PL
      { order: 20, isPick: false, heroId: 64, team: 'radiant' }, // 禁 Jakiro
      { order: 21, isPick: false, heroId: 21, team: 'dire' },    // 禁 WR
      { order: 22, isPick: true, heroId: 86, team: 'radiant', playerName: 'Kataomi' }, // Enigma
      { order: 23, isPick: true, heroId: 34, team: 'dire', playerName: 'Mjz' },        // Tinker
    ],
    result: {
      winner: 'radiant',
      radiantScore: 32,
      direScore: 18,
      radiantNetWorth: 82345,
      direNetWorth: 54321,
    },
  },
];

// 初始化示例数据到localStorage
import { loadProMatches, saveProMatches } from '@/types/proMatches';

export function initSampleProMatches(): void {
  const existing = loadProMatches();
  
  // 如果没有数据，则初始化示例数据
  if (existing.length === 0) {
    saveProMatches(sampleProMatches);
    console.log('Initialized sample pro matches:', sampleProMatches.length);
  }
}
