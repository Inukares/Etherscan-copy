import { getMockPQueue } from '../../shared/testUtils/getMockPQueue';
import { fetchLogsMockResponse } from './mocks';
import { recursiveFetchLogsWithBlocks } from './recursiveFetchLogsWithBlocks';

type Provider = Record<string, any>;

describe(recursiveFetchLogsWithBlocks, () => {
  it('merges results on subsequent runs', async () => {
    const PQueue = getMockPQueue();
    let provider: Provider = {};
    const { logs: mockLogs, blocks: expectedBlocks } = fetchLogsMockResponse;
    const getLogsMock = jest.fn(
      () =>
        new Promise((resolve) => {
          resolve(mockLogs);
        })
    );
    const getBlockMock = jest.fn(
      () =>
        new Promise((resolve) => {
          resolve(expectedBlocks['15867800']);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;
    const { logs, blocks } = await recursiveFetchLogsWithBlocks({
      blockRange: { fromBlock: 900, toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
      promiseQueue: PQueue,
      collectedLogs: [],
      minLogsCount: mockLogs.length * 3,
      topics: [],
    });
    const expectedLogs = [...mockLogs, ...mockLogs, ...mockLogs];
    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });
  it('prevents infinite loop when from and to blocks are the same', async () => {
    const PQueue = getMockPQueue();

    let provider: Provider = {};
    const { logs: expectedLogs, blocks: expectedBlocks } =
      fetchLogsMockResponse;
    const getLogsMock = jest.fn(
      () =>
        new Promise((resolve) => {
          resolve(expectedLogs);
        })
    );
    const getBlockMock = jest.fn(
      (number) =>
        new Promise((resolve) => {
          resolve(expectedBlocks['15867800']);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;
    const { logs, blocks } = await recursiveFetchLogsWithBlocks({
      blockRange: { fromBlock: 1000, toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
      promiseQueue: PQueue,
      collectedLogs: [],
      minLogsCount: 100,
      topics: [],
    });
    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });
  it('should end fetching at the Genesis block', async () => {
    const PQueue = getMockPQueue();

    let provider: Provider = {};
    const { logs: expectedLogs, blocks: expectedBlocks } =
      fetchLogsMockResponse;
    const getLogsMock = jest.fn(
      () =>
        new Promise((resolve) => {
          resolve(expectedLogs);
        })
    );
    const getBlockMock = jest.fn(
      (number) =>
        new Promise((resolve) => {
          resolve(expectedBlocks['15867800']);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;
    const { logs, blocks } = await recursiveFetchLogsWithBlocks({
      blockRange: { fromBlock: 0, toBlock: 1 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
      collectedLogs: [],
      promiseQueue: PQueue,
      minLogsCount: 100,
      topics: [],
    });
    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });
  it('Should return after first call when toBlock ot fromBlock or both are nullish', async () => {
    const PQueue = getMockPQueue();
    let provider: Provider = {};
    const { logs: expectedLogs, blocks: expectedBlocks } =
      fetchLogsMockResponse;
    const getLogsMock = jest.fn(
      ({ address, fromBlock, toBlock, topics }) =>
        new Promise((resolve) => {
          resolve(expectedLogs);
        })
    );
    const getBlockMock = jest.fn(
      (number) =>
        new Promise(async (resolve) => {
          resolve(expectedBlocks['15867800']);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;
    let response = await recursiveFetchLogsWithBlocks({
      blockRange: { toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      promiseQueue: PQueue as any,
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: Infinity,
      topics: [],
    });
    expect(response.blocks).toEqual(expectedBlocks);
    expect(response.logs).toEqual(expectedLogs);
    expect(getLogsMock).toHaveBeenCalledTimes(1);
    expect(getBlockMock).toHaveBeenCalledTimes(1);
    getLogsMock.mockClear();
    getBlockMock.mockClear();

    response = await recursiveFetchLogsWithBlocks({
      blockRange: { fromBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      promiseQueue: PQueue as any,
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: Infinity,
      topics: [],
    });

    expect(response.blocks).toEqual(expectedBlocks);
    expect(response.logs).toEqual(expectedLogs);
    expect(getLogsMock).toHaveBeenCalledTimes(1);
    expect(getBlockMock).toHaveBeenCalledTimes(1);
  });
});
