const Contracts = artifacts.require('HebiToken.sol');
const Exchange = artifacts.require('Exchange.sol');

module.exports = async function(deployer) {
  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(Contracts);
  await deployer.deploy(Exchange, accounts[0], 10);
}
