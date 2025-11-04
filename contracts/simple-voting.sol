// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title Simple Voting Contract
 * @dev Simplified voting system that works with Supabase for candidate management
 *      This contract only handles vote verification and prevents double voting.
 *      Candidates are managed entirely in Supabase database.
 */
contract SimpleVoting {
    address public owner;
    
    // Track if an address has voted
    mapping(address => bool) public hasVoted;
    
    // Optional: Track vote count per candidate ID (for reference)
    mapping(uint256 => uint256) public candidateVoteCount;
    
    // Total votes cast
    uint256 public totalVotes;
    
    // Events
    event VoteCasted(address indexed voter, uint256 candidateId, uint256 timestamp);
    event ElectionStatusChanged(bool active);
    
    // Election status (optional - defaults to active)
    bool public isElectionActive = true;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }
    
    modifier electionActive() {
        require(isElectionActive, "Election is not active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        isElectionActive = true; // Election starts active by default
        emit ElectionStatusChanged(true);
    }
    
    /**
     * @dev Cast a vote for a candidate
     * @param _candidateId The ID of the candidate (matches Supabase candidate position/ID)
     * 
     * Requirements:
     * - Election must be active
     * - Voter must not have voted before
     * - Candidate ID must be greater than 0
     */
    function vote(uint256 _candidateId) external electionActive {
        require(!hasVoted[msg.sender], "You have already voted!");
        require(_candidateId > 0, "Invalid candidate ID");
        
        // Mark voter as voted
        hasVoted[msg.sender] = true;
        
        // Increment vote count for this candidate (optional, for reference)
        candidateVoteCount[_candidateId]++;
        
        // Increment total votes
        totalVotes++;
        
        // Emit vote event
        emit VoteCasted(msg.sender, _candidateId, block.timestamp);
    }
    
    /**
     * @dev Check if an address has voted
     * @param _voter The address to check
     * @return bool True if the address has voted, false otherwise
     */
    function checkHasVoted(address _voter) external view returns (bool) {
        return hasVoted[_voter];
    }
    
    /**
     * @dev Get vote count for a specific candidate
     * @param _candidateId The candidate ID
     * @return uint256 The number of votes for this candidate
     */
    function getCandidateVoteCount(uint256 _candidateId) external view returns (uint256) {
        return candidateVoteCount[_candidateId];
    }
    
    /**
     * @dev Owner can activate/deactivate the election
     * @param _active True to activate, false to deactivate
     */
    function setElectionStatus(bool _active) external onlyOwner {
        isElectionActive = _active;
        emit ElectionStatusChanged(_active);
    }
    
    /**
     * @dev Get election status
     * @return bool True if election is active, false otherwise
     */
    function getElectionStatus() external view returns (bool) {
        return isElectionActive;
    }
    
    /**
     * @dev Reset election (owner only) - use with caution!
     * This clears all votes and voter records. Only use for testing or election reset.
     */
    function resetElection() external onlyOwner {
        // Note: This cannot reset mappings in Solidity, so votes remain on-chain
        // This is a placeholder for potential future functionality
        isElectionActive = false;
        emit ElectionStatusChanged(false);
    }
}

