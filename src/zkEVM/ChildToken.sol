// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract ChildToken is Ownable, ERC20 {
    uint256 constant INITIAL_SUPPLY = 100000000 * (1e18);

    constructor() ERC20("Test ERC20 Token", "TestERC20Token") {
        _mint(_msgSender(), INITIAL_SUPPLY);
    }
}
