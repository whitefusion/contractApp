import React, { useContext, useEffect, useState } from 'react';

import Web3 from 'web3';
import Balance from '../Balance/index';
import Order from '../Order/index';
import tokenJson from '../../build_contract/HebiToken.json';
import exchangeJson from '../../build_contract/Exchange.json';
import { loadBalanceData } from '@/app/redux/slices/balanceSlice';
import { useDispatch } from 'react-redux';
import { ContractContext } from '../contractContext';

export default function Content () {
  const dispatch = useDispatch();
  const contractInit = useContext(ContractContext);
  const [contractGlobal, setContractGlobal ]= useState(contractInit);

  useEffect(() => {
    const start = async () => {
      const web = await initWeb();
      const { web3 } = web as any;
      setContractGlobal({
        ...web,
        convert: (n: string) => web3?.utils?.fromWei(n),
      });

      dispatch(loadBalanceData(web));
    };
    try {
      if (!(window as any)?.web) {
        start();
      }
    } catch(e) {
      console.log(e); 
    }
  }, [dispatch]);

  const initWeb = async () => {
    // 获取账户
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.requestAccounts();
    console.log(accounts[0]);

    // 获取货币合约
    const networkId = await web3.eth.net.getId();
    const tokenAbi = tokenJson.abi;
    const tokenAddress = (tokenJson as any)?.networks?.[networkId]?.address;
    const token = new web3.eth.Contract(tokenAbi as any, tokenAddress);

    // 获取交易所合约
    const exchangeAbi = exchangeJson.abi;
    const exchangeAddress = (exchangeJson as any)?.networks?.[networkId]?.address;
    const exchange = new web3.eth.Contract(exchangeAbi as any, exchangeAddress);

    return { web3, token, exchange, account: accounts[0] };
  };

  return (
    <ContractContext.Provider value={contractGlobal}>
      <Balance></Balance>
      <Order></Order>
    </ContractContext.Provider>
  );
}