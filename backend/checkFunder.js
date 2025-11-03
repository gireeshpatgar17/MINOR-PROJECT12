import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function checkFunder() {
  try {
    console.log("🔍 Checking funder wallet status...\n");

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.FUNDER_PRIVATE_KEY, provider);

    // Verify funder details
    const balanceWei = await provider.getBalance(wallet.address);
    const balanceEth = ethers.formatEther(balanceWei);

    console.log(`🏦 Funder Wallet Address: ${wallet.address}`);
    console.log(`💰 Balance: ${balanceEth} ETH`);
    console.log(`🌐 RPC Connected: ${await provider.getNetwork().then(n => n.name)}\n`);

    if (balanceEth < parseFloat(process.env.FUND_AMOUNT_ETH || "0.01")) {
      console.warn("⚠️ Warning: Low balance. Add Sepolia ETH to this wallet to fund voters.");
    } else {
      console.log("✅ Ready to auto-fund voters!");
    }

  } catch (error) {
    console.error("❌ Error checking funder wallet:", error.message || error);
  }
}

checkFunder();
