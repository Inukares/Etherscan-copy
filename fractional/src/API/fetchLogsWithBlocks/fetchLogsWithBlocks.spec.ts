import { getMockPQueue } from '../../shared/testUtils/getMockPQueue';
import { fetchLogsWithBlocks } from './fetchLogsWithBlocks';
import { fetchLogsMockResponse } from './mocks';

type Provider = Record<string, any>;

describe(fetchLogsWithBlocks, () => {
  it('fetches blocks basing on corresponding to them blocks', async () => {
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
        new Promise(async (resolve) => {
          resolve(expectedBlocks['15867800']);
        })
    );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;
    const filter = {};

    const { logs, blocksMap: blocks } = await fetchLogsWithBlocks({
      filter,
      promiseQueue: PQueue,
      provider: provider as any,
    });

    expect(blocks).toEqual(expectedBlocks);
    expect(logs).toEqual(expectedLogs);
  });
});
