import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, PartyPopper } from "lucide-react";

interface WinnerDisplayProps {
  winnerAddress: string;
  winningScore: number;
  payout: string;
  onNewRound: () => void;
}

export default function WinnerDisplay({ winnerAddress, winningScore, payout, onNewRound }: WinnerDisplayProps) {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="border-primary border-2" data-testid="card-winner">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <PartyPopper className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">Winner!</CardTitle>
        <CardDescription>Round has ended</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="font-mono text-xl font-bold" data-testid="text-winner-address">
              {truncateAddress(winnerAddress)}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            Winning Score: <span className="font-mono font-bold" data-testid="text-winning-score">{winningScore.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center border-t pt-6">
          <div className="text-sm text-muted-foreground mb-1">Payout</div>
          <div className="text-4xl font-bold font-mono text-primary" data-testid="text-payout">
            {payout} ETH
          </div>
        </div>

        <Button
          onClick={onNewRound}
          className="w-full"
          size="lg"
          data-testid="button-new-round"
        >
          Start New Round
        </Button>
      </CardContent>
    </Card>
  );
}
