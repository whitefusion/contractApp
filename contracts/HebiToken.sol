// SPDX-License-Identifier: GPL-3.0
// follow EIP20: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
pragma solidity >=0.4.16 <0.9.0;

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract HebiToken {
  using SafeMath for uint256;

  string public name = "HebiToken";
  string public symbol = "HBT";
  uint8 public decimals = 18;
  uint256 public totalSupply;

  /** 去中心化“数据库” **/
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);

  constructor() {
    totalSupply = 1000000 * (10 ** decimals);
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint256 _value) public returns(bool success) {
    require(_to!=address(0));

    _transfer(msg.sender, _to, _value);
    return true;
  }

  function _transfer(address _from, address _to, uint256 _value) internal {
    require(balanceOf[_from]>=_value);

    balanceOf[_from] = balanceOf[_from].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);
    emit Transfer(_from, _to, _value);
  }

  // 三方额度授权
  function approve(address _spender, uint256 _value) public returns (bool success) {
    require(_spender!=address(0));

    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true; 
  }

  // 被授权交易所调用 
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    // msg.sender此时是交易所账号的地址
    require(balanceOf[_from]>=_value);
    require(allowance[_from][msg.sender]>=_value);

    allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
    _transfer(_from, _to, _value);
    return true;
  }

}
