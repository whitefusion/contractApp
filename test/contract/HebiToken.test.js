const HebiToken = artifacts.require('HebiToken.sol');
const Exchange = artifacts.require('Exchange.sol');
const util = require('./common');

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, 'ether');
}

const toWei = (n) => {
  return web3.utils.toWei(n.toString(), 'ether');
}

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

contract("HebiToken", (accounts) => {
  it("should put 10000 HebiToken in the first account", async () => {
    const hebiTokenInstance = await HebiToken.deployed();
    const balance = await hebiTokenInstance.balanceOf(accounts[0]);
    assert.equal(fromWei(balance), 1000000, "100,0000 in the first account");
  });
  it("should transfer correctly", async () => {
    const hebiTokenInstance = await HebiToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = fromWei(
      await hebiTokenInstance.balanceOf(accountOne)
    )
    const accountTwoStartingBalance = fromWei(
      await hebiTokenInstance.balanceOf(accountTwo)
    );

    // Make transaction from first account to second.
    const amount = 10;
    await hebiTokenInstance.transfer(accountTwo, toWei(amount), { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = fromWei(
      await hebiTokenInstance.balanceOf(accountOne)
    );
    const accountTwoEndingBalance = fromWei(
      await hebiTokenInstance.balanceOf(accountTwo)
    );

    assert.equal(
      accountOneEndingBalance,
      parseInt(accountOneStartingBalance) - amount,
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      accountTwoEndingBalance,
      parseInt(accountTwoStartingBalance) + amount,
      "Amount wasn't correctly sent to the receiver"
    );
  });
});
