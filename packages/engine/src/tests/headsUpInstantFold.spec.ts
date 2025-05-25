import { describe, it, expect } from 'vitest';
import { 
  createInitialGameState,
  postBlinds,
  dealHoleCards,
  applyAction,
  performShowdown,
  GameConfig,
  ActionType,
  GameStage
} from '../api';

describe('Heads Up - Instant Fold', () => {
  it('should award pot to big blind when small blind folds pre-flop', () => {
    const config: GameConfig = {
      smallBlind: 50,
      bigBlind: 100,
      initialStack: 1000,
      playerCount: 2,
      rngSeed: 42n
    };

    // Create new game
    let state = createInitialGameState(config);
    expect(state.players).toHaveLength(2);
    expect(state.players[0]!.stack).toBe(1000);
    expect(state.players[1]!.stack).toBe(1000);

    // Post blinds
    state = postBlinds(state);
    expect(state.players[0]!.stack).toBe(950); // SB posted 50
    expect(state.players[0]!.currentBet).toBe(50);
    expect(state.players[1]!.stack).toBe(900); // BB posted 100
    expect(state.players[1]!.currentBet).toBe(100);
    expect(state.highestBet).toBe(100);
    expect(state.toAct).toBe(0); // SB to act

    // Deal hole cards
    state = dealHoleCards(state);
    expect(state.players[0]!.hole).toHaveLength(2);
    expect(state.players[1]!.hole).toHaveLength(2);

    // Small blind folds
    state = applyAction(state, {
      playerId: 'player-0',
      type: ActionType.FOLD
    });
    
    expect(state.players[0]!.status).toBe('folded');
    
    // Move bets to pot and perform showdown
    state = performShowdown(state);
    
    // Big blind should win the pot (50 + 100 = 150)
    expect(state.players[1]!.stack).toBe(1050);
    expect(state.stage).toBe(GameStage.COMPLETE);
  });

  it('should handle all-in scenarios correctly', () => {
    const config: GameConfig = {
      smallBlind: 50,
      bigBlind: 100,
      initialStack: 150, // Small stack for all-in scenario
      playerCount: 2,
      rngSeed: 123n
    };

    let state = createInitialGameState(config);
    state = postBlinds(state);
    state = dealHoleCards(state);

    // SB should go all-in with remaining 100 chips
    const legalActions = getLegalActions(state, state.players[0]!);
    const allInAction = legalActions.find(a => a.type === ActionType.ALL_IN);
    
    expect(allInAction).toBeDefined();
    expect(allInAction!.minAmount).toBe(150); // 50 current + 100 remaining
    expect(allInAction!.maxAmount).toBe(150);

    // Apply all-in
    state = applyAction(state, {
      playerId: 'player-0',
      type: ActionType.ALL_IN,
      amount: 150
    });

    expect(state.players[0]!.stack).toBe(0);
    expect(state.players[0]!.status).toBe('all-in');
    expect(state.players[0]!.currentBet).toBe(150);
  });
});

// Import at top of file
import { getLegalActions } from '../api/legalActions';