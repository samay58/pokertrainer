import { motion } from 'framer-motion'
import { useGame } from '@hooks/useGame'

export default function HintPanel() {
  const { gameState, isUserTurn } = useGame()

  if (!gameState || !isUserTurn) {
    return null
  }

  // Simple hint logic based on game state
  const getHint = () => {
    const player = gameState.players[0]!
    const potOdds = gameState.highestBet > 0 
      ? (gameState.highestBet - player.currentBet) / (gameState.pots[0]?.amount || 0)
      : 0

    if (player.hole.length === 2) {
      const [card1, card2] = player.hole
      const isPair = card1.rank === card2.rank
      const highCards = ['A', 'K', 'Q', 'J']
      const hasHighCard = highCards.includes(card1.rank) || highCards.includes(card2.rank)

      if (isPair) {
        return "You have a pocket pair! Consider raising to build the pot."
      } else if (hasHighCard) {
        return "High cards can be strong. Consider the position and betting action."
      } else if (potOdds < 0.3) {
        return "The pot odds are favorable. Consider calling if you have drawing potential."
      }
    }

    return "Play tight and aggressive. Fold weak hands, bet strong hands."
  }

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-4 top-24 bg-bg-table border border-border-dim rounded-lg p-4 max-w-xs shadow-xl"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-2">Hint</h3>
      <p className="text-sm text-text-secondary">{getHint()}</p>
    </motion.div>
  )
}