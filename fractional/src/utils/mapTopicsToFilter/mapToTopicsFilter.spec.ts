import exp from 'constants';
import { mapTopicsToFilter } from './mapTopicsToFilter';
describe(mapTopicsToFilter, () => {
  it('returns topics formatted in ethers acceptable way', () => {
    let result = mapTopicsToFilter(['aHash', 'me', 'you']);
    expect(result).toEqual(['aHash', null, null]);
    result = mapTopicsToFilter([
      'aHash',
      '0x6d707F73f621722fEc0E6A260F43f24cCC8d4997',
      '0x6d707F73f621722fEc0E6A260F43f24cCC8d4997',
    ]);
    expect(result).toEqual([
      'aHash',
      '0x0000000000000000000000006d707F73f621722fEc0E6A260F43f24cCC8d4997',
      '0x0000000000000000000000006d707F73f621722fEc0E6A260F43f24cCC8d4997',
    ]);
  });
  it('return null for falsy values', () => {
    let result = mapTopicsToFilter(['aHash', '', '']);
    expect(result).toEqual(['aHash', null, null]);

    result = mapTopicsToFilter([]);
    expect(result).toEqual([null, null, null]);
  });
});
