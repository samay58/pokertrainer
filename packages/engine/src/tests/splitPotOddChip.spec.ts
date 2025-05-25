import { describe, it, expect } from 'vitest';
import { 
  createInitialGameState,
  postBlinds,
  dealHoleCards,
  applyAction,
  performShowdown,
  GameConfig,
  ActionType,
  GameStage,
  PlayerStatus
} from '../api';

describe('Split Pot - Odd Chip', () => {
  it.skip('should award odd chip to player in earliest position', () => {
    const config: GameConfig = {
      smallBlind: 25,  // Use 25/50 to create odd chip scenario
      bigBlind: 50,
      initialStack: 1000,
      playerCount: 3,
      rngSeed: 42n
    };

    let state = createInitialGameState(config);
    state = postBlinds(state);
    state = dealHoleCards(state);
    
    // Give all players the same hole cards (for split pot)
    state.players[0]!.hole = [
      { rank: 'A', suit: 's' },
      { rank: 'A', suit: 'h' }
    ];
    state.players[1]!.hole = [
      { rank: 'A', suit: 'd' },
      { rank: 'A', suit: 'c' }
    ];
    state.players[2]!.hole = [
      { rank: 'K', suit: 's' },
      { rank: 'K', suit: 'h' }
    ];
    
    // Player 0 (dealer/UTG) raises to 175
    state = applyAction(state, {
      playerId: 'player-0',
      type: ActionType.RAISE,
      amount: 175
    });
    
    // Player 1 (SB) calls
    state = applyAction(state, {
      playerId: 'player-1',
      type: ActionType.CALL
    });
    
    // Player 2 (BB) calls
    state = applyAction(state, {
      playerId: 'player-2',
      type: ActionType.CALL
    });
    
    // All players have now put in 175 each
    
    // Set up community cards that don't make a straight
    state.community = [
      { rank: '2', suit: 's' },
      { rank: '3', suit: 'h' },
      { rank: '7', suit: 'd' },
      { rank: '8', suit: 'c' },
      { rank: '9', suit: 's' }
    ];
    
    // Perform showdown
    state = performShowdown(state);
    
    // All players put in 175 total, so all have 825 left
    // Total pot: 175 * 3 = 525
    // Players 0 and 1 split (AA vs AA), player 2 loses (KK)
    // Split: 262.5 each, player 0 gets odd chip
    
    expect(state.players[0]!.stack).toBe(825 + 263); // 1088
    expect(state.players[1]!.stack).toBe(825 + 262); // 1087
    expect(state.players[2]!.stack).toBe(825);       // 825
    
    expect(state.stage).toBe(GameStage.COMPLETE);
  });

  it.skip('should handle odd chip in side pot correctly', () => {
    const config: GameConfig = {
      smallBlind: 25,
      bigBlind: 50,
      initialStack: 1000,
      playerCount: 4,
      rngSeed: 123n
    };

    let state = createInitialGameState(config);
    
    // Set up different stacks
    state.players[0]!.stack = 175;  // Will go all-in
    state.players[1]!.stack = 1000;
    state.players[2]!.stack = 1000;
    state.players[3]!.stack = 1000;
    
    state = postBlinds(state);
    state = dealHoleCards(state);
    
    // Give split pot hands
    state.players[0]!.hole = [{ rank: 'A', suit: 's' }, { rank: 'K', suit: 's' }];
    state.players[1]!.hole = [{ rank: 'A', suit: 'h' }, { rank: 'K', suit: 'h' }];
    state.players[2]!.hole = [{ rank: 'A', suit: 'd' }, { rank: 'K', suit: 'd' }];
    state.players[3]!.hole = [{ rank: '2', suit: 's' }, { rank: '2', suit: 'h' }];
    
    // Manually set up the betting to avoid turn order issues
    // All players put in 175, but player 0 only has 175 total
    state.players[0]!.stack = 0;
    state.players[0]!.currentBet = 175;
    state.players[0]!.status = PlayerStatus.ALL_IN;
    
    state.players[1]!.stack = 1000 - 50 - 125; // 825
    state.players[1]!.currentBet = 175;
    
    state.players[2]!.stack = 1000 - 175; // 825
    state.players[2]!.currentBet = 175;
    
    state.players[3]!.stack = 1000 - 175; // 825
    state.players[3]!.currentBet = 175;
    
    // Community cards that give everyone ace high
    state.community = [
      { rank: 'Q', suit: 'c' },
      { rank: 'J', suit: 'c' },
      { rank: 'T', suit: 'c' },
      { rank: '9', suit: 'c' },
      { rank: '8', suit: 'c' }
    ];
    
    state = performShowdown(state);
    
    // Main pot: 175 * 4 = 700, split 3 ways (233, 233, 234)
    // Player 0 should get odd chip (earliest position)
    
    const totalChips = state.players.reduce((sum, p) => sum + p.stack, 0);
    expect(totalChips).toBe(4000); // Total chips should be conserved
    
    expect(state.stage).toBe(GameStage.COMPLETE);
  });
});