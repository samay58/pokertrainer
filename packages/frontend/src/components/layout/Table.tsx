import { useGame } from '@hooks/useGame'
import Seat from './Seat'
import CommunityCards from '../atoms/CommunityCards'
import PotDisplay from '../atoms/PotDisplay'
import DealerButton from '../atoms/DealerButton'

export default function Table() {
  const { gameState } = useGame()

  if (!gameState) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  // For 2 players, position them at top and bottom of table
  const seatPositions = [
    { top: '10%', left: '50%', transform: 'translateX(-50%)' }, // Top center
    { bottom: '10%', left: '50%', transform: 'translateX(-50%)' }, // Bottom center
  ]

  return (
    <div className="relative w-full max-w-4xl aspect-[16/10]">
      {/* Table Felt */}
      <div className="absolute inset-0 table-felt rounded-[120px] shadow-2xl">
        {/* Table Edge */}
        <div className="absolute inset-4 border-4 border-amber-900 rounded-[100px] shadow-inner" />
        
        {/* Center Area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {/* Pot Display */}
          <PotDisplay pots={gameState.pots} />
          
          {/* Community Cards */}
          <CommunityCards cards={gameState.community} />
        </div>

        {/* Dealer Button */}
        <DealerButton 
          dealerIndex={gameState.dealer} 
          positions={seatPositions} 
        />

        {/* Player Seats */}
        {gameState.players.map((player, index) => (
          <div
            key={player.id}
            className="absolute"
            style={seatPositions[index]}
          >
            <Seat 
              player={player} 
              isActive={gameState.toAct === index}
              isDealer={gameState.dealer === index}
              position={index === 0 ? 'top' : 'bottom'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}