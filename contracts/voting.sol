// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


/**
 * @title Voting
 * @dev A comprehensive voting system with candidate management
 */
contract Voting {
    address public owner;
    
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    mapping(uint256 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint256 public candidatesCount;

    event VoteCasted(address voter, uint256 candidateId);
    event CandidateAdded(uint256 id, string name, string party);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Add some default candidates
        _addCandidate("Alice Johnson", "Party A");
        _addCandidate("Bob Smith", "Party B");
        _addCandidate("Charlie Brown", "Party C");
    }

    function _addCandidate(string memory _name, string memory _party) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _party, 0);
        emit CandidateAdded(candidatesCount, _name, _party);
    }

    function addCandidate(string memory _name, string memory _party) external onlyOwner {
        _addCandidate(_name, _party);
    }

    function vote(uint256 _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted!");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;

        emit VoteCasted(msg.sender, _candidateId);
    }

    function getCandidate(uint256 _id) public view returns (Candidate memory) {
        return candidates[_id];
    }
}
