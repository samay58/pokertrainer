import { Card, Suit } from '@poker-trainer/shared-types'
import { motion } from 'framer-motion'

interface Card3DProps {
  card: Card
  faceUp?: boolean
  size?: 'small' | 'medium' | 'large'
  delay?: number
}

export default function Card3D({ card, faceUp = true, size = 'medium', delay = 0 }: Card3DProps) {
  const sizeClasses = {
    small: 'w-12 h-16 text-sm',
    medium: 'w-16 h-24 text-base',
    large: 'w-20 h-28 text-lg'
  }

  const suitSymbols: Record<Suit, string> = {
    's': '♠',
    'h': '♥',
    'd': '♦',
    'c': '♣'
  }

  const suitColors: Record<Suit, string> = {
    's': 'text-black',
    'h': 'text-red-500',
    'd': 'text-red-500',
    'c': 'text-black'
  }

  return (
    <motion.div
      className="card-3d"
      initial={{ rotateY: 180, scale: 0.8 }}
      animate={{ rotateY: faceUp ? 0 : 180, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 180, 
        damping: 20,
        delay 
      }}
    >
      <div className={`relative ${sizeClasses[size]} preserve-3d`}>
        {/* Card Front */}
        <div className={`absolute inset-0 rounded-lg bg-white shadow-card flex flex-col items-center justify-center font-bold backface-hidden ${
          faceUp ? '' : 'rotate-y-180'
        }`}>
          <div className={suitColors[card.suit]}>
            <div>{card.rank}</div>
            <div className="text-2xl">{suitSymbols[card.suit]}</div>
          </div>
        </div>

        {/* Card Back */}
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br from-blue-800 to-blue-900 shadow-card backface-hidden ${
          faceUp ? 'rotate-y-180' : ''
        }`}>
          <div className="absolute inset-2 border-2 border-blue-600 rounded-md" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-blue-600 text-xl font-bold">PT</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}