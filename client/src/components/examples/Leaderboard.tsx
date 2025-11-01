import Leaderboard, { type LeaderboardEntry } from '../Leaderboard';

export default function LeaderboardExample() {
  const entries: LeaderboardEntry[] = [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", clicks: 89, stake: "0.5", score: 44.5, isCurrentUser: true },
    { address: "0x1234567890abcdef1234567890abcdef12345678", clicks: 75, stake: "0.3", score: 22.5 },
    { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", clicks: 92, stake: "0.2", score: 18.4 },
    { address: "0x9876543210fedcba9876543210fedcba98765432", clicks: 68, stake: "0.25", score: 17.0 },
    { address: "0x5555555555555555555555555555555555555555", clicks: 55, stake: "0.1", score: 5.5 },
  ];

  return <Leaderboard entries={entries} />;
}
