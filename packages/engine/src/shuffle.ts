import { XoShiRo256StarStar } from './rng';

export function fisherYatesShuffle<T>(array: T[], rng: XoShiRo256StarStar): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  
  return shuffled;
}