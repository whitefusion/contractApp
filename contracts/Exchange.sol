// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "./HebiToken.sol";

contract Exchange {
    using SafeMath for uint256;
    address public feeAccount;
    uint256 public feeRate;
    address constant ETHER = address(0);

    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint amountGive;
        uint256 timestamp;
    }

    mapping(address => mapping(address => uint256)) public tokens;
    // 订单池
    mapping(uint256 => _Order) public orders;
    // 取消订单
    mapping(uint256 => bool) public orderCancel;
    // 填充订单
     mapping(uint256 => bool) public orderFill;

    uint256 public orderCount;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint amountGive,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint amountGive,
        uint256 timestamp
    );

    constructor(address _feeAccount, uint256 _feeRate) {
        feeAccount = _feeAccount;
        feeRate = _feeRate;
    }

    // 存以太币
    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);

        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    // 存其他货币
    function depositToken(address _token, uint256 _value) public {
        require(_token != ETHER);
        // address(this)当前合约部署的地址
        require(
            HebiToken(_token).transferFrom(msg.sender, address(this), _value)
        );
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_value);

        emit Deposit(_token, msg.sender, _value, tokens[_token][msg.sender]);
    }

    // 提取以太币
    function withdrawEther(uint256 _value) public {
        require(tokens[ETHER][msg.sender] >= _value);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_value);
        payable(msg.sender).transfer(_value);

        emit Deposit(ETHER, msg.sender, _value, tokens[ETHER][msg.sender]);
    }

    // 提取其他货币
    function withdrawToken(address _token, uint256 _value) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _value);

        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_value);
        require(HebiToken(_token).transfer(msg.sender, _value));

        emit Withdraw(_token, msg.sender, _value, tokens[_token][msg.sender]);
    }

    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        require(balanceOf(_tokenGive, msg.sender)>=_amountGive, unicode'创建订单时余额不足'); 
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        _Order memory myOrder  = orders[_id];
        require(myOrder.id == _id);
        orderCancel[_id] = true;

        emit Cancel(
            _id,
            msg.sender,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            block.timestamp
        );
    }

    function fillOrder(uint256 _id) public {
        _Order memory myOrder  = orders[_id];
        require(myOrder.id == _id);
        uint256 feeAmount = myOrder.amountGet.mul(feeRate).div(100);
        require(balanceOf(myOrder.tokenGive, myOrder.user)>=(myOrder.amountGive), unicode'创建订单用户余额不足');
        require(balanceOf(myOrder.tokenGet, msg.sender)>=myOrder.amountGet.add(feeAmount), unicode'完成订单用户余额不足');

        // 交易双方账户金额增/减
        tokens[myOrder.tokenGet][msg.sender] = tokens[myOrder.tokenGet][msg.sender].sub(myOrder.amountGet.add(feeAmount));
        tokens[myOrder.tokenGet][myOrder.user] = tokens[myOrder.tokenGet][myOrder.user].add(myOrder.amountGet);

        tokens[myOrder.tokenGive][msg.sender] = tokens[myOrder.tokenGive][msg.sender].add(myOrder.amountGive);        
        tokens[myOrder.tokenGive][myOrder.user] = tokens[myOrder.tokenGive][myOrder.user].sub(myOrder.amountGive);

        // 小费
        tokens[myOrder.tokenGet][feeAccount] = tokens[myOrder.tokenGet][feeAccount].add(feeAmount);

        orderFill[_id] = true;

        emit Trade(
            _id,
            myOrder.user,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            block.timestamp
        );
    }
}
