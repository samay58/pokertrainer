export class XoShiRo256StarStar {
  private s: BigUint64Array;

  constructor(seed: bigint) {
    this.s = new BigUint64Array(4);
    this.s[0] = seed;
    this.s[1] = seed >> 64n;
    this.s[2] = seed >> 128n;
    this.s[3] = seed >> 192n;
    
    // Warm up the generator
    for (let i = 0; i < 20; i++) {
      this.next();
    }
  }

  private rotl(x: bigint, k: number): bigint {
    return ((x << BigInt(k)) | (x >> BigInt(64 - k))) & 0xFFFFFFFFFFFFFFFFn;
  }

  next(): bigint {
    const s0 = this.s[0]!;
    const s1 = this.s[1]!;
    const s2 = this.s[2]!;
    const s3 = this.s[3]!;
    
    const result = this.rotl(s1 * 5n, 7) * 9n;
    const t = s1 << 17n;

    this.s[2] = s2 ^ s0;
    this.s[3] = s3 ^ s1;
    this.s[1] = s1 ^ this.s[2];
    this.s[0] = s0 ^ this.s[3];

    this.s[2] ^= t;
    this.s[3] = this.rotl(this.s[3], 45);

    return result & 0xFFFFFFFFFFFFFFFFn;
  }

  nextFloat(): number {
    return Number(this.next() >> 11n) / 0x1fffffffffffff;
  }

  nextInt(max: number): number {
    return Math.floor(this.nextFloat() * max);
  }
}

export function createRng(seed?: bigint): XoShiRo256StarStar {
  const finalSeed = seed ?? BigInt(Date.now());
  return new XoShiRo256StarStar(finalSeed);
}