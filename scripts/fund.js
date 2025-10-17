// scripts/fund.js
// Funds a voter wallet from an admin account to remove gas fee barriers
// Usage: set ADMIN_PRIVATE_KEY and RPC_URL in .env, then: npm run fund -- <voterAddress> [amountEther]

import 'dotenv/config';
import { ethers } from 'ethers';

async function main() {
  const voterAddress = process.argv[2];
  const amountEther = process.argv[3] || '0.01';

  if (!voterAddress) {
    console.error('Usage: npm run fund -- <voterAddress> [amountEther]');
    process.exit(1);
  }

  const rpcUrl = process.env.RPC_URL;
  const adminPk = process.env.ADMIN_PRIVATE_KEY;

  if (!rpcUrl || !adminPk) {
    console.error('Missing RPC_URL or ADMIN_PRIVATE_KEY in .env');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const admin = new ethers.Wallet(adminPk, provider);

  console.log('Admin:', await admin.getAddress());
  console.log('Funding', voterAddress, 'with', amountEther, 'ETH');

  const tx = await admin.sendTransaction({ to: voterAddress, value: ethers.parseEther(amountEther) });
  console.log('Sent. Tx:', tx.hash);
  const receipt = await tx.wait();
  console.log('Confirmed in block', receipt.blockNumber);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


