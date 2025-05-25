import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { 
  GameState, 
  GameConfig, 
  PlayerAction,
  ActionType,
  newHand,
  applyAction,
  getLegalActions,
  advanceGameStage,
  GameStage
} from '@poker-trainer/engine'

interface GameContextValue {
  gameState: GameState | null
  legalActions: ReturnType<typeof getLegalActions>
  startNewHand: () => void
  performAction: (action: PlayerAction) => void
  isUserTurn: boolean
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  
  // Initialize game with 2 players (user vs AI)
  const startNewHand = useCallback(() => {
    const config: GameConfig = {
      smallBlind: 50,
      bigBlind: 100,
      initialStack: 1000,
      playerCount: 2,
      rngSeed: BigInt(Date.now())
    }
    
    const newState = newHand(config)
    setGameState(newState)
  }, [])

  // Handle player actions
  const performAction = useCallback((action: PlayerAction) => {
    if (!gameState) return
    
    try {
      let newState = applyAction(gameState, action)
      
      // Check if betting round is complete
      console.log('Checking if bets settled:', {
        stage: newState.stage,
        highestBet: newState.highestBet,
        numActions: newState.numActionsThisRound,
        lastAggressor: newState.lastAggressor,
        toAct: newState.toAct,
        players: newState.players.map(p => ({ currentBet: p.currentBet, status: p.status }))
      })
      newState = advanceGameStage(newState)

      if (newState.stage === GameStage.COMPLETE) {
        setTimeout(startNewHand, 3000)
      }
      
      setGameState(newState)
    } catch (error) {
      console.error('Invalid action:', error)
    }
  }, [gameState, startNewHand])

  // Get legal actions for current player
  const legalActions = gameState && gameState.toAct === 0
    ? getLegalActions(gameState, gameState.players[0]!)
    : []

  const isUserTurn = gameState?.toAct === 0 && gameState.stage !== GameStage.COMPLETE

  // Start a new hand when component mounts
  useEffect(() => {
    startNewHand()
  }, [startNewHand])

  // Handle AI moves
  useEffect(() => {
    if (!gameState) return
    if (gameState.toAct !== 1) return
    if (gameState.stage === GameStage.COMPLETE) return
    
    const timer = setTimeout(() => {
      const aiPlayer = gameState.players[1]
      if (!aiPlayer) return
      
      const aiActions = getLegalActions(gameState, aiPlayer)
      console.log('AI legal actions:', aiActions.map(a => a.type))
      console.log('Current game state:', {
        stage: gameState.stage,
        highestBet: gameState.highestBet,
        player1CurrentBet: aiPlayer.currentBet,
        player1Stack: aiPlayer.stack,
        toAct: gameState.toAct
      })
      
      if (aiActions.length > 0) {
        // Simple AI strategy: check/call most of the time
        const checkOrCall = aiActions.find(a => 
          a.type === ActionType.CHECK || a.type === ActionType.CALL
        )
        const aiAction: PlayerAction = checkOrCall 
          ? { playerId: 'player-1', type: checkOrCall.type }
          : { playerId: 'player-1', type: aiActions[0]!.type }
        
        console.log('AI choosing action:', aiAction.type)
        performAction(aiAction)
      }
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [gameState, performAction])

  return (
    <GameContext.Provider value={{
      gameState,
      legalActions,
      startNewHand,
      performAction,
      isUserTurn
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}