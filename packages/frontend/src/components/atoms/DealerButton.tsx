import { motion } from 'framer-motion'

interface DealerButtonProps {
  dealerIndex: number
  positions: Array<{ top?: string; bottom?: string; left?: string; transform?: string }>
}

export default function DealerButton({ dealerIndex, positions }: DealerButtonProps) {
  const position = positions[dealerIndex]
  
  if (!position) return null

  // Adjust position to be near the player
  const adjustedPosition = {
    ...position,
    ...(position.top ? { top: `calc(${position.top} + 60px)` } : {}),
    ...(position.bottom ? { bottom: `calc(${position.bottom} + 60px)` } : {})
  }

  return (
    <motion.div
      className="absolute w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-black border-2 border-gray-300"
      style={adjustedPosition}
      animate={adjustedPosition}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      D
    </motion.div>
  )
}