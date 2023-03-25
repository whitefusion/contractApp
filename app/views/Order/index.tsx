import React, { useContext } from 'react';
import { Button, Row, Col, Card, Table } from 'antd';
import { useSelector } from 'react-redux';
import { ContractContext } from '../contractContext';
import dayjs from 'dayjs';

export default function Order () {
  const orderSlice = useSelector((state: any) => state.order);
  const contractGlobal = useContext(ContractContext);
  const { convert, account, exchange } = contractGlobal || {};

  const getPendingOrders = (orderCollection: any, type: number) => {
    if (!account) return [];
    const { cancelOrders, fillOrders = [], allOrders } = orderCollection;
    const filterIds = [...cancelOrders, ...fillOrders].map((order: any) => order.id);

    const pendingOrders = allOrders.filter((i:any) => !filterIds.includes(i.id));

    if (type === 1) {
      return pendingOrders.filter((i: any) => i.user === account);
    } else {
      return pendingOrders.filter((i: any) => i.user !== account);
    }
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      render: (timestamp: number) => dayjs(timestamp*1000).format( 'YYYY-MM-DD HH:mm')
    },
    {
      title: 'HBT',
      dataIndex: 'amountGet',
      render: (amountGet: string) => { return convert ? convert(amountGet) : '--' }
    },
    {
      title: 'ETH',
      dataIndex: 'amountGive',
      render: (amountGive: string) => { return convert ? convert(amountGive) : '--' }
    }
  ];

  const columns1 = [
    ...columns,
    {
      title: '操作',
      render: (item: any)=>renderBuyBtn(item)
    }
  ];

  const columns2 = [
    ...columns,
    {
      title: '操作',
      render: (item: any)=>renderCancelBtn(item)
    }
  ];

  const renderBuyBtn = (item: any) => {
    return(
      <>
        <Button
          size='small'
          style={{ color: '#fff', borderColor: '#28a745', backgroundColor: '#28a745' }}
          onClick={
            () => {
              // send会调用metamask插件让用户确认
              exchange.methods.fillOrder(item.id).send({ from: account });
            }
          }>买入</Button>
      </>
    );
  }

  const renderCancelBtn = (item: any) => {
    return(
      <>
        <Button size='small' danger onClick={
          () => {
            // send会调用metamask插件让用户确认
            exchange.methods.cancelOrder(item.id).send({ from: account });
          }
        }>取消</Button>
      </>
    );
  }

  return (
    <>
      <Row style={{ marginTop: '24px' }} >
        <Col span={8}  style={{ paddingRight: '24px' }}>
          <Card title='Bid' bordered={false}>
          <Table dataSource={getPendingOrders(orderSlice, 2)} columns={columns1} rowKey={item=>item.id} />
          </Card>
        </Col>
        <Col span={8} style={{ paddingRight: '24px' }}>
          <Card title='My orders' bordered={false}>
          <Table dataSource={getPendingOrders(orderSlice, 1)} columns={columns2} rowKey={item=>item.id} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='Done' bordered={false}>
          <Table dataSource={orderSlice.fillOrders} columns={columns} rowKey={item=>item.id} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
