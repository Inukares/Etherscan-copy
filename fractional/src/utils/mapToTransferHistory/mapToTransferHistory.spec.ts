import { BlocksMap } from '../../shared/types';
import { fetchLogsMockResponse } from './../mocks';
import { ethers } from 'ethers';
import ABI from '../DAIABI.json';
import { mockLogs } from '../mocks';
import { mapToTransferHistory } from './mapToTransferHistory';
describe(mapToTransferHistory, () => {
  it('should map blocksMap and logs responses', () => {
    const logs = fetchLogsMockResponse.logs;
    const block = fetchLogsMockResponse.blocks;
    const result = mapToTransferHistory(
      logs,
      block as unknown as BlocksMap,
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      ABI
    );

    const expected = [
      {
        from: '0xA7d0b6A1Edf7e6aaf7A8D4BD19160c9dC371ca41',
        timestamp: 1667216375,
        to: '0x5f65f7b609678448494De4C87521CdF6cEf1e932',
        value: '9992.1993619',
        txHash:
          '0xc2ad454ed46068fe00d67a7383dc6ec7ae11452ab0753b3b6d5c47c1cc99aa58',
      },
    ];
    expect(result).toEqual(expected);
  });
  it('returns null timestamp in case there was a failure while fetching block', () => {
    const logs = fetchLogsMockResponse.logs;
    const block = {};
    const result = mapToTransferHistory(
      logs,
      block,
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      ABI
    );

    const expected = [
      {
        from: '0xA7d0b6A1Edf7e6aaf7A8D4BD19160c9dC371ca41',
        timestamp: null,
        to: '0x5f65f7b609678448494De4C87521CdF6cEf1e932',
        txHash:
          '0xc2ad454ed46068fe00d67a7383dc6ec7ae11452ab0753b3b6d5c47c1cc99aa58',
        value: '9992.1993619',
      },
    ];
    expect(result).toEqual(expected);
  });
});
