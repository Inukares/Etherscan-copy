import { Log, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import ABI from './utils/DAIABI.json';
import { useEffect, useState } from 'react';
import './App.css';
import ConnectToMetamask from './features/ConnectMetamask';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { TranfersGrid } from './features/TransfersGrid';
import { mapToTransferHistory } from './utils/mapToTransferHistory/mapToTransferHistory';
import { fetchLogsWithBlocks } from './utils/fetchLogsWithBlocks/fetchLogsWithBlocks';
import { BlocksMap, Transfer } from './shared/types';
import { contractAddress } from './shared/constants';

// TODO: Verify if the mapping of transfer's value is correct.
function App() {
  const [blocks, setBlocks] = useState<BlocksMap>({});
  const [logs, setLogs] = useState<Log[]>([]);
  const [transferHistory, setTransferHistory] = useState<Transfer[]>();

  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  // TODO: for now leave blank. chekc re-adding later
  // const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (library) {
        const latest = await library.getBlockNumber();
        const { logs, blocks } = await fetchLogsWithBlocks({
          blockNumber: latest,
          collectedLogs: [],
          collectedBlocksMap: {},
          contractAddress,
          minLogsCount: 10,
          provider: library,
          parallelRequests: 10,
        });
        const history = mapToTransferHistory(
          logs,
          blocks,
          contractAddress,
          ABI
        );
        setBlocks(blocks);
        setLogs(logs);
        setTransferHistory(history);
      }
    };
    fetchAccounts();
  }, [library]);

  return (
    <div>
      <div className="flex items-center align-center border-2 border-indigo-600">
        <ConnectToMetamask />
        {transferHistory ? <TranfersGrid data={transferHistory} /> : null}
      </div>
    </div>
  );
}

export default App;
