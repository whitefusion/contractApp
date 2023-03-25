import React, { useContext } from 'react';
import { ContractContext } from '../contractContext';
import { useSelector } from 'react-redux';
import { Card, Col, Row, Statistic } from 'antd';
import styles from './index.module.css';

export default function Balance() {
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
      <div>
      <Row>
        <Col span={6} style={{ paddingRight: '24px' }}>
          <Card bordered={false} hoverable={true}>
            <Statistic
              title="钱包中的以太币"
              value={getDisplayAmount(etherWallet)}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={6} style={{ paddingRight: '24px' }}>
          <Card bordered={false} hoverable={true}>
            <Statistic
              title="钱包中的HBT"
              value={getDisplayAmount(tokenWallet)}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={6} style={{ paddingRight: '24px' }}>
          <Card bordered={false} hoverable={true}>
            <Statistic
              title="交易所的以太币"
              value={getDisplayAmount(etherExchange)}
              precision={3}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable={true}>
            <Statistic
              title="交易所的HBT"
              value={getDisplayAmount(tokenExchange)}
              precision={3}
            />
          </Card>
        </Col>
      </Row>
      </div>
    </div>
  );
}
