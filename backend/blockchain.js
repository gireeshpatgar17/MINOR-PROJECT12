import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

export async function autoFundVoter(voterAddress) {
  try {
    if (!voterAddress || !ethers.isAddress(voterAddress)) {
      console.error("❌ Invalid voter wallet address:", voterAddress);
      return null;
    }

    const rpcUrl = process.env.RPC_URL?.trim();
    if (!rpcUrl) {
      console.error("❌ RPC_URL not defined in .env");
      return null;
    }
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    let privateKey = process.env.ADMIN_PRIVATE_KEY?.trim();
    if (!privateKey) {
      console.error("❌ ADMIN_PRIVATE_KEY missing in .env");
      return null;
    }

    // remove invisible chars and fix missing 0x prefix
    privateKey = privateKey.replace(/\s+/g, "");
    if (!privateKey.startsWith("0x")) privateKey = "0x" + privateKey;

    const funderWallet = new ethers.Wallet(privateKey, provider);

    const network = await provider.getNetwork();
    console.log(`🌐 Connected to ${network.name} | Chain ID: ${network.chainId}`);
    console.log(`🏦 Funder wallet: ${funderWallet.address}`);

    const balanceWei = await provider.getBalance(funderWallet.address);
    const balanceEth = parseFloat(ethers.formatEther(balanceWei));
    const sendAmount = parseFloat(process.env.FUND_AMOUNT_ETH || "0.01");

    if (balanceEth < sendAmount + 0.001) {
      console.error(`⚠️ Insufficient balance: ${balanceEth} ETH`);
      return null;
    }

    console.log(`🚀 Sending ${sendAmount} ETH to ${voterAddress}...`);
    const tx = await funderWallet.sendTransaction({
      to: voterAddress,
      value: ethers.parseEther(sendAmount.toString()),
    });
    await tx.wait();

    console.log(`✅ Transaction confirmed! Hash: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error("❌ Auto-funding failed:", error?.message || error);
    return null;
  }
}
