import { Card } from './card';
import { PlayerStatus } from './enums';

export interface PlayerState {
  readonly id: string;
  readonly seat: number;
  stack: number;
  status: PlayerStatus;
  hole: readonly [Card, Card] | readonly [];
  currentBet: number;
  invested: number;
}

export interface PlayerAction {
  readonly playerId: string;
  readonly type: ActionType;
  readonly amount?: number;
}

import { ActionType } from './enums';