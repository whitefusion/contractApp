import React, { useEffect, useContext, useMemo } from 'react';
import { ContractContext } from '../contractContext';
import { useSelector } from 'react-redux';
import styles from './index.module.css';

// const convert = function(n: any) {
//   return (window as any)?.web ? (window as any)?.web?.web3?.utils?.fromWei(n) : '--';
// }

export default function Balance () {
  const contractGlobal = useContext(ContractContext);
  const { convert } = contractGlobal || {};
  const {
    tokenWallet,
    tokenExchange,
    etherWallet,
    etherExchange,
  } = useSelector((state: any) => state?.balance);
  
  const getDisplayAmount = (n: string) => {
    return convert ? convert(n) : '--';
  };

  return (
    <div className={styles.balance}>
      <div className={styles.balanceCard}>
        <h3>钱包</h3>
        <div>ETH: { getDisplayAmount(etherWallet) }</div>
        <div>HBT: { getDisplayAmount(tokenWallet) }</div>
      </div>
      <div className={styles.balanceCard}>
        <h3>交易所</h3>
        <div>ETH: { getDisplayAmount(etherExchange) }</div>
        <div>HBT: { getDisplayAmount(tokenExchange) }</div>
      </div>
    </div>
  );
}
