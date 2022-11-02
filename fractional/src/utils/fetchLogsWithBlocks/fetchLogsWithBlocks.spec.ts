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
      blockNumber: 1000,
      // @ts-ignore-next-line
      provider,
      contractAddress: '0x',
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: 1,
      parallelRequests: 1,
    });

    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });

  it('ignores failed promises', async () => {
    let provider: Provider = {};
    const { logs: expectedLogs, blocks: expectedBlocks } =
      fetchLogsMockResponse;
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

    const { logs, blocks } = await fetchLogsWithBlocks({
      blockNumber: 1000,
      // @ts-ignore-next-line
      provider,
      contractAddress: '0x',
      collectedBlocksMap: expectedBlocks as unknown as BlocksMap, // actual response doesnt match types from ethers lib
      collectedLogs: mockLogs,
      minLogsCount: 1,
      parallelRequests: 1,
    });
    expect(logs).toEqual(mockLogs);
    expect(blocks).toEqual(expectedBlocks);
  });

  it('merges recursively fetched logs and blocks', async () => {
    let provider: Provider = {};

    const getLogsMock = jest.fn(
      ({ address, fromBlock, toBlock, topics }) =>
        new Promise((resolve, reject) => {
          resolve(mockLogs);
        })
    );

    const getBlockMock = jest
      .fn()
      .mockImplementationOnce(
        () => new Promise((resolve) => resolve(mockBlock))
      )
      .mockImplementationOnce(
        () => new Promise((resolve) => resolve(mockBlock2))
      );
    provider.getLogs = getLogsMock;
    provider.getBlock = getBlockMock;

    const { logs, blocks } = await fetchLogsWithBlocks({
      blockNumber: 1000,
      // @ts-ignore-next-line
      provider,
      contractAddress: '0x',
      collectedBlocksMap: {},
      collectedLogs: [],
      minLogsCount: mockLogs.length * 2,
      parallelRequests: 1,
    });

    const expectedLogs = [...mockLogs, ...mockLogs];
    const expectedBlocks: { [key: string]: unknown } = {
      '15868070': {
        hash: '0xe0b8581ae1e3b7ab3427222c4cd48b4c2d78375645c43fea24dd1f9d6943e769',
        parentHash:
          '0x2fa9b9279a4864b6cbd232972edc3eac809846fba62b2626ca922d8c63230d68',
        number: 15868070,
        timestamp: 1667219627,
        nonce: '0x0000000000000000',
        difficulty: 0,
        gasLimit: { type: 'BigNumber', hex: '0x01c9c380' },
        gasUsed: { type: 'BigNumber', hex: '0xc2cb27' },
        miner: '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5',
        extraData:
          '0x496c6c756d696e61746520446d6f63726174697a6520447374726962757465',
        transactions: [
          '0x6d4cc91e617481671ccb43aad5b91f10112c75baca69c428f5dbee03d678fe6d',
          '0xf61cfd837ab3fff217af97c62f41dbf04803ec27fb94dc9f7a23d2cab55daaec',
          '0x9167d9a4c9a0dea71be8488abe1ad57407d01e35424e1f27985e6b9865096d9d',
          '0x665d37ccd215154cf27124b308417640fcccbaef293a5639146251b09f25490c',
          '0x47c692c7cb241bf1a93ce51e106db9e5ae63841cb7ee71d434ea82ccee412fbc',
          '0x516705f807acc2c6467882190b7dc145b356c1214f84fd71acc37fd0dd6c49cb',
        ],
        baseFeePerGas: { type: 'BigNumber', hex: '0x03fa111434' },
        _difficulty: { type: 'BigNumber', hex: '0x00' },
      },
      '152': {
        hash: '0x2',
        number: 152,
      },
    };
    expect(logs).toEqual(expectedLogs);
    expect(blocks).toEqual(expectedBlocks);
  });

  it.skip('should end fetching at the Genesis block', () => {});
});
