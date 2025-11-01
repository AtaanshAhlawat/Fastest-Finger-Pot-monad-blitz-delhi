import ClickButton from '../ClickButton';
import { useState } from 'react';

export default function ClickButtonExample() {
  const [clicks, setClicks] = useState(0);

  return (
    <ClickButton
      disabled={false}
      clicks={clicks}
      onClick={() => {
        setClicks(prev => prev + 1);
        console.log('Click registered!');
      }}
    />
  );
}
