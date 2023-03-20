import { createContext } from 'react';

interface ContextGlobal {
  web3: any;
  token: any;
  exchange: any;
  account: string;
  convert?: Function,
}

export const ContractContext = createContext<ContextGlobal>({
  web3: {},
  token: {},
  exchange: {},
  account: '',
});
