export enum CardType {
  DARE = 'DARE',
  DODGE = 'DODGE',
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface Card {
  id: string;
  type: CardType;
  text: string;
  difficulty: Difficulty;
  active?: boolean; // Phase 2: Active flag for admin management
}

export interface Player {
  id: string;
  name: string;
  score: number;
  turnIndex: number;
}

export interface GameSettings {
  numberOfRounds: number;
  difficultyFilter: Difficulty | 'ANY';
  players: Player[];
  difficultyPresetId?: string | null;
  playerPatternAssignments?: Record<string, string | null>; // playerId -> patternId
}

export enum GamePhase {
  SETUP = 'SETUP',
  IN_PROGRESS = 'IN_PROGRESS', // Transient
  TURN_DARE_SHOWN = 'TURN_DARE_SHOWN',
  TURN_DARE_RESOLUTION = 'TURN_DARE_RESOLUTION',
  TURN_DODGE_SHOWN = 'TURN_DODGE_SHOWN',
  GAME_OVER = 'GAME_OVER',
}

export interface GameState {
  players: Player[];
  settings: GameSettings;
  currentRound: number;
  currentPlayerIndex: number;
  currentCard: Card | null;
  currentPhase: GamePhase;
  currentScriptedDareId: string | null;
  currentScriptedDodgeId: string | null;
  activeDifficultyPreset: DifficultyPreset | null;
  playerPatternStepIndex: Record<string, number>;
}

export enum ScreenName {
  HOME = 'HOME',
  SETUP = 'SETUP',
  GAME = 'GAME',
  GAME_OVER = 'GAME_OVER',
}

// Phase 2: Admin Types

export interface DifficultyPreset {
  id: string;
  name: string;
  allowedDifficulties: Difficulty[];
}

export interface PatternStep {
  id: string;
  dareCardId: string;
  dodgeCardId?: string;
}

export interface CardPattern {
  id: string;
  name: string;
  steps: PatternStep[];
  fallbackMode: 'random' | 'loop' | 'stop';
}