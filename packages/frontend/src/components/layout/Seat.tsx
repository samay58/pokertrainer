import { PlayerState, PlayerStatus } from '@poker-trainer/shared-types'
import Card3D from '../atoms/Card3D'
import ChipStack from '../atoms/ChipStack'
import { motion } from 'framer-motion'

interface SeatProps {
  player: PlayerState
  isActive: boolean
  isDealer: boolean
  position: 'top' | 'bottom'
}

export default function Seat({ player, isActive }: SeatProps) {
  const isUser = player.id === 'player-0'
  const isFolded = player.status === PlayerStatus.FOLDED
  const isAllIn = player.status === PlayerStatus.ALL_IN

  return (
    <motion.div
      className={`relative flex flex-col items-center gap-2 ${
        isActive ? 'player-glow' : ''
      }`}
      animate={{ scale: isActive ? 1.05 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Player Info */}
      <div className={`bg-bg-table border border-border-dim rounded-lg px-4 py-2 min-w-[150px] ${
        isFolded ? 'opacity-50' : ''
      }`}>
        <div className="text-center">
          <div className="text-sm text-text-secondary">
            {isUser ? 'You' : 'Opponent'}
          </div>
          <div className="text-lg font-semibold text-text-primary">
            ${player.stack}
          </div>
          {isAllIn && (
            <div className="text-xs text-red-action font-semibold">ALL IN</div>
          )}
        </div>
      </div>

      {/* Current Bet */}
      {player.currentBet > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -bottom-16"
        >
          <ChipStack amount={player.currentBet} />
        </motion.div>
      )}

      {/* Hole Cards */}
      <div className="flex gap-1 mt-2">
        {player.hole.length === 2 ? (
          player.hole.map((card, index) => (
            <Card3D
              key={index}
              card={card}
              faceUp={isUser || player.status === PlayerStatus.ALL_IN}
              size="small"
            />
          ))
        ) : (
          // Placeholder for no cards
          <div className="w-20 h-28" />
        )}
      </div>

      {/* Status Badge */}
      {isFolded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-action/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
            FOLDED
          </div>
        </div>
      )}
    </motion.div>
  )
}