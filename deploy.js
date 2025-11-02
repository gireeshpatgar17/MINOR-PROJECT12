// Deploy Voting Contract to Sepolia Testnet
// Usage: PRIVATE_KEY=your_private_key node deploy.js

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 Deploying Voting contract to Sepolia testnet...\n');

  // Check for private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('❌ Error: PRIVATE_KEY environment variable is required');
    console.log('\nUsage:');
    console.log('  Windows PowerShell: $env:PRIVATE_KEY="your_private_key"; node deploy.js');
    console.log('  Windows CMD: set PRIVATE_KEY=your_private_key && node deploy.js');
    console.log('  Linux/Mac: PRIVATE_KEY=your_private_key node deploy.js');
    console.log('\n⚠️  Make sure your wallet has Sepolia ETH for gas fees!');
    process.exit(1);
  }

  // Sepolia Testnet RPC
  const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/7ce5241fd4a848e9959f3bf8d4545836";
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);

  // Create wallet
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`📝 Deploying from address: ${wallet.address}`);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);
  
  if (balance === 0n) {
    console.error('\n❌ Error: Insufficient balance. You need Sepolia ETH for gas fees.');
    console.log('   Get free Sepolia ETH from: https://sepoliafaucet.com/');
    process.exit(1);
  }

  // Contract ABI and bytecode
  // Note: You need to compile the contract first using Remix or Hardhat
  // For now, we'll use a simplified approach with inline bytecode
  // If you have compiled bytecode, replace this section

  const contractSource = fs.readFileSync(
    path.join(__dirname, 'contracts', 'voting.sol'),
    'utf8'
  );

  console.log('\n⚠️  IMPORTANT: You need to compile the contract first!');
  console.log('\n📋 Options to get bytecode:');
  console.log('   1. Use Remix IDE (Recommended):');
  console.log('      - Go to https://remix.ethereum.org');
  console.log('      - Create a new file and paste contracts/voting.sol');
  console.log('      - Compile the contract');
  console.log('      - Copy the bytecode from the compiler output');
  console.log('\n   2. Use Hardhat (if installed):');
  console.log('      - npx hardhat compile');
  console.log('      - Check artifacts/contracts/Voting.sol/Voting.json');
  console.log('\n   3. Use Solidity Compiler online:');
  console.log('      - https://remix-project.org');
  
  console.log('\n📝 Once you have the bytecode, you can update this script or use Remix to deploy.');
  console.log('\n🔗 Remix IDE Deployment Steps:');
  console.log('   1. Go to https://remix.ethereum.org');
  console.log('   2. Create new file: voting.sol');
  console.log('   3. Paste your contract code from contracts/voting.sol');
  console.log('   4. Go to "Solidity Compiler" tab');
  console.log('   5. Select compiler version 0.8.9 or higher');
  console.log('   6. Click "Compile voting.sol"');
  console.log('   7. Go to "Deploy & Run Transactions" tab');
  console.log('   8. Select "Injected Provider - MetaMask"');
  console.log('   9. Make sure you\'re on Sepolia testnet');
  console.log('   10. Click "Deploy"');
  console.log('   11. Copy the contract address from the terminal');
  console.log('   12. Update CONTRACT_ADDRESS in html/dashboard.html');

  // For users who want to use this script with bytecode:
  // Uncomment and replace BYTECODE_HERE with actual compiled bytecode
  /*
  const BYTECODE = "BYTECODE_HERE"; // Paste compiled bytecode here
  const ABI = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'contracts', 'voting.json'),
    'utf8'
  ));

  console.log('\n📦 Creating contract factory...');
  const factory = new ethers.ContractFactory(ABI, BYTECODE, wallet);

  console.log('🚀 Deploying contract...');
  const contract = await factory.deploy();

  console.log('⏳ Waiting for deployment transaction to be mined...');
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`\n✅ Contract deployed successfully!`);
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  
  // Update dashboard.html with new address
  const dashboardPath = path.join(__dirname, 'html', 'dashboard.html');
  let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
  dashboardContent = dashboardContent.replace(
    /const CONTRACT_ADDRESS = ".*";/,
    `const CONTRACT_ADDRESS = "${contractAddress}"; // Deployed contract address`
  );
  fs.writeFileSync(dashboardPath, dashboardContent);
  console.log(`\n✅ Updated dashboard.html with new contract address`);
  */

  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});

