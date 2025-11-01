import WalletButton from '../WalletButton';
import { useState } from 'react';

export default function WalletButtonExample() {
  const [connected, setConnected] = useState(false);
  const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";

  return (
    <WalletButton
      connected={connected}
      address={address}
      onConnect={() => {
        console.log('Connecting wallet...');
        setConnected(true);
      }}
      onDisconnect={() => {
        console.log('Disconnecting wallet...');
        setConnected(false);
      }}
    />
  );
}
