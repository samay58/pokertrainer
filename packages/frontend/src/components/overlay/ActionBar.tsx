import { useState } from 'react'
import { useGame } from '@hooks/useGame'
import { ActionType } from '@poker-trainer/shared-types'
import { motion, AnimatePresence } from 'framer-motion'

export default function ActionBar() {
  const { gameState, legalActions, performAction, isUserTurn } = useGame()
  const [betAmount, setBetAmount] = useState(0)

  if (!gameState || !isUserTurn) {
    return null
  }

  const handleAction = (type: ActionType, amount?: number) => {
    performAction({
      playerId: 'player-0',
      type,
      amount
    })
  }

  const betAction = legalActions.find(a => a.type === ActionType.BET)
  const raiseAction = legalActions.find(a => a.type === ActionType.RAISE)
  const betOrRaise = betAction || raiseAction

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-bg-table border-t border-border-dim"
      >
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center gap-4">
            {/* Action Buttons */}
            {legalActions.map((action) => {
              switch (action.type) {
                case ActionType.FOLD:
                  return (
                    <button
                      key="fold"
                      onClick={() => handleAction(ActionType.FOLD)}
                      className="btn-danger"
                    >
                      Fold
                    </button>
                  )
                case ActionType.CHECK:
                  return (
                    <button
                      key="check"
                      onClick={() => handleAction(ActionType.CHECK)}
                      className="btn-secondary"
                    >
                      Check
                    </button>
                  )
                case ActionType.CALL:
                  const callAmount = gameState.highestBet - gameState.players[0]!.currentBet
                  return (
                    <button
                      key="call"
                      onClick={() => handleAction(ActionType.CALL)}
                      className="btn-success"
                    >
                      Call ${callAmount}
                    </button>
                  )
                case ActionType.ALL_IN:
                  return (
                    <button
                      key="allin"
                      onClick={() => handleAction(ActionType.ALL_IN, action.maxAmount)}
                      className="btn-danger"
                    >
                      All In ${action.maxAmount}
                    </button>
                  )
                default:
                  return null
              }
            })}

            {/* Bet/Raise Controls */}
            {betOrRaise && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={betOrRaise.minAmount}
                  max={betOrRaise.maxAmount}
                  value={betAmount || betOrRaise.minAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-32"
                />
                <input
                  type="number"
                  min={betOrRaise.minAmount}
                  max={betOrRaise.maxAmount}
                  value={betAmount || betOrRaise.minAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-24 px-2 py-1 bg-bg-surface border border-border-dim rounded text-text-primary"
                />
                <button
                  onClick={() => handleAction(betOrRaise.type, betAmount || betOrRaise.minAmount)}
                  className="btn-primary"
                >
                  {betOrRaise.type === ActionType.BET ? 'Bet' : 'Raise'} ${betAmount || betOrRaise.minAmount}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}