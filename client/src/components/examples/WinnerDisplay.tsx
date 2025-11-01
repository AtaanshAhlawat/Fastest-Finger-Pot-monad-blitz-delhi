import WinnerDisplay from '../WinnerDisplay';

export default function WinnerDisplayExample() {
  return (
    <WinnerDisplay
      winnerAddress="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
      winningScore={44.5}
      payout="1.5"
      onNewRound={() => {
        console.log('Starting new round...');
      }}
    />
  );
}
