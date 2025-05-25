import { Card, HandRank, HandEvaluation } from './types';

export class HandEvaluator {
  evaluate(cards: Card[]): HandEvaluation {
    if (cards.length < 5) {
      throw new Error('Need at least 5 cards to evaluate');
    }

    const allCombinations = this.getCombinations(cards, 5);
    let bestHand: HandEvaluation | null = null;

    for (const combination of allCombinations) {
      const evaluation = this.evaluateFiveCards(combination);
      if (!bestHand || evaluation.value > bestHand.value) {
        bestHand = evaluation;
      }
    }

    return bestHand!;
  }

  private getCombinations(cards: Card[], size: number): Card[][] {
    const combinations: Card[][] = [];
    
    function backtrack(start: number, current: Card[]): void {
      if (current.length === size) {
        combinations.push([...current]);
        return;
      }
      
      for (let i = start; i < cards.length; i++) {
        current.push(cards[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    }
    
    backtrack(0, []);
    return combinations;
  }

  private evaluateFiveCards(cards: Card[]): HandEvaluation {
    const sortedCards = [...cards].sort((a, b) => b.value - a.value);
    
    if (this.isRoyalFlush(sortedCards)) {
      return {
        rank: 'royal-flush',
        value: 10000000,
        cards: sortedCards,
        description: 'Royal Flush'
      };
    }
    
    if (this.isStraightFlush(sortedCards)) {
      return {
        rank: 'straight-flush',
        value: 9000000 + this.getHighCard(sortedCards),
        cards: sortedCards,
        description: 'Straight Flush'
      };
    }
    
    const fourOfAKind = this.isFourOfAKind(sortedCards);
    if (fourOfAKind) {
      return {
        rank: 'four-of-a-kind',
        value: 8000000 + fourOfAKind,
        cards: sortedCards,
        description: 'Four of a Kind'
      };
    }
    
    const fullHouse = this.isFullHouse(sortedCards);
    if (fullHouse) {
      return {
        rank: 'full-house',
        value: 7000000 + fullHouse,
        cards: sortedCards,
        description: 'Full House'
      };
    }
    
    if (this.isFlush(sortedCards)) {
      return {
        rank: 'flush',
        value: 6000000 + this.getHighCard(sortedCards),
        cards: sortedCards,
        description: 'Flush'
      };
    }
    
    if (this.isStraight(sortedCards)) {
      return {
        rank: 'straight',
        value: 5000000 + this.getHighCard(sortedCards),
        cards: sortedCards,
        description: 'Straight'
      };
    }
    
    const threeOfAKind = this.isThreeOfAKind(sortedCards);
    if (threeOfAKind) {
      return {
        rank: 'three-of-a-kind',
        value: 4000000 + threeOfAKind,
        cards: sortedCards,
        description: 'Three of a Kind'
      };
    }
    
    const twoPair = this.isTwoPair(sortedCards);
    if (twoPair) {
      return {
        rank: 'two-pair',
        value: 3000000 + twoPair,
        cards: sortedCards,
        description: 'Two Pair'
      };
    }
    
    const pair = this.isPair(sortedCards);
    if (pair) {
      return {
        rank: 'pair',
        value: 2000000 + pair,
        cards: sortedCards,
        description: 'Pair'
      };
    }
    
    return {
      rank: 'high-card',
      value: 1000000 + this.getHighCard(sortedCards),
      cards: sortedCards,
      description: 'High Card'
    };
  }

  private isRoyalFlush(cards: Card[]): boolean {
    return this.isStraightFlush(cards) && cards[0].value === 14;
  }

  private isStraightFlush(cards: Card[]): boolean {
    return this.isFlush(cards) && this.isStraight(cards);
  }

  private isFourOfAKind(cards: Card[]): number {
    const values = this.getValueCounts(cards);
    for (const [value, count] of values.entries()) {
      if (count === 4) return value;
    }
    return 0;
  }

  private isFullHouse(cards: Card[]): number {
    const values = this.getValueCounts(cards);
    let threeValue = 0;
    let pairValue = 0;
    
    for (const [value, count] of values.entries()) {
      if (count === 3) threeValue = value;
      if (count === 2) pairValue = value;
    }
    
    return threeValue && pairValue ? threeValue * 100 + pairValue : 0;
  }

  private isFlush(cards: Card[]): boolean {
    const suit = cards[0].suit;
    return cards.every(card => card.suit === suit);
  }

  private isStraight(cards: Card[]): boolean {
    const values = cards.map(c => c.value).sort((a, b) => b - a);
    
    // Check for regular straight
    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] - values[i + 1] !== 1) {
        // Check for low ace straight (A, 2, 3, 4, 5)
        if (values[0] === 14 && values[1] === 5 && values[2] === 4 && 
            values[3] === 3 && values[4] === 2) {
          return true;
        }
        return false;
      }
    }
    return true;
  }

  private isThreeOfAKind(cards: Card[]): number {
    const values = this.getValueCounts(cards);
    for (const [value, count] of values.entries()) {
      if (count === 3) return value;
    }
    return 0;
  }

  private isTwoPair(cards: Card[]): number {
    const values = this.getValueCounts(cards);
    const pairs: number[] = [];
    
    for (const [value, count] of values.entries()) {
      if (count === 2) pairs.push(value);
    }
    
    if (pairs.length === 2) {
      pairs.sort((a, b) => b - a);
      return pairs[0] * 100 + pairs[1];
    }
    return 0;
  }

  private isPair(cards: Card[]): number {
    const values = this.getValueCounts(cards);
    for (const [value, count] of values.entries()) {
      if (count === 2) return value;
    }
    return 0;
  }

  private getValueCounts(cards: Card[]): Map<number, number> {
    const counts = new Map<number, number>();
    for (const card of cards) {
      counts.set(card.value, (counts.get(card.value) || 0) + 1);
    }
    return counts;
  }

  private getHighCard(cards: Card[]): number {
    return Math.max(...cards.map(c => c.value));
  }
}