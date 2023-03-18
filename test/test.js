const Contracts = artifacts.require('StudentListStorage.sol');

module.exports = async function(callback) {
  const studentListStorage = await Contracts.deployed();
  await studentListStorage.addList('bay', 99);
  let res = await studentListStorage.getList();
  console.log(res);
  callback();
}
