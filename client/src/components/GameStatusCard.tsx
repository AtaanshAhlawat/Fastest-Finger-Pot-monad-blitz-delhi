import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, Coins } from "lucide-react";

type RoundStatus = "Waiting" | "Active" | "Ended";

interface GameStatusCardProps {
  timeRemaining: number;
  potSize: string;
  status: RoundStatus;
  playerCount: number;
}

export default function GameStatusCard({ timeRemaining, potSize, status, playerCount }: GameStatusCardProps) {
  const getStatusColor = (status: RoundStatus) => {
    switch (status) {
      case "Active":
        return "bg-green-500 text-white";
      case "Ended":
        return "bg-red-500 text-white";
      default:
        return "bg-yellow-500 text-white";
    }
  };

  return (
    <Card data-testid="card-game-status">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Round Status</span>
          <Badge className={getStatusColor(status)} data-testid={`badge-status-${status.toLowerCase()}`}>
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="h-5 w-5" />
            <span className="text-sm font-medium">Time Remaining</span>
          </div>
          <div className="text-7xl font-bold font-mono" data-testid="text-timer">
            {timeRemaining}s
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 border-t pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-5 w-5" />
            <span className="text-sm font-medium">Total Pot</span>
          </div>
          <div className="text-4xl font-bold font-mono" data-testid="text-pot">
            {potSize} ETH
          </div>
          <div className="text-sm text-muted-foreground" data-testid="text-player-count">
            {playerCount} {playerCount === 1 ? 'player' : 'players'} entered
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
