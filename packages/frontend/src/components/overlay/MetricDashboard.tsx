import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SessionStats {
  handsPlayed: number
  vpip: number // Voluntarily Put money In Pot
  pfr: number  // Pre-Flop Raise
  af: number   // Aggression Factor
  wtsd: number // Went To ShowDown
  winRate: number
}

export default function MetricDashboard() {
  const [stats, setStats] = useState<SessionStats>({
    handsPlayed: 0,
    vpip: 0,
    pfr: 0,
    af: 0,
    wtsd: 0,
    winRate: 0
  })

  // In a real app, these would be calculated from hand history
  useEffect(() => {
    // Simulate some stats
    setStats({
      handsPlayed: 42,
      vpip: 28.5,
      pfr: 22.3,
      af: 2.8,
      wtsd: 45.2,
      winRate: 52.3
    })
  }, [])

  const StatCard = ({ label, value, suffix = '%' }: { label: string; value: number; suffix?: string }) => (
    <div className="bg-bg-surface rounded-lg p-3">
      <div className="text-xs text-text-secondary uppercase">{label}</div>
      <div className="text-xl font-bold text-text-primary">
        {value.toFixed(1)}{suffix}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-4 top-24 bg-bg-table border border-border-dim rounded-lg p-4 w-80 shadow-xl"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-4">Session Statistics</h3>
      
      <div className="space-y-4">
        <div className="text-sm text-text-secondary">
          Hands Played: <span className="text-text-primary font-semibold">{stats.handsPlayed}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="VPIP" value={stats.vpip} />
          <StatCard label="PFR" value={stats.pfr} />
          <StatCard label="AF" value={stats.af} suffix="" />
          <StatCard label="WTSD" value={stats.wtsd} />
        </div>

        <div className="border-t border-border-dim pt-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Win Rate</span>
            <span className={`text-xl font-bold ${stats.winRate >= 50 ? 'text-green-action' : 'text-red-action'}`}>
              {stats.winRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}