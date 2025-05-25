import { GameState, Pot, PlayerStatus } from '@poker-trainer/shared-types';
import { structuredClone } from '../gameState';

export function moveBetsToPots(gameState: GameState): GameState {
  const newState = structuredClone(gameState);
  
  // Get all players with bets
  const playersWithBets = newState.players
    .filter(p => p.currentBet > 0)
    .sort((a, b) => a.currentBet - b.currentBet);
  
  if (playersWithBets.length === 0) {
    return newState;
  }
  
  // Clear existing pots to rebuild them
  const pots: Pot[] = [...newState.pots];
  
  while (playersWithBets.length > 0) {
    const lowestBet = playersWithBets[0]!.currentBet;
    
    // Find all players eligible for this pot (not folded)
    const eligiblePlayers = playersWithBets
      .filter(p => p.status !== PlayerStatus.FOLDED)
      .map(p => p.id);
    
    // Calculate pot amount
    let potAmount = 0;
    for (const player of newState.players) {
      const contribution = Math.min(player.currentBet, lowestBet);
      potAmount += contribution;
      player.currentBet -= contribution;
    }
    
    // Create pot if amount > 0
    if (potAmount > 0) {
      pots.push({
        amount: potAmount,
        eligible: new Set(eligiblePlayers)
      });
    }
    
    // Remove players with no more bets
    while (playersWithBets.length > 0 && playersWithBets[0]!.currentBet === 0) {
      playersWithBets.shift();
    }
  }
  
  // Reset all current bets to 0
  for (const player of newState.players) {
    player.currentBet = 0;
  }
  
  newState.pots = pots;
  return newState as GameState;
}
