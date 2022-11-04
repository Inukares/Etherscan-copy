import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

const RPC_URLS = {
  // 1: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  1: 'https://mainnet.infura.io/v3/84842078b09946638c03157f83405213',
  // 1: 'https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213',
};

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1] },
  // urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: 1,
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
