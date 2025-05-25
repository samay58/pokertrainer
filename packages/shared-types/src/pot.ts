export interface Pot {
  readonly amount: number;
  readonly eligible: ReadonlySet<string>;
}