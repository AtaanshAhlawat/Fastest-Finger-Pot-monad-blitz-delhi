import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletButtonProps {
  connected: boolean;
  address?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function WalletButton({ connected, address, onConnect, onDisconnect }: WalletButtonProps) {
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (connected && address) {
    return (
      <Button
        variant="outline"
        onClick={onDisconnect}
        className="font-mono"
        data-testid="button-disconnect-wallet"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {truncateAddress(address)}
      </Button>
    );
  }

  return (
    <Button
      onClick={onConnect}
      data-testid="button-connect-wallet"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
}
