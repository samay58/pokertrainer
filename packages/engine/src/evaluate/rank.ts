import { Card, Rank, RANK_VALUES } from '@poker-trainer/shared-types';

export enum HandRank {
  HIGH_CARD = 0,
  PAIR = 1,
  TWO_PAIR = 2,
  THREE_OF_A_KIND = 3,
  STRAIGHT = 4,
  FLUSH = 5,
  FULL_HOUSE = 6,
  FOUR_OF_A_KIND = 7,
  STRAIGHT_FLUSH = 8,
  ROYAL_FLUSH = 9
}

export interface HandEvaluation {
  rank: HandRank;
  value: number; // 32-bit value where lower is better
  cards: Card[]; // Best 5 cards
}

// Convert hand rank and kickers to a 32-bit value
function makeHandValue(rank: HandRank, ...kickers: number[]): number {
  let value = rank << 20; // Use top bits for hand rank
  let shift = 16;
  
  for (const kicker of kickers) {
    value |= kicker << shift;
    shift -= 4;
  }
  
  return value;
}

// Get numeric value for rank
function rankValue(rank: Rank): number {
  return RANK_VALUES[rank];
}

// Check if cards form a flush
function checkFlush(cards: Card[]): Card[] | null {
  const suitCounts = new Map<string, Card[]>();
  
  for (const card of cards) {
    const suited = suitCounts.get(card.suit) || [];
    suited.push(card);
    suitCounts.set(card.suit, suited);
    
    if (suited.length >= 5) {
      return suited
        .sort((a, b) => rankValue(b.rank) - rankValue(a.rank))
        .slice(0, 5);
    }
  }
  
  return null;
}

// Check if cards form a straight
function checkStraight(cards: Card[]): Card[] | null {
  const uniqueRanks = new Set(cards.map(c => rankValue(c.rank)));
  const sortedRanks = Array.from(uniqueRanks).sort((a, b) => b - a);
  
  // Check for regular straights
  for (let i = 0; i <= sortedRanks.length - 5; i++) {
    const high = sortedRanks[i]!;
    const low = sortedRanks[i + 4]!;
    
    if (high - low === 4) {
      // Found a straight, get the cards
      const straightCards: Card[] = [];
      for (let rank = high; rank >= low; rank--) {
        const card = cards.find(c => rankValue(c.rank) === rank);
        if (card) straightCards.push(card);
      }
      return straightCards;
    }
  }
  
  // Check for A-2-3-4-5 (wheel)
  if (uniqueRanks.has(14) && uniqueRanks.has(5) && uniqueRanks.has(4) && 
      uniqueRanks.has(3) && uniqueRanks.has(2)) {
    const straightCards: Card[] = [];
    for (const targetRank of [5, 4, 3, 2]) {
      const card = cards.find(c => rankValue(c.rank) === targetRank);
      if (card) straightCards.push(card);
    }
    const ace = cards.find(c => rankValue(c.rank) === 14);
    if (ace) straightCards.push(ace);
    return straightCards;
  }
  
  return null;
}

