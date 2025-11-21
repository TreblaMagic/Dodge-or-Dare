import { Card, CardType, Difficulty, CardPattern, DifficultyPreset, PatternStep } from '../game/types';
import { DARE_CARDS as SEED_DARES, DODGE_CARDS as SEED_DODGES } from '../data/cards';

const KEYS = {
  DARES: 'dod_dares',
  DODGES: 'dod_dodges',
  PRESETS: 'dod_presets',
  PATTERNS: 'dod_patterns',
};

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

class AdminDataService {
  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.DARES)) {
      // Seed with default active cards
      const seededDares = SEED_DARES.map(c => ({ ...c, active: true }));
      localStorage.setItem(KEYS.DARES, JSON.stringify(seededDares));
    }

    if (!localStorage.getItem(KEYS.DODGES)) {
      const seededDodges = SEED_DODGES.map(c => ({ ...c, active: true }));
      localStorage.setItem(KEYS.DODGES, JSON.stringify(seededDodges));
    }

    if (!localStorage.getItem(KEYS.PRESETS)) {
      // Default Presets
      const defaults: DifficultyPreset[] = [
        { id: 'p1', name: 'Standard', allowedDifficulties: [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD] },
        { id: 'p2', name: 'Family Friendly', allowedDifficulties: [Difficulty.EASY] },
        { id: 'p3', name: 'Spicy', allowedDifficulties: [Difficulty.MEDIUM, Difficulty.HARD] },
      ];
      localStorage.setItem(KEYS.PRESETS, JSON.stringify(defaults));
    }

    if (!localStorage.getItem(KEYS.PATTERNS)) {
      localStorage.setItem(KEYS.PATTERNS, JSON.stringify([]));
    }
  }

  private normalizePatternStep(step: PatternStep | string, fallbackIndex: number): PatternStep {
    if (typeof step === 'string') {
      return {
        id: `legacy-step-${fallbackIndex}-${step}`,
        dareCardId: step,
      };
    }

    return {
      id: step.id || generateId(),
      dareCardId: step.dareCardId,
      dodgeCardId: step.dodgeCardId,
    };
  }

  private normalizePattern(data: any): CardPattern {
    if (!data) {
      return {
        id: generateId(),
        name: 'Untitled Pattern',
        steps: [],
        fallbackMode: 'random',
      };
    }

    const rawFallback = data.fallbackMode ?? data.fallback ?? data.mode;
    const fallback: 'random' | 'loop' | 'stop' =
      rawFallback === 'loop' || rawFallback === 'stop' ? rawFallback : 'random';

    if (Array.isArray(data.steps)) {
      return {
        id: data.id || generateId(),
        name: data.name || 'Pattern',
        steps: data.steps.map((step: PatternStep, index: number) =>
          this.normalizePatternStep(step, index)
        ),
        fallbackMode: fallback,
      };
    }

    if (data.playerSequences) {
      const collected: PatternStep[] = [];
      Object.values(data.playerSequences).forEach((value: unknown) => {
        if (Array.isArray(value)) {
          value.forEach((step: any, idx: number) => {
            collected.push(this.normalizePatternStep(step, collected.length + idx));
          });
        }
      });

      return {
        id: data.id || generateId(),
        name: data.name || 'Pattern',
        steps: collected,
        fallbackMode: fallback,
      };
    }

    return {
      id: data.id || generateId(),
      name: data.name || 'Pattern',
      steps: [],
      fallbackMode: fallback,
    };
  }

  // --- Dares ---
  getDares(): Card[] {
    const data = localStorage.getItem(KEYS.DARES);
    return data ? JSON.parse(data) : [];
  }

  getActiveDares(): Card[] {
    return this.getDares().filter(c => c.active !== false);
  }

  saveDares(cards: Card[]) {
    localStorage.setItem(KEYS.DARES, JSON.stringify(cards));
  }

  // --- Dodges ---
  getDodges(): Card[] {
    const data = localStorage.getItem(KEYS.DODGES);
    return data ? JSON.parse(data) : [];
  }

  getActiveDodges(): Card[] {
    return this.getDodges().filter(c => c.active !== false);
  }

  saveDodges(cards: Card[]) {
    localStorage.setItem(KEYS.DODGES, JSON.stringify(cards));
  }

  getCardById(type: CardType, id: string): Card | undefined {
    const source = type === CardType.DARE ? this.getDares() : this.getDodges();
    return source.find(c => c.id === id);
  }

  // --- Presets ---
  getPresets(): DifficultyPreset[] {
    const data = localStorage.getItem(KEYS.PRESETS);
    return data ? JSON.parse(data) : [];
  }

  savePresets(presets: DifficultyPreset[]) {
    localStorage.setItem(KEYS.PRESETS, JSON.stringify(presets));
  }

  getPresetById(id: string | null | undefined): DifficultyPreset | null {
    if (!id) return null;
    return this.getPresets().find(p => p.id === id) || null;
  }

  // --- Patterns ---
  getPatterns(): CardPattern[] {
    const data = localStorage.getItem(KEYS.PATTERNS);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed)
      ? parsed.map(pattern => this.normalizePattern(pattern))
      : [];
  }

  savePatterns(patterns: CardPattern[]) {
    localStorage.setItem(KEYS.PATTERNS, JSON.stringify(patterns));
  }

  getPatternById(id: string | null | undefined): CardPattern | null {
    if (!id) return null;
    const pattern = this.getPatterns().find(p => p.id === id);
    return pattern || null;
  }
}

export const adminDataService = new AdminDataService();