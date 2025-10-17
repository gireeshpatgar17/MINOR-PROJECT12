// result.js
// Dynamic vote results from blockchain

let web3Result;
let votingContractResult;

// Replace CONTRACT_ADDRESS with your deployed contract address
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // TODO: set real address
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      }
    ],
    "name": "VoteCasted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getCandidate",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "party",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct Voting.Candidate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; 

async function loadResults() {
    if (typeof window.ethereum === "undefined") return;

    web3Result = new Web3(window.ethereum);
    await window.ethereum.enable();
    votingContractResult = new web3Result.eth.Contract(contractABI, CONTRACT_ADDRESS);

    const count = await votingContractResult.methods.candidatesCount().call();
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    let totalVotes = 0;
    let candidates = [];

    for (let i = 1; i <= count; i++) {
        const c = await votingContractResult.methods.getCandidate(i).call();
        totalVotes += parseInt(c.voteCount);
        candidates.push(c);
    }

    // Optionally show user's vote (replace with your logic)
    const myVoteId = 2; // Demo only
    const votedCandidate = candidates.find(c => c.id == myVoteId);
    const myVote = document.getElementById("myVote");
    if(myVote) myVote.innerHTML = `<strong>${votedCandidate.name}</strong> (${votedCandidate.party})`;

    candidates.forEach(c => {
        const percentage = totalVotes === 0 ? 0 : ((c.voteCount / totalVotes) * 100).toFixed(1);
        const barContainer = document.createElement("div");
        barContainer.className = "result-bar-container";
        barContainer.innerHTML = `
            <div class="result-label">
                <span>${c.name} (${c.party})</span>
                <span>${percentage}%</span>
            </div>
            <div class="result-bar-bg">
                <div class="result-bar-fill" style="width: 0%;"></div>
            </div>
        `;
        resultsContainer.appendChild(barContainer);
        setTimeout(() => {
            const fill = barContainer.querySelector(".result-bar-fill");
            fill.style.width = `${percentage}%`;
        }, 200);
    });

    showToast(`Your vote for ${votedCandidate.name} is recorded ✅`, "success");
}

// Toast function
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize results page
window.onload = loadResults;
