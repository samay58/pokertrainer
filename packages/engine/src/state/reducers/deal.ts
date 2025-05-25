import { GameState, PlayerStatus, GameStage } from '@poker-trainer/shared-types';
import { getNextActiveSeat, structuredClone } from '../gameState';
import { moveBetsToPots } from './sidePot';

export function dealHoleCards(gameState: GameState): GameState {
  const newState = structuredClone(gameState);
  const deck = [...newState.deck];
  
  // First, collect hole cards for each player
  const playerHoles: Map<number, any[]> = new Map();
  
  // Initialize empty arrays for active players
  for (let i = 0; i < newState.players.length; i++) {
    const player = newState.players[i]!;
    if (player.status === PlayerStatus.ACTIVE || player.status === PlayerStatus.ALL_IN) {
      playerHoles.set(i, []);
    }
  }
  
  // Start dealing from player after dealer
  let dealPosition = getNextActiveSeat(newState.dealer, newState);
  
  // Deal 2 cards to each player
  for (let round = 0; round < 2; round++) {
    let currentPosition = dealPosition;
    const startPosition = currentPosition;
    
    do {
      const player = newState.players[currentPosition]!;
      if (player.status === PlayerStatus.ACTIVE || player.status === PlayerStatus.ALL_IN) {
        const card = deck.pop();
        if (!card) {
          throw new Error('Not enough cards in deck');
        }
        
        playerHoles.get(currentPosition)!.push(card);
      }
      
      currentPosition = getNextActiveSeat(currentPosition, newState);
    } while (currentPosition !== startPosition);
  }
  
  // Assign hole cards to players
  for (const [position, cards] of playerHoles.entries()) {
    if (cards.length === 2) {
      newState.players[position]!.hole = [cards[0], cards[1]] as [any, any];
    }
  }
  
  newState.deck = deck;
  return newState as GameState;
}

export function dealCommunityCards(gameState: GameState, count: number): GameState {
  let newState = structuredClone(gameState);
  
  // First, move any existing bets to pots
  newState = moveBetsToPots(newState as GameState) as any;
  
  const deck = [...newState.deck];
  const community = [...newState.community];
  
  // Burn one card (discard without revealing)
  deck.pop();
  
  // Deal community cards
  for (let i = 0; i < count; i++) {
    const card = deck.pop();
    if (!card) {
      throw new Error('Not enough cards in deck');
    }
    community.push(card);
  }
  
  newState.deck = deck;
  newState.community = community;
  
  // Update stage based on community cards count
  const totalCommunityCards = community.length;
  if (totalCommunityCards === 3) {
    newState.stage = GameStage.FLOP;
  } else if (totalCommunityCards === 4) {
    newState.stage = GameStage.TURN;
  } else if (totalCommunityCards === 5) {
    newState.stage = GameStage.RIVER;
  }
  
  // Reset betting for new round
  newState.highestBet = 0;
  newState.minRaise = newState.bb;
  newState.lastAggressor = -1; // No aggressor yet this round
  newState.numActionsThisRound = 0; // Reset action counter
  
  // Set first active player to act
  // In heads-up, dealer acts last post-flop (opposite of pre-flop)
  if (newState.players.length === 2) {
    // In heads-up, non-dealer acts first post-flop
    newState.toAct = newState.dealer === 0 ? 1 : 0;
  } else {
    // In multi-way, player left of dealer acts first
    newState.toAct = getNextActiveSeat(newState.dealer, newState);
  }
  
  return newState as GameState;
}