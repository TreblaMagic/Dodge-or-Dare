import { GameState, GameSettings, GamePhase, CardType, Card, Difficulty } from './types';
import { adminDataService } from '../services/adminDataService';

interface RandomCardOptions {
  difficultyFilter?: Difficulty | 'ANY';
  allowedDifficulties?: Difficulty[];
}

// --- Helper: Select Random Card ---
function getRandomCard(type: CardType, options: RandomCardOptions = {}): Card {
  const { difficultyFilter = 'ANY', allowedDifficulties } = options;
  const pool = type === CardType.DARE
    ? adminDataService.getActiveDares()
    : adminDataService.getActiveDodges();

  let filtered = pool;

  if (type === CardType.DARE) {
    if (allowedDifficulties && allowedDifficulties.length > 0) {
      filtered = pool.filter(c => allowedDifficulties.includes(c.difficulty));
    }

    if (filtered.length === 0 && difficultyFilter !== 'ANY') {
      filtered = pool.filter(c => c.difficulty === difficultyFilter);
    }

    if (filtered.length === 0) {
      filtered = pool;
    }
  }

  if (filtered.length === 0) {
    return {
      id: 'fallback',
      type,
      text: 'No cards available! Please check admin settings.',
      difficulty: Difficulty.EASY,
      active: true,
    };
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

function getCardById(type: CardType, id?: string | null): Card | null {
  if (!id) return null;
  return adminDataService.getCardById(type, id) || null;
}

function getAllowedDifficulties(state: GameState): Difficulty[] | undefined {
  const preset = state.activeDifficultyPreset;
  if (preset && preset.allowedDifficulties.length > 0) {
    return preset.allowedDifficulties;
  }
  return undefined;
}

// --- Core Logic ---

export function createInitialGameState(settings: GameSettings): GameState {
  const assignments = settings.playerPatternAssignments
    ? { ...settings.playerPatternAssignments }
    : {};
  settings.players.forEach(player => {
    if (!(player.id in assignments)) {
      assignments[player.id] = null;
    }
  });

  const normalizedSettings: GameSettings = {
    ...settings,
    playerPatternAssignments: assignments,
  };

  const activePreset = settings.difficultyPresetId
    ? adminDataService.getPresetById(settings.difficultyPresetId)
    : null;

  const playerPatternStepIndex: Record<string, number> = {};
  Object.entries(assignments).forEach(([playerId, patternId]) => {
    if (patternId) {
      playerPatternStepIndex[playerId] = 0;
    }
  });

  // Initialize scores equal to number of rounds
  const initializedPlayers = settings.players.map(p => ({
    ...p,
    score: settings.numberOfRounds
  }));

  return {
    players: initializedPlayers,
    settings: normalizedSettings,
    currentRound: 1,
    currentPlayerIndex: 0,
    currentCard: null,
    currentPhase: GamePhase.SETUP,
    currentScriptedDareId: null,
    currentScriptedDodgeId: null,
    activeDifficultyPreset: activePreset,
    playerPatternStepIndex,
  };
}

export function drawDareForCurrentPlayer(state: GameState): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  if (!currentPlayer) {
    return state;
  }

  let card: Card = getRandomCard(CardType.DARE, {
    difficultyFilter: state.settings.difficultyFilter,
    allowedDifficulties: getAllowedDifficulties(state),
  });
  let scriptedDareId: string | null = null;
  let scriptedDodgeId: string | null = null;
  let patternStepIndexMap = state.playerPatternStepIndex;

  const patternId = state.settings.playerPatternAssignments?.[currentPlayer.id] ?? null;
  if (patternId) {
    const pattern = adminDataService.getPatternById(patternId);
    if (pattern && pattern.steps.length > 0) {
      let stepIndex = patternStepIndexMap[currentPlayer.id];
      if (stepIndex === undefined) stepIndex = 0;

      const cloneMapIfNeeded = () => {
        if (patternStepIndexMap === state.playerPatternStepIndex) {
          patternStepIndexMap = { ...state.playerPatternStepIndex };
        }
      };

      if (stepIndex === -1) {
        stepIndex = -1;
      } else if (stepIndex >= pattern.steps.length) {
        if (pattern.fallbackMode === 'loop') {
          cloneMapIfNeeded();
          stepIndex = 0;
          patternStepIndexMap[currentPlayer.id] = 0;
        } else {
          cloneMapIfNeeded();
          stepIndex = -1;
          patternStepIndexMap[currentPlayer.id] = -1;
        }
      }

      if (stepIndex >= 0 && stepIndex < pattern.steps.length) {
        const step = pattern.steps[stepIndex];
        const scriptedCard = getCardById(CardType.DARE, step.dareCardId);
        if (scriptedCard) {
          card = scriptedCard;
          scriptedDareId = step.dareCardId;
          scriptedDodgeId = step.dodgeCardId ?? null;
        }
      }
    }
  }

  return {
    ...state,
    playerPatternStepIndex: patternStepIndexMap,
    currentCard: card,
    currentPhase: GamePhase.TURN_DARE_SHOWN,
    currentScriptedDareId: scriptedDareId,
    currentScriptedDodgeId: scriptedDodgeId,
  };
}

export function drawDodgeForCurrentPlayer(state: GameState, scriptedCardId?: string | null): GameState {
  const scriptedCard = getCardById(CardType.DODGE, scriptedCardId);
  const card = scriptedCard || getRandomCard(CardType.DODGE);
  return {
    ...state,
    currentCard: card,
    currentPhase: GamePhase.TURN_DODGE_SHOWN,
    currentScriptedDodgeId: scriptedCardId ?? null,
  };
}

export function startFirstTurn(state: GameState): GameState {
  // Start turn by drawing a Dare
  return drawDareForCurrentPlayer(state);
}

export function playerChoosesDoDare(state: GameState): GameState {
  return {
    ...state,
    currentPhase: GamePhase.TURN_DARE_RESOLUTION,
  };
}

export function playerChoosesDodge(state: GameState): GameState {
  // 1. Deduct 1 point (Immutable update)
  const players = state.players.map((p, i) => 
    i === state.currentPlayerIndex 
      ? { ...p, score: p.score - 1 } 
      : p
  );

  // 2. Draw Dodge Card
  const stateWithScoreDrop = { ...state, players };
  return drawDodgeForCurrentPlayer(stateWithScoreDrop, state.currentScriptedDodgeId);
}

export function resolveDareResult(state: GameState, didComplete: boolean): GameState {
  if (didComplete) {
    // Success: Advance turn
    return advanceTurn(state);
  } else {
    // Failure: Forced Dodge
    // 1. Deduct 1 point (Immutable update)
    const players = state.players.map((p, i) => 
      i === state.currentPlayerIndex 
        ? { ...p, score: p.score - 1 } 
        : p
    );

    // 2. Draw Dodge Card
    const stateWithScoreDrop = { ...state, players };
    return drawDodgeForCurrentPlayer(stateWithScoreDrop, state.currentScriptedDodgeId);
  }
}

export function completeDodge(state: GameState): GameState {
  // Dodge is always completed successfully
  return advanceTurn(state);
}

export function advanceTurn(state: GameState): GameState {
  let patternStepIndexMap = state.playerPatternStepIndex;
  const currentPlayer = state.players[state.currentPlayerIndex];
  if (
    currentPlayer &&
    state.currentScriptedDareId &&
    state.settings.playerPatternAssignments?.[currentPlayer.id]
  ) {
    const currentValue = patternStepIndexMap[currentPlayer.id] ?? 0;
    if (currentValue >= 0) {
      patternStepIndexMap =
        patternStepIndexMap === state.playerPatternStepIndex
          ? { ...state.playerPatternStepIndex }
          : patternStepIndexMap;
      patternStepIndexMap[currentPlayer.id] = currentValue + 1;
    }
  }

  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  let nextRound = state.currentRound;
  
  // If we wrapped around to the first player, increment round
  if (nextPlayerIndex === 0) {
    nextRound += 1;
  }

  // Check Game Over
  if (nextRound > state.settings.numberOfRounds) {
    return {
      ...state,
      playerPatternStepIndex: patternStepIndexMap,
      currentPlayerIndex: -1, // No current player
      currentCard: null,
      currentPhase: GamePhase.GAME_OVER,
      currentScriptedDareId: null,
      currentScriptedDodgeId: null,
    };
  }

  // Prepare next turn state
  const nextTurnState: GameState = {
    ...state,
    currentPlayerIndex: nextPlayerIndex,
    currentRound: nextRound,
    currentCard: null,
    currentScriptedDareId: null,
    currentScriptedDodgeId: null,
    playerPatternStepIndex: patternStepIndexMap,
  };

  // Draw Dare for the next player
  return drawDareForCurrentPlayer(nextTurnState);
}