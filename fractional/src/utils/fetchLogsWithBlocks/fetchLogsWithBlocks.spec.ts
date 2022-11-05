import { fetchLogsMockResponse } from '../mocks';
import { fetchLogsWithBlocks } from './fetchLogsWithBlocks';
import { ethers } from 'ethers';
import { mockLogs, mockBlock, mockBlock2 } from '../mocks';
import { fetchJson } from 'ethers/lib/utils';
import { BlocksMap } from '../../shared/types';

type Provider = Record<string, any>;

describe(fetchLogsWithBlocks, () => {
  it('fethes logs and blocks', async () => {
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
        new Promise((resolve) => {
          resolve(expectedBlocks['15867800']);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;

    const { logs, blocks } = await fetchLogsWithBlocks({
      blocksRange: { fromBlock: 999, toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: 1,
      topics: [],
    });

    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });

  it('merges results on subsequent runs', async () => {
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

    const { logs, blocks } = await fetchLogsWithBlocks({
      blocksRange: { fromBlock: 995, toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
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

    const { logs, blocks } = await fetchLogsWithBlocks({
      blocksRange: { fromBlock: 1000, toBlock: 1000 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: 100,
      topics: [],
    });

    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });

  it('should end fetching at the Genesis block', async () => {
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

    const { logs, blocks } = await fetchLogsWithBlocks({
      blocksRange: { fromBlock: 0, toBlock: 1 },
      provider: provider as any,
      contractAddress: '0x',
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: 100,
      topics: [],
    });

    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });

  it.skip('shows error message when throws', async () => {
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
      fetchLogsWithBlocks({
        blocksRange: { fromBlock: 1000, toBlock: 1000 },
        // @ts-ignore-next-line
        provider,
        contractAddress: '0x',
        collectedBlocksMap: expectedBlocks as unknown as BlocksMap, // actual response doesnt match types from ethers lib
        collectedLogs: mockLogs,
        minLogsCount: 1,
        parallelRequests: 1,
      })
    ).toThrow();
  });
});
