import { Card } from './card';
import { PlayerState, PlayerAction } from './player';
import { Pot } from './pot';
import { GameStage } from './enums';

export interface GameState {
  readonly stage: GameStage;
  readonly dealer: number;
  readonly sb: number;
  readonly bb: number;
  toAct: number;
  highestBet: number;
  minRaise: number;
  readonly deck: readonly Card[];
  readonly community: readonly Card[];
  readonly players: readonly PlayerState[];
  readonly pots: readonly Pot[];
  readonly rngSeed: bigint;
  readonly handHistory: readonly PlayerAction[];
  lastAggressor: number; // Seat of last player to bet/raise, -1 if none
  numActionsThisRound: number; // Track actions in current betting round
}

export interface GameConfig {
  readonly smallBlind: number;
  readonly bigBlind: number;
  readonly initialStack: number;
  readonly playerCount: number;
  readonly rngSeed?: bigint;
}