import { GameState, PlayerStatus, GameStage } from '@poker-trainer/shared-types';
import { structuredClone } from '../gameState';
import { evaluateHand7 } from '../../evaluate/rank';
import { createRng } from '../../rng';
import { createShuffledDeck } from '../../deck';
import { moveBetsToPots } from './sidePot';

export function performShowdown(gameState: GameState): GameState {
  let newState = structuredClone(gameState);
  newState.stage = GameStage.SHOWDOWN;
  
  // Move any remaining bets to pots
  if (newState.players.some(p => p.currentBet > 0)) {
    newState = moveBetsToPots(newState as GameState) as any;
  }
  
  // Check if only one player remains (others folded)
  const activePlayers = newState.players.filter(p => p.status !== PlayerStatus.FOLDED);
  
  // Award each pot to winner(s)
  for (const pot of newState.pots) {
    const winners: string[] = [];
    
    if (activePlayers.length === 1) {
      // Only one player left, they win
      winners.push(activePlayers[0]!.id);
    } else {
      // Find best hand among eligible players
      let bestHandValue = Infinity;
      
      for (const playerId of pot.eligible) {
        const player = newState.players.find(p => p.id === playerId);
        if (!player || player.hole.length !== 2) continue;
        
        const evaluation = evaluateHand7(player.hole, newState.community);
        
        if (evaluation.value < bestHandValue) {
          bestHandValue = evaluation.value;
          winners.length = 0;
          winners.push(playerId);
        } else if (evaluation.value === bestHandValue) {
          winners.push(playerId);
        }
      }
    }
    
    // Distribute pot to winners
    if (winners.length > 0) {
      const share = Math.floor(pot.amount / winners.length);
      const remainder = pot.amount % winners.length;
      
      for (const winnerId of winners) {
        const winner = newState.players.find(p => p.id === winnerId);
        if (winner) {
          winner.stack += share;
        }
      }
      
      // Award odd chip to player in earliest position
      if (remainder > 0) {
        const winnerPlayers = winners
          .map(id => newState.players.find(p => p.id === id)!)
          .filter(p => p != null)
          .sort((a, b) => a.seat - b.seat);
        
        if (winnerPlayers[0]) {
          winnerPlayers[0].stack += remainder;
        }
      }
    }
  }
  
  // Clear pots after distribution
  newState.pots = [];
  
  // Mark hand as complete
  newState.stage = GameStage.COMPLETE;
  
  return newState as GameState;
}

export function prepareNextHand(gameState: GameState): GameState {
  const newState = structuredClone(gameState);
  
  // Remove busted players
  newState.players = newState.players.filter(p => p.stack > 0);
  
  // Reset player states
  for (const player of newState.players) {
    player.status = PlayerStatus.ACTIVE;
    player.hole = [];
    player.currentBet = 0;
    player.invested = 0;
  }
  
  // Move dealer button
  let nextDealer = (newState.dealer + 1) % newState.players.length;
  while (newState.players[nextDealer]?.stack === 0) {
    nextDealer = (nextDealer + 1) % newState.players.length;
  }
  newState.dealer = nextDealer;
  
  // Reset game state
  newState.stage = GameStage.PRE_DEAL;
  newState.highestBet = 0;
  newState.minRaise = newState.bb;
  newState.community = [];
  newState.handHistory = [];
  newState.lastAggressor = -1;
  newState.numActionsThisRound = 0;
  
  // Generate new deck with same RNG seed for consistency
  const rng = createRng(newState.rngSeed);
  newState.deck = createShuffledDeck(rng);
  
  return newState as GameState;
}