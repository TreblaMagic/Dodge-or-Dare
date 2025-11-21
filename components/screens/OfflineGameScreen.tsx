import React from 'react';
import { GameState, GamePhase } from '../../game/types';
import { playerChoosesDoDare, playerChoosesDodge, resolveDareResult, completeDodge } from '../../game/gameLogic';
import Button from '../ui/Button';
import Scoreboard from '../ui/Scoreboard';
import CardDisplay from '../ui/CardDisplay';

interface OfflineGameScreenProps {
  gameState: GameState;
  onUpdateState: (newState: GameState) => void;
  onQuit: () => void;
}

const OfflineGameScreen: React.FC<OfflineGameScreenProps> = ({ gameState, onUpdateState, onQuit }) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  
  // Logic handlers
  const handleDoDare = () => onUpdateState(playerChoosesDoDare(gameState));
  const handleDodge = () => onUpdateState(playerChoosesDodge(gameState));
  const handleDareSuccess = () => onUpdateState(resolveDareResult(gameState, true));
  const handleDareFail = () => onUpdateState(resolveDareResult(gameState, false));
  const handleDodgeComplete = () => onUpdateState(completeDodge(gameState));

  return (
    <div className="flex-1 flex flex-col p-6 h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-slate-400 text-sm font-bold uppercase tracking-wide">
          Round <span className="text-white">{gameState.currentRound}</span> / {gameState.settings.numberOfRounds}
        </div>
        <button onClick={onQuit} className="text-xs text-slate-500 hover:text-rose-400">
          Quit Game
        </button>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto z-10">
        
        {/* Current Player Indicator */}
        <div className="text-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Current Turn</p>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            {currentPlayer?.name}
          </h2>
        </div>

        {/* Card Display Area */}
        <div className="w-full">
          <CardDisplay card={gameState.currentCard} />
        </div>

        {/* Interaction Area - Depends on Phase */}
        <div className="w-full space-y-3">
          
          {gameState.currentPhase === GamePhase.TURN_DARE_SHOWN && (
            <>
              <Button fullWidth variant="primary" onClick={handleDoDare}>
                Do the Dare
              </Button>
              <Button fullWidth variant="danger" onClick={handleDodge}>
                Dodge (-1 Point)
              </Button>
            </>
          )}

          {gameState.currentPhase === GamePhase.TURN_DARE_RESOLUTION && (
            <div className="space-y-4 text-center bg-slate-800/80 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-lg text-slate-200 font-medium">
                Did <span className="text-indigo-400 font-bold">{currentPlayer?.name}</span> complete the dare?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={handleDareSuccess}>
                  Yes, Completed
                </Button>
                <Button variant="danger" onClick={handleDareFail}>
                  No, Failed
                </Button>
              </div>
            </div>
          )}

          {gameState.currentPhase === GamePhase.TURN_DODGE_SHOWN && (
            <>
              <div className="text-center text-rose-400 text-sm font-bold mb-2 animate-pulse">
                PENALTY ACTIVE
              </div>
              <Button fullWidth variant="secondary" onClick={handleDodgeComplete}>
                Dodge Completed
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Footer Scoreboard Preview */}
      <div className="mt-6">
        <Scoreboard players={gameState.players} currentPlayerId={currentPlayer?.id} />
      </div>
    </div>
  );
};

export default OfflineGameScreen;