// Evaluate best 5-card hand from 7 cards
export function evaluateHand(cards: Card[]): HandEvaluation {
  if (cards.length < 5) {
    throw new Error('Need at least 5 cards to evaluate');
  }
  
  // Count ranks
  const rankCounts = new Map<Rank, number>();
  const rankCards = new Map<Rank, Card[]>();
  
  for (const card of cards) {
    rankCounts.set(card.rank, (rankCounts.get(card.rank) || 0) + 1);
    const existing = rankCards.get(card.rank) || [];
    existing.push(card);
    rankCards.set(card.rank, existing);
  }
  
  // Sort ranks by count then value
  const sortedRanks = Array.from(rankCounts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]; // By count
      return rankValue(b[0]) - rankValue(a[0]); // By rank value
    });
  
  // Check for flushes and straights
  const flushCards = checkFlush(cards);
  const straightCards = checkStraight(cards);
  
  // Check for straight flush
  if (flushCards && straightCards) {
    const straightFlush = checkStraight(flushCards);
    if (straightFlush) {
      const highCard = rankValue(straightFlush[0]!.rank);
      if (highCard === 14) {
        // Royal flush
        return {
          rank: HandRank.ROYAL_FLUSH,
          value: makeHandValue(HandRank.ROYAL_FLUSH),
          cards: straightFlush
        };
      }
      return {
        rank: HandRank.STRAIGHT_FLUSH,
        value: makeHandValue(HandRank.STRAIGHT_FLUSH, highCard),
        cards: straightFlush
      };
    }
  }
  
  // Check for four of a kind
  if (sortedRanks[0]![1] === 4) {
    const quadRank = sortedRanks[0]![0];
    const quadCards = rankCards.get(quadRank)!;
    const kicker = cards.find(c => c.rank !== quadRank)!;
    
    return {
      rank: HandRank.FOUR_OF_A_KIND,
      value: makeHandValue(HandRank.FOUR_OF_A_KIND, rankValue(quadRank), rankValue(kicker.rank)),
      cards: [...quadCards, kicker]
    };
  }
  
  // Check for full house
  if (sortedRanks[0]![1] === 3 && sortedRanks[1]![1] >= 2) {
    const tripRank = sortedRanks[0]![0];
    const pairRank = sortedRanks[1]![0];
    const tripCards = rankCards.get(tripRank)!.slice(0, 3);
    const pairCards = rankCards.get(pairRank)!.slice(0, 2);
    
    return {
      rank: HandRank.FULL_HOUSE,
      value: makeHandValue(HandRank.FULL_HOUSE, rankValue(tripRank), rankValue(pairRank)),
      cards: [...tripCards, ...pairCards]
    };
  }
  
  // Check for flush
  if (flushCards) {
    const values = flushCards.map(c => rankValue(c.rank));
    return {
      rank: HandRank.FLUSH,
      value: makeHandValue(HandRank.FLUSH, ...values),
      cards: flushCards
    };
  }
  
  // Check for straight
  if (straightCards) {
    const highCard = rankValue(straightCards[0]!.rank);
    // Special case for wheel (A-5 straight)
    const straightValue = straightCards[4]!.rank === 'A' ? 5 : highCard;
    
    return {
      rank: HandRank.STRAIGHT,
      value: makeHandValue(HandRank.STRAIGHT, straightValue),
      cards: straightCards
    };
  }
  
  // Check for three of a kind
  if (sortedRanks[0]![1] === 3) {
    const tripRank = sortedRanks[0]![0];
    const tripCards = rankCards.get(tripRank)!.slice(0, 3);
    const kickers = cards
      .filter(c => c.rank !== tripRank)
      .sort((a, b) => rankValue(b.rank) - rankValue(a.rank))
      .slice(0, 2);
    
    return {
      rank: HandRank.THREE_OF_A_KIND,
      value: makeHandValue(
        HandRank.THREE_OF_A_KIND, 
        rankValue(tripRank),
        ...kickers.map(c => rankValue(c.rank))
      ),
      cards: [...tripCards, ...kickers]
    };
  }
  
  // Check for two pair
  if (sortedRanks[0]![1] === 2 && sortedRanks[1]![1] === 2) {
    const pair1Rank = sortedRanks[0]![0];
    const pair2Rank = sortedRanks[1]![0];
    const pair1Cards = rankCards.get(pair1Rank)!.slice(0, 2);
    const pair2Cards = rankCards.get(pair2Rank)!.slice(0, 2);
    const kicker = cards
      .find(c => c.rank !== pair1Rank && c.rank !== pair2Rank)!;
    
    return {
      rank: HandRank.TWO_PAIR,
      value: makeHandValue(
        HandRank.TWO_PAIR,
        rankValue(pair1Rank),
        rankValue(pair2Rank),
        rankValue(kicker.rank)
      ),
      cards: [...pair1Cards, ...pair2Cards, kicker]
    };
  }
  
  // Check for one pair
  if (sortedRanks[0]![1] === 2) {
    const pairRank = sortedRanks[0]![0];
    const pairCards = rankCards.get(pairRank)!.slice(0, 2);
    const kickers = cards
      .filter(c => c.rank !== pairRank)
      .sort((a, b) => rankValue(b.rank) - rankValue(a.rank))
      .slice(0, 3);
    
    return {
      rank: HandRank.PAIR,
      value: makeHandValue(
        HandRank.PAIR,
        rankValue(pairRank),
        ...kickers.map(c => rankValue(c.rank))
      ),
      cards: [...pairCards, ...kickers]
    };
  }
  
  // High card
  const highCards = cards
    .sort((a, b) => rankValue(b.rank) - rankValue(a.rank))
    .slice(0, 5);
  
  return {
    rank: HandRank.HIGH_CARD,
    value: makeHandValue(
      HandRank.HIGH_CARD,
      ...highCards.map(c => rankValue(c.rank))
    ),
    cards: highCards
  };
}

// Evaluate 7-card hand (2 hole + 5 community)
export function evaluateHand7(holeCards: readonly Card[], communityCards: readonly Card[]): HandEvaluation {
  const allCards = [...holeCards, ...communityCards];
  return evaluateHand(allCards);
}