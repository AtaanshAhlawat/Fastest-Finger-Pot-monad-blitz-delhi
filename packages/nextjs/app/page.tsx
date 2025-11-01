"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address, EtherInput } from "~~/components/scaffold-eth";
import {
  useScaffoldReadContract,
  useScaffoldWatchContractEvent,
  useScaffoldWriteContract,
} from "~~/hooks/scaffold-eth";

const Home = () => {
  const { address: connectedAddress } = useAccount();

  // Game state
  const [stakeAmount, setStakeAmount] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [playerClicks, setPlayerClicks] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [optimisticClicks, setOptimisticClicks] = useState(0); // For instant UI updates

  // Read contract data
  const { data: roundActive } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "roundActive",
    watch: true,
  });

  const { data: potSize } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "potSize",
    watch: true,
  });

  const { data: roundNumber } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "currentRoundNumber",
    watch: true,
  });

  const { data: winner } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "currentWinner",
    watch: true,
  });

  const { data: timeLeft } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "getTimeRemaining",
    watch: true,
  });

  const { data: playerData } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "getPlayerData",
    args: [connectedAddress],
    watch: true,
  });

  const { data: playerScore } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "getPlayerScore",
    args: [connectedAddress],
    watch: true,
  });

  const { data: allPlayers } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "getCurrentRoundPlayers",
    watch: true,
  });

  const { data: lastRoundWinner } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "lastRoundWinner",
    watch: true,
  });

  const { data: canClaimInactivity } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "canClaimInactivityPayout",
    watch: true,
  });

  const { data: timeUntilInactivityPayout } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "getTimeUntilInactivityPayout",
    watch: true,
  });

  const { writeContractAsync: claimInactivityPayout } = useScaffoldWriteContract("FastestFingerPot");


  // Write functions
  const { writeContractAsync: joinRound, isMining: isJoining } = useScaffoldWriteContract("FastestFingerPot");

  const { writeContractAsync: click, isMining: isClicking } = useScaffoldWriteContract("FastestFingerPot");

  const { writeContractAsync: endRound } = useScaffoldWriteContract("FastestFingerPot");

  // Watch events
  useScaffoldWatchContractEvent({
    contractName: "FastestFingerPot",
    eventName: "PlayerJoined",
    onLogs: logs => {
      console.log("Player joined:", logs);
      setHasJoined(true);
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "FastestFingerPot",
    eventName: "PlayerClicked",
    onLogs: logs => {
      console.log("Player clicked:", logs);
      // Reset optimistic clicks and sync with contract
      setOptimisticClicks(0);
      if (playerData) {
        setPlayerClicks(Number(playerData.clicks));
      }
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "FastestFingerPot",
    eventName: "RoundStarted",
    onLogs: logs => {
      console.log("New round started:", logs);
      setHasJoined(false);
      setPlayerClicks(0);
      setStakeAmount("");
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "FastestFingerPot",
    eventName: "RoundEnded",
    onLogs: logs => {
      console.log("Round ended:", logs);
      // Reset player state for next round
      setHasJoined(false);
      setPlayerClicks(0);
      setStakeAmount("");
    },
  });

  // Update time remaining from contract
  useEffect(() => {
    if (timeLeft !== undefined && roundActive) {
      const timeLeftNum = Number(timeLeft);
      setTimeRemaining(timeLeftNum);
      console.log("Time remaining updated from contract:", timeLeftNum);
    }
  }, [timeLeft, roundActive]);

  // Real-time countdown timer
  useEffect(() => {
    if (!roundActive) {
      setTimeRemaining(0);
      return;
    }
    
    if (timeRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [roundActive, timeLeft, timeRemaining]); // Re-initialize when contract timeLeft changes

  // Update player data
  useEffect(() => {
    if (playerData) {
      const wasJoined = playerData.hasJoined;
      setHasJoined(wasJoined);
      const actualClicks = Number(playerData.clicks);
      setPlayerClicks(actualClicks);
      // Reset optimistic clicks when contract data updates
      setOptimisticClicks(0);

      // If player data shows not joined but we thought we were joined,
      // it means a new round started - reset state
      if (!wasJoined && hasJoined) {
        setStakeAmount("");
        setOptimisticClicks(0);
      }
    } else if (connectedAddress) {
      // No player data means not joined to current round
      setHasJoined(false);
      setPlayerClicks(0);
      setOptimisticClicks(0);
      // Don't reset stake amount here - let user keep their input if they want to join
    }
  }, [playerData, connectedAddress, hasJoined]);

  // Removed auto-executing transactions - user must click buttons manually

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleJoinRound = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert("Please enter a valid stake amount");
      return;
    }
    const stakeInWei = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));
    try {
      await joinRound(
        {
          functionName: "joinRound",
          value: stakeInWei,
        },
        {
          onBlockConfirmation: () => {
            console.log("Join transaction confirmed!");
            setHasJoined(true);
            // Force a refresh of time remaining after joining
            if (timeLeft !== undefined) {
              setTimeRemaining(Number(timeLeft));
            }
          },
        },
      );
      setStakeAmount("");
    } catch (error) {
      console.error("Failed to join round:", error);
    }
  };

  const formatScore = (score: bigint) => {
    return (Number(score) / 1e18).toFixed(2);
  };

  const formatPot = (pot: bigint) => {
    return (Number(pot) / 1e18).toFixed(4);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 px-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            🎮 Fastest Finger Pot 🎮
          </h1>
          <p className="text-xl text-gray-600">Click your way to victory on Monad!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
            <div className="text-sm text-gray-600 mb-1">Round #{roundNumber?.toString() || "1"}</div>
            <div className="text-3xl font-bold text-blue-600">{roundActive ? "🟢 ACTIVE" : "🔴 ENDED"}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-300">
            <div className="text-sm text-gray-600 mb-1">Pot Size</div>
            <div className="text-3xl font-bold text-purple-600">{potSize ? formatPot(potSize) : "0.0000"} MON</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-300">
            <div className="text-sm text-gray-600 mb-1">Time Remaining</div>
            <div className="text-3xl font-bold text-orange-600">{formatTime(timeRemaining)}</div>
          </div>
        </div>

        {/* Winner Display */}
        {winner && winner !== "0x0000000000000000000000000000000000000000" && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg mb-8 w-full max-w-4xl">
            <div className="text-center text-white font-bold text-xl">
              🏆 Last Winner: <Address address={winner} />
            </div>
          </div>
        )}

        {/* Inactivity Timer - Show when no players have joined */}
        {roundActive && (!allPlayers || allPlayers.length === 0) && timeUntilInactivityPayout && Number(timeUntilInactivityPayout) > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-300 mb-8 w-full max-w-4xl">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">⏰ Waiting for players to join...</div>
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {formatTime(Number(timeUntilInactivityPayout))} until auto-payout
              </div>
              {lastRoundWinner && lastRoundWinner !== "0x0000000000000000000000000000000000000000" && (
                <div className="text-sm text-gray-500">
                  If no one joins, previous winner <Address address={lastRoundWinner} /> will get the pot
                </div>
              )}
              {canClaimInactivity && (
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => claimInactivityPayout({ functionName: "claimInactivityPayout" })}
                >
                  Claim Inactivity Payout
                </button>
              )}
            </div>
          </div>
        )}

        {/* Player Info */}
        {connectedAddress && (
          <div className="bg-white p-6 rounded-xl border-2 border-gray-300 mb-8 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <div className="text-2xl font-bold">{hasJoined ? "✅ Joined" : "❌ Not Joined"}</div>
              </div>
              {hasJoined && playerData && (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Your Stake</div>
                  <div className="text-2xl font-bold text-green-600">{formatPot(playerData.stake)} MON</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Your Clicks</div>
                <div className="text-2xl font-bold">
                  {playerClicks + optimisticClicks}
                  {optimisticClicks > 0 && (
                    <span className="text-sm text-green-500 ml-2">(+{optimisticClicks})</span>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Your Score</div>
                <div className="text-2xl font-bold">{playerScore ? formatScore(playerScore) : "0.00"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Join Section */}
        {connectedAddress && !hasJoined && roundActive && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-400 shadow-lg mb-8 w-full max-w-4xl">
            <h2 className="text-3xl font-bold mb-2 text-center text-green-700">🎮 Join the Round!</h2>
            <p className="text-center text-gray-600 mb-6">Enter your stake amount to participate in the current round</p>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stake Amount (MON)</label>
                <EtherInput value={stakeAmount} onChange={setStakeAmount} placeholder="e.g., 0.1 MON" />
              </div>
              <button
                className="btn btn-primary btn-lg px-8 py-3 text-lg font-bold"
                onClick={handleJoinRound}
                disabled={isJoining || !roundActive || !stakeAmount || parseFloat(stakeAmount) <= 0}
              >
                {isJoining ? "⏳ Joining..." : "🚀 Join Round"}
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              💡 Tip: Higher stake = More points per click = Better chance to win!
            </p>
          </div>
        )}

        {/* Cannot join when round not active */}
        {connectedAddress && !hasJoined && !roundActive && (
          <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl mb-8 w-full max-w-4xl">
            <p className="text-center text-gray-700 text-lg">
              ⏸️ Round is not active. Waiting for the next round to start...
            </p>
          </div>
        )}

        {/* End Round Button - Show when round has ended but not yet ended manually */}
        {connectedAddress && roundActive && timeRemaining === 0 && (
          <div className="mb-8 w-full max-w-4xl">
            <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl mb-4">
              <p className="text-center text-gray-700 text-lg mb-4">
                Round time is up! Click below to end the round and determine the winner.
              </p>
              <button
                className="btn btn-lg w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none"
                onClick={() => endRound({ functionName: "endRound" })}
              >
                End Round & Determine Winner
              </button>
            </div>
          </div>
        )}

        {/* Debug Info - Remove after testing */}
        {connectedAddress && (
          <div className="text-xs text-gray-400 mb-2">
            Debug: hasJoined={hasJoined ? "true" : "false"}, roundActive={roundActive ? "true" : "false"}, 
            timeRemaining={timeRemaining}, timeLeft={timeLeft ? Number(timeLeft).toString() : "undefined"}
          </div>
        )}

        {/* Click Button - Show if joined and round is active */}
        {connectedAddress && hasJoined && roundActive && (timeRemaining > 0 || (timeLeft && Number(timeLeft) > 0)) && (
          <div className="mb-8 w-full max-w-4xl">
            <button
              className="btn btn-lg w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none text-4xl py-12 rounded-xl shadow-lg transform transition-all active:scale-95"
              onClick={async () => {
                // Optimistically update the click count immediately
                setOptimisticClicks(prev => prev + 1);
                try {
                  await click({ functionName: "click" });
                } catch (error) {
                  // Revert optimistic update on error
                  setOptimisticClicks(prev => Math.max(0, prev - 1));
                  console.error("Click failed:", error);
                }
              }}
              disabled={isClicking || !roundActive || timeRemaining === 0}
            >
              {isClicking ? "⏳ Clicking..." : "⚡ CLICK ME! ⚡"}
            </button>
            <div className="text-center mt-4 text-gray-600">Higher stake = More points per click!</div>
          </div>
        )}

        {/* Waiting for next round message */}
        {connectedAddress && hasJoined && !roundActive && (
          <div className="mb-8 w-full max-w-4xl">
            <div className="bg-blue-50 border-2 border-blue-300 p-6 rounded-xl">
              <p className="text-center text-gray-700 text-lg">
                Round has ended! Waiting for the next round to start...
              </p>
            </div>
          </div>
        )}

        {/* Players Leaderboard */}
        <div className="bg-white p-6 rounded-xl border-2 border-blue-300 w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Current Round Leaderboard</h2>
          {!allPlayers || allPlayers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No players yet. Be the first to join!</div>
          ) : (
            <LeaderboardTable players={allPlayers} />
          )}
        </div>

        {/* Connection Status */}
        {!connectedAddress && (
          <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl mt-8 w-full max-w-2xl">
            <p className="text-center text-gray-700 text-lg">
              Connect your wallet to play! Make sure you&apos;re on Monad Testnet.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 text-center text-gray-600 max-w-2xl">
          <h3 className="text-xl font-bold mb-2">How to Play</h3>
          <ol className="text-left list-decimal list-inside space-y-1">
            <li>Join a round by staking MON tokens</li>
            <li>Click as fast as you can during the 15-second round</li>
            <li>Highest score (clicks × stake) wins the entire pot!</li>
            <li>Winner is automatically paid when the round ends</li>
          </ol>
        </div>
      </div>
    </>
  );
};

// Leaderboard Table Component
const LeaderboardTable = ({ players }: { players: readonly string[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-2">Rank</th>
            <th className="text-left p-2">Player</th>
            <th className="text-right p-2">Clicks</th>
            <th className="text-right p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <PlayerRow key={player} player={player} rank={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Player Row Component
const PlayerRow = ({ player, rank }: { player: string; rank: number }) => {
  const { data: playerData } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "getPlayerData",
    args: [player],
    watch: true,
  });

  const { data: playerScore } = useScaffoldReadContract({
    contractName: "FastestFingerPot",
    functionName: "getPlayerScore",
    args: [player],
    watch: true,
  });

  const formatScore = (score: bigint) => {
    return (Number(score) / 1e18).toFixed(2);
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="p-3 font-bold text-lg">{getRankEmoji(rank)}</td>
      <td className="p-3">
        <Address address={player} />
      </td>
      <td className="p-3 text-right font-semibold">{playerData ? Number(playerData.clicks) : 0}</td>
      <td className="p-3 text-right font-bold text-green-600">{playerScore ? formatScore(playerScore) : "0.00"}</td>
    </tr>
  );
};

export default Home;
