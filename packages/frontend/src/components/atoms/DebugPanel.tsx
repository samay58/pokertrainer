import { useGame } from '@hooks/useGame'

export default function DebugPanel() {
  const { gameState } = useGame()

  if (!gameState) return null

  return (
    <div className="absolute top-4 right-4 bg-bg-table/90 backdrop-blur border border-border-dim rounded-lg p-4 text-xs font-mono">
      <h3 className="text-text-primary font-bold mb-2">Debug Info</h3>
      <div className="space-y-1 text-text-secondary">
        <div>Stage: {gameState.stage}</div>
        <div>To Act: Player {gameState.toAct}</div>
        <div>Highest Bet: ${gameState.highestBet}</div>
        <div>Min Raise: ${gameState.minRaise}</div>
        <div>Last Aggressor: {gameState.lastAggressor >= 0 ? `Player ${gameState.lastAggressor}` : 'None'}</div>
        <div>Actions This Round: {gameState.numActionsThisRound}</div>
        <div>Pots: {gameState.pots.map(p => `$${p.amount}`).join(', ') || 'None'}</div>
        <div className="mt-2">Players:</div>
        {gameState.players.map((p, i) => (
          <div key={p.id} className="ml-2">
            P{i}: ${p.stack} | Bet: ${p.currentBet} | {p.status}
          </div>
        ))}
        <div className="mt-2">History: {gameState.handHistory.length} actions</div>
      </div>
    </div>
  )
}