import { Card } from '@poker-trainer/shared-types'
import Card3D from './Card3D'
import { motion } from 'framer-motion'

interface CommunityCardsProps {
  cards: readonly Card[]
}

export default function CommunityCards({ cards }: CommunityCardsProps) {
  return (
    <div className="flex gap-2">
      {/* Show 5 card slots, filled with actual cards or placeholders */}
      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {cards[index] ? (
            <Card3D card={cards[index]!} size="medium" delay={index * 0.1} />
          ) : (
            <div className="w-16 h-24 bg-bg-table/50 border-2 border-border-dim border-dashed rounded-lg" />
          )}
        </motion.div>
      ))}
    </div>
  )
}