import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export interface LeaderboardEntry {
  address: string;
  clicks: number;
  stake: string;
  score: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const sortedEntries = [...entries].sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <Card data-testid="card-leaderboard">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-2 pb-2 border-b text-sm font-semibold text-muted-foreground">
            <div>Rank</div>
            <div className="col-span-2">Player</div>
            <div className="text-right">Clicks</div>
            <div className="text-right">Score</div>
          </div>
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-players">
              No players yet
            </div>
          ) : (
            sortedEntries.map((entry, index) => (
              <div
                key={entry.address}
                className={`grid grid-cols-5 gap-2 py-2 ${entry.isCurrentUser ? 'bg-primary/10 rounded-md px-2 -mx-2' : ''}`}
                data-testid={`row-player-${index}`}
              >
                <div className="font-bold">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className="col-span-2 font-mono text-sm" data-testid={`text-address-${index}`}>
                  {truncateAddress(entry.address)}
                </div>
                <div className="text-right font-mono" data-testid={`text-clicks-${index}`}>
                  {entry.clicks}
                </div>
                <div className="text-right font-mono font-bold" data-testid={`text-score-${index}`}>
                  {entry.score.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
