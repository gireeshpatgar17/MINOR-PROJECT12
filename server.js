// server.js
// Minimal OTP backend using Twilio Verify
// Endpoints:
//   POST /otp/send   { to: "+91XXXXXXXXXX" }
//   POST /otp/verify { to: "+91XXXXXXXXXX", code: "123456" }

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';

const app = express();
app.use(cors());
app.use(express.json());

// Twilio client (Verify v2)
// Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID
let twilioClient = null;
try {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    const twilio = (await import('twilio')).default;
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
} catch (e) {
  // defer error until endpoint usage
}

function assertEnv() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SID) {
    throw new Error('Missing Twilio env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID');
  }
  if (!twilioClient) {
    throw new Error('Twilio client not initialized');
  }
}

app.post('/otp/send', async (req, res) => {
  try {
    assertEnv();
    const { to } = req.body || {};
    if (!to) return res.status(400).json({ ok: false, error: 'Missing to' });
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({ to, channel: 'sms' });
    return res.json({ ok: true, status: verification.status });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/otp/verify', async (req, res) => {
  try {
    assertEnv();
    const { to, code } = req.body || {};
    if (!to || !code) return res.status(400).json({ ok: false, error: 'Missing to or code' });
    const check = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({ to, code });
    const valid = check.status === 'approved';
    return res.json({ ok: valid, status: check.status });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// Admin-funded wallet endpoint: POST /fund { to, amount }
app.post('/fund', async (req, res) => {
  try {
    const { to, amount } = req.body || {};
    if (!to || !amount) return res.status(400).json({ ok: false, error: 'Missing to or amount' });
    const rpcUrl = process.env.RPC_URL;
    const adminPk = process.env.ADMIN_PRIVATE_KEY;
    if (!rpcUrl || !adminPk) return res.status(500).json({ ok: false, error: 'Server not configured' });
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const admin = new ethers.Wallet(adminPk, provider);
    const tx = await admin.sendTransaction({ to, value: ethers.parseEther(String(amount)) });
    return res.json({ ok: true, tx: tx.hash });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`OTP server listening on http://localhost:${PORT}`);
});
