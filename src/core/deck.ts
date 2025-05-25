import { Card, Suit, Rank } from './types';

export class Deck {
  private cards: Card[] = [];
  private suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  private ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.cards = [];
    this.suits.forEach(suit => {
      this.ranks.forEach((rank, index) => {
        let value = index + 2;
        if (rank === 'J') value = 11;
        else if (rank === 'Q') value = 12;
        else if (rank === 'K') value = 13;
        else if (rank === 'A') value = 14;
        
        this.cards.push({
          suit,
          rank,
          value
        });
      });
    });
    this.shuffle();
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(count: number = 1): Card[] {
    const drawnCards: Card[] = [];
    for (let i = 0; i < count && this.cards.length > 0; i++) {
      const card = this.cards.pop();
      if (card) drawnCards.push(card);
    }
    return drawnCards;
  }

  getRemaining(): number {
    return this.cards.length;
  }
}