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

export const logDescription = {
  eventFragment: {
    name: 'Transfer',
    anonymous: false,
    inputs: [
      {
        name: 'src',
        type: 'address',
        indexed: true,
        components: null,
        arrayLength: null,
        arrayChildren: null,
        baseType: 'address',
        _isParamType: true,
      },
      {
        name: 'dst',
        type: 'address',
        indexed: true,
        components: null,
        arrayLength: null,
        arrayChildren: null,
        baseType: 'address',
        _isParamType: true,
      },
      {
        name: 'wad',
        type: 'uint256',
        indexed: false,
        components: null,
        arrayLength: null,
        arrayChildren: null,
        baseType: 'uint256',
        _isParamType: true,
      },
    ],
    type: 'event',
    _isFragment: true,
  },
  name: 'Transfer',
  signature: 'Transfer(address,address,uint256)',
  topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  args: [
    '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11',
    '0x2c2963CB38bb3462857F419Bda262e90abf5b8c9',
    {
      type: 'BigNumber',
      hex: '0x3635c9adc5dea00000',
    },
  ],
};
