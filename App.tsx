import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { GameState, ScreenName, GameSettings } from './game/types';
import { createInitialGameState, startFirstTurn } from './game/gameLogic';
import HomeScreen from './components/screens/HomeScreen';
import OfflineSetupScreen from './components/screens/OfflineSetupScreen';
import OfflineGameScreen from './components/screens/OfflineGameScreen';
import GameOverScreen from './components/screens/GameOverScreen';

const App: React.FC = () => {
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(ScreenName.HOME);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStartSetup = useCallback(() => {
    setCurrentScreen(ScreenName.SETUP);
  }, []);

  const handleStartGame = useCallback((settings: GameSettings) => {
    let initial = createInitialGameState(settings);
    initial = startFirstTurn(initial);
    setGameState(initial);
    setCurrentScreen(ScreenName.GAME);
  }, []);

  const handleGameUpdate = useCallback((newState: GameState) => {
    setGameState(newState);
    if (newState.currentPhase === 'GAME_OVER') {
      setCurrentScreen(ScreenName.GAME_OVER);
    }
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (gameState) {
      // Reset game with same settings
      let newGame = createInitialGameState(gameState.settings);
      newGame = startFirstTurn(newGame);
      setGameState(newGame);
      setCurrentScreen(ScreenName.GAME);
    } else {
      setCurrentScreen(ScreenName.HOME);
    }
  }, [gameState]);

  const handleGoHome = useCallback(() => {
    setGameState(null);
    setCurrentScreen(ScreenName.HOME);
  }, []);

  // Don't render game app on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-900 shadow-2xl min-w-[320px]">
      {currentScreen === ScreenName.HOME && (
        <HomeScreen onStartOffline={handleStartSetup} />
      )}
      {currentScreen === ScreenName.SETUP && (
        <OfflineSetupScreen onStartGame={handleStartGame} onBack={handleGoHome} />
      )}
      {currentScreen === ScreenName.GAME && gameState && (
        <OfflineGameScreen 
          gameState={gameState} 
          onUpdateState={handleGameUpdate}
          onQuit={handleGoHome}
        />
      )}
      {currentScreen === ScreenName.GAME_OVER && gameState && (
        <GameOverScreen 
          gameState={gameState} 
          onPlayAgain={handlePlayAgain} 
          onHome={handleGoHome} 
        />
      )}
    </div>
  );
};

export default App;