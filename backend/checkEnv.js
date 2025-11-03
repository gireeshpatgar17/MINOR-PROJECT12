// backend/checkEnv.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

console.log("📂 Looking for .env file at:", envPath);
console.log("📄 Exists?", fs.existsSync(envPath));

dotenv.config({ path: envPath });

console.log("🔍 SUPABASE_URL =", process.env.SUPABASE_URL || "❌ Not Loaded");
console.log(
  "🔍 SUPABASE_SERVICE_ROLE_KEY =",
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 30) + "..."
    : "❌ Not Loaded"
);
