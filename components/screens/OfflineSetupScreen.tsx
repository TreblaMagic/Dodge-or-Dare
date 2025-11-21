import React, { useState, useEffect } from 'react';
import { Player, GameSettings, Difficulty, DifficultyPreset, CardPattern } from '../../game/types';
import { adminDataService } from '../../services/adminDataService';
import Button from '../ui/Button';

interface OfflineSetupScreenProps {
  onStartGame: (settings: GameSettings) => void;
  onBack: () => void;
}

const OfflineSetupScreen: React.FC<OfflineSetupScreenProps> = ({ onStartGame, onBack }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [rounds, setRounds] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty | 'ANY'>('ANY');
  const [presets, setPresets] = useState<DifficultyPreset[]>([]);
  const [patterns, setPatterns] = useState<CardPattern[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('NONE');
  const [playerPatternSelections, setPlayerPatternSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    setPresets(adminDataService.getPresets());
    setPatterns(adminDataService.getPatterns());
  }, []);

  const addPlayer = () => {
    if (!playerNameInput.trim()) return;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: playerNameInput.trim(),
      score: 0, // Will be reset by game logic
      turnIndex: players.length,
    };
    setPlayers([...players, newPlayer]);
    setPlayerPatternSelections(prev => ({ ...prev, [newPlayer.id]: 'NONE' }));
    setPlayerNameInput('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    setPlayerPatternSelections(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleStart = () => {
    if (players.length < 2) return;

    const assignments: Record<string, string | null> = {};
    players.forEach(player => {
      const selection = playerPatternSelections[player.id] ?? 'NONE';
      assignments[player.id] = selection === 'NONE' ? null : selection;
    });

    onStartGame({
      players,
      numberOfRounds: rounds,
      difficultyFilter: difficulty,
      difficultyPresetId: selectedPresetId !== 'NONE' ? selectedPresetId : null,
      playerPatternAssignments: assignments,
    });
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-8 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          ← Back
        </button>
        <h2 className="text-xl font-bold text-white">Game Setup</h2>
        <div className="w-8"></div> {/* Spacer */}
      </div>

      {/* Players Section */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide">
          Players ({players.length})
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={playerNameInput}
            onChange={(e) => setPlayerNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            placeholder="Enter name..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            onClick={addPlayer}
            disabled={!playerNameInput.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-3 rounded-xl font-bold transition-colors"
          >
            +
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {players.map((p) => (
            <div key={p.id} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-200">{p.name}</span>
                <button 
                  onClick={() => removePlayer(p.id)}
                  className="text-rose-500 hover:text-rose-400 p-1"
                >
                  ✕
                </button>
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-1">Pattern</label>
                <select
                  value={playerPatternSelections[p.id] || 'NONE'}
                  onChange={(e) =>
                    setPlayerPatternSelections(prev => ({ ...prev, [p.id]: e.target.value }))
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="NONE">None (Random)</option>
                  {patterns.map(pattern => (
                    <option key={pattern.id} value={pattern.id}>
                      {pattern.name} ({pattern.steps.length} steps)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {players.length === 0 && (
            <p className="text-slate-500 text-center italic py-2">Add at least 2 players</p>
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide">
            Rounds
          </label>
          <select 
            value={rounds} 
            onChange={(e) => setRounds(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
          >
            {[5, 10, 15, 20].map(n => (
              <option key={n} value={n}>{n} Rounds</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide">
            Difficulty
          </label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value as any)}
            disabled={selectedPresetId !== 'NONE'}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none disabled:opacity-50"
          >
            <option value="ANY">Any</option>
            <option value={Difficulty.EASY}>Easy</option>
            <option value={Difficulty.MEDIUM}>Medium</option>
            <option value={Difficulty.HARD}>Hard</option>
          </select>
          {selectedPresetId !== 'NONE' && (
            <p className="text-xs text-slate-500">
              Controlled by preset {presets.find(p => p.id === selectedPresetId)?.name}
            </p>
          )}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide">
            Difficulty Preset
          </label>
          <select
            value={selectedPresetId}
            onChange={(e) => {
              const nextValue = e.target.value;
              setSelectedPresetId(nextValue);
              if (nextValue !== 'NONE') {
                const preset = presets.find(p => p.id === nextValue);
                if (preset && preset.allowedDifficulties.length === 1) {
                  setDifficulty(preset.allowedDifficulties[0]);
                }
              }
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="NONE">No Preset (use dropdown)</option>
            {presets.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.name} ({preset.allowedDifficulties.join(', ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1"></div>

      <Button 
        fullWidth 
        onClick={handleStart} 
        disabled={players.length < 2}
      >
        Start Game
      </Button>
    </div>
  );
};

export default OfflineSetupScreen;