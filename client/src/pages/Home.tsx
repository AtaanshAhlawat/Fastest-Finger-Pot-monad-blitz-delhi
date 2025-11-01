import { useState, useEffect } from "react";
import WalletButton from "@/components/WalletButton";
import NetworkBadge from "@/components/NetworkBadge";
import GameStatusCard from "@/components/GameStatusCard";
import ClickButton from "@/components/ClickButton";
import StakeEntry from "@/components/StakeEntry";
import Leaderboard, { type LeaderboardEntry } from "@/components/Leaderboard";
import WinnerDisplay from "@/components/WinnerDisplay";

type RoundStatus = "Waiting" | "Active" | "Ended";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
  const [roundStatus, setRoundStatus] = useState<RoundStatus>("Waiting");
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [userClicks, setUserClicks] = useState(0);
  const [userStake, setUserStake] = useState<string | undefined>(undefined);
  
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([
    { address: "0x1234567890abcdef1234567890abcdef12345678", clicks: 75, stake: "0.3", score: 22.5 },
    { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", clicks: 92, stake: "0.2", score: 18.4 },
    { address: "0x9876543210fedcba9876543210fedcba98765432", clicks: 68, stake: "0.25", score: 17.0 },
  ]);

  const potSize = leaderboardEntries.reduce((sum, e) => sum + parseFloat(e.stake), userStake ? parseFloat(userStake) : 0).toFixed(2);

  useEffect(() => {
    if (roundStatus === "Active" && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (roundStatus === "Active" && timeRemaining === 0) {
      setRoundStatus("Ended");
    }
  }, [roundStatus, timeRemaining]);

  const handleConnect = () => {
    console.log("Connecting wallet...");
    setWalletConnected(true);
  };

  const handleDisconnect = () => {
    console.log("Disconnecting wallet...");
    setWalletConnected(false);
    setUserStake(undefined);
    setUserClicks(0);
  };

  const handleJoinRound = (stake: string) => {
    console.log("Joining round with stake:", stake);
    setUserStake(stake);
    if (roundStatus === "Waiting") {
      setRoundStatus("Active");
      setTimeRemaining(15);
    }
  };

  const handleClick = () => {
    if (roundStatus === "Active" && userStake) {
      setUserClicks(prev => prev + 1);
      console.log("Click registered!");
    }
  };

  const handleNewRound = () => {
    console.log("Starting new round...");
    setRoundStatus("Waiting");
    setTimeRemaining(15);
    setUserClicks(0);
    setUserStake(undefined);
    setLeaderboardEntries([
      { address: "0x1234567890abcdef1234567890abcdef12345678", clicks: 75, stake: "0.3", score: 22.5 },
      { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", clicks: 92, stake: "0.2", score: 18.4 },
    ]);
  };

  const currentLeaderboard: LeaderboardEntry[] = userStake
    ? [
        ...leaderboardEntries,
        {
          address: userAddress,
          clicks: userClicks,
          stake: userStake,
          score: userClicks * parseFloat(userStake),
          isCurrentUser: true,
        },
      ]
    : leaderboardEntries;

  const winner = roundStatus === "Ended" && currentLeaderboard.length > 0
    ? currentLeaderboard.reduce((max, entry) => (entry.score > max.score ? entry : max))
    : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" data-testid="text-app-title">⚡ Fastest Finger Pot</h1>
              <NetworkBadge network="Monad Testnet" connected={walletConnected} />
            </div>
            <WalletButton
              connected={walletConnected}
              address={userAddress}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <GameStatusCard
              timeRemaining={timeRemaining}
              potSize={potSize}
              status={roundStatus}
              playerCount={currentLeaderboard.length}
            />

            {!walletConnected && (
              <div className="text-center p-8 border rounded-lg bg-card" data-testid="card-connect-prompt">
                <p className="text-lg text-muted-foreground">
                  Connect your wallet to join the game
                </p>
              </div>
            )}

            {walletConnected && roundStatus !== "Ended" && (
              <StakeEntry
                onJoin={handleJoinRound}
                disabled={roundStatus === "Active"}
                currentStake={userStake}
              />
            )}

            {walletConnected && userStake && roundStatus !== "Ended" && (
              <div className="flex justify-center py-8">
                <ClickButton
                  disabled={roundStatus !== "Active"}
                  clicks={userClicks}
                  onClick={handleClick}
                />
              </div>
            )}

            {roundStatus === "Ended" && winner && (
              <WinnerDisplay
                winnerAddress={winner.address}
                winningScore={winner.score}
                payout={potSize}
                onNewRound={handleNewRound}
              />
            )}
          </div>

          <div>
            <Leaderboard entries={currentLeaderboard} />
          </div>
        </div>
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for hackathons • Minimal Web3 dApp Template</p>
        </div>
      </footer>
    </div>
  );
}
