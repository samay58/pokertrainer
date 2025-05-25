import { GameState, GameConfig } from '@poker-trainer/shared-types';
import { createInitialGameState } from '../state/gameState';
import { postBlinds } from '../state/reducers/blinds';
import { dealHoleCards } from '../state/reducers/deal';

export function newHand(config: GameConfig): GameState {
  let state = createInitialGameState(config);
  state = postBlinds(state);
  state = dealHoleCards(state);
  return state;
}