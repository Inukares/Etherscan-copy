import { fetchLogsMockResponse } from '../../shared/mocks';
import { recursiveFetchLogsWithBlocks } from './fetchLogsWithBlocks';
import { mockLogs } from '../../shared/mocks';
import { BlocksMap } from '../../shared/types';

type Provider = Record<string, any>;

describe(recursiveFetchLogsWithBlocks, () => {
  // Ideally I'd just import PQueue from node_modules, but doing that caused
  // "Cannot use import statement outside a module" error. After debugging for a while decided to
  // opt in for a hack-way to make it work, as I'm not really testing this lib but rather fetchLogsWithBlocks func
  const getMockPQueue = (): any => {
    const add = jest.fn().mockImplementation(async (func) => await func());
    const onIdle = jest.fn();
    const PQueue = { add, onIdle } as any;

    return PQueue;
  };

  it('fethes logs and blocks', async () => {
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
    const { logs, blocks } = await recursiveFetchLogsWithBlocks({
      blocksRange: { fromBlock: 999, toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      promiseQueue: PQueue as any,
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: 1,
      topics: [],
    });
    expect(blocks).toEqual(expectedBlocks);
    expect(logs).toEqual(expectedLogs);
  });
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
      (number) =>
        new Promise((resolve) => {
          resolve(expectedBlocks['15867800']);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;
    const { logs, blocks } = await recursiveFetchLogsWithBlocks({
      blocksRange: { fromBlock: 900, toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
      promiseQueue: PQueue,
      collectedLogs: [],
      minLogsCount: 3,
      topics: [],
    });
    const expectedLogs = [...mockLogs, ...mockLogs, ...mockLogs];
    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });
  // TODO: implement custom block range iterartor func
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
      blocksRange: { fromBlock: 1000, toBlock: 1000 },
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
      blocksRange: { fromBlock: 0, toBlock: 1 },
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
      blocksRange: { toBlock: 1000 },
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
      blocksRange: { fromBlock: 1000 },
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
  it.skip('shows error message when throws', async () => {
    const PQueue = getMockPQueue();
    let provider: Provider = {};
    const { blocks: expectedBlocks } = fetchLogsMockResponse;
    const getLogsMock = jest.fn(
      ({ address, fromBlock, toBlock, topics }) =>
        new Promise((resolve, reject) => {
          reject('oops');
        })
    );
    const getBlockMock = jest.fn(
      (number) =>
        new Promise((resolve, reject) => {
          reject('oops');
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;
    expect(() =>
      recursiveFetchLogsWithBlocks({
        blocksRange: { fromBlock: 1000, toBlock: 1000 },
        // @ts-ignore-next-line
        provider,
        contractAddress: '0x',
        collectedBlocksMap: expectedBlocks as unknown as BlocksMap, // actual response doesnt match types from ethers lib
        collectedLogs: mockLogs,
        promiseQueue: PQueue,
        minLogsCount: 1,
        parallelRequests: 1,
      })
    ).toThrow();
  });
});
