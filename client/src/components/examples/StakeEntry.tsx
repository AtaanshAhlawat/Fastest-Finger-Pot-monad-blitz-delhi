import StakeEntry from '../StakeEntry';
import { useState } from 'react';

export default function StakeEntryExample() {
  const [joined, setJoined] = useState(false);

  if (joined) {
    return (
      <StakeEntry
        onJoin={() => {}}
        disabled={false}
        currentStake="0.5"
      />
    );
  }

  return (
    <StakeEntry
      onJoin={(stake) => {
        console.log('Joining with stake:', stake);
        setJoined(true);
      }}
      disabled={false}
    />
  );
}
