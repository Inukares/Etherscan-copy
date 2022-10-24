import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';
import ABI from './utils/DAIABI.json';
import { useEffect, useState } from 'react';
import './App.css';
import ConnectToMetamask from './features/ConnectMetamask';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { ErrorWithMessage, toErrorWithMessage } from './shared/errorUtils';
import { eventFilterv5 } from './utils/eventFilter';
const contractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

function App() {
  // todo: move to redux
  const [accounts, setAccounts] = useState();
  const [error, setError] = useState<ErrorWithMessage>();

  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  // TODO: for now leave blank. chekc re-adding later
  // const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager);

  useEffect(() => {
    const fetchAccounts = async () => {
      console.log(library);
      if (library) {
        const accounts = await library.send('eth_requestAccounts', []);
        const contract = new ethers.Contract(contractAddress, ABI, library);
        // library.getLo
        const event = await eventFilterv5(contractAddress, ABI, library);
        console.log(event);
        console.log(accounts);
      }
    };
    fetchAccounts();
  });

  return (
    <div>
      <div className="flex items-center align-center border-2 border-indigo-600">
        <ConnectToMetamask />
      </div>
    </div>
  );
}

export default App;
