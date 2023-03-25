
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

    for(let i = 1; i < 5; ++i) {
      await exchange.makeOrder(
        hebiToken.address,
        toWei(100 + i),
        ETHER_ADDRESS,
        toWei(i/1000),
        { from: accounts[0] }
      )
      console.log(`accounts[0]制作第${i}个账单`);
      await wait(1);
    }

    for(let i = 1; i < 5; ++i) {
      await exchange.makeOrder(
        hebiToken.address,
        toWei(100 + i),
        ETHER_ADDRESS,
        toWei(i/1000),
        { from: accounts[1] }
      )
      console.log(`accounts[1]制作第${i}个账单`);
      await wait(1);
    }
  } catch(e) {
    console.log(e);
  }
  callback();
}