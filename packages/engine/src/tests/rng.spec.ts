import { describe, it, expect } from 'vitest';
import { XoShiRo256StarStar, createRng } from '../rng';

describe('XoShiRo256StarStar', () => {
  it('should produce deterministic results with the same seed', () => {
    const seed = 12345n;
    const rng1 = new XoShiRo256StarStar(seed);
    const rng2 = new XoShiRo256StarStar(seed);
    
    for (let i = 0; i < 100; i++) {
      expect(rng1.next()).toBe(rng2.next());
    }
  });

  it('should produce different results with different seeds', () => {
    const rng1 = new XoShiRo256StarStar(12345n);
    const rng2 = new XoShiRo256StarStar(54321n);
    
    const results1 = Array.from({ length: 10 }, () => rng1.next());
    const results2 = Array.from({ length: 10 }, () => rng2.next());
    
    expect(results1).not.toEqual(results2);
  });

  it('should produce floats in [0, 1) range', () => {
    const rng = createRng(42n);
    
    for (let i = 0; i < 1000; i++) {
      const value = rng.nextFloat();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('should produce integers in [0, max) range', () => {
    const rng = createRng(42n);
    const max = 52;
    
    const values = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const value = rng.nextInt(max);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(max);
      expect(Math.floor(value)).toBe(value);
      values.add(value);
    }
    
    // Should eventually generate all possible values
    expect(values.size).toBeGreaterThan(max * 0.9);
  });

  it('should handle edge case with max = 1', () => {
    const rng = createRng(42n);
    
    for (let i = 0; i < 100; i++) {
      expect(rng.nextInt(1)).toBe(0);
    }
  });

  it('should have good distribution', () => {
    const rng = createRng(42n);
    const buckets = 10;
    const samples = 100000;
    const counts = new Array(buckets).fill(0);
    
    for (let i = 0; i < samples; i++) {
      const bucket = Math.floor(rng.nextFloat() * buckets);
      counts[bucket]++;
    }
    
    const expected = samples / buckets;
    const tolerance = expected * 0.05; // 5% tolerance
    
    for (const count of counts) {
      expect(count).toBeGreaterThan(expected - tolerance);
      expect(count).toBeLessThan(expected + tolerance);
    }
  });

  it('should use current timestamp when no seed provided', () => {
    const beforeTime = Date.now();
    const rng1 = createRng();
    const afterTime = Date.now();
    
    // Just verify it creates an RNG successfully
    expect(rng1).toBeInstanceOf(XoShiRo256StarStar);
    expect(rng1.nextInt(100)).toBeGreaterThanOrEqual(0);
    expect(rng1.nextInt(100)).toBeLessThan(100);
    
    // Different calls should produce different RNGs
    const rng2 = createRng();
    const values1 = Array.from({ length: 10 }, () => rng1.next());
    const values2 = Array.from({ length: 10 }, () => rng2.next());
    expect(values1).not.toEqual(values2);
  });
});