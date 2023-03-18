const HebiToken = artifacts.require('HebiToken.sol');
const Exchange = artifacts.require('Exchange.sol');
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, 'ether');
}

const toWei = (n) => {
  return web3.utils.toWei(n.toString(), 'ether');
}

const wait = (seconds) => {
  const ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = async function(callback) {
  try {
    const hebiToken = await HebiToken.deployed();
    const exchange = await Exchange.deployed();

    const accounts = await web3.eth.getAccounts();
    
    /** 1. accounts0 -> accounts1传10,0000 HBT, 并在交易所存100eth */

    await hebiToken.transfer(accounts[1], toWei(100000), { from: accounts[0] });

    // accounts0在交易所存100eth

    await exchange.depositEther({ from: accounts[0], value: toWei(100) });

    const res1 = await exchange.tokens(ETHER_ADDRESS,accounts[0]);
    console.log('accounts0在交易所的ETH：', fromWei(res1));

    /** 2. accounts0给交易所存10,0000 HBT */

    // 授权
    await hebiToken.approve(exchange.address, toWei(100000), {
      from: accounts[0]
    });

    // 存款
    await exchange.depositToken(hebiToken.address, toWei(100000), {
      from: accounts[0]
    });

    const res2 = await exchange.tokens(hebiToken.address,accounts[0]);
    console.log('accounts0在交易所的HBT：', fromWei(res2));

    /** 3. accounts1在交易所存50以太币 */

    await exchange.depositEther({ from: accounts[1], value: toWei(50) });
    const res3 = await exchange.tokens(ETHER_ADDRESS, accounts[1]);
    console.log('accounts1在交易所的ETH: ', fromWei(res3));

    /** 4. accounts1在交易所存50000KWT */
    await hebiToken.approve(exchange.address, toWei(50000), {
      from: accounts[1]
    });

    await exchange.depositToken(hebiToken.address, toWei(50000), {
      from: accounts[1]
    });
    const res4 = await exchange.tokens(hebiToken.address, accounts[1]);
    console.log('accounts1在交易所的HBT：', fromWei(res4));

    /** 5. 创建第一个订单 */
    let orderId = 0;
    let res;

    res = await exchange.makeOrder(hebiToken.address, toWei(1000), ETHER_ADDRESS, toWei(0.1), { from: accounts[0] });
    orderId = res.logs[0].args.id;
    console.log('创建第一个订单');
    await wait(1);

    /** 6. 创建第二个订单 */

    res = await exchange.makeOrder(hebiToken.address, toWei(2000), ETHER_ADDRESS, toWei(0.2), { from: accounts[0] });
    orderId = res.logs[0].args.id;
    console.log('创建第二个订单');
    
    /** 7. 取消第二个订单 */

    await exchange.cancelOrder(orderId, { from: accounts[0] });
    console.log('取消一个订单');
    await wait(1);

    /** 8. 创建第三个订单 */

    res = await exchange.makeOrder(hebiToken.address, toWei(3000), ETHER_ADDRESS, toWei(0.3), {from: accounts[0]});
    orderId = res.logs[0].args.id;
    console.log('创建第三个订单');

    /** 9. 完成一个订单 */

    await exchange.fillOrder(orderId, { from: accounts[1] });
    console.log('完成第一个订单');

    /** 10. 查看余额 */
    console.log('accounts0 - HBT', (fromWei(await exchange.tokens(hebiToken.address,accounts[0]))));
    console.log('accounts0 - ETH', (fromWei(await exchange.tokens(ETHER_ADDRESS,accounts[0]))));

    console.log('accounts1 - HBT', (fromWei(await exchange.tokens(hebiToken.address,accounts[1]))));
    console.log('accounts1 - ETH', (fromWei(await exchange.tokens(ETHER_ADDRESS,accounts[1]))));

  } catch(e) {
    console.log(e);
  }

  callback();
}
