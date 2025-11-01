import GameStatusCard from '../GameStatusCard';

export default function GameStatusCardExample() {
  return (
    <GameStatusCard
      timeRemaining={12}
      potSize="1.5"
      status="Active"
      playerCount={5}
    />
  );
}
