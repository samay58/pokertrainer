import { GameState, Player, Card, GamePhase } from './types';
import { Deck } from './deck';
import { HandEvaluator } from './handEvaluator';

export class PokerGame {
  private gameState: GameState;
  private deck: Deck;
  private handEvaluator: HandEvaluator;

  constructor() {
    this.deck = new Deck();
    this.handEvaluator = new HandEvaluator();
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    return {
      players: [],
      communityCards: [],
      pot: 0,
      currentBet: 0,
      dealerPosition: 0,
      activePlayerIndex: 0,
      phase: 'preflop',
      deck: []
    };
  }

  addPlayer(player: Player): void {
    this.gameState.players.push(player);
  }

  startNewHand(): void {
    this.deck.reset();
    this.gameState.communityCards = [];
    this.gameState.pot = 0;
    this.gameState.currentBet = 0;
    this.gameState.phase = 'preflop';
    
    this.gameState.players.forEach(player => {
      player.cards = [];
      player.folded = false;
      player.currentBet = 0;
    });

    this.dealHoleCards();
    this.postBlinds();
  }

  private dealHoleCards(): void {
    this.gameState.players.forEach(player => {
      if (!player.folded) {
        player.cards = this.deck.draw(2);
      }
    });
  }

  private postBlinds(): void {
    const smallBlindIndex = (this.gameState.dealerPosition + 1) % this.gameState.players.length;
    const bigBlindIndex = (this.gameState.dealerPosition + 2) % this.gameState.players.length;
    
    const smallBlind = 10;
    const bigBlind = 20;
    
    this.placeBet(smallBlindIndex, smallBlind);
    this.placeBet(bigBlindIndex, bigBlind);
    
    this.gameState.currentBet = bigBlind;
    this.gameState.activePlayerIndex = (bigBlindIndex + 1) % this.gameState.players.length;
  }

  private placeBet(playerIndex: number, amount: number): void {
    const player = this.gameState.players[playerIndex];
    const betAmount = Math.min(amount, player.chips);
    
    player.chips -= betAmount;
    player.currentBet += betAmount;
    this.gameState.pot += betAmount;
  }

  playerAction(action: 'fold' | 'check' | 'call' | 'raise', raiseAmount?: number): void {
    const activePlayer = this.gameState.players[this.gameState.activePlayerIndex];
    
    switch (action) {
      case 'fold':
        activePlayer.folded = true;
        break;
        
      case 'check':
        if (this.gameState.currentBet > activePlayer.currentBet) {
          throw new Error('Cannot check when there is a bet');
        }
        break;
        
      case 'call':
        const callAmount = this.gameState.currentBet - activePlayer.currentBet;
        this.placeBet(this.gameState.activePlayerIndex, callAmount);
        break;
        
      case 'raise':
        if (!raiseAmount) {
          throw new Error('Raise amount required');
        }
        const totalBet = this.gameState.currentBet + raiseAmount;
        const additionalBet = totalBet - activePlayer.currentBet;
        this.placeBet(this.gameState.activePlayerIndex, additionalBet);
        this.gameState.currentBet = totalBet;
        break;
    }
    
    this.nextPlayer();
  }

  private nextPlayer(): void {
    const activePlayers = this.gameState.players.filter(p => !p.folded);
    
    if (activePlayers.length === 1) {
      this.endHand();
      return;
    }
    
    do {
      this.gameState.activePlayerIndex = 
        (this.gameState.activePlayerIndex + 1) % this.gameState.players.length;
    } while (this.gameState.players[this.gameState.activePlayerIndex].folded);
    
    if (this.isRoundComplete()) {
      this.nextPhase();
    }
  }

  private isRoundComplete(): boolean {
    const activePlayers = this.gameState.players.filter(p => !p.folded);
    return activePlayers.every(p => p.currentBet === this.gameState.currentBet);
  }

  private nextPhase(): void {
    this.gameState.players.forEach(p => p.currentBet = 0);
    this.gameState.currentBet = 0;
    
    switch (this.gameState.phase) {
      case 'preflop':
        this.gameState.phase = 'flop';
        this.gameState.communityCards.push(...this.deck.draw(3));
        break;
      case 'flop':
        this.gameState.phase = 'turn';
        this.gameState.communityCards.push(...this.deck.draw(1));
        break;
      case 'turn':
        this.gameState.phase = 'river';
        this.gameState.communityCards.push(...this.deck.draw(1));
        break;
      case 'river':
        this.gameState.phase = 'showdown';
        this.determineWinner();
        break;
    }
    
    const firstActivePlayer = this.gameState.players.findIndex(p => !p.folded);
    this.gameState.activePlayerIndex = firstActivePlayer;
  }

  private determineWinner(): void {
    const activePlayers = this.gameState.players.filter(p => !p.folded);
    
    if (activePlayers.length === 1) {
      activePlayers[0].chips += this.gameState.pot;
      return;
    }
    
    let bestEvaluation = null;
    let winner = null;
    
    for (const player of activePlayers) {
      const allCards = [...player.cards, ...this.gameState.communityCards];
      const evaluation = this.handEvaluator.evaluate(allCards);
      
      if (!bestEvaluation || evaluation.value > bestEvaluation.value) {
        bestEvaluation = evaluation;
        winner = player;
      }
    }
    
    if (winner) {
      winner.chips += this.gameState.pot;
    }
  }

  private endHand(): void {
    const winner = this.gameState.players.find(p => !p.folded);
    if (winner) {
      winner.chips += this.gameState.pot;
    }
    
    this.gameState.dealerPosition = 
      (this.gameState.dealerPosition + 1) % this.gameState.players.length;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }
}