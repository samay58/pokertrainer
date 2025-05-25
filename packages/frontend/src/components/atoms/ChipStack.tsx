import { motion } from 'framer-motion'

interface ChipStackProps {
  amount: number
  size?: 'small' | 'medium' | 'large'
}

export default function ChipStack({ amount, size = 'medium' }: ChipStackProps) {
  const formatAmount = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  // Calculate chip denominations
  const chips: { value: number; color: string; count: number }[] = []
  let remaining = amount

  const denominations = [
    { value: 1000, color: 'bg-yellow-500' },
    { value: 500, color: 'bg-purple-500' },
    { value: 100, color: 'bg-black' },
    { value: 50, color: 'bg-blue-500' },
    { value: 25, color: 'bg-green-500' },
    { value: 5, color: 'bg-red-500' },
    { value: 1, color: 'bg-white' }
  ]

  for (const denom of denominations) {
    const count = Math.floor(remaining / denom.value)
    if (count > 0) {
      chips.push({ ...denom, count: Math.min(count, 5) }) // Max 5 chips per denomination for visual
      remaining -= count * denom.value
    }
  }

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base'
  }

  return (
    <motion.div 
      className="relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {/* Chip Stack Visual */}
      <div className="relative">
        {chips.map((chip, chipIndex) => (
          <div key={chipIndex} className="relative">
            {Array.from({ length: chip.count }).map((_, stackIndex) => (
              <motion.div
                key={stackIndex}
                className={`absolute ${sizeClasses[size]} ${chip.color} rounded-full chip-stack border-2 border-gray-700`}
                style={{
                  bottom: `${(chipIndex * 3 + stackIndex * 2)}px`,
                  zIndex: chipIndex * 10 + stackIndex
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: chipIndex * 0.05 + stackIndex * 0.02 }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Amount Label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-bg-table px-2 py-1 rounded text-text-primary font-semibold whitespace-nowrap">
        ${formatAmount(amount)}
      </div>
    </motion.div>
  )
}