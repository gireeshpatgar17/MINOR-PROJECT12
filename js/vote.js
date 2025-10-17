// vote.js
// Voting dashboard integration with blockchain

let web3;
let votingContract;

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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "party",
        "type": "string"
      }
    ],
    "name": "CandidateAdded",
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
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_party",
        "type": "string"
      }
    ],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function init() {
    if (typeof window.ethereum === "undefined") {
        showToast("MetaMask not found! Install it to continue.", "error");
        return;
    }

    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    votingContract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

    loadCandidates();
}

// Load candidates from blockchain
async function loadCandidates() {
    const count = await votingContract.methods.candidatesCount().call();
    const container = document.getElementById("candidateList");
    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const candidate = await votingContract.methods.getCandidate(i).call();
        const card = document.createElement("div");
        card.className = "candidate-card";
        card.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>${candidate.party}</p>
            <button onclick="castVote(${candidate.id})">Vote</button>
        `;
        container.appendChild(card);
    }
}

// Cast vote using blockchain
async function castVote(id) {
    const accounts = await web3.eth.getAccounts();
    const voter = accounts[0];

    try {
        // Auto-fund if low balance (optional UX improvement)
        const balanceWei = await web3.eth.getBalance(voter);
        const hasGas = BigInt(balanceWei) > BigInt(1_000_000_000_000_00); // ~0.0001 ETH
        if (!hasGas) {
            try {
                await fetch("http://localhost:4000/fund", {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ to: voter, amount: '0.01' })
                });
                showToast("Funding your wallet... retrying in 3s", "success");
                await new Promise(r => setTimeout(r, 3000));
            } catch (_) {}
        }

        // Require OTP verification before allowing vote
        const otpVerified = sessionStorage.getItem("otpVerified");
        if (otpVerified !== "true") {
            showToast("Complete OTP verification first.", "error");
            window.location.href = "login.html";
            return;
        }

        await votingContract.methods.vote(id).send({ from: voter });
        showToast("Vote cast successfully ✅", "success");
        setTimeout(() => {
            window.location.href = "result.html";
        }, 2000);
    } catch (err) {
        console.error(err);
        showToast("Error: You may have already voted!", "error");
    }
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

// Initialize dashboard
window.onload = init;

