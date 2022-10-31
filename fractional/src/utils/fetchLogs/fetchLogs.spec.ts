import { fetchLogs } from './fetchLogs';
import { mockLogs, mockBlocks } from './mocks';

describe('fetchLogs', () => {
  it('fethes logs and blocks', async () => {
    let provider: Record<string, any> = {};
    const getLogsMock = jest.fn(
      ({ address, fromBlock, toBlock, topics }) =>
        new Promise((resolve, reject) => {
          resolve(mockLogs);
        })
    );

    const getBlocksMock = jest.fn(
      (number) =>
        new Promise((resolve, reject) => {
          resolve(mockBlocks);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlocks = getBlocksMock;

    const { logs, blocks } = await fetchLogs({
      blockNumber: 1000,
      // @ts-ignore-next-line
      provider,
      contractAddress: '0x',
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: 1,
      parallelRequests: 1,
    });
    expect(logs).toEqual(mockLogs);
    expect(blocks).toEqual(mockBlocks);
  });

  it.skip('ignores failed promises', () => {});

  it.skip('combines multiple requests together for blocks and logs', () => {});
});
