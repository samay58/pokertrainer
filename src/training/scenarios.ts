import { Card, Player, GameState, GamePhase } from '../core/types';

export interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  gameState: GameState;
  correctAction: PlayerAction;
  explanation: string;
}

export interface PlayerAction {
  type: 'fold' | 'check' | 'call' | 'raise' | 'all-in';
  amount?: number;
}

export class ScenarioGenerator {
  generatePreflopScenario(): TrainingScenario {
    const scenarios = [
      this.createPocketAcesScenario(),
      this.createSmallPocketPairScenario(),
      this.createSuitedConnectorsScenario(),
      this.createTrashHandScenario()
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  private createPocketAcesScenario(): TrainingScenario {
    const gameState: GameState = {
      players: [
        {
          id: 'hero',
          name: 'Hero',
          chips: 1000,
          cards: [
            { suit: 'spades', rank: 'A', value: 14 },
            { suit: 'hearts', rank: 'A', value: 14 }
          ],
          folded: false,
          currentBet: 0,
          position: 2
        },
        {
          id: 'villain1',
          name: 'Villain 1',
          chips: 1200,
          cards: [],
          folded: false,
          currentBet: 50,
          position: 0
        },
        {
          id: 'villain2',
          name: 'Villain 2',
          chips: 800,
          cards: [],
          folded: false,
          currentBet: 50,
          position: 1
        }
      ],
      communityCards: [],
      pot: 115,
      currentBet: 50,
      dealerPosition: 0,
      activePlayerIndex: 0,
      phase: 'preflop',
      deck: []
    };

    return {
      id: 'pocket-aces-preflop',
      name: 'Pocket Aces Preflop',
      description: 'You have pocket aces in middle position. There has been a raise to 50.',
      difficulty: 'beginner',
      gameState,
      correctAction: { type: 'raise', amount: 150 },
      explanation: 'With pocket aces, you should always raise or re-raise. A 3x raise is standard here.'
    };
  }

  private createSmallPocketPairScenario(): TrainingScenario {
    const gameState: GameState = {
      players: [
        {
          id: 'hero',
          name: 'Hero',
          chips: 1000,
          cards: [
            { suit: 'hearts', rank: '4', value: 4 },
            { suit: 'diamonds', rank: '4', value: 4 }
          ],
          folded: false,
          currentBet: 0,
          position: 3
        },
        {
          id: 'villain1',
          name: 'Villain 1',
          chips: 1500,
          cards: [],
          folded: false,
          currentBet: 200,
          position: 1
        }
      ],
      communityCards: [],
      pot: 230,
      currentBet: 200,
      dealerPosition: 0,
      activePlayerIndex: 0,
      phase: 'preflop',
      deck: []
    };

    return {
      id: 'small-pocket-pair',
      name: 'Small Pocket Pair vs Large Raise',
      description: 'You have pocket 4s and face a large raise.',
      difficulty: 'intermediate',
      gameState,
      correctAction: { type: 'fold' },
      explanation: 'Small pocket pairs play poorly against large raises. The pot odds are not favorable for set mining.'
    };
  }

  private createSuitedConnectorsScenario(): TrainingScenario {
    const gameState: GameState = {
      players: [
        {
          id: 'hero',
          name: 'Hero',
          chips: 1000,
          cards: [
            { suit: 'hearts', rank: '8', value: 8 },
            { suit: 'hearts', rank: '9', value: 9 }
          ],
          folded: false,
          currentBet: 0,
          position: 5
        },
        {
          id: 'villain1',
          name: 'Villain 1',
          chips: 900,
          cards: [],
          folded: false,
          currentBet: 30,
          position: 2
        },
        {
          id: 'villain2',
          name: 'Villain 2',
          chips: 1100,
          cards: [],
          folded: false,
          currentBet: 30,
          position: 3
        }
      ],
      communityCards: [],
      pot: 75,
      currentBet: 30,
      dealerPosition: 1,
      activePlayerIndex: 0,
      phase: 'preflop',
      deck: []
    };

    return {
      id: 'suited-connectors',
      name: 'Suited Connectors in Late Position',
      description: 'You have 8-9 suited on the button with multiple limpers.',
      difficulty: 'intermediate',
      gameState,
      correctAction: { type: 'call' },
      explanation: 'Suited connectors play well in position with multiple players. Good implied odds.'
    };
  }

  private createTrashHandScenario(): TrainingScenario {
    const gameState: GameState = {
      players: [
        {
          id: 'hero',
          name: 'Hero',
          chips: 1000,
          cards: [
            { suit: 'clubs', rank: '7', value: 7 },
            { suit: 'diamonds', rank: '2', value: 2 }
          ],
          folded: false,
          currentBet: 0,
          position: 1
        }
      ],
      communityCards: [],
      pot: 15,
      currentBet: 10,
      dealerPosition: 0,
      activePlayerIndex: 0,
      phase: 'preflop',
      deck: []
    };

    return {
      id: 'trash-hand',
      name: 'Weak Hand Early Position',
      description: 'You have 7-2 offsuit in early position.',
      difficulty: 'beginner',
      gameState,
      correctAction: { type: 'fold' },
      explanation: '7-2 offsuit is the worst starting hand in poker. Always fold, especially in early position.'
    };
  }

  generatePostflopScenario(): TrainingScenario {
    const scenarios = [
      this.createTopPairScenario(),
      this.createDrawingHandScenario(),
      this.createBluffScenario()
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  private createTopPairScenario(): TrainingScenario {
    const gameState: GameState = {
      players: [
        {
          id: 'hero',
          name: 'Hero',
          chips: 950,
          cards: [
            { suit: 'hearts', rank: 'A', value: 14 },
            { suit: 'clubs', rank: 'K', value: 13 }
          ],
          folded: false,
          currentBet: 0,
          position: 2
        },
        {
          id: 'villain',
          name: 'Villain',
          chips: 920,
          cards: [],
          folded: false,
          currentBet: 80,
          position: 0
        }
      ],
      communityCards: [
        { suit: 'diamonds', rank: 'A', value: 14 },
        { suit: 'hearts', rank: '7', value: 7 },
        { suit: 'clubs', rank: '3', value: 3 }
      ],
      pot: 180,
      currentBet: 80,
      dealerPosition: 1,
      activePlayerIndex: 0,
      phase: 'flop',
      deck: []
    };

    return {
      id: 'top-pair-top-kicker',
      name: 'Top Pair Top Kicker on Dry Board',
      description: 'You have top pair with best kicker on a dry flop.',
      difficulty: 'beginner',
      gameState,
      correctAction: { type: 'raise', amount: 200 },
      explanation: 'With top pair top kicker on a dry board, you should raise for value and protection.'
    };
  }

  private createDrawingHandScenario(): TrainingScenario {
    const gameState: GameState = {
      players: [
        {
          id: 'hero',
          name: 'Hero',
          chips: 1000,
          cards: [
            { suit: 'hearts', rank: 'K', value: 13 },
            { suit: 'hearts', rank: 'Q', value: 12 }
          ],
          folded: false,
          currentBet: 0,
          position: 3
        },
        {
          id: 'villain',
          name: 'Villain',
          chips: 850,
          cards: [],
          folded: false,
          currentBet: 120,
          position: 1
        }
      ],
      communityCards: [
        { suit: 'hearts', rank: '10', value: 10 },
        { suit: 'hearts', rank: '9', value: 9 },
        { suit: 'clubs', rank: '4', value: 4 }
      ],
      pot: 280,
      currentBet: 120,
      dealerPosition: 0,
      activePlayerIndex: 0,
      phase: 'flop',
      deck: []
    };

    return {
      id: 'flush-draw',
      name: 'Strong Flush Draw',
      description: 'You have a flush draw with overcards facing a bet.',
      difficulty: 'intermediate',
      gameState,
      correctAction: { type: 'call' },
      explanation: 'With a flush draw and overcards, you have good equity. The pot odds justify a call.'
    };
  }

  private createBluffScenario(): TrainingScenario {
    const gameState: GameState = {
      players: [
        {
          id: 'hero',
          name: 'Hero',
          chips: 1100,
          cards: [
            { suit: 'diamonds', rank: '6', value: 6 },
            { suit: 'clubs', rank: '5', value: 5 }
          ],
          folded: false,
          currentBet: 0,
          position: 4
        },
        {
          id: 'villain',
          name: 'Villain',
          chips: 900,
          cards: [],
          folded: false,
          currentBet: 0,
          position: 2
        }
      ],
      communityCards: [
        { suit: 'spades', rank: 'A', value: 14 },
        { suit: 'hearts', rank: 'K', value: 13 },
        { suit: 'diamonds', rank: 'Q', value: 12 },
        { suit: 'clubs', rank: '2', value: 2 },
        { suit: 'spades', rank: '3', value: 3 }
      ],
      pot: 220,
      currentBet: 0,
      dealerPosition: 1,
      activePlayerIndex: 0,
      phase: 'river',
      deck: []
    };

    return {
      id: 'bluff-opportunity',
      name: 'Bluff on Scary Board',
      description: 'The board shows three high cards. Villain has checked to you.',
      difficulty: 'advanced',
      gameState,
      correctAction: { type: 'raise', amount: 150 },
      explanation: 'This board heavily favors your range. A well-sized bluff can often take down the pot.'
    };
  }
}