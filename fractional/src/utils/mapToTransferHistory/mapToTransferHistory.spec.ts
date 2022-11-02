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
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        from: '0xA7d0b6A1Edf7e6aaf7A8D4BD19160c9dC371ca41',
        timestamp: 1667216375,
        to: '0x5f65f7b609678448494De4C87521CdF6cEf1e932',
        value: '9992199361900000000000',
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
        txHash: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        from: '0xA7d0b6A1Edf7e6aaf7A8D4BD19160c9dC371ca41',
        timestamp: null,
        to: '0x5f65f7b609678448494De4C87521CdF6cEf1e932',
        value: '9992199361900000000000',
      },
    ];
    expect(result).toEqual(expected);
  });
});
