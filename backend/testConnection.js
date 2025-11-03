import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const network = await provider.getNetwork();
    console.log("✅ Connected to network:", network.name, "| Chain ID:", network.chainId);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
})();
