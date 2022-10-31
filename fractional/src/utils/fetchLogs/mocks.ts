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

export const mockBlock = {
  hash: '0xe0b8581ae1e3b7ab3427222c4cd48b4c2d78375645c43fea24dd1f9d6943e769',
  parentHash:
    '0x2fa9b9279a4864b6cbd232972edc3eac809846fba62b2626ca922d8c63230d68',
  number: 15868070,
  timestamp: 1667219627,
  nonce: '0x0000000000000000',
  difficulty: 0,
  gasLimit: {
    type: 'BigNumber',
    hex: '0x01c9c380',
  },
  gasUsed: {
    type: 'BigNumber',
    hex: '0xc2cb27',
  },
  miner: '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5',
  extraData: '0x496c6c756d696e61746520446d6f63726174697a6520447374726962757465',
  transactions: [
    '0x6d4cc91e617481671ccb43aad5b91f10112c75baca69c428f5dbee03d678fe6d',
    '0xf61cfd837ab3fff217af97c62f41dbf04803ec27fb94dc9f7a23d2cab55daaec',
    '0x9167d9a4c9a0dea71be8488abe1ad57407d01e35424e1f27985e6b9865096d9d',
    '0x665d37ccd215154cf27124b308417640fcccbaef293a5639146251b09f25490c',
    '0x47c692c7cb241bf1a93ce51e106db9e5ae63841cb7ee71d434ea82ccee412fbc',
    '0x516705f807acc2c6467882190b7dc145b356c1214f84fd71acc37fd0dd6c49cb',
  ],
  baseFeePerGas: {
    type: 'BigNumber',
    hex: '0x03fa111434',
  },
  _difficulty: {
    type: 'BigNumber',
    hex: '0x00',
  },
};

export const mockBlock2 = {
  hash: '0x2',
  number: 152,
};
