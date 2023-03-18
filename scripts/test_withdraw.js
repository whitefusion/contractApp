const HebiToken = artifacts.require('HebiToken.sol');
const Exchange = artifacts.require('Exchange.sol');
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, 'ether');
}

const toWei = (n) => {
  return web3.utils.toWei(n.toString(), 'ether');
}

module.exports = async function(callback) {
  const hebiToken = await HebiToken.deployed();
  const exchange = await Exchange.deployed();

  const accounts = await web3.eth.getAccounts();

  // await exchange.withdrawEther(toWei(5), { from: accounts[0]});

  // const res = await exchange.tokens(ETHER_ADDRESS,accounts[0]);
  // console.log(fromWei(res));

  // // 授权
  // await hebiToken.approve(exchange.address, toWei(100000), {
  //   from: accounts[0]
  // });

  // 存款
  await exchange.withdrawToken(hebiToken.address, toWei(50000), {
    from: accounts[0]
  });

  const res1 = await exchange.tokens(hebiToken.address,accounts[0]);
  console.log(fromWei(res1));


  callback();
}
