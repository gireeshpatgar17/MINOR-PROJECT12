import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

(async () => {
  try {
    const network = await provider.getNetwork();
    console.log("✅ Connected to", network.name, "| Chain ID:", network.chainId);
  } catch (err) {
    console.error("❌ RPC connection failed:", err.message);
  }
})();
