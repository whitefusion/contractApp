const HebiToken = artifacts.require('HebiToken.sol');

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, 'ether');
}

const toWei = (n) => {
  return web3.utils.toWei(n.toString(), 'ether');
}

module.exports = async function(callback) {
  const hebiToken = await HebiToken.deployed();
  let res1 = await hebiToken.balanceOf('0x8acA5763e4c936D984BcDf091ea8B47FeB088788');
  console.log('sender: ', fromWei(res1)) ;
  await hebiToken.transfer('0xCAe9Ff2C5334da30f323f0E827B7B01888c3b284', toWei(10000), {
    from: '0x8acA5763e4c936D984BcDf091ea8B47FeB088788'
  });
  let res2 = await hebiToken.balanceOf('0x8acA5763e4c936D984BcDf091ea8B47FeB088788');
  let res3 = await hebiToken.balanceOf('0xCAe9Ff2C5334da30f323f0E827B7B01888c3b284');
  console.log('sender: ', fromWei(res2));
  console.log('recipient: ', fromWei(res3));
  callback();
}
