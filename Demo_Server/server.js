const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let aadhaarData = JSON.parse(fs.readFileSync("aadhaar_data.json", "utf8"));
let panData = JSON.parse(fs.readFileSync("pan_data.json", "utf8")); // Load PAN data
let otpStore = {}; // To store OTPs temporarily

// Generate OTP
app.post("/generate-otp", (req, res) => {
  const { aadhaar_number } = req.body;

  if (!aadhaar_number || aadhaar_number.length !== 12) {
    return res.status(400).json({ status: "FAILED", message: "Invalid Aadhaar number" });
  }

  let ref_id = Math.floor(10000000 + Math.random() * 90000000).toString();
  otpStore[ref_id] = { otp: "267987", aadhaar_number };

  res.json({
    status: "SUCCESS",
    message: "OTP sent successfully",
    ref_id: ref_id
  });
});

// Verify OTP
app.post("/verify-otp", (req, res) => {
  const { otp, ref_id } = req.body;

  if (!otp || !ref_id || !otpStore[ref_id]) {
    return res.status(400).json({ status: "FAILED", message: "Invalid OTP or ref_id" });
  }

  if (otp !== otpStore[ref_id].otp) {
    return res.status(400).json({ status: "FAILED", message: "Incorrect OTP" });
  }

  let aadhaar = aadhaarData.find((a) => a.ref_id === ref_id);

  if (!aadhaar) {
    return res.status(404).json({ status: "FAILED", message: "Aadhaar not found" });
  }

  delete otpStore[ref_id]; // Remove OTP after successful verification

  res.json(aadhaar);
});

// Verify PAN Details
app.post("/verify-pan", (req, res) => {
  const { verification_id, pan, name, dob } = req.body;

  if (!verification_id || !pan || !name || !dob) {
    return res.status(400).json({ status: "FAILED", message: "All fields are required" });
  }

  if (!panData.verifyPanResponses || !Array.isArray(panData.verifyPanResponses)) {
    return res.status(500).json({ status: "FAILED", message: "Internal server error" });
  }

  const panRecord = panData.verifyPanResponses.find((record) => record.verification_id === verification_id);

  if (!panRecord) {
    return res.status(404).json({ status: "FAILED", message: "PAN verification ID not found" });
  }

  let errors = [];

  if (panRecord.pan !== pan) {
    errors.push("PAN does not match");
  }

  if (panRecord.name !== name) {
    errors.push("Name does not match");
  }

  if (panRecord.dob !== dob) {
    errors.push("Date of Birth does not match");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: "FAILED",
      message: "Verification failed",
      errors
    });
  }

  res.json(panRecord);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
