import { Log, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import ABI from './utils/DAIABI.json';
import { useEffect, useState } from 'react';
import './App.css';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { TranfersGrid } from './features/TransfersGrid';
import { mapToTransferHistory } from './utils/mapToTransferHistory/mapToTransferHistory';
import {
  fetchLogsWithBlocks,
  mapTopicsToFilter,
} from './utils/fetchLogsWithBlocks/fetchLogsWithBlocks';
import { BlocksMap, Transfer } from './shared/types';
import { contractAddress, TRANSFER_HASH } from './shared/constants';

// TODO: Verify if the mapping of transfer's value is correct.
function App() {
  const [blocks, setBlocks] = useState<BlocksMap>({});
  const [logs, setLogs] = useState<Log[]>([]);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [transferHistory, setTransferHistory] = useState<Transfer[]>();

  const { library, error } = useWeb3React<Web3Provider>();
  const triedEager = useEagerConnect();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (library) {
        const latest = await library.getBlockNumber();
        const { logs, blocks } = await fetchLogsWithBlocks({
          collectedLogs: [],
          collectedBlocksMap: {},
          contractAddress,
          minLogsCount: 100,
          provider: library,
          topics: mapTopicsToFilter([TRANSFER_HASH, from, to]),
          blocksRange: { toBlock: latest, fromBlock: latest - 10 },
        });
        const history = mapToTransferHistory(
          logs.sort((a, b) => b.blockNumber - a.blockNumber),
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
  }, [from, library, to]);

  if (error) {
    console.error(error);
    return (
      <div>
        There was an error while fetching data. Please see the console for more
        details
      </div>
    );
  }

  return (
    <div>
      <div className="flex align-center justify-start  w-full h-10">
        <div className="inline-flex">
          <label htmlFor="from">From</label>
          <div className="inputWrapper">
            <input
              onChange={(e) => setFrom(e.target.value)}
              name="from"
              className="w-32 text-slate-200 border-black border-solid"
              type={'text'}
            />
          </div>
        </div>

        <div className="inline-flex">
          <label htmlFor="to">To</label>
          <input
            onChange={(e) => setTo(e.target.value)}
            name="to"
            className="w-32 border-black border-solid"
            type={'text'}
          />
        </div>
      </div>

      <div>
        {transferHistory ? (
          <TranfersGrid data={transferHistory} />
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </div>
  );
}

export default App;
