import type { Team } from '@/types/team';
import heroesData from '@/data/heroes.json';

interface OpponentSelectorProps {
  teams: Team[];
  mainTeam: Team | null;
  opponentTeam: Team | null;
  onSelectOpponent: (team: Team | null) => void;
}

export function OpponentSelector({ teams, mainTeam, opponentTeam, onSelectOpponent }: OpponentSelectorProps) {
  // 过滤掉主队，只显示可作为对手的队伦
  const availableTeams = teams.filter(t => !t.isMainTeam && t.id !== mainTeam?.id);

  if (availableTeams.length === 0) {
    return (
      <div className="opponent-selector">
        <h4>🆚 对手队伍</h4>
        <p className="opponent-hint">
          {mainTeam 
            ? "没有其他队伍可作为对手，请先创建更多队伍" 
            : "请先设定主队后再选择对手"}
        </p>
      </div>
    );
  }

  return (
    <div className="opponent-selector">
      <h4>🆚 对手队伍</h4>
      <p className="opponent-hint">选择本轮对阵的对手，查看其擅长英雄</p>
      
      <div className="opponent-list">
        {availableTeams.map(team => (
          <button
            key={team.id}
            className={`opponent-btn ${opponentTeam?.id === team.id ? 'active' : ''}`}
            onClick={() => onSelectOpponent(opponentTeam?.id === team.id ? null : team)}
          >
            <span className="opponent-name">{team.name}</span>
            <span className="opponent-players">{team.players.length}人</span>
          </button>
        ))}
      </div>

      {opponentTeam && (
        <div className="opponent-info">
          <h5>对手擅长英雄</h5>
          <div className="opponent-heroes">
            {opponentTeam.players.map(player => (
              <div key={player.id} className="opponent-player">
                <span className="player-name">{player.name}</span>
                <div className="signature-heroes">
                  {player.signatureHeroes.slice(0, 3).map(heroId => {
                    const hero = heroesData.find(h => h.id === heroId);
                    return (
                      <img 
                        key={heroId}
                        src={hero?.image || 'heroes/default.png'}
                        alt={hero?.localizedName || ''}
                        className="opponent-hero-icon"
                        title={`${player.name} 的擅长英雄: ${hero?.localizedName || ''}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


