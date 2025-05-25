import { GameState, GameStage, PlayerStatus } from '@poker-trainer/shared-types';
import { getNextActiveSeat, structuredClone } from '../gameState';

export function postBlinds(gameState: GameState): GameState {
  const newState = structuredClone(gameState);
  
  // Determine small blind and big blind positions
  // In heads-up, dealer is small blind
  let sbSeat: number;
  let bbSeat: number;
  
  if (newState.players.length === 2) {
    sbSeat = newState.dealer;
    bbSeat = getNextActiveSeat(sbSeat, newState);
  } else {
    sbSeat = getNextActiveSeat(newState.dealer, newState);
    bbSeat = getNextActiveSeat(sbSeat, newState);
  }
  
  const sbPlayer = newState.players[sbSeat]!;
  const bbPlayer = newState.players[bbSeat]!;
  
  // Post small blind
  const sbAmount = Math.min(sbPlayer.stack, newState.sb);
  sbPlayer.currentBet = sbAmount;
  sbPlayer.stack -= sbAmount;
  sbPlayer.invested += sbAmount;
  
  if (sbPlayer.stack === 0) {
    sbPlayer.status = PlayerStatus.ALL_IN;
  }
  
  // Post big blind
  const bbAmount = Math.min(bbPlayer.stack, newState.bb);
  bbPlayer.currentBet = bbAmount;
  bbPlayer.stack -= bbAmount;
  bbPlayer.invested += bbAmount;
  
  if (bbPlayer.stack === 0) {
    bbPlayer.status = PlayerStatus.ALL_IN;
  }
  
  // Update game state
  newState.highestBet = Math.max(sbAmount, bbAmount);
  newState.minRaise = newState.bb;
  newState.toAct = getNextActiveSeat(bbSeat, newState);
  newState.stage = GameStage.PRE_FLOP;
  newState.lastAggressor = bbSeat; // BB is the last "aggressor" pre-flop
  newState.numActionsThisRound = 0; // Reset action counter
  
  return newState as GameState;
}