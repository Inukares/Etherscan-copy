import { Web3Provider } from '@ethersproject/providers';

export const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider);
  return library;
};
