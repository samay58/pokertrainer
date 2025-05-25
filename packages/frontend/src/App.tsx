import { useState } from 'react'
import { GameProvider } from '@hooks/useGame'
import Table from '@components/layout/Table'
import ActionBar from '@components/overlay/ActionBar'
import HintPanel from '@components/overlay/HintPanel'
import MetricDashboard from '@components/overlay/MetricDashboard'
import DebugPanel from '@components/atoms/DebugPanel'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [showHints, setShowHints] = useState(true)

  return (
    <GameProvider>
      <div className="min-h-screen bg-bg-surface flex flex-col">
        {/* Header */}
        <header className="bg-bg-table border-b border-border-dim px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-text-primary">
              Poker Trainer
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHints(!showHints)}
                className="btn-secondary text-sm"
              >
                {showHints ? 'Hide' : 'Show'} Hints
              </button>
              <button
                onClick={() => setShowDashboard(!showDashboard)}
                className="btn-secondary text-sm"
              >
                {showDashboard ? 'Hide' : 'Show'} Stats
              </button>
            </div>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="flex-1 relative overflow-hidden">
          <div className="h-full flex items-center justify-center p-8">
            <Table />
          </div>

          {/* Action Bar - Fixed at bottom */}
          <ActionBar />

          {/* Overlays */}
          {showHints && <HintPanel />}
          {showDashboard && <MetricDashboard />}
          <DebugPanel />
        </main>
      </div>
    </GameProvider>
  )
}

export default App