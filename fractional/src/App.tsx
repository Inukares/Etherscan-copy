import { ethers } from 'ethers';
import { useState } from 'react';
import './App.css';
import { ErrorWithMessage, toErrorWithMessage } from './shared/errorUtils';

function App() {
  // todo: move to redux
  const [accounts, setAccounts] = useState();
  const [error, setError] = useState<ErrorWithMessage>();

  const connectToMetamask = async () => {
    // TODO: Change this to add etherum to global window object
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    let accounts;
    try {
      accounts = await provider.send('eth_requestAccounts', []);
      setAccounts(accounts);
    } catch (error) {
      setError(toErrorWithMessage(error));
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center align-center border-2 border-indigo-600">
        <button>Connect to metamask</button>
      </div>
    </div>
  );
}

export default App;
