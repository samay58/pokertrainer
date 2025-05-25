import { GameState, PlayerState, ActionType, PlayerStatus } from '@poker-trainer/shared-types';

export interface LegalAction {
  type: ActionType;
  minAmount?: number;
  maxAmount?: number;
}

export function getLegalActions(
  gameState: GameState,
  player: PlayerState
): LegalAction[] {
  const actions: LegalAction[] = [];
  
  // Player must be active to take actions
  if (player.status !== PlayerStatus.ACTIVE) {
    return actions;
  }
  
  // Player must be the one to act
  if (gameState.players[gameState.toAct]?.id !== player.id) {
    return actions;
  }
  
  const amountToCall = gameState.highestBet - player.currentBet;
  const canAfford = player.stack;
  
  // FOLD is always available unless player has nothing to call
  if (amountToCall > 0) {
    actions.push({ type: ActionType.FOLD });
  }
  
  // CHECK is available when there's nothing to call
  if (amountToCall === 0) {
    actions.push({ type: ActionType.CHECK });
  }
  
  // CALL is available when there's an amount to call and player can afford it
  if (amountToCall > 0 && canAfford > 0) {
    if (canAfford <= amountToCall) {
      // Player would go all-in with a call
      actions.push({ type: ActionType.ALL_IN, minAmount: canAfford, maxAmount: canAfford });
    } else {
      actions.push({ type: ActionType.CALL });
    }
  }
  
  // BET is available when there's no current bet and player has chips
  if (gameState.highestBet === 0 && canAfford >= gameState.bb) {
    if (canAfford === gameState.bb) {
      actions.push({ type: ActionType.ALL_IN, minAmount: canAfford, maxAmount: canAfford });
    } else {
      actions.push({
        type: ActionType.BET,
        minAmount: gameState.bb,
        maxAmount: canAfford
      });
    }
  }
  
  // RAISE is available when there's a current bet and player can afford minimum raise
  if (gameState.highestBet > 0 && canAfford > amountToCall) {
    const minRaiseTotal = gameState.highestBet + gameState.minRaise;
    const minRaiseAmount = minRaiseTotal - player.currentBet;
    
    if (canAfford >= minRaiseAmount) {
      actions.push({
        type: ActionType.RAISE,
        minAmount: minRaiseTotal,
        maxAmount: player.currentBet + canAfford
      });
    } else if (canAfford > amountToCall) {
      // Player can only go all-in
      actions.push({ 
        type: ActionType.ALL_IN, 
        minAmount: player.currentBet + canAfford, 
        maxAmount: player.currentBet + canAfford 
      });
    }
  }
  
  return actions;
}