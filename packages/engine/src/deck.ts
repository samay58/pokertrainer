import { Card, RANKS, SUITS } from '@poker-trainer/shared-types';
import { XoShiRo256StarStar } from './rng';
import { fisherYatesShuffle } from './shuffle';

export function createStandardDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  
  return deck;
}

export function createShuffledDeck(rng: XoShiRo256StarStar): Card[] {
  const deck = createStandardDeck();
  return fisherYatesShuffle(deck, rng);
}