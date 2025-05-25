import { describe, it, expect } from 'vitest'
import {
  newHand,
  applyAction,
  advanceGameStage,
  GameConfig,
  GameStage,
  ActionType
} from '../api'

const config: GameConfig = {
  smallBlind: 50,
  bigBlind: 100,
  initialStack: 1000,
  playerCount: 2,
  rngSeed: 42n
}

describe('betting round flow', () => {
  it('advances through all stages with correct turn order', () => {
    let state = newHand(config)

    expect(state.stage).toBe(GameStage.PRE_FLOP)
    expect(state.toAct).toBe(0)

    state = applyAction(state, { playerId: 'player-0', type: ActionType.CALL })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.PRE_FLOP)
    expect(state.toAct).toBe(1)

    state = applyAction(state, { playerId: 'player-1', type: ActionType.CHECK })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.FLOP)
    expect(state.toAct).toBe(1)

    state = applyAction(state, { playerId: 'player-1', type: ActionType.CHECK })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.FLOP)
    expect(state.toAct).toBe(0)

    state = applyAction(state, { playerId: 'player-0', type: ActionType.CHECK })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.TURN)
    expect(state.toAct).toBe(1)

    state = applyAction(state, { playerId: 'player-1', type: ActionType.CHECK })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.TURN)
    expect(state.toAct).toBe(0)

    state = applyAction(state, { playerId: 'player-0', type: ActionType.CHECK })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.RIVER)
    expect(state.toAct).toBe(1)

    state = applyAction(state, { playerId: 'player-1', type: ActionType.CHECK })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.RIVER)
    expect(state.toAct).toBe(0)

    state = applyAction(state, { playerId: 'player-0', type: ActionType.CHECK })
    state = advanceGameStage(state)
    expect(state.stage).toBe(GameStage.COMPLETE)
  })
})
