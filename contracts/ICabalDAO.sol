// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICabalDAO {
    function addMember(address _memberAddress) external;
    function addParticipant(address _eventContract, address payable _participantAddress) external;
}
