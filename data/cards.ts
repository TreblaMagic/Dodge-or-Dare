import { Card, CardType, Difficulty } from '../game/types';

export const DARE_CARDS: Card[] = [
  { id: 'd1', type: CardType.DARE, difficulty: Difficulty.EASY, text: 'Do your best impression of a chicken for 10 seconds.' },
  { id: 'd2', type: CardType.DARE, difficulty: Difficulty.EASY, text: 'Sing the chorus of a pop song loudly.' },
  { id: 'd3', type: CardType.DARE, difficulty: Difficulty.MEDIUM, text: 'Let the group look through your photo gallery for 1 minute.' },
  { id: 'd4', type: CardType.DARE, difficulty: Difficulty.MEDIUM, text: 'Speak in an accent chosen by the group for the next round.' },
  { id: 'd5', type: CardType.DARE, difficulty: Difficulty.HARD, text: 'Call a random contact and ask "Where did you hide the body?".' },
  { id: 'd6', type: CardType.DARE, difficulty: Difficulty.HARD, text: 'Lick the floor.' },
  { id: 'd7', type: CardType.DARE, difficulty: Difficulty.EASY, text: 'Hold your breath for 20 seconds.' },
  { id: 'd8', type: CardType.DARE, difficulty: Difficulty.MEDIUM, text: 'Do 10 pushups immediately.' },
  { id: 'd9', type: CardType.DARE, difficulty: Difficulty.HARD, text: 'Let another player draw on your face with a marker (washable!).' },
  { id: 'd10', type: CardType.DARE, difficulty: Difficulty.EASY, text: 'Tell a joke. If no one laughs, you fail.' },
];

export const DODGE_CARDS: Card[] = [
  { id: 'do1', type: CardType.DODGE, difficulty: Difficulty.EASY, text: 'Drink a glass of water without using your hands.' },
  { id: 'do2', type: CardType.DODGE, difficulty: Difficulty.EASY, text: 'Spin around 10 times and try to walk in a straight line.' },
  { id: 'do3', type: CardType.DODGE, difficulty: Difficulty.MEDIUM, text: 'Eat a spoonful of hot sauce or a lemon slice.' },
  { id: 'do4', type: CardType.DODGE, difficulty: Difficulty.MEDIUM, text: 'Plank for 45 seconds.' },
  { id: 'do5', type: CardType.DODGE, difficulty: Difficulty.HARD, text: 'Send a risky text to your crush (or ex).' },
  { id: 'do6', type: CardType.DODGE, difficulty: Difficulty.EASY, text: 'Balance a spoon on your nose for 10 seconds.' },
  { id: 'do7', type: CardType.DODGE, difficulty: Difficulty.MEDIUM, text: 'Let the person to your right tickle you for 10 seconds.' },
  { id: 'do8', type: CardType.DODGE, difficulty: Difficulty.HARD, text: 'Post an embarrassing photo on your social media story.' },
  { id: 'do9', type: CardType.DODGE, difficulty: Difficulty.EASY, text: 'Do 20 jumping jacks.' },
  { id: 'do10', type: CardType.DODGE, difficulty: Difficulty.MEDIUM, text: 'Sit on an imaginary chair (wall sit) for 1 minute.' },
];