import { 
  GameState, 
  PlayerAction, 
  ActionType,
  PlayerStatus
} from '@poker-trainer/shared-types';
import { structuredClone } from '../state/gameState';
import { updateToAct } from '../state/reducers/bettingRound';
import { getLegalActions } from './legalActions';

export function applyAction(
  gameState: GameState,
  action: PlayerAction
): GameState {
  const newState = structuredClone(gameState);
  const player = newState.players.find(p => p.id === action.playerId);
  
  if (!player) {
    throw new Error(`Player ${action.playerId} not found`);
  }
  
  // Validate action is legal
  const legalActions = getLegalActions(gameState, player);
  const isLegal = legalActions.some(la => {
    if (la.type !== action.type) return false;
    if (action.type === ActionType.BET || action.type === ActionType.RAISE) {
      if (!action.amount) return false;
      if (la.minAmount && action.amount < la.minAmount) return false;
      if (la.maxAmount && action.amount > la.maxAmount) return false;
    }
    return true;
  });
  
  if (!isLegal) {
    throw new Error(`Illegal action: ${action.type}`);
  }
  
  // Apply the action
  switch (action.type) {
    case ActionType.FOLD:
      player.status = PlayerStatus.FOLDED;
      break;
      
    case ActionType.CHECK:
      // No chip movement needed
      break;
      
    case ActionType.CALL: {
      const amountToCall = newState.highestBet - player.currentBet;
      const callAmount = Math.min(amountToCall, player.stack);
      player.stack -= callAmount;
      player.currentBet += callAmount;
      player.invested += callAmount;
      
      if (player.stack === 0) {
        player.status = PlayerStatus.ALL_IN;
      }
      break;
    }
      
    case ActionType.BET: {
      if (!action.amount) {
        throw new Error('Bet amount required');
      }
      const betAmount = action.amount;
      player.stack -= betAmount;
      player.currentBet = betAmount;
      player.invested += betAmount;
      newState.highestBet = betAmount;
      newState.minRaise = betAmount;
      
      if (player.stack === 0) {
        player.status = PlayerStatus.ALL_IN;
      }
      break;
    }
      
    case ActionType.RAISE: {
      if (!action.amount) {
        throw new Error('Raise amount required');
      }
      const raiseToAmount = action.amount;
      const raiseByAmount = raiseToAmount - player.currentBet;
      const raiseDiff = raiseToAmount - newState.highestBet;
      
      player.stack -= raiseByAmount;
      player.currentBet = raiseToAmount;
      player.invested += raiseByAmount;
      newState.highestBet = raiseToAmount;
      newState.minRaise = Math.max(newState.minRaise, raiseDiff);
      
      if (player.stack === 0) {
        player.status = PlayerStatus.ALL_IN;
      }
      break;
    }
      
    case ActionType.ALL_IN: {
      const allInAmount = player.stack;
      player.currentBet += allInAmount;
      player.invested += allInAmount;
      player.stack = 0;
      player.status = PlayerStatus.ALL_IN;
      
      if (player.currentBet > newState.highestBet) {
        const raiseDiff = player.currentBet - newState.highestBet;
        newState.highestBet = player.currentBet;
        newState.minRaise = Math.max(newState.minRaise, raiseDiff);
      }
      break;
    }
  }
  
  // Track aggressive actions
  if (action.type === ActionType.BET || action.type === ActionType.RAISE || action.type === ActionType.ALL_IN) {
    const playerSeat = newState.players.findIndex(p => p.id === action.playerId);
    if (playerSeat !== -1) {
      newState.lastAggressor = playerSeat;
    }
  }
  
  // Add action to history
  newState.handHistory = [...newState.handHistory, action];
  newState.numActionsThisRound++;
  
  // Move to next player
  return updateToAct(newState) as GameState;
}