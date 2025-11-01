import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface StakeEntryProps {
  onJoin: (stake: string) => void;
  disabled: boolean;
  currentStake?: string;
}

export default function StakeEntry({ onJoin, disabled, currentStake }: StakeEntryProps) {
  const [stakeAmount, setStakeAmount] = useState("");

  const handleJoin = () => {
    if (stakeAmount && parseFloat(stakeAmount) > 0) {
      onJoin(stakeAmount);
      setStakeAmount("");
    }
  };

  if (currentStake) {
    return (
      <Card data-testid="card-stake-entered">
        <CardHeader>
          <CardTitle>Your Stake</CardTitle>
          <CardDescription>You're in the round!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold font-mono" data-testid="text-current-stake">
              {currentStake} ETH
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-stake-entry">
      <CardHeader>
        <CardTitle>Enter Round</CardTitle>
        <CardDescription>Set your stake to join the competition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stake-input">Stake Amount (ETH)</Label>
          <Input
            id="stake-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.1"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            disabled={disabled}
            className="font-mono text-lg"
            data-testid="input-stake"
          />
        </div>
        <Button
          onClick={handleJoin}
          disabled={disabled || !stakeAmount || parseFloat(stakeAmount) <= 0}
          className="w-full"
          size="lg"
          data-testid="button-join-round"
        >
          Join Round
        </Button>
      </CardContent>
    </Card>
  );
}
