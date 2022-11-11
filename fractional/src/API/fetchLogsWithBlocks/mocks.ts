export const fetchLogsMockResponse = {
  logs: [
    {
      blockNumber: 15867800,
      blockHash:
        '0xd5385ce9959e21713f7cef965dc04e1f541c6a17f591548d1fd8e9455f7bccce',
      transactionIndex: 48,
      removed: false,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      data: '0x00000000000000000000000000000000000000000000021dad9f5ab4f65f3800',
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000a7d0b6a1edf7e6aaf7a8d4bd19160c9dc371ca41',
        '0x0000000000000000000000005f65f7b609678448494de4c87521cdf6cef1e932',
      ],
      transactionHash:
        '0xc2ad454ed46068fe00d67a7383dc6ec7ae11452ab0753b3b6d5c47c1cc99aa58',
      logIndex: 75,
    },
  ],
  blocks: {
    '15867800': {
      hash: '0xd5385ce9959e21713f7cef965dc04e1f541c6a17f591548d1fd8e9455f7bccce',
      parentHash:
        '0x718158fd9cabdde50e6fd57d175ff14ef578b73df4ae654bdd7aeb3a0d874b73',
      number: 15867800,
      timestamp: 1667216375,
      nonce: '0x0000000000000000',
      difficulty: 0,
      gasLimit: {
        type: 'BigNumber',
        hex: '0x01c9c380',
      },
      gasUsed: {
        type: 'BigNumber',
        hex: '0xaece3e',
      },
      miner: '0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990',
      extraData: '0x627920406275696c64657230783639',
      transactions: [
        '0x65adf89b4939d47f4f610b1ddf09d2a1f14a0de8f2d8a75d8da2a45720ebfbd4',
      ],
      baseFeePerGas: {
        type: 'BigNumber',
        hex: '0x05c54e99dd',
      },
      _difficulty: {
        type: 'BigNumber',
        hex: '0x00',
      },
    },
  },
};

export const mockLogs = [
  {
    blockNumber: 15867801,
    blockHash:
      '0xa6a417df5b661d9a084c32a0efc740fb3f3d677522532c42f08640901aa74edc',
    transactionIndex: 20,
    removed: false,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    data: '0x00000000000000000000000000000000000000000000000168d28e3f00280000',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000d16e4cdb153b2dcc617061174223a6d4bfae53f5',
      '0x000000000000000000000000fb9e2e35b3ccaedd89533e4376ce1e8a7169fde5',
    ],
    transactionHash:
      '0x65adf89b4939d47f4f610b1ddf09d2a1f14a0de8f2d8a75d8da2a45720ebfbd4',
    logIndex: 61,
  },
  {
    blockNumber: 15867800,
    blockHash:
      '0xd5385ce9959e21713f7cef965dc04e1f541c6a17f591548d1fd8e9455f7bccce',
    transactionIndex: 48,
    removed: false,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    data: '0x00000000000000000000000000000000000000000000021dad9f5ab4f65f3800',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000a7d0b6a1edf7e6aaf7a8d4bd19160c9dc371ca41',
      '0x0000000000000000000000005f65f7b609678448494de4c87521cdf6cef1e932',
    ],
    transactionHash:
      '0xc2ad454ed46068fe00d67a7383dc6ec7ae11452ab0753b3b6d5c47c1cc99aa58',
    logIndex: 75,
  },
  {
    blockNumber: 15867800,
    blockHash:
      '0xd5385ce9959e21713f7cef965dc04e1f541c6a17f591548d1fd8e9455f7bccce',
    transactionIndex: 64,
    removed: false,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    data: '0x00000000000000000000000000000000000000000000000f2dc7d47f15600000',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x0000000000000000000000004027b11844b401dbfaaa54aca8e990680aa43c3d',
      '0x0000000000000000000000005b8b6f8cff44cf089c3e24939f16f0e5c8a1cd78',
    ],
    transactionHash:
      '0xdc73192484329259e636e2df42e6783262a905bd6c9cb70e1ed535904098ebb0',
    logIndex: 94,
  },
];
