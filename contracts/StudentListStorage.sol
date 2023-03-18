// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract StudentListStorage {
  struct Student{
    uint id;
    uint age;
    string name;
    address account;
  }

  Student[] public StudentList;

  function addList(string memory _name, uint _age) public returns (uint) {
    uint count = StudentList.length;
    uint index = count + 1;
    StudentList.push(Student(index, _age, _name, msg.sender));
    return StudentList.length;
  }

  function getList() public view returns (Student[] memory) {
    return StudentList;
  }
}
