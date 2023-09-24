// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV10.sol";
import "./ICabalDAO.sol";


contract OnParticipantHook {

  ICabalDAO public cabalDao;
  constructor(address _cabalDao) {
    cabalDao = ICabalDAO(_cabalDao);
  }

 
  function keyPurchasePrice(
      address, /* from */
      address, /*recipient */
      address, /* referrer */
      bytes calldata /* data */
  ) external view returns (uint256 minKeyPrice) {
      return IPublicLockV10(msg.sender).keyPrice();
  }


  function onKeyPurchase(
      address, /*from*/
      address recipient,
      address, /*referrer*/
      bytes calldata, /*data*/
      uint256, /*minKeyPrice*/
      uint256 /*pricePaid*/
  ) external {
    cabalDao.addParticipant(msg.sender, payable(recipient));
  }
}