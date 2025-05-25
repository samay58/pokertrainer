import { GameState, GameStage, PlayerStatus } from '@poker-trainer/shared-types'
import { getNextActiveSeat, getActivePlayers, structuredClone } from '../gameState'
import { dealCommunityCards } from './deal'
import { performShowdown } from './showdown'
import { moveBetsToPots } from './sidePot'

export function updateToAct(gameState: GameState): GameState {
  const newState = structuredClone(gameState)
  newState.toAct = getNextActiveSeat(newState.toAct, newState)
  return newState as GameState
}

export function allBetsSettled(gameState: GameState): boolean {
  const activePlayers = getActivePlayers(gameState)
  if (activePlayers.length <= 1) {
    return true
  }

  const highestBet = gameState.highestBet
  const allMatched = gameState.players.every(
    p =>
      p.status === PlayerStatus.FOLDED ||
      p.status === PlayerStatus.ALL_IN ||
      p.currentBet === highestBet
  )

  if (!allMatched) {
    return false
  }

  if (gameState.highestBet > 0 && gameState.lastAggressor >= 0) {
    const nextAfterAggressor = getNextActiveSeat(gameState.lastAggressor, gameState)
    return gameState.toAct === nextAfterAggressor
  }

  if (gameState.highestBet === 0) {
    return gameState.numActionsThisRound >= activePlayers.length
  }

  return false
}

export function advanceGameStage(gameState: GameState): GameState {
  if (!allBetsSettled(gameState)) {
    return gameState
  }

  let newState = moveBetsToPots(structuredClone(gameState)) as GameState
  const activePlayers = getActivePlayers(newState)

  if (activePlayers.length <= 1) {
    return performShowdown(newState)
  }

  switch (newState.stage) {
    case GameStage.PRE_FLOP:
      newState = dealCommunityCards(newState, 3)
      break
    case GameStage.FLOP:
      newState = dealCommunityCards(newState, 1)
      break
    case GameStage.TURN:
      newState = dealCommunityCards(newState, 1)
      break
    case GameStage.RIVER:
      newState = performShowdown(newState)
      break
  }

  return newState
}
