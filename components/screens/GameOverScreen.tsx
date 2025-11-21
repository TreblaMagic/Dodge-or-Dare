import React from 'react';
import { GameState } from '../../game/types';
import Button from '../ui/Button';

interface GameOverScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameState, onPlayAgain, onHome }) => {
  const players = [...gameState.players].sort((a, b) => b.score - a.score);
  const topScore = players[0].score;
  const winners = players.filter(p => p.score === topScore);

  return (
    <div className="flex-1 flex flex-col p-6 items-center text-center space-y-8 h-screen overflow-y-auto">
      <div className="mt-8 space-y-2">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Game Over</h1>
        <p className="text-slate-400">All rounds completed!</p>
      </div>

      {/* Winner Showcase */}
      <div className="w-full bg-gradient-to-b from-yellow-500/20 to-transparent p-6 rounded-2xl border border-yellow-500/30">
        <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">Winner{winners.length > 1 ? 's' : ''}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {winners.map(w => (
            <div key={w.id} className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">
              {w.name}
            </div>
          ))}
        </div>
        <div className="mt-4 text-2xl font-mono font-bold text-yellow-200">
          {topScore} pts
        </div>
      </div>

      {/* Full Ranking */}
      <div className="w-full space-y-2 text-left">
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider ml-1">Final Standings</h3>
        {players.map((p, idx) => (
          <div 
            key={p.id} 
            className={`flex justify-between items-center p-3 rounded-lg border ${
              idx === 0 
                ? "bg-slate-800 border-yellow-500/20" 
                : "bg-slate-800/50 border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-mono text-sm w-4">{idx + 1}</span>
              <span className={`font-medium ${idx === 0 ? 'text-white' : 'text-slate-300'}`}>{p.name}</span>
            </div>
            <span className={`font-bold ${p.score < 0 ? 'text-rose-400' : 'text-slate-200'}`}>{p.score}</span>
          </div>
        ))}
      </div>

      <div className="flex-1"></div>

      <div className="w-full space-y-3 pb-4">
        <Button fullWidth variant="primary" onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button fullWidth variant="outline" onClick={onHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;