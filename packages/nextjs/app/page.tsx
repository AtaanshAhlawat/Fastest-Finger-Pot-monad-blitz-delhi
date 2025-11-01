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

  // Update time remaining
  useEffect(() => {
    if (timeLeft) {
      setTimeRemaining(Number(timeLeft));
    }
  }, [timeLeft]);

  // Update player data
  useEffect(() => {
    if (playerData) {
      const wasJoined = playerData.hasJoined;
      setHasJoined(wasJoined);
      setPlayerClicks(Number(playerData.clicks));

      // If player data shows not joined but we thought we were joined,
      // it means a new round started - reset state
      if (!wasJoined && hasJoined) {
        setStakeAmount("");
      }
    } else if (connectedAddress) {
      // No player data means not joined to current round
      setHasJoined(false);
      setPlayerClicks(0);
      // Don't reset stake amount here - let user keep their input if they want to join
    }
  }, [playerData, connectedAddress, hasJoined]);

  // Auto-end round when time is up
  useEffect(() => {
    if (timeRemaining === 0 && roundActive) {
      const timer = setTimeout(() => {
        endRound({ functionName: "endRound" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, roundActive, endRound]);

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
    await joinRound(
      {
        functionName: "joinRound",
        value: stakeInWei,
      },
      {
        onBlockConfirmation: () => setHasJoined(true),
      },
    );
    setStakeAmount("");
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
                <div className="text-2xl font-bold">{playerClicks}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Your Score</div>
                <div className="text-2xl font-bold">{playerScore ? formatScore(playerScore) : "0.00"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Join Section */}
        {connectedAddress && !hasJoined && (
          <div className="bg-white p-6 rounded-xl border-2 border-green-300 mb-8 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Join the Round</h2>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow">
                <EtherInput value={stakeAmount} onChange={setStakeAmount} placeholder="Enter stake amount in MON" />
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleJoinRound} disabled={isJoining || !roundActive}>
                {isJoining ? "Joining..." : "Join Round"}
              </button>
            </div>
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

        {/* Click Button */}
        {connectedAddress && hasJoined && roundActive && timeRemaining > 0 && (
          <div className="mb-8 w-full max-w-4xl">
            <button
              className="btn btn-lg w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none text-4xl py-12 rounded-xl shadow-lg transform transition-all active:scale-95"
              onClick={() => click({ functionName: "click" })}
              disabled={isClicking || !roundActive || timeRemaining === 0}
            >
              {isClicking ? "Clicking..." : "⚡ CLICK ME! ⚡"}
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
        <div className="bg-white p-6 rounded-xl border-2 border-blue-300 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
          {!allPlayers || allPlayers.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No players yet. Be the first to join!</div>
          ) : (
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
                  {allPlayers.map((player, index) => (
                    <PlayerRow key={player} player={player} rank={index + 1} />
                  ))}
                </tbody>
              </table>
            </div>
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

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="p-2 font-bold">#{rank}</td>
      <td className="p-2">
        <Address address={player} />
      </td>
      <td className="p-2 text-right">{playerData ? Number(playerData.clicks) : 0}</td>
      <td className="p-2 text-right font-bold">{playerScore ? formatScore(playerScore) : "0.00"}</td>
    </tr>
  );
};

export default Home;
