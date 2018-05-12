# transferProxy Bug

## Contract: SMART Token 
https://etherscan.io/address/0x60be37dacb94748a12208a7ff298f6112365e31f

```javascript
    function transferProxy(address _from, address _to, uint256 _value, uint256 _feeSmart,
        uint8 _v,bytes32 _r, bytes32 _s) public returns (bool){
        
        /* Pass parameter values '_value' and '_feeSmart' so that '_value + _feeSmart >= 2^256' This will overflow uint256 and allow the balance check to pass for any address in the mapping, thus the contract will not revert. */

        if(balances[_from] < _feeSmart + _value) revert();

        uint256 nonce = nonces[_from];

        /* To get around this, deploy a second contract and hash the parameters _from,_to,_value,_feeSmart,nonce with the same method in Solidity, then extract the _v, _r, and _s segments of the signature as specified by Ethereum Wiki. 

        This cannot be done in Web3 or other local libraries because keccak256 in Solidity has no direct counterpart in them.

        Lastly, pass all parameters to transferProxy() */

        bytes32 h = keccak256(_from,_to,_value,_feeSmart,nonce);
        if(_from != ecrecover(h,_v,_r,_s)) revert();

        if(balances[_to] + _value < balances[_to]
            || balances[msg.sender] + _feeSmart < balances[msg.sender]) revert();

        // Address _to will get an amount of tokens = _value, which can be set to any value

        balances[_to] += _value;
        Transfer(_from, _to, _value);

        // Address of message sender will get an amount of tokens = _feeSmart, which can also be set to any value
        balances[msg.sender] += _feeSmart;
        Transfer(_from, msg.sender, _feeSmart);

        balances[_from] -= _value + _feeSmart;
        nonces[_from] = nonce + 1;
        return true;
    }
```

`SMART` token contract `transferProxy` method does not use SafeMath libraries for the summation of _value and _feeSmart. Thus the value can be overflown. 

## Contract: SMT Token 
https://etherscan.io/address/0x55f93985431fc9304077687a35a1ba103dc1e081

```javascript
    function transferProxy(address _from, address _to, uint256 _value, uint256 _feeSmt,
        uint8 _v,bytes32 _r, bytes32 _s) public transferAllowed(_from) returns (bool){

        if(balances[_from] < _feeSmt + _value) revert();

        uint256 nonce = nonces[_from];
        bytes32 h = keccak256(_from,_to,_value,_feeSmt,nonce);
        if(_from != ecrecover(h,_v,_r,_s)) revert();

        if(balances[_to] + _value < balances[_to]
            || balances[msg.sender] + _feeSmt < balances[msg.sender]) revert();
        balances[_to] += _value;
        Transfer(_from, _to, _value);

        balances[msg.sender] += _feeSmt;
        Transfer(_from, msg.sender, _feeSmt);

        balances[_from] -= _value + _feeSmt; 
        nonces[_from] = nonce + 1; 
        return true;
    }
```

`SMT` token contract also shares the exact same problem with `SMART`, however, the modifier `transferAllowed(_from)` limits the execution of the function. 

In Solidity, modifier code is ran before the function itself, and it usually contains critical checks such as ownership of the contract, which will revert the whole process on failure, before the function ever gets executed.

```javascript
contract Controlled is Owned{

    function Controlled() public {
       setExclude(msg.sender);
    }

    // Flag that determines if the token is transferable or not.
    bool public transferEnabled = false;

    // flag that makes locked address effect
    bool lockFlag=true;
    mapping(address => bool) locked;
    mapping(address => bool) exclude;

    function enableTransfer(bool _enable) public onlyOwner{
        transferEnabled=_enable;
    }

    function disableLock(bool _enable) public onlyOwner returns (bool success){
        lockFlag=_enable;
        return true;
    }

    function addLock(address _addr) public onlyOwner returns (bool success){
        require(_addr!=msg.sender);
        locked[_addr]=true;
        return true;
    }

    function setExclude(address _addr) public onlyOwner returns (bool success){
        exclude[_addr]=true;
        return true;
    }

    function removeLock(address _addr) public onlyOwner returns (bool success){
        locked[_addr]=false;
        return true;
    }

    /* transferAllowed modifier checks if _addr is excluded from the check, then checks if transferEnabled which can only be set by the contract creater. Lastly it checks if there is a lock on _addr. All of these functions can only be called by the contract owner. */

    modifier transferAllowed(address _addr) {
        if (!exclude[_addr]) {
            assert(transferEnabled);
            if(lockFlag){
                assert(!locked[_addr]);
            }
        }
        
        _;
    }

}

// StandardToken inherits Controlled
contract StandardToken is Token,Controlled {...}

// SMT inherits StandardToken
contract SMT is StandardToken {...}
```

As the above code and comments show, `transferAllowed` will always revert the transaction, unless the `owner` address is used to send these transactions. Moreover, `assert` is used in `transferAllowed`, thus it will not only revert the transaction attempts, but also consume all the `gas` that is required to run the contract code, as opposed to `require` which refunds the gas. 

This contract is likely safe from the `transferProxy` attack as a result of this modifier's protection. However, the `SMT` token was being traded on many exchanges, and as of May 12, 2018, 20 days after the vulnerability was discovered, tons of people are still attempting to get rich quick every minute. 

![Screen Shot 1](https://github.com/dliuproduction/ethploits/transferProxyBug/Screen1.jpg "Screen Shot 1")

![Screen Shot 2](https://github.com/dliuproduction/ethploits/transferProxyBug/Screen2.jpg "Screen Shot 2")