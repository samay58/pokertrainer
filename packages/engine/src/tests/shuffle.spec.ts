import { describe, it, expect } from 'vitest';
import { fisherYatesShuffle } from '../shuffle';
import { createRng } from '../rng';

describe('fisherYatesShuffle', () => {
  it('should preserve all elements', () => {
    const rng = createRng(42n);
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = fisherYatesShuffle(original, rng);
    
    expect(shuffled).toHaveLength(original.length);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });

  it('should not modify the original array', () => {
    const rng = createRng(42n);
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    
    fisherYatesShuffle(original, rng);
    
    expect(original).toEqual(copy);
  });

  it('should produce different results with different RNG states', () => {
    const original = Array.from({ length: 20 }, (_, i) => i);
    
    const rng1 = createRng(42n);
    const rng2 = createRng(43n);
    
    const shuffled1 = fisherYatesShuffle(original, rng1);
    const shuffled2 = fisherYatesShuffle(original, rng2);
    
    expect(shuffled1).not.toEqual(shuffled2);
  });

  it('should produce deterministic results with same seed', () => {
    const original = Array.from({ length: 52 }, (_, i) => i);
    
    const rng1 = createRng(12345n);
    const rng2 = createRng(12345n);
    
    const shuffled1 = fisherYatesShuffle(original, rng1);
    const shuffled2 = fisherYatesShuffle(original, rng2);
    
    expect(shuffled1).toEqual(shuffled2);
  });

  it('should handle empty array', () => {
    const rng = createRng(42n);
    const result = fisherYatesShuffle([], rng);
    
    expect(result).toEqual([]);
  });

  it('should handle single element array', () => {
    const rng = createRng(42n);
    const result = fisherYatesShuffle([42], rng);
    
    expect(result).toEqual([42]);
  });

  it('should have good distribution over many shuffles', () => {
    const rng = createRng(42n);
    const array = [0, 1, 2, 3];
    const positionCounts = Array.from({ length: array.length }, () => 
      new Array(array.length).fill(0)
    );
    
    const iterations = 10000;
    
    for (let i = 0; i < iterations; i++) {
      const shuffled = fisherYatesShuffle(array, rng);
      shuffled.forEach((value, position) => {
        positionCounts[value]![position]!++;
      });
    }
    
    const expectedCount = iterations / array.length;
    const tolerance = expectedCount * 0.1; // 10% tolerance
    
    for (let value = 0; value < array.length; value++) {
      for (let position = 0; position < array.length; position++) {
        const count = positionCounts[value]![position]!;
        expect(count).toBeGreaterThan(expectedCount - tolerance);
        expect(count).toBeLessThan(expectedCount + tolerance);
      }
    }
  });
});