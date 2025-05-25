import { describe, it, expect } from 'vitest';
import { createStandardDeck, createShuffledDeck } from '../deck';
import { createRng } from '../rng';
import { RANKS, SUITS } from '@poker-trainer/shared-types';

describe('deck', () => {
  describe('createStandardDeck', () => {
    it('should create a 52-card deck', () => {
      const deck = createStandardDeck();
      expect(deck).toHaveLength(52);
    });

    it('should contain all ranks and suits', () => {
      const deck = createStandardDeck();
      
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          const card = deck.find(c => c.rank === rank && c.suit === suit);
          expect(card).toBeDefined();
        }
      }
    });

    it('should have no duplicate cards', () => {
      const deck = createStandardDeck();
      const cardStrings = deck.map(c => `${c.rank}${c.suit}`);
      const uniqueCards = new Set(cardStrings);
      
      expect(uniqueCards.size).toBe(52);
    });

    it('should be ordered by suit then rank', () => {
      const deck = createStandardDeck();
      
      let expectedIndex = 0;
      for (const suit of SUITS) {
        for (const rank of RANKS) {
          const card = deck[expectedIndex];
          expect(card).toEqual({ rank, suit });
          expectedIndex++;
        }
      }
    });
  });

  describe('createShuffledDeck', () => {
    it('should return a 52-card deck', () => {
      const rng = createRng(42n);
      const deck = createShuffledDeck(rng);
      
      expect(deck).toHaveLength(52);
    });

    it('should contain all cards from standard deck', () => {
      const rng = createRng(42n);
      const shuffled = createShuffledDeck(rng);
      const standard = createStandardDeck();
      
      for (const card of standard) {
        const found = shuffled.find(c => c.rank === card.rank && c.suit === card.suit);
        expect(found).toBeDefined();
      }
    });

    it('should produce different order than standard deck', () => {
      const rng = createRng(42n);
      const shuffled = createShuffledDeck(rng);
      const standard = createStandardDeck();
      
      let differences = 0;
      for (let i = 0; i < 52; i++) {
        if (shuffled[i]!.rank !== standard[i]!.rank || 
            shuffled[i]!.suit !== standard[i]!.suit) {
          differences++;
        }
      }
      
      expect(differences).toBeGreaterThan(40);
    });

    it('should produce deterministic results with same seed', () => {
      const rng1 = createRng(12345n);
      const rng2 = createRng(12345n);
      
      const deck1 = createShuffledDeck(rng1);
      const deck2 = createShuffledDeck(rng2);
      
      expect(deck1).toEqual(deck2);
    });

    it('should produce different results with different seeds', () => {
      const rng1 = createRng(12345n);
      const rng2 = createRng(54321n);
      
      const deck1 = createShuffledDeck(rng1);
      const deck2 = createShuffledDeck(rng2);
      
      expect(deck1).not.toEqual(deck2);
    });
  });
});