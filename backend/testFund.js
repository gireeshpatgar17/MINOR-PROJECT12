// backend/testFund.js
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("🔍 Testing funder wallet...");

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const privateKey = process.env.FUNDER_PRIVATE_KEY?.trim();

  if (!privateKey) {
    throw new Error("❌ FUNDER_PRIVATE_KEY not found in .env");
  }

  if (!privateKey.startsWith("0x")) {
    console.warn("ℹ️ Adding missing 0x prefix to private key...");
  }

  const wallet = new ethers.Wallet(
    privateKey.startsWith("0x") ? privateKey : "0x" + privateKey,
    provider
  );

  console.log("🪙 Funder wallet address:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  const voterAddress = "0xcffe83b5289f4731afa3978c87fd37f713fd4032"; // test wallet
  console.log("⏳ Sending funds to:", voterAddress);

  const tx = await wallet.sendTransaction({
    to: voterAddress,
    value: ethers.parseEther(process.env.FUND_AMOUNT_ETH || "0.01"),
  });

  console.log("✅ Transaction sent! Waiting for confirmation...");
  await tx.wait();

  console.log(`✅ Successfully funded ${voterAddress}`);
  console.log(`🔗 View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
}

main().catch((err) => console.error("❌ Funding failed:", err));
