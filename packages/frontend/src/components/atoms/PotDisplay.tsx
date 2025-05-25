import { Pot } from '@poker-trainer/shared-types'
import { motion, AnimatePresence } from 'framer-motion'

interface PotDisplayProps {
  pots: readonly Pot[]
}

export default function PotDisplay({ pots }: PotDisplayProps) {
  const totalPot = pots.reduce((sum, pot) => sum + pot.amount, 0)

  if (totalPot === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="flex flex-col items-center gap-2"
      >
        {/* Main Pot Display */}
        <motion.div
          className="bg-gold-pot/20 border-2 border-gold-pot rounded-full px-6 py-3"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.3)',
              '0 0 40px rgba(255, 215, 0, 0.5)',
              '0 0 20px rgba(255, 215, 0, 0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <div className="text-xs text-gold-pot uppercase tracking-wider">Pot</div>
            <div className="text-2xl font-bold text-white">${totalPot}</div>
          </div>
        </motion.div>

        {/* Side Pots */}
        {pots.length > 1 && (
          <div className="flex gap-2">
            {pots.map((pot, index) => (
              <motion.div
                key={index}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-table/80 border border-border-dim rounded-lg px-3 py-1"
              >
                <div className="text-xs text-text-secondary">
                  {index === 0 ? 'Main' : `Side ${index}`}: ${pot.amount}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}