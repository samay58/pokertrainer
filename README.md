# Poker Trainer

A monorepo for building a Texas Hold'em training application. The project is organized using `pnpm` workspaces with packages for the engine, shared types, frontend and more.

## Hand Flow

A single hand progresses through these steps:

1. **Deck shuffle** – A new shuffled deck is created.
2. **Blinds** – Small and big blinds are posted.
3. **Hole cards** – Each active player receives two cards.
4. **Betting rounds** – Players act in turn until betting is settled.
5. **Community cards** – Flop, turn and river are dealt between betting rounds.
6. **Showdown** – Remaining players reveal their hands and the pot is awarded.
7. **Next hand** – The dealer button moves and stacks reset for the following hand.

## Engine API Example

```ts
import { newHand, applyAction, advanceGame, ActionType, GameConfig } from '@poker-trainer/engine';

const config: GameConfig = {
  smallBlind: 50,
  bigBlind: 100,
  initialStack: 1000,
  playerCount: 2,
};

let state = newHand(config);

state = applyAction(state, { playerId: 'player-0', type: ActionType.CALL });
state = applyAction(state, { playerId: 'player-1', type: ActionType.CHECK });

state = advanceGame(state); // progress to next stage (flop, turn, river or showdown)
```

## Testing

Run all unit tests across packages using:

```bash
pnpm -r run test
```
