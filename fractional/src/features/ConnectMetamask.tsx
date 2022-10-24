import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../shared/injectedConnector';

const ConnectToMetamask = () => {
  const { chainId, account, activate, active } = useWeb3React();
  console.log(`chainid:${chainId}, ${account}`);

  const onClick = () => {
    activate(injectedConnector);
  };

  return (
    <div>
      <div>ChainId: {chainId}</div>
      <div>Account: {account}</div>
      {active ? (
        <div>✅ </div>
      ) : (
        <button type="button" onClick={onClick}>
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectToMetamask;
