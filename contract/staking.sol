// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.7;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UNI is ERC20 {
    constructor() ERC20("LP-$CREATOR","LP-CRT") {
        _mint(msg.sender, 10_000_000 ether);
    }
}

contract CreatorToken is ERC20 {
    constructor() ERC20("$CREATOR","CRT") {
        _mint(msg.sender, 10_000_000 ether);
    }
}

contract StakingModule {
    using SafeMath for uint256;
    
    address uniToken;
    address erc20Token;
    uint256 stakingEndsAt;
    uint256 totalRewards = 100 ether;
    mapping(address=>uint256) balances;
    
    event Stake(address from, uint256 value);
    event Withdraw(address from, uint256 value);
    
    constructor(address _uniToken, address _erc20Token, uint256 duration){
        uniToken = _uniToken;
        erc20Token = _erc20Token;
        stakingEndsAt = block.timestamp.add(duration);
    }
    
    function getBalances() public view returns(uint256 balance, uint256 reward) {
        balance = balances[msg.sender];
        reward = balance.mul(2);
    }
    
    function stake(uint256 amount) public {
        require(block.timestamp < stakingEndsAt, "Staking period over.");
        require(totalRewards.sub(amount * 2) > 0, "underflow. cannot stake this high.");
        require(IERC20(uniToken).transferFrom(msg.sender,address(this),amount),"Transfer failed.");
        
        balances[msg.sender] += amount;
        emit Stake(msg.sender, amount);
    }
    
    function withdraw() public {
        require(block.timestamp > stakingEndsAt, "Staking period not over yet.");
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        IERC20(erc20Token).transfer(msg.sender, balance.mul(2));
        IERC20(uniToken).transfer(msg.sender, balance);
        emit Withdraw(msg.sender, balance);
    }
}