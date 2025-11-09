// admin.js - Admin-only actions: add candidate (onlyOwner) and fund voter wallet via backend


const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // set actual address
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

const OTP_API_BASE = (window.OTP_API_BASE || "http://localhost:4000").replace(/\/$/, "");

let web3; let contract;

async function initAdmin() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask required");
    return;
  }
  web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
}

document.getElementById("addCandidateForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  const name = document.getElementById("candName").value.trim();
  const party = document.getElementById("candParty").value.trim();
  try {
    await contract.methods.addCandidate(name, party).send({ from });
    alert("Candidate added");
  } catch (err) {
    alert("Add failed: only owner can add candidates");
  }
});

document.getElementById("fundForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const to = document.getElementById("voterAddress").value.trim();
  const amount = document.getElementById("fundAmount").value.trim();
  try {
    const res = await fetch(`${OTP_API_BASE}/fund`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, amount })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Funding failed');
    alert(`Funded: ${data.tx}`);
  } catch (err) {
    alert("Funding failed");
  }
});

window.onload = initAdmin;


