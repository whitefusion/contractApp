const Contracts = artifacts.require('StudentListStorage.sol');

module.exports = async function(callback) {
  const studentListStorage = await Contracts.deployed();
  await studentListStorage.addList('bay', 99);
  await studentListStorage.addList('rtb', 98);
  await studentListStorage.addList('oljk', 97);
  let res = await studentListStorage.getList();
  console.log('res after add', res);
  // res = await studentListStorage.deleteByIdWithKeyword(1);
  // console.log('res after delete with keyword', res);
  res = await studentListStorage.deleteByIdWithLoop(1);
  console.log('res after delete with loop', res);
  callback();
}
