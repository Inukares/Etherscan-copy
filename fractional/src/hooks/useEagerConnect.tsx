import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { network } from '../connectors';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);
  useEffect(() => {
    if (active) return;
    const activateNetwork = async () => {
      try {
        await activate(network);
      } catch (_error) {
        // gets caught by web3react anyway, but console logging for better experience
        console.error(_error);
        setTried(true);
      }
    };
    activateNetwork();
  }, [activate, active, tried]); // intentionally only running on mount

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
