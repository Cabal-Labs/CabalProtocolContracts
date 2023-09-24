// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV13.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CabalDAO {
    using Counters for Counters.Counter;
    Counters.Counter private _eventIds;
    
    IPublicLockV13 public membership;

    address public admin;


    event MemberAdded(address indexed memberAddress);
    event MemberRemoved(address indexed memberAddress);
    event EventContractAdded(address indexed eventContract, uint256 eventId);
    event RewardAmountSet(address indexed eventContract, uint256 rewardAmount);
    event RefundAmountSet(address indexed eventContract, uint256 refundAmount);
    event FundsAllocated(address indexed eventContract, uint256 amount);
    event ParticipantAdded(address indexed eventContract, address indexed participantAddress);
    event RewardPaid(address indexed eventContract, address indexed participant);
    event RefundClaimed(address indexed eventContract, address indexed participant, uint256 amount);

    struct Member {
        address memberAddress;
        bool isMember;
    }
    mapping(address => Member) public members;

    struct Participant {
        address payable participantAddress;
        bool hasPaidReward;
        bool hasBeenRefunded;
    }

    enum EventStatus { Proposed, Active, Finished }
    
    struct EventDetails {
        uint256 eventId;
        string name;
        string location;
        uint256 eventValue;
        uint256 fundsAllocated;
        uint256 rewardAmount;
        uint256 refundAmount;
        EventStatus status;
        mapping(address => Participant) participants;
    }
    mapping(uint256 => address) public eventIdToAddress;
    mapping(address => EventDetails) public events;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }


    constructor( address _membershipAddress) {
        admin = msg.sender;
        members[admin] = Member({memberAddress: admin, isMember: true});
        membership = IPublicLockV13(_membershipAddress);

    }

    function addMember(address _memberAddress) external {
        members[_memberAddress] = Member({memberAddress: _memberAddress, isMember: true});
        emit MemberAdded(_memberAddress);
    }

    function addEventContract(address _eventContract, string memory _name, string memory _location, uint256 _eventValue) external onlyAdmin {
        _eventIds.increment();
        uint256 newEventId = _eventIds.current();

        events[_eventContract].eventId = newEventId;
        events[_eventContract].name = _name;
        events[_eventContract].location = _location;
        events[_eventContract].eventValue = _eventValue;
        events[_eventContract].fundsAllocated = 0;
        events[_eventContract].status = EventStatus.Active;
      
        eventIdToAddress[newEventId] = _eventContract;

        emit EventContractAdded(_eventContract, newEventId);
    }

    function setRewardAmount(address _eventContract, uint256 _newRewardAmount) external onlyAdmin {
        events[_eventContract].rewardAmount = _newRewardAmount;
        emit RewardAmountSet(_eventContract, _newRewardAmount);
    }

    function setRefundAmount(address _eventContract, uint256 _newRefundAmount) external onlyAdmin {
        events[_eventContract].refundAmount = _newRefundAmount;
        emit RefundAmountSet(_eventContract, _newRefundAmount);
    }

    function allocateFunds(address _eventContract, uint256 _amount) external payable onlyAdmin {
        events[_eventContract].fundsAllocated += _amount;
        emit FundsAllocated(_eventContract, _amount);
    }

    function addParticipant(address _eventContract, address payable _participantAddress) external onlyAdmin {

        require(membership.balanceOf(_participantAddress) > 0, "Participant is not member from the cabal");
        require(IPublicLockV13(_eventContract).balanceOf(_participantAddress) > 0 ,"Does not hold paticipant ticket" );

        events[_eventContract].participants[_participantAddress] = Participant({
            participantAddress: _participantAddress,
            hasPaidReward: false,
            hasBeenRefunded: false
        });
        emit ParticipantAdded(_eventContract, _participantAddress);
    }

    function payReward(address _eventContract) external payable {
        EventDetails storage hackathonEvent = events[_eventContract];
        require(msg.value == hackathonEvent.rewardAmount, "Incorrect reward amount sent");
        hackathonEvent.fundsAllocated += msg.value;

        Participant storage participant = hackathonEvent.participants[msg.sender];
        require(!participant.hasPaidReward, "Reward already paid");

        participant.hasPaidReward = true;

        emit RewardPaid(_eventContract, msg.sender);
    }

    function claimRefund(address _eventContract) external {
        EventDetails storage hackathonEvent = events[_eventContract];
        Participant storage participant = hackathonEvent.participants[msg.sender];

        require(participant.hasPaidReward, "Reward payment required to claim refund");
        require(participant.participantAddress == msg.sender, "Not a participant");
        uint256 refundAmount = events[_eventContract].refundAmount;
        require(hackathonEvent.fundsAllocated >= refundAmount, "Insufficient funds allocated to the event");

        hackathonEvent.fundsAllocated -= refundAmount;

        payable(msg.sender).transfer(refundAmount);

        participant.hasBeenRefunded = true;

        emit RefundClaimed(_eventContract, msg.sender, refundAmount);
    }
}
