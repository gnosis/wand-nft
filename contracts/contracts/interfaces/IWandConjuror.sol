// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

import "./IWands.sol";

interface IWandConjuror {
  function generateWandURI(IWands.Wand memory wand, uint256 tokenId)
    external
    view
    returns (string memory);
}
