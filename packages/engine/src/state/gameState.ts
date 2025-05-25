import { 
  GameState, 
  GameConfig, 
  PlayerState, 
  GameStage,
  PlayerStatus 
} from '@poker-trainer/shared-types';
import { createRng } from '../rng';
import { createShuffledDeck } from '../deck';

export function createInitialGameState(config: GameConfig): GameState {
  const rngSeed = config.rngSeed ?? BigInt(Date.now());
  const rng = createRng(rngSeed);
  
  const players: PlayerState[] = Array.from({ length: config.playerCount }, (_, i) => ({
    id: `player-${i}`,
    seat: i,
    stack: config.initialStack,
    status: PlayerStatus.ACTIVE,
    hole: [],
    currentBet: 0,
    invested: 0
  }));

  return {
    stage: GameStage.PRE_DEAL,
    dealer: 0,
    sb: config.smallBlind,
    bb: config.bigBlind,
    toAct: 0,
    highestBet: 0,
    minRaise: config.bigBlind,
    deck: createShuffledDeck(rng),
    community: [],
    players,
    pots: [],
    rngSeed,
    handHistory: [],
    lastAggressor: -1,
    numActionsThisRound: 0
  };
}

export function getNextActiveSeat(
  currentSeat: number, 
  gameState: GameState
): number {
  const playerCount = gameState.players.length;
  let nextSeat = (currentSeat + 1) % playerCount;
  
  while (nextSeat !== currentSeat) {
    const player = gameState.players[nextSeat];
    if (player && (player.status === PlayerStatus.ACTIVE || player.status === PlayerStatus.ALL_IN)) {
      return nextSeat;
    }
    nextSeat = (nextSeat + 1) % playerCount;
  }
  
  return currentSeat;
}

export function getActivePlayers(gameState: GameState): PlayerState[] {
  return gameState.players.filter(
    p => p.status === PlayerStatus.ACTIVE || p.status === PlayerStatus.ALL_IN
  );
}

export function getActionablePlayers(gameState: GameState): PlayerState[] {
  return gameState.players.filter(p => p.status === PlayerStatus.ACTIVE);
}

// Type to recursively remove readonly modifiers
type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends readonly (infer U)[] ? U[] :
                            T[P] extends ReadonlyArray<infer U> ? U[] :
                            T[P] extends object ? Mutable<T[P]> :
                            T[P]
};

export function structuredClone<T>(obj: T): Mutable<T> {
  return JSON.parse(JSON.stringify(obj, (_key, value) => {
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    if (value instanceof Set) {
      return { __type: 'Set', values: Array.from(value) };
    }
    return value;
  }), (_key, value) => {
    if (typeof value === 'string' && value.endsWith('n')) {
      const numStr = value.slice(0, -1);
      // Only convert valid numeric strings
      if (/^-?\d+$/.test(numStr)) {
        return BigInt(numStr);
      }
    }
    if (value && typeof value === 'object' && value.__type === 'Set') {
      return new Set(value.values);
    }
    return value;
  });
}