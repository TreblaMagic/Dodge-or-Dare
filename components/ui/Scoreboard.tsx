import React from 'react';
import { Player } from '../../game/types';

interface ScoreboardProps {
  players: Player[];
  currentPlayerId?: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayerId }) => {
  // Sort by score descending
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 w-full">
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Leaderboard</h3>
      <div className="space-y-2">
        {sortedPlayers.map((player) => (
          <div 
            key={player.id} 
            className={`flex justify-between items-center p-2 rounded-lg ${
              player.id === currentPlayerId 
                ? "bg-indigo-900/40 border border-indigo-500/30 text-indigo-200" 
                : "text-slate-300"
            }`}
          >
            <span className="font-medium flex items-center gap-2">
              {player.id === currentPlayerId && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              )}
              {player.name}
            </span>
            <span className="font-mono font-bold text-lg">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;